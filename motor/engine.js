/* Motor del carrusel largo @isaiscoding.ia
   Uso:  node build.mjs            -> genera build/cNN-slug.html (autocontenido)
   Lo único que cambia entre carruseles es data/cNN.json. */

export const CSS = `
:root{--ink:#111;--gray:#555;--accent:#C4613A;--pale:#F0D5CA;--bg:#F7F6F4;--grid:rgba(0,0,0,.055)}
*{box-sizing:border-box}
body{margin:0;background:#191919;color:#eee;font-family:"DM Sans",system-ui,sans-serif}
.page{padding:22px}
h1.t{font-family:"Instrument Serif",Georgia,serif;font-size:28px;font-weight:400;margin:0 0 6px}
p.s{margin:0 0 22px;color:#999;font-size:14px;max-width:74ch;line-height:1.6}
.row{display:flex;gap:18px;flex-wrap:wrap}
.holder{width:540px}
.cap{font-family:"Bebas Neue",Impact,sans-serif;letter-spacing:.12em;font-size:15px;color:#8a8a8a;margin-bottom:5px}
.scaler{width:540px;height:675px;overflow:hidden}
.scaler>.slide{transform:scale(.5);transform-origin:top left}
body.export{background:#fff}
body.export .page{padding:0}
body.export .cap,body.export h1.t,body.export p.s{display:none}
body.export .row{gap:0}
body.export .holder,body.export .scaler{width:1080px;height:1350px}
body.export .scaler>.slide{transform:none}

/* ---------- artboard ---------- */
.slide{width:1080px;height:1350px;position:relative;overflow:hidden;background-color:var(--bg);
 background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
 background-size:54px 54px;color:var(--ink);font-family:"DM Sans",system-ui,sans-serif}
.slide svg{flex:none}
.inner{position:absolute;inset:0;padding:250px 96px 150px;display:flex;flex-direction:column;align-items:center;text-align:center}
.tl{position:absolute;top:52px;left:60px;font-family:"Bebas Neue",Impact,sans-serif;font-size:26px;letter-spacing:.14em}
.foot{position:absolute;bottom:46px;left:60px;font-family:"Bebas Neue",Impact,sans-serif;font-size:22px;letter-spacing:.14em;color:var(--gray);z-index:6}
.foot b{color:var(--accent);font-weight:400}
.dots{position:absolute;bottom:42px;right:60px;display:flex;gap:9px;z-index:6}
.pip{width:9px;height:9px;border-radius:50%;background:var(--ink);opacity:.15}
.pip.on{opacity:1;background:var(--accent);transform:scale(1.4)}
.numwrap{position:absolute;top:132px;left:50%;transform:translateX(-50%);width:150px;height:96px}
.numwrap .n{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
 font-family:"Bebas Neue",Impact,sans-serif;font-size:44px;letter-spacing:.06em;padding-top:4px}
.numspark{position:absolute;top:120px;left:calc(50% - 118px);color:var(--accent);transform:scale(.8)}

.title{font-family:"Instrument Serif",Georgia,serif;font-weight:400;
 font-size:calc(var(--ts,86px)*var(--sc,1));line-height:.99;letter-spacing:-.012em;margin:0;text-wrap:balance}
.title em{font-style:italic}
.ul{display:block;height:16px;margin:12px auto 0;color:var(--accent)}
.wave{display:block;height:18px;color:var(--accent)}

/* piezas */
.frame{position:absolute;inset:0;color:var(--ink)}
.tape{position:absolute;left:-16px;top:-22px;color:var(--accent)}
.hbox{position:relative;width:100%}
.ribbon{min-width:0}
.ribbon svg{max-width:100%;height:auto}
.hbox>.body{position:relative;padding:calc(38px*var(--sc,1)) 44px}
.abox>.frame{color:var(--accent)}

.band{width:100%;background:var(--pale);padding:calc(24px*var(--sc,1)) 30px;text-align:center}
.band .txt{font-family:"Instrument Serif",Georgia,serif;font-size:calc(40px*var(--sc,1));line-height:1.14}
.band .lab{font-family:"Bebas Neue",Impact,sans-serif;font-size:22px;letter-spacing:.16em;color:var(--accent);display:block;margin-bottom:8px}

.chain{display:flex;flex-direction:column;gap:calc(24px*var(--sc,1));text-align:left}
.chain .lk{display:flex;gap:15px;align-items:flex-start;font-size:calc(30px*var(--sc,1));line-height:1.32;font-weight:500}
.chain .lk .d{flex:none;width:13px;height:13px;border-radius:50%;background:var(--accent);margin-top:11px}
.chain i{font-style:normal;color:var(--accent);font-weight:700;padding:0 4px}

ol.nums{margin:0;padding:0;display:flex;flex-direction:column;gap:calc(22px*var(--sc,1));text-align:left;width:100%}
ol.nums li{display:flex;gap:16px;align-items:flex-start;font-size:calc(29px*var(--sc,1));line-height:1.3;font-weight:500;list-style:none}
ol.nums .k{flex:none;font-family:"Bebas Neue",Impact,sans-serif;font-size:30px;color:var(--accent);width:32px;text-align:right;padding-top:3px}

.quotes{display:flex;flex-direction:column;gap:calc(20px*var(--sc,1));width:100%}
.quotes p{margin:0;font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:calc(42px*var(--sc,1));line-height:1.2;color:var(--gray)}
.quotes .solid{font-family:"DM Sans",system-ui,sans-serif;font-style:normal;font-weight:600;font-size:calc(30px*var(--sc,1));color:var(--ink);line-height:1.34;margin-top:calc(10px*var(--sc,1))}

/* alterna del beat 03 */
.cards3{display:flex;flex-direction:column;gap:calc(20px*var(--sc,1));width:100%;align-items:flex-start}
.cards3 .q{position:relative;text-align:left;width:auto;max-width:100%}
.cards3 .q .body{position:relative;padding:calc(18px*var(--sc,1)) 30px;
 font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:calc(36px*var(--sc,1));line-height:1.18}
.cards3 .q:nth-child(2){align-self:flex-end;transform:rotate(.5deg)}
.cards3 .q:nth-child(3){margin-left:60px;transform:rotate(-.6deg)}

.defn{font-size:calc(38px*var(--sc,1));line-height:1.38;margin:0;max-width:23ch;font-weight:500}
.defn .hl{background:var(--pale);border-radius:8px;padding:2px 9px 4px;margin:0 -1px}

.negs{display:flex;flex-direction:column;gap:calc(20px*var(--sc,1));width:100%;text-align:left}
.negs .r{display:flex;gap:16px;align-items:flex-start;font-size:calc(31px*var(--sc,1));line-height:1.28;color:var(--gray);font-weight:500}
.negs .r svg{margin-top:6px;color:var(--accent)}

.cols2{display:grid;grid-template-columns:1fr 1fr;gap:26px;width:100%;text-align:left}
.cols2 .c{position:relative}
.cols2 .c .body{position:relative;padding:26px 26px 30px}
.cols2 .lab{font-family:"Bebas Neue",Impact,sans-serif;font-size:22px;letter-spacing:.14em;color:var(--accent);display:block;margin-bottom:10px}
.cols2 .tx{font-size:calc(27px*var(--sc,1));line-height:1.3;font-weight:500}

.checks{display:grid;grid-template-columns:1fr 1fr;gap:calc(18px*var(--sc,1)) 30px;width:100%;text-align:left}
.checks .r{display:flex;gap:13px;align-items:flex-start;font-size:calc(27px*var(--sc,1));line-height:1.26;font-weight:500}
.checks .r span.d{flex:none;width:12px;height:3px;background:var(--accent);margin-top:16px}

/* alterna del beat 09 */
.stack6{display:flex;flex-direction:column;width:100%;text-align:left}
.stack6 .r{display:flex;gap:18px;align-items:baseline;padding:calc(15px*var(--sc,1)) 4px;border-bottom:2px solid rgba(0,0,0,.10)}
.stack6 .r:last-child{border-bottom:none}
.stack6 .k{flex:none;width:26px;height:4px;background:var(--accent);align-self:center}
.stack6 .tx{font-size:calc(28px*var(--sc,1));line-height:1.26;font-weight:500}

.split{display:grid;grid-template-columns:0.9fr 1.1fr;gap:30px;align-items:center;width:100%;text-align:left}
.split .lines p{margin:0 0 calc(18px*var(--sc,1));font-size:calc(31px*var(--sc,1));line-height:1.3;font-weight:500}

/* alterna del beat 05 */
.steps{display:flex;flex-direction:column;gap:calc(16px*var(--sc,1));width:100%;text-align:left}
.steps .r{display:flex;gap:18px;align-items:flex-start;font-size:calc(30px*var(--sc,1));line-height:1.3;font-weight:500}
.steps .r .bar{flex:none;width:6px;align-self:stretch;background:var(--accent);opacity:.85}
.steps .r:nth-child(2) .bar{opacity:.55}
.steps .r:nth-child(3) .bar{opacity:.3}

/* alterna del beat 08 */
.caso{position:relative;width:100%;text-align:left}
.caso .body{position:relative;padding:calc(32px*var(--sc,1)) 40px}
.caso .lab{font-family:"Bebas Neue",Impact,sans-serif;font-size:23px;letter-spacing:.16em;color:var(--accent);display:block;margin-bottom:14px}
.caso p{margin:0 0 calc(14px*var(--sc,1));font-size:calc(30px*var(--sc,1));line-height:1.3;font-weight:500}
.caso p:last-child{margin-bottom:0}

.chips{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.chips span{position:relative;font-family:"Instrument Serif",Georgia,serif;font-size:calc(34px*var(--sc,1));padding:11px 24px;color:var(--ink)}
.chips span .frame{position:absolute;inset:0;color:var(--accent)}
.ask{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:calc(50px*var(--sc,1));line-height:1.12;color:var(--accent);margin:0;max-width:20ch}

/* arte */
.art{position:absolute;z-index:2;display:flex;align-items:flex-end;justify-content:center}
.art img{width:auto;max-width:100%;max-height:100%;display:block}
.art svg{max-height:100%;width:auto}
.art > svg.dd{width:100%;height:100%}
svg.dd path,svg.dd circle,svg.dd rect,svg.dd ellipse,svg.dd line,svg.dd polyline{vector-effect:non-scaling-stroke}   /* el doodle se ajusta a su caja sin desbordarla (viewBox + meet) */
.art.bl{left:84px;bottom:150px;width:340px;height:320px;justify-content:flex-start}
.art.br{right:76px;bottom:150px;width:330px;height:310px;justify-content:flex-end}
.art.cc{left:0;right:0;bottom:150px;height:330px}
.art.cr{right:96px;bottom:158px;width:280px;height:250px;justify-content:flex-end}
.art.cl{left:96px;bottom:158px;width:280px;height:250px;justify-content:flex-start}
.cta .art.cc{bottom:170px;height:300px}
.art.big{left:0;right:0;bottom:180px;height:480px}
.art.inl{position:relative;bottom:auto;left:auto;right:auto;width:100%;height:300px}

/* cierre */
.cta .inner{padding:140px 96px 180px;justify-content:flex-start}
.cta .ask{font-size:calc(42px*var(--sc,1));margin-top:26px;max-width:24ch;text-align:center}
.cta .q{font-family:"Instrument Serif",Georgia,serif;font-size:calc(76px*var(--sc,1));line-height:1.02;margin:0;text-wrap:balance}
.cta .follow{background:var(--pale);padding:20px 44px;margin-top:26px;
 font-family:"Instrument Serif",Georgia,serif;font-size:calc(56px*var(--sc,1));line-height:1.05}
.cta .send{margin-top:22px;font-size:31px;font-weight:500;line-height:1.3;color:var(--accent);
 display:flex;align-items:center;gap:14px}
.cta .send svg{flex:0 0 auto}
.cta .hd{font-family:"Instrument Serif",Georgia,serif;font-size:52px}

/* portada */
.cover .inner{padding:150px 96px 210px;justify-content:flex-start}
.cover .eyebrow{font-family:"Bebas Neue",Impact,sans-serif;font-size:25px;letter-spacing:.2em;color:var(--accent);margin:0 0 26px}
.cover .hook{font-family:"Instrument Serif",Georgia,serif;font-size:calc(104px*var(--sc,1));line-height:.96;letter-spacing:-.02em;margin:0;text-wrap:balance}
.cover .hook em{font-style:italic}
.sign{position:absolute;bottom:50px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:18px;z-index:6}
.sign .ph{width:96px;height:96px;border-radius:50%;background:var(--pale);display:flex;align-items:center;justify-content:center;
 font-size:15px;color:var(--accent);font-weight:700;text-align:center;line-height:1.2}
.sign .hd{font-family:"Instrument Serif",Georgia,serif;font-size:44px}
`;

