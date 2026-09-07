import fs from 'fs';
import path from 'path';
import { CSS, PRIM, RENDER } from './engine-corto.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const FUENTES = path.join(ROOT, '..', 'fonts');

const FONTS = [
  ['Bebas Neue', 'BebasNeue-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic'],
  ['DM Sans', 'DMSans.ttf', '100 1000', 'normal'],
  ['DM Sans', 'DMSans-Italic.ttf', '100 1000', 'italic'],
];
const fontCSS = () => FONTS.map(([fam, file, wght, style]) => {
  const b64 = fs.readFileSync(path.join(FUENTES, file)).toString('base64');
  return `@font-face{font-family:"${fam}";font-style:${style};font-weight:${wght};font-display:block;` +
    `src:url(data:font/ttf;base64,${b64}) format("truetype")}`;
}).join('\n');


/* ---------- validación: romper aquí es mejor que publicar roto ---------- */
const BEATS = {
  portada:      { req: ['hook'],                    opt: ['tape', 'ts'] },
  diagnostico:  { req: ['copy', 'boc'],             opt: ['ts', 'dato', 'pale'] },
  // "verificado" es la firma de Isabela. El beat de credibilidad SIEMPRE la necesita,
  // y además cualquier slide cuyo texto haga una afirmación en primera persona sobre
  // sus clientes o sus pruebas (ver CLAIM más abajo) — la regla no puede ir sólo por
  // kind porque el propio SCHEMA autoriza fusionar credibilidad en el diagnóstico.
  credibilidad: { req: ['copy', 'boc', 'verificado'], opt: ['ts', 'dato', 'pale'] },
  concepto:     { req: ['copy', 'lista'],           opt: ['ts', 'boc', 'pale'] },
  solucion:     { req: ['copy', 'boc', 'dato'],     opt: ['ts', 'pale'] },
  resultado:    { req: ['copy', 'boc'],             opt: ['ts', 'dato', 'pale'] },
  final:        { req: ['copy','ask','follow','send'], opt: ['ts'] },
};
const ALIAS = { cierre: 'final' };

/* Sólo <em>, <br> y <span class="o"> son HTML; todo lo demás se escapa.
   Un "<" suelto en el copy se comía el resto del slide en silencio. */
const PERMITIDO = /<(\/?(?:em|br)|span class="o"|\/span)>/g;
function limpia(txt) {
  if (typeof txt !== 'string') return txt;
  const guardado = [];
  let t = txt.replace(PERMITIDO, m => `\u0000${guardado.push(m) - 1}\u0000`);
  t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => guardado[i]);
}
function limpiaHondo(v) {
  if (typeof v === 'string') return limpia(v);
  if (Array.isArray(v)) return v.map(x => limpiaHondo(x));
  if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = limpiaHondo(v[k]); return o; }
  return v;
}

/* Afirmación en primera persona sobre clientes, alumnos o pruebas propias.
   NADIE la puede comprobar desde aquí, así que exige la firma de Isabela.
   Va por TEXTO y no por kind: la regla de fusión del SCHEMA permite mudar
   "lo veo en los negocios que asesoro" del beat credibilidad al diagnóstico,
   y con la regla atada al kind esa mudanza colaba la frase sin firma.
   Es un colador, no una red: reconoce las formas que ya se han usado, no el
   idioma entero. Cuando escribas una paráfrasis nueva que se le escape, AGRÉGALA. */
