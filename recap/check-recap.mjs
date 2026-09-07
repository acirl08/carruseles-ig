// Validador del carril recap.
//
//   node check-recap.mjs                 todos los data/*.json
//   node check-recap.mjs data/rNN.json   uno solo
//
// Comprueba lo que las cuatro variantes tienen en común y lo que cada una exige
// aparte. La regla que no se negocia: **toda noticia lleva `fuente`**. Una noticia
// sin URL no se puede comprobar, y 02-MARCA.md prohíbe publicar lo que no se puede
// verificar — aquí importa más que en los otros carriles, porque el recap no habla
// de mecanismos generales sino de hechos con fecha.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const DATA = process.env.RECAP_DATA || path.join(AQUI, 'data');

// Qué campo extra exige cada variante, y cuántas noticias admite.
const VARIANTES = {
  negocio:    { campo: 'paraTi',    min: 3, max: 7,  desc: 'qué cambia para tu negocio' },
  mecanismo:  { campo: 'mecanismo', min: 3, max: 7,  desc: 'por qué pasa' },
  accionable: { campo: 'accion',    min: 3, max: 6,  desc: 'qué haces mañana' },
  // Hasta 18 noticias: con portada y cierre son 20, el tope de la app.
  completo:   { campo: null,        min: 6, max: 18, desc: 'solo qué pasó' },
};

const limpio = s => String(s ?? '').replace(/<[^>]*>/g, '').trim();
const palabras = s => limpio(s).split(/\s+/).filter(Boolean).length;

// Cifra en texto visible: mismos patrones que el carril largo.
const CIFRA = /(\$\s?\d[\d.,]*\s*(mil millones|millones|mil)?|\b\d[\d.,]*\s*(%|mil millones|millones|dólares|pesos|horas?|días?|veces))/gi;

