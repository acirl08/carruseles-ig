// Firma asistida de las frases en primera persona.
//
//   node firmar.mjs              revisa las frases pendientes, una por una
//   node firmar.mjs --preparar   NO pregunta: escribe FIRMAS-PENDIENTES.md y sale
//
// POR QUÉ EXISTE: `build-corto.mjs` se cae con la frase exacta que hay que firmar,
// pero luego hay que abrir el JSON, encontrar el slide y escribir el campo a mano.
// Eso son varios archivos de fricción cada semana, y la fricción es justo lo que
// empuja a poner "verificado": true sin leer.
//
// LO QUE NO HACE, A PROPÓSITO:
//   · no firma nada solo — cada frase se lee y se decide una por una
//   · no tiene "marcar todas": firmar de más devalúa la firma (02-MARCA.md)
//   · no decide qué pide firma: eso lo dice `build-corto.mjs` y este script lo
//     lee de su salida, para que las dos reglas no puedan desincronizarse
//
// El modo --preparar existe para el domingo: la tarea corre en una sesión sin la
// Mac de Isabela, así que no puede preguntarle nada. Deja el archivo escrito y
// ella corre el modo interactivo cuando lo abre.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const DATA = process.env.CORTO_DATA || path.join(AQUI, 'data');
const PREPARAR = process.argv.includes('--preparar');

const limpio = s => String(s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// Corre el validador real y saca de su salida qué mazo y qué frase pide firma.
// Se apoya en el mensaje que ya emite build-corto.mjs en vez de reimplementar
// la detección: si la regla cambia allá, esto la sigue sin tocarse.
function pendientes() {
  const r = spawnSync('node', [path.join(AQUI, 'build-corto.mjs')], {
    encoding: 'utf8', env: { ...process.env, CORTO_DATA: DATA },
  });
  const salida = (r.stdout || '') + (r.stderr || '');
  const out = [];
  let mazo = null;
  for (const linea of salida.split('\n')) {
    const m = linea.match(/^✗\s+(\S+\.json)/);
    if (m) { mazo = m[1]; continue; }
    const f = linea.match(/^\s+-\s+slide\s+(\d+):\s+(.*)$/);
    if (f && mazo && /verificado/.test(f[2])) {
      out.push({ mazo, slide: Number(f[1]), motivo: f[2].trim() });
    }
  }
  // Un mismo slide puede disparar DOS errores: la frase en primera persona y la
  // regla de que el beat `credibilidad` siempre pide firma. Es un solo slide y
  // una sola decisión, así que se agrupan — si no, se pregunta dos veces por la
  // misma frase y eso convierte la firma en un trámite.
  const porSlide = new Map();
  for (const p of out) {
    const clave = `${p.mazo}#${p.slide}`;
    if (porSlide.has(clave)) porSlide.get(clave).motivos.push(p.motivo);
    else porSlide.set(clave, { mazo: p.mazo, slide: p.slide, motivos: [p.motivo] });
  }
  return [...porSlide.values()];
}

// El slide n del validador es 1-based sobre el array `slides`.
const slideDe = (d, n) => d.slides?.[n - 1];

function frasesDe(sl) {
  const fr = [];
  for (const [k, v] of Object.entries(sl ?? {})) {
    if (k === 'kind' || k === 'verificado') continue;
    if (typeof v === 'string' && limpio(v).length > 20) fr.push(limpio(v));
    else if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const vv of Object.values(v)) {
        if (typeof vv === 'string' && limpio(vv).length > 20) fr.push(limpio(vv));
      }
    }
  }
  return fr;
}

const pend = pendientes();

if (pend.length === 0) {
  console.log('no hay frases pendientes de firma.');
  process.exit(0);
}

