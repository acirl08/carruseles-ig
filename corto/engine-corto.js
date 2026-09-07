/* Motor del carrusel CORTO @isaiscoding.ia  (5-7 slides)
   Carril de confianza: Isabela sí aparece. Cierre de alcance, sin keyword ni DM.
   Uso: node build-corto.mjs   -> build/NN-slug.html autocontenido

   Diferencias deliberadas contra references/slide-rules.md, autorizadas por Isabela
   el 2 de septiembre de 2026:
     - Lienzo 1080×1350 en vez de 540×675. Es el mismo 4:5 a 2×; el largo ya usa
       1080×1350 y los dos formatos comparten cuadrícula en el perfil.
     - El slide 07 cierra con pregunta + seguir + compartir, NO con keyword + DM.
     - La portada la genera el motor y no lleva foto.
   Lo que SÍ se respeta del skill corto: Bebas Neue como titular en caps,
   Instrument Serif solo para palabras dentro del bocadillo, bocadillo naranja,
   tag-pill, botón de flecha, y la primera persona en el beat de credibilidad. */

export const CSS = `
:root{--ink:#111;--gray:#555;--accent:#C4613A;
 --pale:#F0D5CA;--bg:#F7F6F4;--white:#fff;--grid:rgba(0,0,0,.055)}
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
.inner{position:absolute;inset:0;padding:210px 92px 200px;display:flex;flex-direction:column;justify-content:center}

/* chrome fijo, en TODOS los slides */
.brand-top{position:absolute;top:52px;left:60px;font-family:"Bebas Neue",Impact,sans-serif;
 font-size:26px;letter-spacing:.14em;z-index:6}
.pill{position:absolute;top:46px;right:60px;background:var(--pale);color:var(--accent);
 font-family:"Bebas Neue",Impact,sans-serif;font-size:24px;letter-spacing:.16em;
 padding:9px 22px 6px;border-radius:999px;z-index:6}
.foot{position:absolute;bottom:52px;left:60px;font-family:"Bebas Neue",Impact,sans-serif;
 font-size:22px;letter-spacing:.14em;color:var(--gray);z-index:6}
.foot b{color:var(--accent);font-weight:400}
.arrow{position:absolute;bottom:40px;right:56px;width:78px;height:78px;border:3px solid var(--ink);
 border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;
 line-height:1;padding-bottom:4px;z-index:6}

/* ---------- tipografía ---------- */
.hl{font-family:"Bebas Neue",Impact,sans-serif;font-size:calc(var(--ts,104px)*var(--sc,1));
 line-height:.92;letter-spacing:.012em;margin:0;text-transform:uppercase;text-wrap:balance}
.hl .o{color:var(--accent)}

/* bocadillo naranja — la primitiva del corto */
.boc{background:var(--accent);color:var(--white);border-radius:28px 28px 28px 8px;
 padding:calc(30px*var(--sc,1)) 36px;font-size:calc(29px*var(--sc,1));line-height:1.36;
 font-weight:500;margin-top:calc(46px*var(--sc,1))}
.boc em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:1.18em;
 line-height:1;color:var(--white)}
.boc.pale{background:var(--pale);color:var(--ink)}
.boc.pale em{color:var(--accent)}

/* lista de concepto: máximo 3 */
.lista{display:flex;flex-direction:column;gap:calc(26px*var(--sc,1));margin-top:34px}
.lista .it{display:flex;gap:18px;align-items:flex-start}
.lista .fl{flex:none;color:var(--accent);font-size:34px;line-height:1.1;font-weight:700}
.lista .nm{font-family:"Bebas Neue",Impact,sans-serif;font-size:calc(38px*var(--sc,1));
 letter-spacing:.04em;line-height:1.06;display:block;margin-bottom:5px}
.lista .ds{font-size:calc(26px*var(--sc,1));line-height:1.34;color:var(--gray);font-weight:500}

/* dato sensorial: la línea que ancla el resultado */
.dato{margin-top:26px;font-family:"Instrument Serif",Georgia,serif;font-style:italic;
 font-size:calc(40px*var(--sc,1));line-height:1.16;color:var(--accent);max-width:22ch}

/* decoración */
.aster{position:absolute;font-family:"Bebas Neue",Impact,sans-serif;color:var(--accent);
 line-height:.8;user-select:none}
.aster.big{bottom:250px;right:78px;font-size:230px;opacity:.9}

/* portada */
.portada .inner{padding:240px 92px 230px;justify-content:flex-start}
.portada .hl{font-size:calc(var(--ts,128px)*var(--sc,1))}
.portada .tape{margin-top:34px;display:inline-block;background:var(--ink);color:var(--bg);
 font-family:"Bebas Neue",Impact,sans-serif;font-size:27px;letter-spacing:.16em;padding:12px 26px 8px}

/* cierre */
.cierre .inner{padding:230px 92px 220px;justify-content:center}
.cierre .ask{font-family:"Instrument Serif",Georgia,serif;font-style:italic;
 font-size:calc(52px*var(--sc,1));line-height:1.14;color:var(--accent);margin:26px 0 0;max-width:21ch}
.cierre .follow{display:inline-block;background:var(--pale);padding:20px 40px;margin-top:34px;
 font-family:"Instrument Serif",Georgia,serif;font-size:calc(52px*var(--sc,1));line-height:1.05}
.cierre .send{margin-top:22px;font-size:30px;font-weight:500;color:var(--accent);
 display:flex;align-items:center;gap:14px}
`;

