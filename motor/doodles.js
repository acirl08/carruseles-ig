/* Biblioteca de doodles monolineales — mismo trazo y misma tinta que marcos y flechas.
   Cada entrada: { vb:"minX minY w h", g:"<paths>", pale?:"<shapes con relleno pálido, van DEBAJO>" }
   Regla: sin sombreado, sin degradados, sin variación de grosor. Todo currentColor. */

const DOODLES = {

/* ---- tiempo ---- */
reloj:{vb:"0 0 200 200",g:`
 <circle cx="100" cy="104" r="72"/><path d="M100 104 L100 58 M100 104 L136 122"/>
 <path d="M100 24 L100 34 M100 174 L100 184 M20 104 L30 104 M170 104 L180 104"/>`},

arena:{vb:"0 0 170 200",g:`
 <path d="M30 20 H140 M30 180 H140"/>
 <path d="M42 20 C42 66 85 88 85 100 C85 112 42 134 42 180"/>
 <path d="M128 20 C128 66 85 88 85 100 C85 112 128 134 128 180"/>
 <path d="M85 106 L85 150 M58 170 q27 -30 54 0 Z M56 34 q29 26 58 0"/>`},

cronometro:{vb:"0 0 190 200",g:`
 <circle cx="95" cy="112" r="70"/><path d="M95 112 L95 66 M95 112 L126 132"/>
 <path d="M76 26 H114 M95 26 V42 M150 46 L164 32"/>`},

calendario:{vb:"0 0 200 190",g:`
 <rect x="20" y="42" width="160" height="132" rx="12"/>
 <path d="M20 82 H180 M62 24 V56 M138 24 V56"/>
 <path d="M56 108 h16 M92 108 h16 M128 108 h16 M56 140 h16 M92 140 h16"/>`},

/* ---- contenedores / límites ---- */
ventana:{vb:"0 0 190 200",g:`
 <rect x="24" y="24" width="142" height="140" rx="10"/>
 <path d="M95 24 V164 M24 94 H166 M14 176 H176"/>`},

caja:{vb:"0 0 200 180",g:`
 <path d="M34 76 H166 V158 H34 Z"/>
 <path d="M34 76 L18 40 L92 30 L100 76 M166 76 L182 40 L108 30 L100 76"/>
 <path d="M100 76 V158"/>`},

carpeta:{vb:"0 0 200 170",g:`
 <path d="M22 46 H86 l16 22 H178 v76 a8 8 0 0 1 -8 8 H30 a8 8 0 0 1 -8 -8 Z"/>
 <path d="M22 92 H178"/>`},

sobre:{vb:"0 0 200 150",g:`
 <rect x="20" y="26" width="160" height="104" rx="8"/>
 <path d="M20 34 L100 90 L180 34"/>`},

/* ---- papel / dato ---- */
postit:{vb:"0 0 180 180",pale:`<path d="M22 22 H158 V126 L124 158 H22 Z"/>`,g:`
 <path d="M22 22 H158 V126 L124 158 H22 Z"/><path d="M158 126 H124 V158"/>
 <path d="M46 58 h88 M46 84 h88 M46 110 h56"/>`},

papel:{vb:"0 0 170 200",g:`
 <path d="M26 20 H112 L146 56 V180 H26 Z"/><path d="M112 20 V56 H146"/>
 <path d="M50 84 h72 M50 110 h72 M50 136 h44"/>`},

recibo:{vb:"0 0 160 200",g:`
 <path d="M28 20 H132 V170 l-13 12 -13 -12 -13 12 -13 -12 -13 12 -13 -12 -13 12 Z"/>
 <path d="M50 58 h60 M50 84 h60 M50 110 h36"/>`},

libro:{vb:"0 0 210 170",g:`
 <path d="M105 46 C86 30 56 26 24 30 v104 c32 -4 62 0 81 16"/>
 <path d="M105 46 C124 30 154 26 186 30 v104 c-32 -4 -62 0 -81 16"/>
 <path d="M105 46 V150 M44 62 h38 M44 88 h38 M128 62 h38 M128 88 h38"/>`},

etiqueta:{vb:"0 0 200 160",g:`
 <path d="M24 48 H140 l40 32 -40 32 H24 Z"/><circle cx="52" cy="80" r="8"/>
 <path d="M78 80 h44"/>`},

/* ---- búsqueda / criterio ---- */
lupa:{vb:"0 0 190 190",g:`<circle cx="86" cy="82" r="54"/><path d="M126 122 L168 164"/>
 <path d="M64 66 a30 30 0 0 1 20 -14"/>`},

diana:{vb:"0 0 190 190",g:`<circle cx="92" cy="98" r="74"/><circle cx="92" cy="98" r="44"/><circle cx="92" cy="98" r="14"/>
 <path d="M92 98 L172 26 M150 20 h24 v24"/>`},

brujula:{vb:"0 0 190 190",g:`<circle cx="94" cy="98" r="72"/>
 <path d="M94 44 L118 98 L94 152 L70 98 Z"/><path d="M94 14 V26"/>`},

embudo:{vb:"0 0 180 200",g:`
 <path d="M20 30 H160 L104 106 V166 L76 148 V106 Z"/>
 <path d="M90 180 v14"/>`},

balanza:{vb:"0 0 210 190",g:`
 <path d="M105 34 V150 M76 168 H134 M105 150 q-14 18 -29 18 M105 150 q14 18 29 18"/>
 <path d="M28 54 H182 M105 34 a10 10 0 0 1 0 20 a10 10 0 0 1 0 -20"/>
 <path d="M28 54 L8 100 h40 Z M182 54 L162 100 h40 Z"/>`},

/* ---- energía / señal ---- */
foco:{vb:"0 0 170 200",g:`
 <path d="M85 30 a48 48 0 0 1 30 86 v14 H55 v-14 A48 48 0 0 1 85 30z"/>
 <path d="M58 146 h54 M64 164 h42"/>
 <path d="M85 6 V16 M18 62 L28 68 M152 62 L142 68"/>`},

rayo:{vb:"0 0 140 200",g:`<path d="M84 18 L36 110 h34 l-16 74 62 -100 h-36 Z"/>`},

bateria:{vb:"0 0 210 130",g:`
 <rect x="20" y="30" width="150" height="70" rx="10"/><path d="M178 54 v22"/>
 <path d="M42 48 v34 M70 48 v34"/>`},

iman:{vb:"0 0 180 190",g:`
 <path d="M40 40 v70 a50 50 0 0 0 100 0 V40"/>
 <path d="M40 40 h34 v70 a16 16 0 0 0 32 0 V40 h34"/>
 <path d="M40 40 h34 M106 40 h34"/>
 <path d="M22 148 l-12 14 M158 148 l12 14 M90 172 v14"/>`},

ciclo:{vb:"0 0 190 190",g:`
 <path d="M40 66 a62 62 0 1 1 -6 62"/><path d="M22 92 L40 60 L70 76"/>
 <circle cx="96" cy="98" r="26"/>`},

mapa:{vb:"0 0 210 170",g:`
 <path d="M14 42 L74 22 L138 46 L198 24 V126 L138 148 L74 124 L14 146 Z"/>
 <path d="M74 22 V124 M138 46 V148"/>
 <path d="M40 108 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22z"/>`},

ojo:{vb:"0 0 210 130",g:`
 <path d="M14 66 C56 16 154 16 196 66 C154 116 56 116 14 66 Z"/>
 <circle cx="105" cy="66" r="28"/><circle cx="105" cy="66" r="9"/>`},

campana:{vb:"0 0 190 190",g:`
 <path d="M60 138 c0 -58 6 -84 34 -84 s34 26 34 84 z"/>
 <path d="M42 138 H146 M82 154 a12 12 0 0 0 24 0"/>
 <path d="M94 42 v-14 M22 96 h-12 M166 96 h12"/>`},

onda:{vb:"0 0 210 140",g:`
 <path d="M24 70 v-8 M48 70 v-30 M72 70 v-48 M96 70 v-24 M120 70 v-40 M144 70 v-16 M168 70 v-32 M192 70 v-10"/>
 <path d="M24 70 v8 M48 70 v30 M72 70 v48 M96 70 v24 M120 70 v40 M144 70 v16 M168 70 v32 M192 70 v10"/>`},

microfono:{vb:"0 0 170 200",g:`
 <rect x="60" y="20" width="52" height="90" rx="26"/>
 <path d="M38 96 a48 48 0 0 0 96 0 M86 144 v30 M58 176 h56"/>`},

/* ---- máquina ---- */
engrane:{vb:"0 0 200 200",g:`
 <circle cx="100" cy="100" r="52"/><circle cx="100" cy="100" r="20"/>
 <path d="M100 26 v22 M100 152 v22 M26 100 h22 M152 100 h22
   M48 48 l16 16 M136 136 l16 16 M152 48 l-16 16 M64 136 l-16 16"/>`},

laptop:{vb:"0 0 220 160",g:`
 <path d="M46 24 H174 V116 H46 Z"/><path d="M20 116 H200 l14 24 H6 Z"/>
 <path d="M70 46 h60 M70 70 h80"/>`},

terminal:{vb:"0 0 210 160",g:`
 <rect x="20" y="24" width="170" height="112" rx="10"/><path d="M20 56 H190"/>
 <path d="M46 84 l18 16 -18 16 M84 116 h40"/>`},

nube:{vb:"0 0 210 170",g:`
 <path d="M54 112 a34 34 0 0 1 4 -68 a44 44 0 0 1 82 -6 a30 30 0 0 1 22 74 Z"/>
 <path d="M62 134 l-10 24 M104 134 l-10 24 M146 134 l-10 24"/>`},

/* ---- camino / decisión ---- */
escalera:{vb:"0 0 200 180",g:`
 <path d="M18 158 h44 v-38 h44 v-38 h44 v-38 h32"/>
 <path d="M150 22 l24 22 -24 22"/>`},

puente:{vb:"0 0 220 160",g:`
 <path d="M12 118 H208 M40 118 V52 M180 118 V52"/>
 <path d="M40 52 C86 92 134 92 180 52"/>
 <path d="M70 118 V74 M110 118 V64 M150 118 V74"/>`},

semaforo:{vb:"0 0 150 200",g:`
 <rect x="32" y="16" width="86" height="140" rx="16"/>
 <circle cx="75" cy="52" r="16"/><circle cx="75" cy="88" r="16"/><circle cx="75" cy="124" r="16"/>
 <path d="M75 156 v28 M52 184 h46"/>`},

bandera:{vb:"0 0 190 200",g:`
 <path d="M46 180 V20"/><path d="M46 30 c34 -18 62 18 96 0 v66 c-34 18 -62 -18 -96 0z"/>
 <path d="M28 180 h36"/>`},

llave:{vb:"0 0 210 140",g:`
 <circle cx="52" cy="70" r="32"/><path d="M84 70 H188"/>
 <path d="M150 70 v26 M172 70 v26"/>`},

candado:{vb:"0 0 170 200",g:`
 <rect x="30" y="82" width="110" height="94" rx="14"/>
 <path d="M56 82 V56 a29 29 0 0 1 58 0 v26"/>
 <circle cx="85" cy="122" r="10"/><path d="M85 132 v20"/>`},

/* ---- comunicación ---- */
burbujas:{vb:"0 0 210 180",g:`
 <path d="M18 26 H126 a10 10 0 0 1 10 10 v52 a10 10 0 0 1 -10 10 H56 l-22 20 v-20 H18 a10 10 0 0 1 -10 -10 V36 a10 10 0 0 1 10 -10z"/>
 <path d="M92 76 H186 a10 10 0 0 1 10 10 v48 a10 10 0 0 1 -10 10 h-8 v20 l-22 -20 H92 a10 10 0 0 1 -10 -10 V86 a10 10 0 0 1 10 -10z"/>`},

megafono:{vb:"0 0 210 170",g:`
 <path d="M22 66 H62 L126 26 v118 L62 104 H22 Z"/><path d="M52 104 v40 h26 v-40"/>
 <path d="M152 56 a44 44 0 0 1 0 58 M172 40 a68 68 0 0 1 0 90"/>`},

/* ---- misc de mundo ---- */
taza:{vb:"0 0 200 180",g:`
 <path d="M36 66 H144 v66 a24 24 0 0 1 -24 24 H60 a24 24 0 0 1 -24 -24z"/>
 <path d="M144 82 h20 a22 22 0 0 1 0 44 h-20"/>
 <path d="M66 40 c10 -12 -6 -20 4 -32 M100 40 c10 -12 -6 -20 4 -32"/>`},

monedas:{vb:"0 0 200 170",g:`
 <ellipse cx="100" cy="60" rx="62" ry="22"/>
 <path d="M38 60 v26 a62 22 0 0 0 124 0 V60"/>
 <path d="M38 96 v26 a62 22 0 0 0 124 0 V96"/>`},

dado:{vb:"0 0 180 180",g:`
 <rect x="26" y="26" width="128" height="128" rx="22"/>
 <circle cx="64" cy="64" r="8"/><circle cx="116" cy="64" r="8"/>
 <circle cx="90" cy="90" r="8"/>
 <circle cx="64" cy="116" r="8"/><circle cx="116" cy="116" r="8"/>`},

hilo:{vb:"0 0 200 180",g:`
 <circle cx="98" cy="90" r="58"/>
 <path d="M52 56 c46 8 74 34 88 74 M46 108 c48 -10 84 -34 96 -68 M70 140 c14 -46 42 -76 76 -86"/>
 <path d="M156 118 c22 14 8 40 -14 44"/>`},

tijeras:{vb:"0 0 180 190",g:`
 <path d="M46 22 L128 138 M134 22 L52 138"/>
 <circle cx="58" cy="156" r="22"/><circle cx="122" cy="156" r="22"/>`},

ancla:{vb:"0 0 180 200",g:`
 <circle cx="90" cy="34" r="18"/><path d="M90 52 V172 M52 78 h76"/>
 <path d="M28 116 c0 40 28 58 62 58 s62 -18 62 -58"/>
 <path d="M14 118 h28 M138 118 h28"/>`},

termometro:{vb:"0 0 130 200",g:`
 <path d="M52 30 a13 13 0 0 1 26 0 v96 a26 26 0 1 1 -26 0z"/>
 <circle cx="65" cy="152" r="14"/><path d="M84 56 h14 M84 78 h14 M84 100 h14"/>`}
};

/* El grosor se compensa con la escala del viewBox para que TODO el sistema
   (doodles, marcos, flechas, subrayados) salga al mismo grosor en pantalla. */
/* vector-effect NO se hereda en SVG: va en cada forma, y eso lo hace el CSS (.dd *). */
const DSTYLE='fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="stroke-width:4px"';

/* renderiza un doodle a una altura dada, con sombrita de piso opcional */
function doodle(name,h=260,opt={}){
  const d=DOODLES[name];
  if(!d) return `<!-- doodle desconocido: ${name} -->`;
  const [,,vw,vh]=d.vb.split(/\s+/).map(Number);
  const w=Math.round(h*vw/vh);
  const ground=opt.ground===false?"":`<ellipse cx="${vw/2}" cy="${vh-3}" rx="${vw*0.3}" ry="${vh*0.028}" fill="var(--pale)" stroke="none"/>`;
  const pale=d.pale?`<g fill="var(--pale)" stroke="none">${d.pale}</g>`:"";
  return `<svg class="dd" viewBox="${d.vb}" width="${w}" height="${h}" style="color:${opt.color||"var(--ink)"}">
   ${ground}${pale}<g ${DSTYLE}>${d.g}</g></svg>`;
}
