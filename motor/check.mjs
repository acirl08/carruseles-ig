import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const files = fs.readdirSync('build').filter(f=>f.endsWith('.html')).sort();
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'});
const problems=[];
for (const f of files){
  const p = await b.newPage({viewport:{width:1160,height:1400}});
  await p.goto('file://'+path.resolve('build',f));
  await p.evaluate(()=>document.body.classList.add('export'));
  await p.waitForTimeout(900);
  const res = await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('.slide').forEach((sl,i)=>{
      const R=el=>{const r=el.getBoundingClientRect();const s=sl.getBoundingClientRect();
        return {t:r.top-s.top,l:r.left-s.left,b:r.bottom-s.top,r:r.right-s.left,w:r.width,h:r.height};};
      const inner=sl.querySelector('.inner');
      const rec={n:i+1,msgs:[]};
      if(inner && inner.scrollHeight>1352) rec.msgs.push('desborde '+inner.scrollHeight);
      const sc=parseFloat(getComputedStyle(sl).getPropertyValue('--sc')||'1');
      if(sc<0.82) rec.msgs.push('escala baja '+sc);
      const artc=sl.querySelector('.art:not(.inl)');
      let art=artc&&(artc.querySelector('img,svg')||artc);
      if(art&&art.tagName.toLowerCase()==='svg') art=art.querySelector('g')||art;
      if(art){const a=R(art);
        if(a.b>1205) rec.msgs.push('arte bajo y=1205 ('+Math.round(a.b)+')');
        const bl=sl.querySelector('.foot'), br=sl.querySelector('.dots');
        [['pie',bl],['puntos',br]].forEach(([nm,el])=>{ if(!el)return; const m=R(el);
          if(!(a.r<m.l||a.l>m.r||a.b<m.t||a.t>m.b)) rec.msgs.push('arte encima de '+nm); });
        // choque con bandas / cajas del cuerpo
        sl.querySelectorAll('.band,.hbox,.caso,.chips,.ribbon,.checks,.stack6,.steps,.quotes,.cards3,.negs,.defn,ol.nums,.cols2,.ask,.follow,.send').forEach(el=>{const m=R(el); if(el.classList.contains('band')){m.l+=28;m.r-=28;}
          if(m.w<20||m.h<20)return;
          const ox=Math.min(a.r,m.r)-Math.max(a.l,m.l), oy=Math.min(a.b,m.b)-Math.max(a.t,m.t);
          if(ox>26&&oy>26) rec.msgs.push('arte encima de caja ('+Math.round(ox)+'x'+Math.round(oy)+')');});
      }
      // marcos inflados: frame mucho más alto que su contenido
      sl.querySelectorAll('.hbox:not(.c)').forEach(el=>{const fr=el.querySelector(':scope > .frame'), bd=el.querySelector(':scope > .body, :scope > div');
        if(fr&&bd){const a=R(fr),m=R(bd); if(a.h>m.h+80) rec.msgs.push('marco inflado '+Math.round(a.h)+' vs '+Math.round(m.h));}});
      // hueco vertical vacío más grande (mide el lienzo, no las cajas)
      {const marcas=[...sl.querySelectorAll('.inner *')].map(R).filter(m=>m.b-m.t>6&&m.r-m.l>6)
         .concat([...sl.querySelectorAll('.art')].map(el=>{const c=el.querySelector('img,svg')||el;return R(c);}));
       const bandas=marcas.map(m=>[m.t,m.b]).sort((a,b)=>a[0]-b[0]);
       let y=250,hueco=0,dondeY=0;
       for(const [t,b] of bandas){ if(t>y){ if(t-y>hueco){hueco=t-y;dondeY=y;} } y=Math.max(y,b); }
       if(1200-y>hueco){hueco=1200-y;dondeY=y;}
       if(hueco>300) rec.msgs.push('hueco '+Math.round(hueco)+'px en y='+Math.round(dondeY));}
      if(rec.msgs.length) out.push(rec);
    });
    return out;
  });
  res.forEach(r=>problems.push(`${f.slice(0,3)} s${String(r.n).padStart(2,'0')}: ${r.msgs.join(' | ')}`));
  await p.close();
}
await b.close();
console.log(problems.length? problems.join('\n') : 'sin hallazgos');
