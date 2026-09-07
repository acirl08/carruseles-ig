// Motor del carril RECAP.
//
// Reusa el CSS y las primitivas del corto en vez de duplicarlos: así la paleta,
// la retícula de 54px, el área segura y el chrome son literalmente los mismos, y
// un cambio de marca no hay que hacerlo en dos sitios. Lo único propio de aquí es
// el layout del slide `noticia`, que el corto no tiene.

import { CSS as CSS_CORTO, PRIM } from '../corto/engine-corto.js';

export const CSS = CSS_CORTO + `
/* ---------- carril recap ---------- */

/* La noticia lleva más texto que un slide del corto, así que el inner sube el
   padding lateral y alinea arriba: el titular manda y el resto cuelga de él. */
.noticia .inner{padding:190px 88px 200px;justify-content:center}

.noticia .tit{font-family:"Bebas Neue",Impact,sans-serif;
 font-size:calc(var(--ts,72px)*var(--sc,1));line-height:.96;letter-spacing:.014em;
 margin:0;text-transform:uppercase;text-wrap:balance}
.noticia .tit .o{color:var(--accent)}

.noticia .res{margin:30px 0 0;font-size:calc(30px*var(--sc,1));line-height:1.42;
 color:var(--ink);font-weight:400;max-width:30ch}

/* El campo que cambia según la variante. Va en pálido y no en acento sólido:
   compite con el titular si es naranja lleno, y el titular tiene que ganar. */
.noticia .giro{margin-top:calc(34px*var(--sc,1));background:var(--pale);
 border-left:6px solid var(--accent);padding:calc(26px*var(--sc,1)) 32px;
 font-size:calc(27px*var(--sc,1));line-height:1.38;font-weight:500}
.noticia .giro .et{display:block;font-family:"Bebas Neue",Impact,sans-serif;
 font-size:23px;letter-spacing:.14em;color:var(--accent);margin-bottom:8px}

/* Hueco para la imagen de la cascada. Si el JSON no trae imagen, no se pinta
   nada: un marco vacío es peor que el espacio en blanco. */
.noticia .sello{margin-top:calc(40px*var(--sc,1));font-family:"Instrument Serif",Georgia,serif;
 font-style:italic;font-size:calc(46px*var(--sc,1));line-height:1.1;color:var(--accent)}

.noticia .media{margin-top:30px;border:3px solid var(--ink);border-radius:14px;
 overflow:hidden;background:var(--white);max-height:420px;display:flex}
.noticia .media img{width:100%;object-fit:cover;display:block}

/* El número de la noticia, arriba a la derecha bajo la píldora. */
.noticia .num{position:absolute;top:158px;right:60px;font-family:"Bebas Neue",Impact,sans-serif;
 font-size:30px;letter-spacing:.1em;color:var(--gray);z-index:6}

/* La fuente va SIEMPRE visible: el recap habla de hechos con fecha, y una
   noticia sin fuente a la vista es indistinguible de una inventada. */
.noticia .src{position:absolute;bottom:152px;left:88px;right:88px;
 font-size:21px;color:var(--gray);line-height:1.3;overflow:hidden;
 text-overflow:ellipsis;white-space:nowrap}

.portadaRecap .inner{padding:250px 92px 240px;justify-content:flex-start}
.portadaRecap .hl{font-size:calc(var(--ts,116px)*var(--sc,1))}
.portadaRecap .rango{font-family:"Bebas Neue",Impact,sans-serif;font-size:30px;
 letter-spacing:.16em;color:var(--accent);margin-bottom:20px;display:block}
/* .tape solo estaba definido bajo .portada, y esta clase es otra: sin esto el
   "DESLIZA" salía como texto suelto en vez de etiqueta negra. */
.portadaRecap .tape{margin-top:34px;display:inline-block;background:var(--ink);color:var(--bg);
 font-family:"Bebas Neue",Impact,sans-serif;font-size:27px;letter-spacing:.16em;padding:12px 26px 8px}

.cierreRecap .inner{padding:230px 92px 220px;justify-content:center}
/* .ask, .follow y .send viven bajo .cierre en el motor del corto, y esta clase
   es otra: sin repetirlos aquí salían en tamaño de cuerpo, ilegibles. */
.cierreRecap .ask{font-family:"Instrument Serif",Georgia,serif;font-style:italic;
 font-size:calc(52px*var(--sc,1));line-height:1.14;color:var(--accent);margin:30px 0 0;max-width:21ch}
.cierreRecap .follow{display:inline-block;background:var(--pale);padding:20px 40px;margin-top:30px;
 font-family:"Instrument Serif",Georgia,serif;font-size:calc(46px*var(--sc,1));line-height:1.05}
.cierreRecap .send{margin-top:22px;font-size:30px;font-weight:500;color:var(--accent)}
`;

