// data/*.json -> build/*.html, autocontenidos (las fuentes van en base64).
//
//   node build-recap.mjs
//
// Valida ANTES de construir llamando a check-recap.mjs: un mazo que no pasa el
// validador no debe llegar a HTML, porque el siguiente paso saca PNG y un PNG
// malo se ve terminado.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { CSS, PRIM, cuerpoRecap, clase } from './engine-recap.js';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const DATA = process.env.RECAP_DATA || path.join(AQUI, 'data');
const BUILD = process.env.RECAP_BUILD || path.join(AQUI, 'build');
// Las tipografías viven en la raíz del repo, igual que para el motor del corto.
const FUENTES = path.join(AQUI, '..', 'fonts');

const FONTS = [
  ['Bebas Neue', 'BebasNeue-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic'],
  ['DM Sans', 'DMSans.ttf', '100 1000', 'normal'],
  ['DM Sans', 'DMSans-Italic.ttf', '100 1000', 'italic'],
];

const fontCSS = () => FONTS.map(([fam, file, wght, style]) => {
  const b64 = readFileSync(path.join(FUENTES, file)).toString('base64');
  return `@font-face{font-family:"${fam}";font-weight:${wght};font-style:${style};` +
         `src:url(data:font/ttf;base64,${b64}) format("truetype")}`;
}).join('\n');

// El validador manda: si se cae, no se construye nada.
const val = spawnSync('node', [path.join(AQUI, 'check-recap.mjs')], {
  encoding: 'utf8', env: { ...process.env, RECAP_DATA: DATA },
});
process.stdout.write(val.stdout || '');
if (val.status !== 0) {
  console.error('\nno se construyó nada: arregla los hallazgos primero.');
  process.exit(1);
}

if (!existsSync(BUILD)) mkdirSync(BUILD, { recursive: true });

const archivos = readdirSync(DATA).filter(f => f.endsWith('.json')).sort();
let n = 0;

for (const f of archivos) {
  const d = JSON.parse(readFileSync(path.join(DATA, f), 'utf8'));
  const slides = d.slides ?? [];
  const noticias = slides.filter(s => s.kind === 'noticia').length;

  let i = 0;
  const html = slides.map(s => {
    if (s.kind === 'noticia') i++;
    return `<div class="holder"><div class="scaler"><div class="slide${clase(s.kind)}">` +
           `<div class="brand-top">@ISAISCODING.IA</div>` +
           `<div class="pill">${(d.variante ?? '').toUpperCase()}</div>` +
           `<div class="foot">✳ <b>ISAISCODING.COM</b></div>` +
           `<div class="inner">${cuerpoRecap(s, d.variante, i, noticias)}</div>` +
           `</div></div></div>`;
  }).join('\n');

  const doc = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>${d.titulo ?? f}</title>
<style>${fontCSS()}
${CSS}</style></head><body class="export">
<div class="page"><div class="row">${html}</div></div>
<script>${PRIM}</script>
<script>window.D=${JSON.stringify({ id: d.id, variante: d.variante, slides: slides.length })};</script>
</body></html>`;

  const salida = path.join(BUILD, f.replace('.json', '.html'));
  writeFileSync(salida, doc);
  const kb = Math.round(doc.length / 1024);
  console.log(`${f} -> ${path.basename(salida)}  (${slides.length} slides, ${kb} KB)`);
  n++;
}

console.log(`\n${n} mazo(s) construidos.`);