// --- modo --preparar: deja el archivo y sale, sin preguntar nada -------------
if (PREPARAR) {
  let md = '# Frases pendientes de tu firma\n\n';
  md += `Generado por \`firmar.mjs --preparar\`. ${pend.length} frase(s) en `;
  md += `${new Set(pend.map(p => p.mazo)).size} mazo(s).\n\n`;
  md += 'Ninguna se puede poner sin ti: `build-corto.mjs` se cae sin ellas, y eso es\n';
  md += 'la funcionalidad. Para resolverlas de una sentada:\n\n```bash\ncd corto && node firmar.mjs\n```\n\n---\n\n';
  for (const p of pend) {
    const d = JSON.parse(readFileSync(path.join(DATA, p.mazo), 'utf8'));
    const sl = slideDe(d, p.slide);
    md += `## ${p.mazo.replace('.json', '')} · slide ${p.slide} (${sl?.kind ?? '?'})\n\n`;
    for (const f of frasesDe(sl)) md += `> ${f}\n>\n`;
    for (const m of p.motivos) md += `\n**Por qué**: ${m}\n`;
    md += `\n---\n\n`;
  }
  const destino = path.join(AQUI, '..', 'FIRMAS-PENDIENTES.md');
  writeFileSync(destino, md);
  console.log(`escrito: FIRMAS-PENDIENTES.md — ${pend.length} frase(s)`);
  process.exit(0);
}

// --- modo interactivo --------------------------------------------------------
const rl = createInterface({ input: process.stdin, output: process.stdout });
let firmadas = 0, reescritas = 0;

console.log(`\n${pend.length} frase(s) pendientes de tu firma.\n`);
console.log('Cada una se decide sola: no hay "marcar todas" a propósito.\n');

for (const [i, p] of pend.entries()) {
  const ruta = path.join(DATA, p.mazo);
  const d = JSON.parse(readFileSync(ruta, 'utf8'));
  const sl = slideDe(d, p.slide);

  console.log('─'.repeat(66));
  console.log(`${i + 1}/${pend.length}  ${p.mazo.replace('.json', '')} · slide ${p.slide} (${sl?.kind ?? '?'})\n`);
  for (const f of frasesDe(sl)) {
    console.log('   ' + f.replace(/(.{62}\s)/g, '$1\n   '));
    console.log();
  }
  for (const m of p.motivos) console.log(`   (${m})\n`);

  const r = (await rl.question('   [s] es cierta   [n] la reescribo   [d] la dejo   [q] salir  > ')).trim().toLowerCase();

  if (r === 'q') { console.log('\nsalgo. lo ya guardado se queda.'); break; }
  if (r === 'd' || r === '') { console.log('   dejada pendiente.\n'); continue; }

  if (r === 's') {
    sl.verificado = true;
    writeFileSync(ruta, JSON.stringify(d, null, 2) + '\n');
    firmadas++;
    console.log('   firmada.\n');
    continue;
  }

  if (r === 'n') {
    // Reescribir para NO hacer la afirmación es legítimo; reescribir para
    // esquivar el validador es el fraude que el sistema existe para impedir.
    // Por eso se abre el mazo entero: se ve la frase en su contexto.
    const editor = process.env.EDITOR || process.env.VISUAL || 'nano';
    console.log(`   abriendo ${editor}… guarda y cierra para revalidar.\n`);
    spawnSync(editor, [ruta], { stdio: 'inherit' });
    const ok = spawnSync('node', [path.join(AQUI, 'build-corto.mjs')], {
      encoding: 'utf8', env: { ...process.env, CORTO_DATA: DATA },
    });
    const sigue = ((ok.stdout || '') + (ok.stderr || '')).includes(p.mazo);
    console.log(sigue ? '   sigue pidiendo firma o hay otro error.\n' : '   ya construye.\n');
    reescritas++;
    continue;
  }

  console.log('   no entendí, la dejo pendiente.\n');
}

rl.close();

console.log('─'.repeat(66));
console.log(`firmadas: ${firmadas}   reescritas: ${reescritas}\n`);

const r = spawnSync('node', [path.join(AQUI, 'build-corto.mjs')], {
  encoding: 'utf8', env: { ...process.env, CORTO_DATA: DATA },
});
const sal = (r.stdout || '') + (r.stderr || '');
const rotos = [...sal.matchAll(/^✗\s+(\S+\.json)/gm)].map(m => m[1]);
if (rotos.length === 0) console.log('todos los mazos construyen.');
else console.log(`siguen sin construir: ${rotos.join(', ')}`);
