import fs from 'fs';
import path from 'path';
import { CSS, PRIM, RENDER } from './engine.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DOODLES_SRC = fs.readFileSync(path.join(ROOT, 'doodles.js'), 'utf8');

/* ---------- tipografías incrustadas ---------- */
const FONTS = [
  ['Bebas Neue', 'BebasNeue-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Regular.ttf', 400, 'normal'],
  ['Instrument Serif', 'InstrumentSerif-Italic.ttf', 400, 'italic'],
  ['DM Sans', 'DMSans.ttf', '100 1000', 'normal'],
  ['DM Sans', 'DMSans-Italic.ttf', '100 1000', 'italic'],
];
function fontCSS() {
  return FONTS.map(([fam, file, wght, style]) => {
    const b64 = fs.readFileSync(path.join(ROOT, 'fonts', file)).toString('base64');
    return `@font-face{font-family:"${fam}";font-style:${style};font-weight:${wght};font-display:block;` +
      `src:url(data:font/ttf;base64,${b64}) format("truetype")}`;
  }).join('\n');
}

/* ---------- ilustraciones de Pichu ---------- */
function imgMap(D) {
  const ids = new Set();
  for (const s of D) if (s.art && s.art.type === 'pichu') ids.add(s.art.id);
  const out = {};
  const faltan = [];
  for (const id of ids) {
    const p = path.join(ROOT, 'pichu', id + '.png');
    if (fs.existsSync(p)) out[id] = 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
    else faltan.push(id);
  }
  return { out, faltan };
}

/* ---------- página ---------- */
function page(c, D) {
  const { out: IMG, faltan } = imgMap(D);
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>${c.titulo}</title>
<style>
${fontCSS()}
${CSS}
</style></head><body>
<div class="page">
  <h1 class="t">${c.id} — ${c.titulo}</h1>
  <p class="s">${c.nota || ''}</p>
  <div class="row" id="app"></div>
</div>
<script>
${DOODLES_SRC}
${PRIM}
const IMG=${JSON.stringify(IMG)};
const D=${JSON.stringify(D)};
${RENDER}
</script></body></html>`;
  return { html, faltan };
}

/* ---------- main ---------- */
const dataDir = path.join(ROOT, 'data');
const only = process.argv[2];
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort()
  .filter(f => !only || f.startsWith(only));
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });

let totalFaltan = new Set();
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
  const { html, faltan } = page(c, c.slides);
  const outFile = path.join(ROOT, 'build', f.replace('.json', '.html'));
  fs.writeFileSync(outFile, html);
  faltan.forEach(x => totalFaltan.add(x));
  console.log(`${f} -> ${path.basename(outFile)}  (${c.slides.length} slides, ${(html.length / 1024 | 0)} KB)` +
    (faltan.length ? `  ⚠ poses faltantes: ${faltan.join(', ')}` : ''));
}
if (totalFaltan.size) console.log(`\nPoses de Pichu por generar (${totalFaltan.size}): ${[...totalFaltan].sort().join(' ')}`);