export { PRIM };

const tam = (t, def) => /^\d{2,3}px$/.test(String(t || '')) ? t : def;

// El campo extra depende de la variante. La etiqueta la ve el lector, así que
// dice lo que promete el slide, no el nombre técnico del campo.
const GIRO = {
  negocio:    ['paraTi',    'QUÉ CAMBIA PARA TI'],
  mecanismo:  ['mecanismo', 'POR QUÉ PASA'],
  accionable: ['accion',    'QUÉ HACES MAÑANA'],
  completo:   [null,        null],
};

export function cuerpoRecap(s, variante, n, total) {
  switch (s.kind) {

    case 'portadaRecap': return `
      <span class="rango">${s.eyebrow ?? ''}</span>
      <p class="hl" style="--ts:${tam(s.ts, '116px')}">${s.hook}</p>
      ${s.tape ? `<div><span class="tape">${s.tape}</span></div>` : ''}
      <div class="aster big">✳</div>`;

    case 'noticia': {
      const [campo, etiqueta] = GIRO[variante] ?? GIRO.completo;
      const giro = campo && s[campo]
        ? `<div class="giro"><span class="et">${etiqueta}</span>${s[campo]}</div>` : '';
      const media = s.imagen?.url
        ? `<div class="media"><img src="${s.imagen.url}" alt=""></div>` : '';
      // `completo` no lleva campo extra, y sin él el slide queda con 350px muertos.
      // 13-HUECOS dice que ahí no sirve subir el ts: hace falta un elemento más.
      // El que corresponde es el dominio de la fuente en grande — es lo que este
      // formato promete: el titular y de dónde salió.
      const sello = (variante === 'completo' && !giro && !media)
        ? `<div class="sello">${String(s.fuente).replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</div>` : '';
      return `
      <div class="num">${n}/${total}</div>
      <p class="tit" style="--ts:${tam(s.ts, '72px')}">${s.titular}</p>
      <p class="res">${s.resumen}</p>
      ${giro}
      ${media}
      ${sello}
      <div class="src">Fuente: ${s.fuente}</div>`;
    }

    case 'cierreRecap': return `
      <p class="hl" style="--ts:76px">${s.cierre ?? 'Eso fue la semana'}</p>
      <div class="boc pale">${total} noticias, y de cada una lo que cambia para ti.
        Si algo no cambiaba nada, no entró.</div>
      <p class="ask">${s.pregunta}</p>
      <div class="follow">${s.cta ?? 'Sígueme'}</div>
      <div class="send">Comparte esto con quien lo necesite</div>
      <div class="aster big">✳</div>`;

    default:
      // Un kind que el motor no sabe pintar produjo un artboard en blanco que el
      // check aprobaba. Aquí se hace visible en vez de silencioso.
      return `<p class="tit">KIND DESCONOCIDO: ${s.kind}</p>`;
  }
}

export const clase = k =>
  k === 'portadaRecap' ? ' portadaRecap'
  : k === 'cierreRecap' ? ' cierreRecap'
  : ' noticia';
