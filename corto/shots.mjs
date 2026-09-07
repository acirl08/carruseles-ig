import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const files = fs.readdirSync(process.env.CORTO_BUILD || 'build').filter(f=>f.endsWith('.html')).sort();
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'});
for (const f of files){
  const id = f.slice(0,3);
  const outdir = path.join(process.env.CORTO_OUT || (process.env.CORTO_BUILD ? path.join(process.env.CORTO_BUILD,'..','out') : 'out'), id); fs.mkdirSync(outdir,{recursive:true});
  const p = await b.newPage({viewport:{width:1160,height:1400}});
  await p.goto('file://'+path.resolve(process.env.CORTO_BUILD || 'build',f));
  await p.evaluate(()=>document.body.classList.add('export'));
  await p.waitForTimeout(1200);
  await p.evaluate(()=>{ if(window.run) window.run(); });
  await p.waitForTimeout(300);
  const els = await p.$$('.slide');
  for(let i=0;i<els.length;i++) await els[i].screenshot({path:path.join(outdir,`${id}-${String(i+1).padStart(2,'0')}.png`)});
  await p.close(); console.log(id, els.length);
}
await b.close();