const GENTE = '(?:clientes?|clientas?|alumnos?|alumnas?|negocios?|emprendedores?|marcas?|equipos?|personas?|gente|due[ñn]os?|fundadores?)';
const FREQ = '(?:cada|en|con|todos|todas|siempre|a diario|seguido|much[oa]s|mil|una y otra|de nuevo)';
const CLAIM = new RegExp([
  `mis (?:[a-záéíóúñ]+ )?${GENTE}`,
  // "mis pruebas" pide un verbo de resultado: "mis pruebas dicen" afirma,
  // "mis pruebas favoritas" no. Sacarlo entero de la lista fue un error:
  // "en mis pruebas" exige la preposición y dejaba libre "mis pruebas dicen".
  'mis pruebas (?:dicen|muestran|indican|dan|arrojan|confirman|sugieren)',
  'que (?:asesoro|acompaño|acompano|atiendo|entreno|capacito)',
  `(?:los|las) (?:negocios?|clientes?|emprendedores?|personas?|gente) (?:que|con)`,
  `trabajo con (?:[a-záéíóúñ]+ )?${GENTE}`,
  'llevo (?:años|anios|meses|semanas) (?:[a-záéíóúñ]+ )?(?:viendo|escuchando|asesorando|trabajando|haciendo|en (?:esto|esta|este))',
  'me (?:piden|pasan|escriben|mandan|preguntan|dicen|cuentan|consultan|contratan|buscan)',
  'me (?:lo|la|los|las) (?:dicen|piden|mandan|cuentan)',
  'en (?:mis|mi) (?:pruebas|experiencia|consultor[íi]a|talleres|sesiones|cursos|clientes)',
  'mi consultor[íi]a', 'mi despacho',
  // "lo veo" pide un anclaje de frecuencia o de lugar. Sin él marcaba
  // "lo veo así de simple", que no afirma nada sobre sus clientes.
  // El (?:\w+ )? es para "lo veo MUY seguido" y "lo he visto UNA y otra vez".
  `lo (?:veo|escucho|he visto|he escuchado) (?:[a-záéíóúñ]+ )?${FREQ}`,
  'he visto (?:[a-záéíóúñ]+ )?(?:a|en|que|cómo|como|much[oa]s|mil|casos|correos|gente|clientes?|negocios?)',
  'se lo he (?:visto|escuchado)',
  'nadie me ha', 'cada (?:semana|d[íi]a|mes) (?:alguien|me|un)',
  'las sesiones que', 'los talleres que',
  // "docenas de" y "cientos de" sólo cuentan si cuentan PERSONAS: "docenas de
  // formas de pedirlo" no es una afirmación sobre su experiencia.
  `(?:docenas|cientos|decenas) de ${GENTE}`,
].join('|'), 'i');

/* "Nunca inventar métricas" (SCHEMA) hecho código. Una cifra visible necesita
   "fuente" (texto, no true) o la firma de Isabela. Un hedge en el copy NO exime:
   "en mis pruebas" es una afirmación más, no evidencia — y ya cae en CLAIM.
   OJO con el \b: %, € y $ NO son caracteres de palabra, así que un \b detrás de
   ellos exige que les siga una letra y nunca dispara. Por eso van en su propia
   alternativa, sin frontera. Esa fue una regresión real: "sube un 40%" pasó limpio. */
const UNI = 'por ciento|x\\b|veces|h\\b|hrs?\\b|horas?|min\\b|minutos?|d[ií]as?|semanas?|meses|años?|anios?|clientes?|negocios?|personas?|emprendedores?|alumnos?|seguidores?|pesos|d[óo]lares|usd|mil(?:es|lones)?';
const PAL = 'dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|quince|veinte|treinta|cuarenta|cincuenta|cien|mil';
const NUM = `(?:\\d+(?:[.,]\\d+)*|\\b(?:${PAL})\\b)`;
/* Dinero con el símbolo DELANTE. Lo que hay que distinguir es "$1 y $2" —
   marcadores dentro de un prompt de ejemplo, el contenido más previsible de un
   carrusel sobre prompts — de un precio real. Contar dígitos NO sirve: con
   "dos o más" se colaba "$2,300", que empieza por un dígito solo. Cuenta dinero
   si el importe trae separador o dos dígitos, o si lo sigue un alcance ("al mes"). */
const ALCANCE = 'al mes|al a[ñn]o|por mes|mensual|cada mes|la hora|al d[íi]a|por persona|de entrada';
const DINERO = `(?:€|\\$|usd\\s|mxn\\s)\\s?(?:\\d{2,}[\\d.,]*|\\d[\\d.,]*\\d|\\d(?=[^.]{0,24}\\b(?:${ALCANCE})\\b))`;
function buscaCifra(t) {
  const m = t.match(new RegExp(`(?:${NUM}\\s*(?:%|€|\\$)|${DINERO})`, 'i'))
    || t.match(new RegExp(`${NUM}\\s*(?:${UNI})\\b`, 'i'))
    || t.match(new RegExp(`${NUM}\\s+de\\s+(?:mis|cada|los|las|nuestros)\\b`, 'i'));
  return m ? m[0] : null;
}

