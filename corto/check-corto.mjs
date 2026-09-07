/* Verificador del carrusel corto.
   Cada guarda de aquí existe porque un defecto real se coló sin ella.
   Si agregas una regla, escribe al lado qué caso concreto la motivó. */
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';

const files = fs.readdirSync(process.env.CORTO_BUILD || 'build').filter(f => f.endsWith('.html')).sort();
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const problemas = [];

for (const f of files) {
  const id = f.replace('.html', '');
  const p = await b.newPage({ viewport: { width: 1160, height: 1400 } });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e).slice(0, 200)));   // un TypeError dejaba la página VACÍA y el check decía "sin hallazgos"
  await p.goto('file://' + path.resolve(process.env.CORTO_BUILD || 'build', f));
  await p.evaluate(() => document.body.classList.add('export'));
  await p.waitForTimeout(1200);

  const esperados = await p.evaluate(() => (window.D?.slides?.length) ?? null);
  const hay = await p.$$eval('.slide', e => e.length);
  if (errores.length) problemas.push(`${id}: ERROR DE PÁGINA -> ${errores[0]}`);
  if (hay === 0) problemas.push(`${id}: CERO slides renderizados`);
  else if (esperados && hay !== esperados) problemas.push(`${id}: ${hay} slides renderizados de ${esperados}`);

  const res = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((sl, i) => {
      const msgs = [], S = sl.getBoundingClientRect();
      const R = el => { const r = el.getBoundingClientRect(); return { t: r.top - S.top, b: r.bottom - S.top, l: r.left - S.left, r: r.right - S.left, h: r.height, w: r.width }; };
      const inner = sl.querySelector('.inner');
      const tinta = [...inner.querySelectorAll(':scope > *')].filter(e => !e.classList.contains('aster') && e.getBoundingClientRect().height > 2);

      // 0. Slide EN BLANCO. Motivo: un kind que el validador aceptaba pero el
      //    render no conocía ("final" vs "cierre") pintaba un artboard vacío,
      //    y como todas las guardas de abajo empiezan con `if (tinta.length)`,
      //    cero tinta daba cero hallazgos. El vacío tiene que gritar.
      //    Se mira el TEXTO, no las cajas: cuatro campos con "<br>" pasan el
      //    validador, producen cuatro elementos con altura real y cero palabras.
      if (!tinta.length || !inner.innerText.trim()) msgs.push('slide SIN TINTA: el .inner no tiene texto');
      if (/kind desconocido/.test(inner.innerHTML)) msgs.push(`kind que el motor no sabe pintar: ${(inner.innerHTML.match(/kind desconocido: ([^\s-]+)/) || [, '?'])[1]}`);

      // 1. Fuera del área segura. Motivo: fit() medía el lienzo (1350) y el titular
      //    se montaba sobre el handle y el pie con el check en silencio.
      if (tinta.length) {
        const t = Math.min(...tinta.map(e => R(e).t)), bo = Math.max(...tinta.map(e => R(e).b));
        if (t < 150) msgs.push(`tinta sube a y=${Math.round(t)} (límite 150)`);
        if (bo > 1215) msgs.push(`tinta baja a y=${Math.round(bo)} (límite 1215)`);
      }

      // 2. Choque real contra el chrome fijo, caja contra caja.
      const chrome = [['handle', '.brand-top'], ['píldora', '.pill'], ['pie', '.foot'], ['flecha', '.arrow']];
      chrome.forEach(([nm, sel]) => {
        const el = sl.querySelector(sel); if (!el) return;
        const c = R(el);
        tinta.forEach(t => {
          const a = R(t);
          if (Math.min(a.r, c.r) - Math.max(a.l, c.l) > 8 && Math.min(a.b, c.b) - Math.max(a.t, c.t) > 8)
            msgs.push(`texto encima de ${nm}`);
        });
      });

      // 3. Recorte horizontal. Motivo: una palabra larga sin espacios se cortaba
      //    a media letra y fit() sólo reacciona al eje vertical.
      sl.querySelectorAll('.inner *').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) msgs.push(`recorte horizontal en .${el.className || el.tagName.toLowerCase()}`);
      });

      // 4. "undefined" impreso dentro del arte. Motivo: un campo faltante
      //    pintaba un bocadillo naranja que decía literalmente "undefined".
      if (/\bundefined\b/.test(sl.innerText)) msgs.push('la palabra "undefined" aparece en el slide');

      // 5. Escala forzada. <= porque fit() baja de 0.02 en 0.02 y 0.80 es alcanzable exacto.
      const sc = parseFloat(getComputedStyle(sl).getPropertyValue('--sc') || '1');
      if (sc <= 0.80) msgs.push(`escala forzada a ${sc}`);

      // 6. Hueco vertical, contando también el aire de arriba y el de abajo.
      //    Motivo: 552px muertos en la mitad inferior de un slide pasaron limpios
      //    porque sólo se medían los huecos ENTRE elementos.
      if (tinta.length && !sl.classList.contains('portada')) {
        const cajas = tinta.map(R).sort((a, c) => a.t - c.t);
        // (a) hueco ENTRE elementos: eso siempre es un defecto de composición
        let entre = 0, donde = 0, y = cajas[0].t;
        for (const m of cajas) { if (m.t - y > entre) { entre = m.t - y; donde = y; } y = Math.max(y, m.b); }
        if (entre > 300) msgs.push(`hueco ${Math.round(entre)}px entre elementos, en y=${Math.round(donde)}`);
        // (b) slide famélico: demasiado aire a CADA lado del bloque.
        //     Ojo con la trampa anterior: .inner usa justify-content:center, así que
        //     |arriba - abajo| vale siempre ~5. Medir el DESBALANCE era medir una
        //     constante de CSS, no la composición: un slide con 439px muertos arriba
        //     y 444px abajo pasaba limpio. Se mide el aire ABSOLUTO de cada lado.
        //     400 respeta el mazo real (máximo medido: 352px, slide 03 de s01) y atrapa
        //     el caso 439/444. Si cambias el umbral, MIDE otra vez; el 333 que decía
        //     este comentario antes venía de un mazo viejo y ya no era cierto.
        const arriba = cajas[0].t - 150, abajo = 1215 - y;
        if (arriba > 400 || abajo > 400)
          msgs.push(`slide vacío de contenido: ${Math.round(arriba)}px de aire arriba y ${Math.round(abajo)}px abajo (límite 400)`);
      }

      if (msgs.length) out.push({ n: i + 1, msgs: [...new Set(msgs)] });
    });
    return out;
  });
  res.forEach(r => problemas.push(`${id} · slide ${String(r.n).padStart(2, '0')}: ${r.msgs.join(' | ')}`));
  await p.close();
}
await b.close();
console.log(problemas.length ? problemas.join('\n') : 'sin hallazgos');
process.exit(problemas.length ? 1 : 0);
