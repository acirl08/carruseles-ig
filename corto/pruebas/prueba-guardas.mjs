/* Prueba de las guardas del carrusel corto.
   Una guarda que nunca se ve fallar no es una guarda: es un comentario.
   Cada caso de aquí rompe el mazo A PROPÓSITO y exige que el pipeline lo cache.
   Uso: node pruebas/prueba-guardas.mjs      (desde corto/)
*/
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TMP = path.join(ROOT, 'pruebas', '.tmp');
const DATA = path.join(TMP, 'data'), BUILD = path.join(TMP, 'build');
const BASE = JSON.parse(fs.readFileSync(path.join(ROOT, 'pruebas', 'base.json'), 'utf8'));

const limpiaTmp = () => fs.rmSync(TMP, { recursive: true, force: true });
function prepara(mut) {
  limpiaTmp();
  fs.mkdirSync(DATA, { recursive: true }); fs.mkdirSync(BUILD, { recursive: true });
  const d = structuredClone(BASE);
  if (mut) mut(d);
  fs.writeFileSync(path.join(DATA, 'f01.json'), JSON.stringify(d, null, 2));
}
const corre = (script) => {
  try {
    const out = execFileSync('node', [path.join(ROOT, script)],
      { cwd: ROOT, env: { ...process.env, CORTO_DATA: path.relative(ROOT, DATA), CORTO_BUILD: path.relative(ROOT, BUILD) }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, salida: out };
  } catch (e) {
    return { code: e.status ?? 1, salida: (e.stdout || '') + (e.stderr || '') };
  }
};

const resultados = [];
const caso = (nombre, ok, detalle) => resultados.push({ nombre, ok, detalle });

/* ---------- A. el BUILD tiene que negarse ---------- */
const rechazos = [
  ['kind que el motor no sabe pintar', d => { d.slides[3].kind = 'inventado'; }, /kind desconocido/],
  ['campo obligatorio ausente', d => { delete d.slides[4].dato; }, /falta "dato"/],
  ['mazo de 4 slides', d => { d.slides.splice(1, 3); }, /entre 5 y 7/],
  ['portada que no nombra a Claude', d => { d.slides[0].hook = 'Le pediste que escribiera como tú'; }, /nombrar a Claude/],
  ['caption con 6 hashtags', d => { d.caption += ' #extra'; }, /6 hashtags/],
  ['inyección de atributo por "ts"', d => { d.slides[1].ts = '40px" data-inyectado="si'; }, /"ts" tiene que ser NNpx/],
  ['lista de concepto vacía', d => { d.slides[3].lista = []; }, /mínimo 2/],
  ['lista con items en blanco', d => { d.slides[3].lista = [{ nombre: ' ', descripcion: ' ' }, { nombre: ' ', descripcion: ' ' }]; }, /sin nombre o descripcion/],

  /* La firma humana. El caso viejo hacía `delete verificado` y por eso pasaba
     por el chequeo genérico de campo requerido: con la regla semántica apagada
     la suite seguía en verde. Ahora el campo ESTÁ, en false, y sin texto de
     reclamo, así que sólo la regla de credibilidad lo puede cazar. */
  ['credibilidad firmada en false', d => {
    d.slides[2].verificado = false;
    d.slides[2].copy = 'Esto se repite siempre'; d.slides[2].boc = 'Pasa una y otra vez.';
  }, /siempre necesita "verificado"/],

  /* La evasión que el SCHEMA mismo recomienda: fusionar credibilidad en el
     diagnóstico. Con la regla atada al kind, la frase colaba sin firma. */
  ['afirmación de cliente mudada al diagnóstico', d => {
    d.slides.splice(2, 1);
    d.slides[1].boc = 'Lo veo cada semana en los negocios que asesoro: me piden que suene profesional.';
  }, /afirma algo sobre la experiencia real/],
  ['hedge "en mis pruebas" sin firma', d => { d.slides[4].dato = 'En mis pruebas baja el tiempo.'; delete d.slides[4].verificado; }, /afirma algo sobre la experiencia real/],

  /* Métricas. Los cuatro primeros los dejaba pasar la regex vieja. */
  ['cifra con dígito y unidad', d => { d.slides[5].boc = 'Le ahorra 4 horas a la semana a cualquiera.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['cifra escrita con letras', d => { d.slides[5].boc = 'Le ahorra cuatro horas a la semana a cualquiera.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['cifra abreviada (4h)', d => { d.slides[5].boc = 'Le ahorra 4h a la semana a cualquiera.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['cifra en dinero', d => { d.slides[5].boc = 'Les ahorra 500 pesos al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['cifra tipo "9 de mis clientes"', d => { d.slides[5].boc = 'Nueve de cada diez lo hacen mal.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['"fuente": true no es una fuente', d => { d.slides[5].boc = 'Le ahorra 4 horas a la semana.'; d.slides[5].fuente = true; d.slides[5].verificado = false; }, /no tiene respaldo/],
  /* Regresión real: al ampliar la regex, el \b final mató los porcentajes — el
     formato de métrica inventada MÁS común, y el ejemplo canónico del SCHEMA. */
  ['porcentaje (la regresión del \\b)', d => { d.slides[5].boc = 'Sube un 40% la conversión.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['porcentaje con espacio', d => { d.slides[5].boc = 'Sube un 40 % la conversión.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['dinero con símbolo', d => { d.slides[5].boc = 'Cuesta $300 al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  /* El separador de miles empieza por un dígito solo: con "dos dígitos o más"
     "$2,300" volvió a colarse — el mismo caso, cerrado y reabierto dos rondas. */
  ['dinero con separador de miles', d => { d.slides[5].boc = 'Te ahorra $2,300 al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['dinero con punto de miles', d => { d.slides[5].boc = 'Cuesta $1.500 al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['precio de un dígito con alcance', d => { d.slides[5].boc = 'Cuesta $9 al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['precio en euros de un dígito', d => { d.slides[5].boc = 'Cuesta €8 al mes.'; d.slides[5].verificado = false; }, /no tiene respaldo/],
  ['porcentaje con dos espacios', d => { d.slides[5].boc = 'Sube un 40  % la conversión.'; d.slides[5].verificado = false; }, /no tiene respaldo/],

  /* Paráfrasis que abrió el anclaje de CLAIM de la ronda 3. Cuatro de estas
     las pedí probar yo y las cuatro se colaban. */
  ['"mis pruebas dicen otra cosa"', d => { d.slides[1].boc = 'Mis pruebas dicen otra cosa.'; }, /experiencia real/],
  ['"he visto muchos casos iguales"', d => { d.slides[1].boc = 'He visto muchos casos iguales.'; }, /experiencia real/],
  ['"llevo años en esto"', d => { d.slides[1].boc = 'Llevo años en esto y siempre es igual.'; }, /experiencia real/],
  ['"trabajo con gente que…"', d => { d.slides[1].boc = 'Trabajo con gente que no sabe pedirle nada.'; }, /experiencia real/],
  ['"lo veo muy seguido"', d => { d.slides[1].boc = 'Lo veo muy seguido.'; }, /experiencia real/],
  ['"lo he visto una y otra vez"', d => { d.slides[1].boc = 'Lo he visto una y otra vez.'; }, /experiencia real/],
  ['"mi consultoría lo ve a diario"', d => { d.slides[1].boc = 'Mi consultoría lo ve a diario.'; }, /experiencia real/],
  ['"trabajo con dueños de negocio"', d => { d.slides[1].boc = 'Trabajo con dueños de negocio todos los días.'; }, /experiencia real/],

  /* El caption se publica tal cual y era terreno libre: ninguna de las dos reglas
     lo miraba. Tres cifras y cinco reclamos pasaban ahí lo que en un slide no. */
  ['reclamo en el caption', d => { d.caption = 'Lo veo cada semana en los negocios que asesoro.\n\n#claudeai #a #b #c #d'; }, /caption: .*experiencia real/],
  ['cifra en el caption', d => { d.caption = 'El 80% de la gente lo hace mal.\n\n#claudeai #a #b #c #d'; delete d.captionNoEsMetrica; }, /caption: .*no tiene respaldo/],
  ['"captionNoEsMetrica" en blanco no exime', d => { d.caption = 'El 80% de la gente lo hace mal.\n\n#claudeai #a #b #c #d'; d.captionNoEsMetrica = 'x'; }, /caption: .*no tiene respaldo/],
  ['"noEsMetrica" en blanco no exime', d => { d.slides[5].boc = 'Le ahorra 4 horas a la semana.'; d.slides[5].verificado = false; d.slides[5].noEsMetrica = 'x'; }, /no tiene respaldo/],

  /* Paráfrasis que el CLAIM viejo dejaba pasar. Cada una es una frase que alguien
     escribiría de verdad, no un caso de laboratorio. */
  ['"mis clientas me lo dicen"', d => { d.slides[1].boc = 'Mis clientas me lo dicen siempre.'; }, /experiencia real/],
  ['"los emprendedores que acompaño"', d => { d.slides[1].boc = 'Los emprendedores que acompaño lo hacen igual.'; }, /experiencia real/],
  ['"trabajo con negocios que…"', d => { d.slides[1].boc = 'Trabajo con negocios que cometen este error.'; }, /experiencia real/],
  ['"lo veo todos los días"', d => { d.slides[1].boc = 'Lo veo todos los días en mi consultoría.'; }, /experiencia real/],
  ['"nadie me ha pasado nunca"', d => { d.slides[1].boc = 'Nadie me ha pasado nunca un correo suyo.'; }, /experiencia real/],
  ['"llevo años viendo"', d => { d.slides[1].boc = 'Llevo años viendo este mismo error.'; }, /experiencia real/],

  /* Reglas de estructura y de marca. Ninguna tenía caso: se podían borrar del
     validador sin que la suite bajara de verde. */
  /* Lo vi mirando un PNG, no lo vio ningún verificador: "Un archivo. CUATRO
     cosas." encima de una lista de tres. "cuatro cosas" no es una métrica, así
     que ninguna regla de cifras lo tocaba. */
  ['el titular cuenta mal los items', d => { d.slides[3].copy = 'Tu estilo. Cuatro cosas.'; }, /el titular dice .* pero la lista trae 3/],
  ['lista de 4 items', d => { d.slides[3].lista.push({ nombre: 'CUATRO', descripcion: 'de más' }); }, /máximo 3/],
  ['lista que no es array', d => { d.slides[3].lista = 'tres cosas'; }, /debe ser un array/],
  ['el mazo no abre con portada', d => { d.slides[0].kind = 'diagnostico'; d.slides[0].copy = 'X'; d.slides[0].boc = 'Y'; }, /primer slide tiene que ser la portada/],
  ['el mazo no cierra con el cierre', d => { d.slides[6] = { ...d.slides[1] }; }, /último slide tiene que ser el cierre/],
  ['sin etiqueta', d => { delete d.etiqueta; }, /falta "etiqueta"/],
  ['sin audiencia', d => { delete d.audiencia; }, /falta "audiencia"/],
  ['caption sin #claudeai', d => { d.caption = d.caption.replace('#claudeai', '#claude'); }, /falta #claudeai/],
  ['el typo #gastosintelgente', d => { d.caption = d.caption.replace('#claudeai', '#gastosintelgente'); }, /gastosintelgente/],
];
for (const [nombre, mut, esperado] of rechazos) {
  prepara(mut);
  const r = corre('build-corto.mjs');
  caso(`build rechaza: ${nombre}`, r.code !== 0 && esperado.test(r.salida),
    r.code === 0 ? 'CONSTRUYÓ igual (exit 0)' : `mensaje: ${(r.salida.match(esperado) || ['no coincide'])[0]}`);
}

/* ---------- A-bis. lo que el build tiene que DEJAR PASAR ----------
   Una suite que sólo prueba lo que la regla rechaza no puede ver el día en que
   la regla empieza a rechazar de más. Eso pasó tres veces seguidas aquí: la
   regla de cifras marcó "tres veces" en el caption real de Isabela, y la
   reacción fue reescribirle el texto a ella en vez de arreglar la regla.
   Cada línea de abajo es copy que alguien escribiría de verdad y que NO
   afirma nada sobre resultados ni sobre la experiencia de Isabela. */
const permitidos = [
  ['marcadores $1 y $2 en un prompt', d => { d.slides[4].boc = 'Usa $1 y $2 como marcadores en el prompt.'; }],
  ['"el trabajo con IA"', d => { d.slides[1].boc = 'El trabajo con IA cambia la forma de escribir.'; }],
  ['"lo veo así de simple"', d => { d.slides[1].boc = 'Lo veo así de simple.'; }],
  ['"docenas de formas de pedirlo"', d => { d.slides[1].boc = 'Hay docenas de formas de pedirlo.'; }],
  ['"mis pruebas favoritas"', d => { d.slides[1].boc = 'Mis pruebas favoritas son las simples.'; }],
  ['"tres veces" con noEsMetrica', d => { d.slides[1].boc = 'Le cambiaste el prompt tres veces.'; d.slides[1].noEsMetrica = 'cuenta los intentos del lector, no un resultado'; }],
  ['cifra con fuente citada', d => { d.slides[5].boc = 'Sube un 40% la conversión.'; d.slides[5].verificado = false; d.slides[5].fuente = 'Benchmark público de X, marzo 2026'; }],
  ['"la gente que escribe" en 2ª persona', d => { d.slides[1].boc = 'La gente escribe distinto cuando tiene prisa.'; }],
  ['"llevo años" fuera de contexto', d => { d.slides[1].boc = 'Llevo años de retraso con eso.'; }],
  ['titular que cuenta bien los items', d => { d.slides[3].copy = 'Tu estilo. Tres cosas.'; }],
  ['titular sin conteo', d => { d.slides[3].copy = 'Tu estilo no se describe. Se muestra.'; }],
];
for (const [nombre, mut] of permitidos) {
  prepara(mut);
  const r = corre('build-corto.mjs');
  caso(`build DEJA PASAR: ${nombre}`, r.code === 0, r.code === 0 ? 'construye' : `RECHAZADO: ${r.salida.split('\n').find(l => l.trim().startsWith('-')) || ''}`.slice(0, 130));
}

/* ---------- B. la base válida SÍ tiene que construir y pasar limpia ---------- */
prepara(null);
const base = corre('build-corto.mjs');
caso('build acepta la base válida', base.code === 0, base.salida.trim().split('\n').pop());
const chkBase = corre('check-corto.mjs');
caso('check no inventa hallazgos en la base', chkBase.code === 0 && /sin hallazgos/.test(chkBase.salida), chkBase.salida.trim());

/* ---------- C. el CHECK tiene que hallar lo que el build no puede ver ---------- */

// C1. Slide EN BLANCO. El validador ya no deja pasar un kind desconocido, así que
//     este caso se fabrica al nivel del HTML: es exactamente lo que produjo el bug
//     "final" vs "cierre" — un .inner vacío que el check aprobaba con exit 0.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace('window.D=D;', 'window.D=D;document.querySelectorAll(".inner")[3].innerHTML="\\u003c!-- kind desconocido: inventado --\\u003e";');
  fs.writeFileSync(f, html);
  const r = corre('check-corto.mjs');
  caso('check caza el slide en blanco', r.code !== 0 && /SIN TINTA/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1b. La guarda del comentario "kind desconocido" tiene su propio caso: antes iba
//      pegada al del .inner vacío y se podía borrar sin que la suite bajara de verde.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  let html = fs.readFileSync(f, 'utf8');
  html = html.replace('window.D=D;', 'window.D=D;document.querySelectorAll(".inner")[3].insertAdjacentHTML("beforeend","\\u003c!-- kind desconocido: inventado --\\u003e");');
  fs.writeFileSync(f, html);
  const r = corre('check-corto.mjs');
  caso('check caza el kind desconocido aunque haya tinta', r.code !== 0 && /no sabe pintar/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1c. Cuatro campos con "<br>": el validador los ve como texto no vacío, el
//      render produce cajas con altura real, y el slide sale SIN UNA PALABRA.
//      Contar cajas no bastaba; hay que mirar innerText.
{
  prepara(d => { const c = d.slides[6]; c.copy = c.ask = c.follow = c.send = '<br>'; });
  const bb = corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza el slide de puros <br>', bb.code === 0 && r.code !== 0 && /SIN TINTA/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1d. Área segura. Esta guarda nació de un bug real —el titular montado sobre el
//      handle y el pie, con el check en silencio— y no tenía un solo caso que la
//      sostuviera. `fit()` sólo encoge hasta 0.55, así que un titular monstruoso
//      se sale igual y la guarda tiene que verlo.
//      Van DOS casos, uno por mitad: con un solo fixture que desborda por arriba
//      y por abajo a la vez, cada mitad tapaba a la otra y se podía borrar media
//      guarda sin que la suite bajara.
{
  prepara(d => { d.slides[1].ts = '999px'; d.slides[1].copy = 'Un titular monstruoso que no cabe de ninguna manera en el área segura ni encogiendo al tope'; });
  const bb = corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza la tinta que sube fuera del área', bb.code === 0 && r.code !== 0 && /tinta sube a y=/.test(r.salida), r.salida.trim().split('\n')[0].slice(0, 90));
  caso('check caza la tinta que baja fuera del área', r.code !== 0 && /tinta baja a y=/.test(r.salida), r.salida.trim().split('\n')[0].slice(0, 90));
}

// C1d-bis. Sólo por ABAJO: el bloque empujado hacia el pie, sin desbordar arriba.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace('window.D=D;', 'window.D=D;setTimeout(()=>{const i=document.querySelectorAll(".inner")[1];i.style.justifyContent="flex-start";i.style.paddingTop="900px";},400);'));
  const r = corre('check-corto.mjs');
  caso('check caza el desborde SÓLO por abajo', r.code !== 0 && /tinta baja a y=/.test(r.salida) && !/tinta sube a y=/.test(r.salida), r.salida.trim().split('\n')[0].slice(0, 90));
}

// C1d-ter. Hueco ENTRE elementos > 300px. Con el CSS actual no se puede producir
//      desde el JSON, y por eso la guarda llevaba dos rondas sin un solo caso.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace('window.D=D;', 'window.D=D;setTimeout(()=>{document.querySelectorAll(".slide")[1].querySelector(".boc").style.marginTop="420px";},400);'));
  const r = corre('check-corto.mjs');
  caso('check caza el hueco entre elementos', r.code !== 0 && /entre elementos/.test(r.salida), r.salida.trim().split('\n')[0].slice(0, 100));
}

// C1d-quater. CERO slides renderizados, con window.D intacto.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace('window.D=D;', 'window.D=D;document.getElementById("app").innerHTML="";'));
  const r = corre('check-corto.mjs');
  caso('check caza la página con CERO slides', r.code !== 0 && /CERO slides/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1e. pageerror + conteo de slides. También nació de un bug real: un TypeError
//      dejaba la página VACÍA y el check decía "sin hallazgos".
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('window.D=D;', 'window.D=D;null.explota();'));
  const r = corre('check-corto.mjs');
  caso('check caza un error de página', r.code !== 0 && /ERROR DE PÁGINA/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1f. Escala forzada y recorte horizontal. Un titular grande que SÍ cabe encogiendo
//      pero deja el slide en <=0.80, y una palabra sin espacios que se corta a media letra.
{
  prepara(d => { d.slides[1].ts = '220px'; });
  const bb = corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza la escala forzada', bb.code === 0 && r.code !== 0 && /escala forzada/.test(r.salida), r.salida.trim().split('\n')[0]);
}
{
  prepara(d => { d.slides[1].copy = 'Supercalifragilisticoespialidosoinquebrantableindescifrable'; d.slides[1].ts = '140px'; });
  corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza el recorte horizontal', r.code !== 0 && /recorte horizontal/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C1f-bis. Choque contra el chrome fijo, caja contra caja.
{
  prepara(d => { d.slides[1].ts = '400px'; });
  corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza el texto encima del chrome', r.code !== 0 && /texto encima de (handle|pie)/.test(r.salida), r.salida.trim().split('\n')[0].slice(0, 120));
}

// C1g. "undefined" impreso, conteo de slides, y la 2ª capa tam() contra el ts.
//      Los tres sólo se pueden fabricar tocando el HTML: el validador ya no deja
//      llegar hasta ahí desde el JSON, y aun así las guardas tienen que existir.
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace('window.D=D;', 'window.D=D;document.querySelectorAll(".boc")[0].textContent="undefined";'));
  const r = corre('check-corto.mjs');
  caso('check caza la palabra "undefined"', r.code !== 0 && /"undefined" aparece/.test(r.salida), r.salida.trim().split('\n')[0]);
}
{
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace('window.D=D;', 'window.D=D;document.querySelectorAll(".holder")[2].remove();'));
  const r = corre('check-corto.mjs');
  caso('check caza que falte un slide', r.code !== 0 && /slides renderizados de/.test(r.salida), r.salida.trim().split('\n')[0]);
}
{
  // tam(): si el validador se cayera, el motor todavía tiene que negarse a meter
  // un ts arbitrario en el atributo. Se le pasa el dato ya construido, por detrás.
  prepara(null); corre('build-corto.mjs');
  const f = path.join(BUILD, 'f01.html');
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8')
    .replace(/"ts":"94px"/, '"ts":"40px\\" data-inyectado=\\"si"'));
  const b2 = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
  const p2 = await b2.newPage({ viewport: { width: 1160, height: 1400 } });
  await p2.goto('file://' + f); await p2.waitForTimeout(800);
  const v2 = await p2.evaluate(() => ({
    inyectado: !!document.querySelector('[data-inyectado]'),
    estilo: document.querySelectorAll('.hl')[1].getAttribute('style'),
  }));
  await b2.close();
  caso('tam() bloquea el ts aunque el validador falle', !v2.inyectado && v2.estilo === '--ts:104px', `style=${v2.estilo} inyectado=${v2.inyectado}`);
}

// C2. Aire absoluto. El umbral viejo medía |arriba-abajo|, que con
//     justify-content:center vale siempre ~5: era una constante de CSS.
{
  prepara(d => { d.slides[5].ts = '40px'; d.slides[5].copy = 'Cambia'; d.slides[5].boc = 'Poco.'; });
  const bb = corre('build-corto.mjs');
  const r = corre('check-corto.mjs');
  caso('check caza el slide famélico', bb.code === 0 && r.code !== 0 && /vacío de contenido/.test(r.salida), r.salida.trim().split('\n')[0]);
}

// C3. Escapado: "<" suelto y "</script>" no pueden romper la página ni desaparecer texto.
{
  prepara(d => { d.slides[1].copy = 'Si A<B entonces el resto del slide sobrevive'; d.slides[1].boc = 'Cierra con </script><h1>INYECTADO</h1> y sigue siendo texto.'; });
  const bb = corre('build-corto.mjs');
  caso('build acepta "<" y "</script>" en el copy', bb.code === 0, bb.salida.trim().split('\n').pop());
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1160, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(BUILD, 'f01.html'));
  await p.waitForTimeout(900);
  const v = await p.evaluate(() => ({
    inyectado: !!document.querySelector('h1 ~ h1, .slide h1'),
    textoH1: [...document.querySelectorAll('h1')].map(h => h.textContent).join('|'),
    sobrevive: document.querySelectorAll('.slide')[1].innerText.includes('SOBREVIVE'),
    literal: document.querySelectorAll('.slide')[1].innerText.includes('</script>'),
    slides: document.querySelectorAll('.slide').length,
  }));
  await b.close();
  caso('sin ejecución de HTML inyectado', !/INYECTADO/.test(v.textoH1) && errs.length === 0, `h1 en la página: ${v.textoH1} · errores: ${errs.length}`);
  caso('el texto tras "<" no se pierde', v.sobrevive && v.slides === 7, `sobrevive=${v.sobrevive} slides=${v.slides}`);
  caso('"</script>" se ve como texto', v.literal, `literal=${v.literal}`);
}

limpiaTmp();

/* ---------- veredicto ---------- */
const fallan = resultados.filter(r => !r.ok);
for (const r of resultados) console.log(`${r.ok ? '✓' : '✗'} ${r.nombre}${r.detalle ? `  — ${r.detalle}` : ''}`);
console.log(`\n${resultados.length - fallan.length}/${resultados.length} guardas comprobadas`);
process.exit(fallan.length ? 1 : 0);