function valida(D, archivo) {
  const err = [];
  const n = D.slides?.length;
  if (!n || n < 5 || n > 7) err.push(`son ${n} slides; el corto lleva entre 5 y 7`);
  D.slides?.forEach((s, i) => {
    const donde = `slide ${i + 1}`;
    const kind = ALIAS[s.kind] || s.kind;
    const spec = BEATS[kind];
    if (!spec) { err.push(`${donde}: kind desconocido "${s.kind}"`); return; }
    for (const c of spec.req) {
      const v = s[c];
      if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) err.push(`${donde} (${s.kind}): falta "${c}"`);
    }
    if (kind === 'concepto') {
      if (!Array.isArray(s.lista)) err.push(`${donde}: "lista" debe ser un array`);
      // Mínimo 2: con "lista": [] el slide de concepto renderizaba un titular solo
      // y un <div class="lista"> vacío, y salía como slide válido.
      else if (s.lista.length < 2) err.push(`${donde}: la lista lleva mínimo 2, trae ${s.lista.length}`);
      else if (s.lista.length > 3) err.push(`${donde}: la lista lleva máximo 3, trae ${s.lista.length}`);
      else s.lista.forEach((it, j) => { if (!it?.nombre?.trim() || !it?.descripcion?.trim()) err.push(`${donde}: item ${j + 1} sin nombre o descripcion`); });
      /* El titular que cuenta los items tiene que contarlos bien. Salió a la luz
         mirando un PNG: "Un archivo. CUATRO cosas." sobre una lista de tres.
         Ningún verificador lo veía porque "cuatro cosas" no es una métrica. */
      if (Array.isArray(s.lista) && typeof s.copy === 'string') {
        const N = { un: 1, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7 };
        const dice = s.copy.match(/\b(un|uno|una|dos|tres|cuatro|cinco|seis|siete|[1-7])\s+(?:cosas?|puntos?|pasos?|claves?|reglas?|partes?|piezas?|ideas?|elementos?|cambios?)\b/i);
        if (dice) {
          const n = N[dice[1].toLowerCase()] ?? Number(dice[1]);
          if (n !== s.lista.length) err.push(`${donde}: el titular dice "${dice[0]}" pero la lista trae ${s.lista.length}`);
        }
      }
    }
    // "ts" es el ÚNICO campo que entra en un atributo (style="--ts:..."), y limpia()
    // no escapa comillas: un ts de 40px" data-x=" inyectaba atributos en el <p>.
    // Aquí se cierra la puerta, y tam() en el motor la cierra otra vez al pintar.
    if (s.ts !== undefined && !/^\d{2,3}px$/.test(String(s.ts)))
      err.push(`${donde}: "ts" tiene que ser NNpx (ej. "104px"), trae ${JSON.stringify(s.ts)}`);

    // Sólo se mira el texto que se IMPRIME; ts y demás campos técnicos no cuentan.
    const VISIBLE = ['hook', 'tape', 'copy', 'boc', 'dato', 'ask', 'follow', 'send'];
    const texto = VISIBLE.map(k => (typeof s[k] === 'string' ? s[k] : ''))
      // Array.isArray y no `s.lista || []`: una "lista" que fuera un string
      // reventaba aquí con un TypeError antes de que el validador pudiera
      // reportar el error de verdad.
      .concat(Array.isArray(s.lista) ? s.lista.flatMap(i => [i?.nombre, i?.descripcion].filter(x => typeof x === 'string')) : []).join(' ');
    const firmado = s.verificado === true;

    // Afirmación en primera persona sobre clientes, alumnos o pruebas propias.
    // NADIE la puede comprobar desde aquí, así que exige la firma de Isabela.
    // Va por TEXTO y no por kind: la regla de fusión del SCHEMA permite mudar
    // "lo veo en los negocios que asesoro" del beat credibilidad al diagnóstico,
    // y con la regla atada al kind esa mudanza colaba la frase sin firma.
    const reclamo = texto.match(CLAIM);
    if (reclamo && !firmado)
      err.push(`${donde}: "${reclamo[0]}" afirma algo sobre la experiencia real de Isabela y nada aquí lo puede comprobar. Ponle "verificado": true sólo si ella confirmó la frase, o reescríbela sin la afirmación.`);
    if (kind === 'credibilidad' && !firmado)
      err.push(`${donde}: el beat de credibilidad existe para afirmar por qué escucharla, así que siempre necesita "verificado": true.`);

    const cifra = buscaCifra(texto);
    const fuenteOk = typeof s.fuente === 'string' && s.fuente.trim().length > 3;
    // "noEsMetrica" es la salida para un falso positivo: un número que cuenta
    // pasos, intentos o ejemplos y no afirma un resultado. Existe para que nadie
    // resuelva un falso positivo poniendo "verificado": true — firmar de más
    // devalúa la firma, que es sobre lo que descansa todo esto.
    const noEsMetrica = typeof s.noEsMetrica === 'string' && s.noEsMetrica.trim().length > 3;
    if (cifra && !fuenteOk && !firmado && !noEsMetrica)
      err.push(`${donde}: la cifra "${cifra.trim()}" no tiene respaldo. Si afirma un resultado, ponle "fuente" (texto) o "verificado": true. Si NO es una métrica (cuenta pasos, intentos o ejemplos), ponle "noEsMetrica" explicando por qué.`);
  });

  /* El caption se publica tal cual y es el texto más largo del archivo. Antes ninguna
     de las dos reglas lo miraba: cinco reclamos y tres cifras que en un slide daban
     exit 1, en el caption pasaban limpios. */
  if (typeof D.caption === 'string') {
    const rc = D.caption.match(CLAIM);
    if (rc && D.captionVerificado !== true)
      err.push(`caption: "${rc[0]}" afirma algo sobre la experiencia real de Isabela. Ponle "captionVerificado": true si ella confirmó la frase, o reescríbela.`);
    const cc = buscaCifra(D.caption);
    const ccOk = (typeof D.captionFuente === 'string' && D.captionFuente.trim().length > 3)
      || (typeof D.captionNoEsMetrica === 'string' && D.captionNoEsMetrica.trim().length > 3);
    if (cc && D.captionVerificado !== true && !ccOk)
      err.push(`caption: la cifra "${cc.trim()}" no tiene respaldo. Ponle "captionFuente", o "captionNoEsMetrica" si el número no afirma un resultado, o "captionVerificado": true.`);
  }
  const primero = D.slides?.[0], ultimo = D.slides?.[n - 1];
  if (primero && primero.kind !== 'portada') err.push('el primer slide tiene que ser la portada');
  if (ultimo && !['cierre', 'final'].includes(ultimo.kind)) err.push('el último slide tiene que ser el cierre');
  if (primero?.hook && !/claude/i.test(primero.hook)) err.push('el hook de la portada tiene que nombrar a Claude');
  if (!D.etiqueta) err.push('falta "etiqueta" (NEGOCIO / PERSONAL / NEGOCIO/PERSONAL)');
  if (!D.audiencia) err.push('falta "audiencia"');
  if (D.caption) {
    const tags = (D.caption.match(/#[\w\u00C0-\u017F]+/g) || []);
    if (tags.length !== 5) err.push(`el caption lleva ${tags.length} hashtags; tienen que ser 5`);
    if (!tags.some(t => t.toLowerCase() === '#claudeai')) err.push('falta #claudeai en el caption');
    if (/#gastosintelgente/.test(D.caption)) err.push('typo publicado: #gastosintelgente -> #gastosinteligente');
  }
  if (err.length) { console.error(`\n✗ ${archivo}\n  - ` + err.join('\n  - ') + '\n'); return false; }
  return true;
}

function page(D) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>${D.titulo}</title>
<style>
${fontCSS()}
${CSS}
</style></head><body>
<div class="page">
  <h1 class="t">${D.id} — ${D.titulo}</h1>
  <p class="s">${D.slides.length} slides · ${D.audiencia} · etiqueta ${D.etiqueta}</p>
  <div class="row" id="app"></div>
</div>
<script>
${PRIM}
const D=${JSON.stringify(D).replace(/</g,'\\u003c')};
${RENDER}
</script></body></html>`;
}

/* CORTO_DATA existe para que pruebas/prueba-guardas.mjs pueda construir sus
   fixtures rotos sin ensuciar data/. No es un bypass: la validación es la misma. */
const dataDir = path.resolve(ROOT, process.env.CORTO_DATA || 'data');
const only = process.argv[2];
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort()
  .filter(f => !only || f.startsWith(only));
fs.mkdirSync(path.resolve(ROOT, process.env.CORTO_BUILD || 'build'), { recursive: true });

let fallos = 0;
for (const f of files) {
  const crudo = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  if (!valida(crudo, f)) { fallos++; continue; }
  const D = limpiaHondo(crudo);
  const out = path.resolve(ROOT, process.env.CORTO_BUILD || 'build', f.replace('.json', '.html'));
  fs.writeFileSync(out, page(D));
  console.log(`${f} -> ${path.basename(out)}  (${D.slides.length} slides, ${(fs.statSync(out).size / 1024 | 0)} KB)`);
}

if (fallos) { console.error(`${fallos} archivo(s) con errores; no se construyeron.`); process.exit(1); }