/* ============ primitivas SVG (mismo trazo que los doodles) ============ */
export const PRIM = `
const S='fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
const oval=\`<svg viewBox="0 0 150 96" width="150" height="96" style="color:var(--accent)"><path d="M75 6C112 6 145 22 145 48c0 27-33 42-70 42S5 75 5 48C5 22 38 6 75 6z" \${S}/></svg>\`;
const spark=(d=0,s=1)=>\`<svg viewBox="0 0 58 58" width="58" height="58" style="transform:rotate(\${d}deg) scale(\${s})"><path d="M8 30 L26 24 M12 14 L27 22 M27 6 L30 21" \${S}/></svg>\`;
const ul=(w=520)=>\`<svg class="ul" viewBox="0 0 \${w} 16" width="\${w}" height="16"><path d="M6 11C\${w*.22} 4 \${w*.42} 13 \${w*.6} 7 \${w*.76} 2 \${w*.9} 10 \${w-6} 6" \${S} stroke-width="5"/></svg>\`;
const wave=(w=420)=>\`<svg class="wave" viewBox="0 0 \${w} 18" width="\${w}" height="18"><path d="M5 12 q14 -10 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" \${S} stroke-width="3.5"/></svg>\`;
const frame=()=>\`<svg class="frame" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><path d="M3.4 8.6C3.6 4.6 5.2 3.2 9.4 3.1L90.8 3.4C95.2 3.3 96.7 5.2 96.6 9.2L96.8 90.6C96.9 95.4 95.1 96.9 90.6 96.8L9.6 96.6C5 96.8 3.2 95 3.3 90.8Z" fill="none" stroke="currentColor" stroke-linejoin="round" style="stroke-width:4px" vector-effect="non-scaling-stroke"/></svg>\`;
const tape=\`<svg class="tape" viewBox="0 0 150 62" width="150" height="62"><path d="M8 20 L14 8 L142 24 L136 44 L10 30Z" fill="var(--pale)" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/><path d="M40 14 L36 34 M72 18 L68 38 M104 22 L100 42" stroke="var(--accent)" stroke-width="2" opacity=".5"/></svg>\`;
const heart=\`<svg viewBox="0 0 30 28" width="27" height="25"><path d="M15 25C8 20 3 15.5 3 10.5 3 6.5 6 4 9.3 4c2.4 0 4.4 1.5 5.7 3.4C16.3 5.5 18.3 4 20.7 4 24 4 27 6.5 27 10.5c0 5-5 9.5-12 14.5z" \${S} stroke-width="2.6"/></svg>\`;
const xm=\`<svg viewBox="0 0 26 26" width="24" height="24"><path d="M5 5 L21 21 M21 5 L5 21" \${S} stroke-width="3.4"/></svg>\`;
const ck=\`<svg viewBox="0 0 30 26" width="28" height="24"><path d="M4 14 L11 21 L26 5" \${S} stroke-width="3.6"/></svg>\`;
const arrow=(w=130,h=96,flip=false)=>\`<svg viewBox="0 0 130 96" width="\${w}" height="\${h}" style="color:var(--accent)\${flip?';transform:scaleX(-1)':''}"><path d="M14 84C10 44 36 16 104 16" \${S}/><path d="M88 6 L108 16 L90 30" \${S}/></svg>\`;
const bubble=\`<svg viewBox="0 0 120 108" width="112" height="100" style="color:var(--ink)"><path d="M18 12h84a10 10 0 0 1 10 10v46a10 10 0 0 1-10 10H52l-20 20v-20H18A10 10 0 0 1 8 68V22A10 10 0 0 1 18 12z" \${S}/><g style="color:var(--accent)"><path d="M60 62C52 56 46 51 46 45c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 6-6 11-14 17z" \${S} stroke-width="3.2"/></g></svg>\`;
`;