function revisa(d, nombre) {
  const h = [];
  const v = VARIANTES[d.variante];
  if (!v) {
    h.push(`variante "${d.variante}" desconocida — vale: ${Object.keys(VARIANTES).join(', ')}`);
    return h.map(x => `${nombre}: ${x}`);
  }

  const slides = d.slides ?? [];
  if (!slides.length) return [`${nombre}: sin slides`];
  if (slides[0]?.kind !== 'portadaRecap') h.push('el primer slide tiene que ser portadaRecap');
  // Medido sobre los cuatro mazos: 55 caracteres deja 503px de aire y check-corto
  // lo reporta; 57 pasa (comprobado). Se mide en CARACTERES y no en palabras porque el titular
  // se dibuja por longitud — 11 palabras cortas ocupan menos que 9 largas, y con la
  // regla en palabras un mazo de 11 seguía saliendo hueco.
  const hook = limpio(slides[0]?.hook);
  if (hook && hook.length < 57)
    h.push(`la portada tiene ${hook.length} caracteres; hacen falta 57 o el slide queda hueco`);
  if (slides.at(-1)?.kind !== 'cierreRecap') h.push('el último slide tiene que ser cierreRecap');

  const noticias = slides.filter(s => s.kind === 'noticia');
  if (noticias.length < v.min || noticias.length > v.max)
    h.push(`${noticias.length} noticias; la variante "${d.variante}" admite entre ${v.min} y ${v.max}`);

  // DOS topes distintos: la API de publicación va a 10, la app a 20 desde agosto
  // de 2024. Aquí manda el de la app, porque este sistema no publica por API —
  // Buffer avisa e Isabela publica a mano para poner la música.
  if (slides.length > 20)
    h.push(`${slides.length} slides: el tope de la app son 20. Parte el recap en dos`);
  if (slides.length > 10)
    console.log(`  aviso: ${slides.length} slides. Cabe publicando A MANO desde la app (tope 20), no por API (tope 10). Comprueba que tu cuenta tenga los 20.`);

  const vistos = new Set();
  for (const [i, s] of noticias.entries()) {
    const donde = `noticia ${i + 1}`;

    for (const campo of ['titular', 'resumen', 'fuente']) {
      if (!limpio(s[campo])) h.push(`${donde}: falta "${campo}"`);
    }
    // La fuente tiene que ser una URL de verdad, no "sí" ni "internet".
    if (s.fuente && !/^https?:\/\/\S+\.\S+/.test(limpio(s.fuente)))
      h.push(`${donde}: "fuente" tiene que ser una URL — llegó "${limpio(s.fuente).slice(0, 40)}"`);

    // Que la URL tenga forma de URL NO prueba que respalde la noticia. Este fallo
    // ya se cometió: tres de cinco noticias del primer mazo citaban una página que
    // no decía lo que el slide afirmaba, y este validador las aprobó. `comprobada`
    // es una declaración atribuible, igual que `verificado` en el corto: no prueba
    // nada por sí sola, pero impide que una fuente pase sin que alguien la abriera.
    if (s.fuente && s.comprobada !== true)
      h.push(`${donde}: abre "${limpio(s.fuente).slice(0, 50)}" y confirma que dice lo que afirma el slide. Luego pon "comprobada": true`);

    if (v.campo && !limpio(s[v.campo]))
      h.push(`${donde}: la variante "${d.variante}" exige "${v.campo}" (${v.desc})`);

    // `completo` no lleva campo extra, así que el resumen es lo único que llena el
    // slide. Medido: por debajo de ~26 palabras quedan más de 300px de hueco y
    // check-corto lo reporta. En las otras variantes el giro rellena y no aplica.
    if (d.variante === 'completo' && s.resumen && palabras(s.resumen) < 26)
      h.push(`${donde}: el resumen tiene ${palabras(s.resumen)} palabras; en "completo" hacen falta 26 o el slide queda hueco`);

    // El resumen tiene que decir QUÉ HACE la cosa, no que existe. Un resumen que
    // solo anuncia el lanzamiento produce un slide vacío de información: "salió el
    // modelo X" no le sirve a nadie. Se caza por las señales del anuncio sin
    // sustancia — verbos de lanzamiento sin nada detrás.
    const res = limpio(s.resumen).toLowerCase();
    const soloAnuncia = /^(sali[óo]|se lanz[óo]|lleg[óa]|anunci[óa]|present[óa]|est[áa] disponible|ya est[áa])/.test(res)
      || /^(el|la|los|las)?\s*\w+\s+(sali[óo]|se lanz[óo]|lleg[óo])\b/.test(res);
    const traeSustancia = /\b(hace|puede|usa|permite|cuesta|pasa a|navega|analiza|pregunta|confirma|revisa|corre|genera|lee|escribe|reduce|sube|baja|dólares|tokens|%)\b/.test(res);
    if (soloAnuncia && !traeSustancia)
      h.push(`${donde}: el resumen solo dice que la cosa salió. Di QUÉ HACE que antes no se podía, o no es noticia para nadie`);

    if (s.titular && palabras(s.titular) > 8)
      h.push(`${donde}: el titular tiene ${palabras(s.titular)} palabras; el máximo es 8`);
    if (s.titular && limpio(s.titular) !== limpio(s.titular).toUpperCase())
      h.push(`${donde}: el titular va en mayúsculas`);

    // Duplicado dentro del mismo mazo.
    const clave = limpio(s.titular).toLowerCase().slice(0, 30);
    if (vistos.has(clave)) h.push(`${donde}: repite el titular de otra noticia`);
    vistos.add(clave);

    // Toda cifra visible necesita su fuente en el mismo slide.
    const texto = [s.titular, s.resumen, s[v.campo]].map(limpio).join(' ');
    const cifras = [...new Set(texto.match(CIFRA) ?? [])];
    if (cifras.length && !limpio(s.fuente))
      h.push(`${donde}: dice ${cifras.join(', ')} y no trae fuente`);

    // La imagen de terceros no se publica sin licencia declarada.
    if (s.imagen?.url && !limpio(s.imagen.licencia))
      h.push(`${donde}: la imagen no dice de dónde salió. Pon "imagen.licencia" o quítala`);
  }

  // Dos noticias distintas apuntando a la MISMA página es la grieta por la que
  // pasó el fraude del primer mazo: una URL genérica sirve de coartada para varias
  // afirmaciones que no están todas ahí. Compartir fuente es legítimo si la página
  // cubre las dos —el anuncio de un lanzamiento que trae varias novedades—, así que
  // avisa en vez de caerse, pero obliga a mirarlo.
  const porFuente = new Map();
  for (const [i, s2] of noticias.entries()) {
    const u = limpio(s2.fuente);
    if (!u) continue;
    porFuente.set(u, [...(porFuente.get(u) ?? []), i + 1]);
  }
  for (const [u, cuales] of porFuente) {
    if (cuales.length > 1)
      console.log(`  aviso: las noticias ${cuales.join(', ')} citan la MISMA fuente (${u.slice(0, 46)}). Comprueba que respalde todas, no solo una.`);
  }

  if (!limpio(d.caption)) h.push('falta el caption');
  return h.map(x => `${nombre}: ${x}`);
}

const arg = process.argv[2];
const archivos = arg ? [arg]
  : (existsSync(DATA) ? readdirSync(DATA).filter(f => f.endsWith('.json')).map(f => path.join(DATA, f)) : []);

if (!archivos.length) { console.error('no encontré ningún data/*.json'); process.exit(1); }

let todos = [];
for (const f of archivos) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  todos = todos.concat(revisa(d, path.basename(f, '.json')));
}

if (todos.length === 0) {
  console.log(`sin hallazgos — ${archivos.length} recap(s)`);
} else {
  console.log(`${todos.length} hallazgo(s):`);
  for (const x of todos) console.log('  · ' + x);
  process.exit(1);
}
