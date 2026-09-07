import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const files = fs.readdirSync('build').filter(f=>f.endsWith('.html')).sort();
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'});
for (const f of files){
  const id = f.slice(0,3);
  const outdir = path.join('out', id); fs.mkdirSync(outdir,{recursive:true});
  const p = await b.newPage({viewport:{width:1160,height:1400},deviceScaleFactor:1});
  await p.goto('file://'+path.resolve('build',f));
  await p.evaluate(()=>document.body.classList.add('export'));
  await p.waitForTimeout(1000);
  const els = await p.$$('.slide');
  for(let i=0;i<els.length;i++) await els[i].screenshot({path:path.join(outdir,`${id}-${String(i+1).padStart(2,'0')}.png`)});
  await p.close();
  console.log(id, els.length);
}
await b.close();
