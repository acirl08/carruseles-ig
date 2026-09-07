// build/*.html -> out/<id>/<id>-NN.png a 1080x1350.
//
//   node shots-recap.mjs
//
// La ruta del navegador sale de CHROMIUM_PATH; ./preparar.sh la deja escrita en
// entorno.sh. El default es la del contenedor donde se construyó el sistema.

import { chromium } from 'playwright';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const BUILD = process.env.RECAP_BUILD || path.join(AQUI, 'build');
const OUT = process.env.RECAP_OUT || path.join(AQUI, 'out');

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

for (const f of readdirSync(BUILD).filter(x => x.endsWith('.html')).sort()) {
  const id = f.replace('.html', '').split('-')[0];
  const dir = path.join(OUT, id);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  await pg.goto('file://' + path.join(BUILD, f));
  await pg.waitForTimeout(400);          // que las fuentes embebidas asienten
  const slides = await pg.locator('.slide').all();

  for (const [i, sl] of slides.entries()) {
    const nn = String(i + 1).padStart(2, '0');
    await sl.screenshot({ path: path.join(dir, `${id}-${nn}.png`) });
  }
  console.log(`${id} ${slides.length}`);
}

await b.close();