export const PRIM = `
const S='fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
const flechita='<svg viewBox="0 0 46 26" width="42" height="24"><path d="M4 13 H38 M28 4 L39 13 L28 22" '+S+'/></svg>';
`;

export const RENDER = `
const marco = () => \`<div class="brand-top">@ISAISCODING.IA</div>
  <div class="pill">\${(D.etiqueta||"NEGOCIO")}</div>
  <div class="foot"><b>✳</b> ISAISCODING.COM</div>
  <div class="arrow">→</div>\`;

/* Único punto donde un dato del JSON entra en un ATRIBUTO. limpia() escapa
   & < > pero NO comillas, así que un ts malicioso podría abrir un atributo.
   Si no es exactamente NNpx, se cae al default. */
const tam = (t,def) => /^\\d{2,3}px$/.test(String(t||"")) ? t : def;

function cuerpo(s){
  switch(s.kind){

  case "portada": return \`
    <p class="hl" style="--ts:\${tam(s.ts,"128px")}">\${s.hook}</p>
    \${s.tape?\`<div><span class="tape">\${s.tape}</span></div>\`:""}
    <div class="aster big">✳</div>\`;

  case "diagnostico":
  case "credibilidad":
  case "solucion":
  case "resultado": return \`
    <p class="hl" style="--ts:\${tam(s.ts,"104px")}">\${s.copy}</p>
    \${s.dato?\`<p class="dato">\${s.dato}</p>\`:""}
    <div class="boc\${s.pale?" pale":""}">\${s.boc}</div>\`;

  case "concepto": return \`
    <p class="hl" style="--ts:\${tam(s.ts,"98px")}">\${s.copy}</p>
    <div class="lista">\${s.lista.map(i=>\`<div class="it"><span class="fl">→</span>
      <div><span class="nm">\${i.nombre}</span><span class="ds">\${i.descripcion}</span></div></div>\`).join("")}</div>
    \${s.boc?\`<div class="boc\${s.pale?" pale":""}">\${s.boc}</div>\`:""}\`;

  /* "final" es el nombre canónico en build-corto.mjs y "cierre" el alias.
     Cuando aquí sólo existía "cierre", un slide kind:"final" pasaba la
     validación, renderizaba un artboard EN BLANCO y el check decía
     "sin hallazgos". Los dos nombres tienen que vivir juntos siempre. */
  case "cierre":
  case "final": return \`
    <p class="hl" style="--ts:\${tam(s.ts,"96px")}">\${s.copy}</p>
    <p class="ask">\${s.ask}</p>
    <div><span class="follow">\${s.follow}</span></div>
    <div class="send">\${flechita}<span>\${s.send}</span></div>\`;
  }
  return "<!-- kind desconocido: "+s.kind+" -->";
}

const clase = k => k==="portada" ? " portada" : ((k==="cierre"||k==="final") ? " cierre" : "");

document.getElementById("app").innerHTML = D.slides.map((s,i)=>\`
<div class="holder"><div class="cap">Slide \${String(i+1).padStart(2,"0")} · \${s.kind}</div><div class="scaler">
 <div class="slide\${clase(s.kind)}">\${marco()}<div class="inner">\${cuerpo(s)}</div></div>
</div></div>\`).join("");

/* El titular baja de tamaño hasta que la tinta cabe en el ÁREA SEGURA.
   Medir scrollHeight contra 1350 no sirve: .inner está centrado, así que el
   contenido se derrama por arriba Y por abajo, y el derrame de arriba ni siquiera
   entra en scrollHeight. Se mide la tinta real contra los límites del chrome. */
const SEGURO = {arriba:150, abajo:1215};
function fit(){document.querySelectorAll(".slide").forEach(sl=>{
  const inner=sl.querySelector(".inner"); let sc=1,g=0;
  sl.style.setProperty("--sc",sc);
  const fuera=()=>{
    const S=sl.getBoundingClientRect();
    /* La hoja de contacto muestra el slide con transform:scale(.5), y
       getBoundingClientRect devuelve la caja YA transformada. Sin normalizar,
       los límites en píxeles de artboard salen al doble y el titular se encoge
       sin motivo — encogía a 0.54 en la portada. */
    const k = S.height ? 1350/S.height : 1;
    let t=Infinity,b=-Infinity;
    inner.querySelectorAll(":scope > *").forEach(el=>{
      if(el.classList.contains("aster")) return;      // decoración, no tinta
      const r=el.getBoundingClientRect();
      if(r.height<2) return;
      t=Math.min(t,(r.top-S.top)*k); b=Math.max(b,(r.bottom-S.top)*k);
    });
    if(t===Infinity) return false;
    return t<SEGURO.arriba || b>SEGURO.abajo;
  };
  while(fuera()&&sc>0.55&&g<70){sc=Math.round((sc-.02)*1000)/1000;sl.style.setProperty("--sc",sc);g++;}
});}
window.run=fit;
window.D=D;
document.fonts.ready.then(()=>{fit();document.body.dataset.listo="1";});
`;