/* ============ render de slides (se inyecta como script en la página) ============ */
export const RENDER = `
const pips=n=>Array.from({length:D.length},(_,i)=>\`<span class="pip\${i+1===n?" on":""}"></span>\`).join("");

function artHTML(a){
  if(!a) return "";
  if(a.type==="pichu"){
    const src=IMG[a.id];
    if(src) return \`<div class="art \${a.pos}"><img src="\${src}" alt=""></div>\`;
    return \`<div class="art \${a.pos}">\${doodle(a.fallback||"foco",260)}</div>\`;
  }
  return \`<div class="art \${a.pos}">\${doodle(a.id,a.h||270,{color:a.color||"var(--ink)"})}</div>\`;
}
/* Cada beat reserva un lado del pie para su banda o su cinta; el arte va al lado libre.
   Sin esto, un arte centrado se encima con la banda de abajo. */
const SIDE={final:"cc",cierre:"cc",ciclo:"bl",costo:"br",quotes:"bl",concepto:"bl",checks:"br",nums:"br",vs:"br",caso:"br",list6:"br",stack:"br"};
const art=s=>{
  const a=s.art?{...s.art}:null;
  if(a&&SIDE[s.kind]) a.pos=SIDE[s.kind];
  return artHTML(a);
};
const artInline=s=>{
  const a=s.art||{};
  if(a.type==="pichu"&&IMG[a.id]) return \`<img src="\${IMG[a.id]}" alt="">\`;
  const id=(a.type==="pichu")?(a.fallback||"foco"):(a.id||"foco");
  return doodle(id,300,{color:a.color||"var(--ink)"});
};

/* cinta de papel: se estira con el texto en vez de dejarlo salirse */
function ribbon(txt){
  const n=txt.replace(/<[^>]+>/g,"").length;
  const w=Math.max(360,Math.min(620,Math.round(n*15.5)+70));
  const h=n>52?128:96;
  return \`<div class="ribbon" style="position:relative;flex:1 1 auto;margin-left:6px">
   <svg viewBox="0 0 \${w} \${h}" width="\${w}" height="\${h}"><path d="M10 \${h*.27} L18 8 L\${w-12} \${h*.23} L\${w-20} \${h-8} L8 \${h*.79}Z"
     fill="var(--pale)" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/></svg>
   <span style="position:absolute;inset:0;padding:0 34px;display:flex;align-items:center;justify-content:center;text-align:center;
     font-family:'Instrument Serif',Georgia,serif;font-size:calc(33px*var(--sc,1));line-height:1.1">\${txt}</span></div>\`;
}

const head=s=>\`<div class="tl">@ISAISCODING.IA</div><div class="numwrap">\${oval}<div class="n">\${String(s.n).padStart(2,"0")}</div></div>
 <div class="numspark">\${spark(0)}</div>\`;
const titleBlock=s=>\`<h2 class="title" style="--ts:\${s.ts||"84px"}">\${s.title}</h2>\${ul(Math.min(640,300+s.title.replace(/<[^>]+>/g,"").length*7))}\`;

function inner(s){
 switch(s.kind){
  case "ciclo": return \`\${titleBlock(s)}
   <div class="hbox" style="margin-top:calc(46px*var(--sc,1))">\${frame()}\${tape}<div class="body"><div class="chain">
     \${s.chain.map(([a,b])=>\`<div class="lk"><span class="d"></span><span>\${a} <i>→</i> \${b}.</span></div>\`).join("")}
   </div></div></div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-end">
     <div class="band" style="width:505px;text-align:left">
       <span class="lab">\${s.band.lab}</span><span class="txt">\${s.band.txt}</span></div></div>
   \${art(s)}\`;

  case "quotes": return \`\${titleBlock(s)}
   <div class="quotes" style="margin-top:calc(40px*var(--sc,1))">
     \${s.quotes.map(q=>\`<p>\${q}</p>\`).join("")}<p class="solid">\${s.solid}</p></div>
   <div style="margin-top:auto;width:100%;display:flex;align-items:flex-end;justify-content:flex-end;gap:10px">
     <div style="padding-bottom:26px">\${arrow(120,88)}</div>
     <div class="hbox abox" style="width:420px">\${frame()}<div class="body" style="text-align:left;display:flex;gap:12px;align-items:flex-start">
       <span style="color:var(--accent)">\${heart}</span>
       <span style="font-family:'Instrument Serif',Georgia,serif;font-size:calc(38px*var(--sc,1));line-height:1.14">\${s.card}</span>
     </div></div></div>
   \${art(s)}\`;

  case "costo": return \`\${titleBlock(s)}
   <div class="cards3" style="margin-top:calc(40px*var(--sc,1))">
     \${s.quotes.map(q=>\`<div class="q hbox">\${frame()}<div class="body">\${q}</div></div>\`).join("")}</div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-start">
     <div class="band" style="width:470px;display:flex;gap:16px;align-items:flex-start;text-align:left">
       <span style="color:var(--accent);flex:none">\${ck}</span>
       <span class="txt" style="font-size:calc(33px*var(--sc,1))">\${s.solid}</span></div></div>
   \${art(s)}\`;

  case "concepto": return \`\${titleBlock(s)}
   <p class="defn" style="margin-top:calc(30px*var(--sc,1))">\${s.defn}</p>\${wave(430)}
   <div class="hbox" style="margin-top:calc(36px*var(--sc,1))">\${frame()}\${tape}<div class="body" style="font-size:calc(30px*var(--sc,1));line-height:1.34;font-weight:500">
     \${s.box[0]}<br><span style="color:var(--gray)">\${s.box[1]}</span></div></div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-end">
     <div class="hbox abox" style="width:470px">\${frame()}<div class="body" style="text-align:left">
       <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;color:var(--accent)">\${heart}
         <b style="color:var(--ink);font-size:24px">\${s.pp.h}</b></div>
       <div style="font-size:calc(29px*var(--sc,1));font-weight:500">\${s.pp.t}</div></div></div></div>
   \${art(s)}\`;

  case "split": return \`\${titleBlock(s)}
   <div class="split" style="margin-top:calc(44px*var(--sc,1))">
     <div class="art inl" style="height:340px;justify-content:center">\${artInline(s)}</div>
     <div class="lines">\${s.lines.map(l=>\`<p>\${l}</p>\`).join("")}</div></div>
   <div style="margin-top:auto;width:100%">
     <div class="band"><span class="lab">\${s.band.lab}</span><span class="txt">\${s.band.txt}</span></div></div>\`;

  case "stack": return \`\${titleBlock(s)}
   <div class="steps" style="margin-top:calc(42px*var(--sc,1))">
     \${s.lines.map(l=>\`<div class="r"><span class="bar"></span><span>\${l}</span></div>\`).join("")}</div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-start">
     <div class="band" style="width:530px;text-align:left"><span class="lab">\${s.band.lab}</span><span class="txt">\${s.band.txt}</span></div></div>
   \${art(s)}\`;

  case "negs": return \`\${titleBlock(s)}
   <div class="negs" style="margin-top:calc(42px*var(--sc,1))">
     \${s.negs.map(t=>\`<div class="r">\${xm}<span>\${t}</span></div>\`).join("")}</div>
   \${wave(360)}
   <div class="band" style="margin-top:calc(24px*var(--sc,1));display:flex;gap:16px;align-items:flex-start;text-align:left">
     <span style="color:var(--accent);flex:none">\${ck}</span>
     <span class="txt" style="font-size:calc(34px*var(--sc,1))">\${s.si}</span></div>
   \${art(s)}\`;

  case "nums": return \`\${titleBlock(s)}
   <div class="hbox" style="margin-top:calc(40px*var(--sc,1))">\${frame()}\${tape}<div class="body"><ol class="nums">
     \${s.nums.map((t,i)=>\`<li><span class="k">\${i+1}</span><span>\${t}</span></li>\`).join("")}</ol></div></div>
   <div style="margin-top:auto;width:100%;display:flex;align-items:flex-end;gap:18px">
     \${ribbon(s.label)}
     <div class="art" style="position:relative;flex:none;height:210px;bottom:auto;right:auto">\${artInline(s)}</div>
   </div>\`;

  case "vs": return \`\${titleBlock(s)}
   <div class="cols2" style="margin-top:calc(44px*var(--sc,1))">
     \${s.cols.map((c,i)=>\`<div class="c hbox \${i?"":"abox"}">\${frame()}<div class="body">
       <span class="lab">\${c[0]}</span><div class="tx">\${c[1]}</div></div></div>\`).join("")}</div>
   <div class="pie" style="margin-top:calc(30px*var(--sc,1));display:flex;align-items:center;gap:18px">
     \${bubble}
     <span style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:calc(38px*var(--sc,1));text-align:left">\${s.foot}</span></div>
   \${art(s)}\`;

  case "caso": return \`\${titleBlock(s)}
   <div class="caso hbox" style="margin-top:calc(42px*var(--sc,1))">\${frame()}\${tape}<div class="body">
     <span class="lab">\${s.lab}</span>\${s.lines.map(l=>\`<p>\${l}</p>\`).join("")}</div></div>
   <div class="pie" style="margin-top:auto;width:100%;display:flex;align-items:flex-end;gap:20px">
     <div style="display:flex;align-items:center;gap:16px;flex:1;padding-bottom:14px">
       <span style="color:var(--accent);flex:none">\${ck}</span>
       <span style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:calc(37px*var(--sc,1));text-align:left">\${s.foot}</span></div>
     <div class="art" style="position:relative;flex:none;height:190px;bottom:auto;right:auto">\${artInline(s)}</div>
   </div>\`;

  case "checks": return \`\${titleBlock(s)}
   <div class="checks" style="margin-top:calc(42px*var(--sc,1))">
     \${s.checks.map(t=>\`<div class="r"><span class="d"></span><span>\${t}</span></div>\`).join("")}</div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-start">
     <div class="band" style="width:495px;text-align:left"><span class="lab">\${s.band.lab}</span><span class="txt">\${s.band.txt}</span></div></div>
   \${art(s)}\`;

  case "list6": return \`\${titleBlock(s)}
   <div class="stack6" style="margin-top:calc(34px*var(--sc,1))">
     \${s.checks.map(t=>\`<div class="r"><span class="k"></span><span class="tx">\${t}</span></div>\`).join("")}</div>
   <div style="margin-top:auto;width:100%;display:flex;justify-content:flex-start">
     <div class="band" style="width:530px;text-align:left"><span class="lab">\${s.band.lab}</span><span class="txt">\${s.band.txt}</span></div></div>
   \${art(s)}\`;

  case "cierre": return \`\${titleBlock(s)}
   <div style="margin-top:calc(46px*var(--sc,1));display:flex;flex-direction:column;align-items:center">
     <p class="ask">\${s.ask}</p>\${ul(520)}</div>
   \${art(s)}\`;
 }
 return "<!-- kind desconocido: "+s.kind+" -->";
}

function cta(s){return \`<div class="holder"><div class="cap">Slide 10 · cierre</div><div class="scaler">
 <div class="slide cta"><div class="tl">@ISAISCODING.IA</div>
  <div class="inner">
    <h2 class="q">\${s.title}</h2>\${ul(430)}
    <p class="ask">\${s.ask}</p>
    <div class="follow">\${s.follow}</div>
    \${s.send?\`<div class="send"><svg viewBox="0 0 46 26" width="42" height="24"><path d="M4 13 H38 M28 4 L39 13 L28 22" \${S}/></svg><span>\${s.send}</span></div>\`:""}
    <div class="hbox" style="margin-top:34px;width:660px">\${frame()}\${tape}
      <div style="position:relative;padding:24px 34px;font-size:29px;font-weight:500;line-height:1.34">\${s.tape}</div></div>
  </div>
  <div style="position:absolute;left:112px;top:300px;color:var(--accent)">\${spark(-20,1.2)}</div>
  <div style="position:absolute;right:130px;top:280px;color:var(--accent)">\${heart}</div>
  \${art(s)}
  <div class="sign"><div><div class="hd">@isaiscoding.ia</div>\${ul(320)}</div></div>
 </div></div></div>\`;}

function cover(s){return \`<div class="holder"><div class="cap">Slide 01 · portada</div><div class="scaler">
 <div class="slide cover"><div class="tl">@ISAISCODING.IA</div>
  <div class="inner">
    <p class="eyebrow">\${s.eyebrow}</p><h2 class="hook">\${s.hook}</h2>\${ul(560)}
    <div class="hbox" style="margin-top:38px;width:620px">\${frame()}\${tape}
      <div style="position:relative;padding:22px 34px;font-size:30px;font-weight:600">\${s.tape}</div></div>
  </div>
  <div style="position:absolute;left:110px;bottom:600px;color:var(--accent)">\${spark(-25,1.2)}</div>
  \${art(s)}
  <div class="sign"><div><div class="hd">@isaiscoding.ia</div>\${ul(300)}</div></div>
 </div></div></div>\`;}

document.getElementById("app").innerHTML=D.map(s=> s.kind==="cover" ? cover(s) : s.kind==="final" ? cta(s) : \`
<div class="holder"><div class="cap">Slide \${String(s.n).padStart(2,"0")}</div><div class="scaler">
 <div class="slide">\${head(s)}<div class="inner">\${inner(s)}</div>
  <div class="foot"><b>✳</b> ISAISCODING.COM</div><div class="dots">\${pips(s.n)}</div>
 </div></div></div>\`).join("");

function fit(){document.querySelectorAll(".slide").forEach(sl=>{const b=sl.querySelector(".inner");let s=1,g=0;
 sl.style.setProperty("--sc",s);
 while(b.scrollHeight>1350&&s>0.6&&g<60){s=Math.round((s-.02)*1000)/1000;sl.style.setProperty("--sc",s);g++;}});}

/* La ilustración nunca debe montarse sobre la caja de arriba: si el beat quedó denso,
   el dibujo se encoge (hasta 185 px) en vez de encimarse. */
function place(){
 document.querySelectorAll(".slide").forEach(sl=>{
  const art=sl.querySelector(".art:not(.inl)"); if(!art) return;
  if(getComputedStyle(art).position!=="absolute") return;   // el arte en línea lo coloca el flex
  const S=sl.getBoundingClientRect();
  const box=el=>{const r=el.getBoundingClientRect();return{t:r.top-S.top,l:r.left-S.left,b:r.bottom-S.top,r:r.right-S.left};};
  /* la banda tiene 30 px de padding vacío: sólo su texto es zona prohibida */
  const cajas=[...sl.querySelectorAll(".inner .band,.inner .hbox,.inner .caso,.inner ol.nums,.inner .cols2,.inner .checks,.inner .stack6,.inner .steps,.inner .quotes,.inner .cards3,.inner .ribbon,.inner .chips,.inner .defn,.inner .negs,.inner .ask,.inner .ul,.inner .wave,.inner .split,.inner .pie,.inner .follow,.inner .send,.inner .hook,.inner .eyebrow,.inner .q,.inner .title")]
    .map(n=>{const m=box(n); if(n.classList.contains("band")){m.l+=28;m.r-=28;} return m;})
    .filter(m=>m.b-m.t>10);
  const el=art.querySelector("img,svg"); if(!el) return;
  /* en un SVG el elemento ocupa toda la caja pero la tinta va centrada: medimos la tinta */
  const tinta=el.tagName.toLowerCase()==="svg"?(el.querySelector("g")||el):el;
  const dibujo=()=>tinta;
  /* proporción real del dibujo, para que la caja lo abrace en vez de recortarlo por ancho */
  let ar=0;
  if(el.tagName==="IMG"&&el.naturalWidth) ar=el.naturalWidth/el.naturalHeight;
  else{const vb=(el.getAttribute("viewBox")||"").split(/\s+/).map(Number); if(vb.length===4&&vb[3]) ar=vb[2]/vb[3];}
  const lateral=art.classList.contains("bl")||art.classList.contains("br")||art.classList.contains("cl")||art.classList.contains("cr");
  const ANCHO_MAX=lateral?430:1080;
  const pon=h=>{art.style.height=h+"px"; if(ar&&lateral) art.style.width=Math.min(ANCHO_MAX,Math.round(h*ar))+"px";};
  const choca=()=>{const a=box(dibujo());
    return cajas.some(m=>Math.min(a.r,m.r)-Math.max(a.l,m.l)>16 && Math.min(a.b,m.b)-Math.max(a.t,m.t)>2);};
  const alto=()=>parseFloat(getComputedStyle(art).height);
  const encoge=()=>{for(let i=0;i<26;i++){ if(!choca()) return; const h=alto();
    if(h<=140) return; pon(Math.max(140,h-15)); }};
  const esDoodle=el.tagName.toLowerCase()==="svg";
  const TOPE=art.classList.contains("big")?540:(art.classList.contains("cc")?(esDoodle?350:430):(esDoodle?330:400));
  pon(alto());
  encoge();                                   // que no se monte sobre nada
  for(let i=0;i<26;i++){                      // y si sobra aire, que llene el hueco
    const h=alto(); if(h>=TOPE) break;
    pon(h+20);
    if(choca()){ pon(h); break; }
  }
  encoge();
 });
}
function run(){fit();place();}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run);
window.addEventListener("load",run);run();
`;
