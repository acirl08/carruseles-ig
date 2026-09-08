// Reconstruye publicados.json leyendo los mazos que existen, y saca del backlog
// los temas que ya se publicaron.
//
//   node backlog/actualizar.mjs
//
// POR QUÉ EXISTE: `publicados.json` se escribió a mano una vez. En cuanto se
// produce un carrusel nuevo queda viejo, y `check-backlog.mjs` compara duplicados
// contra una lista incompleta — que es exactamente "la criba con el fondo abierto"
// que 05-MOTOR-DE-SENAL.md nombra como el hueco más grande del sistema.
//
// Corre esto DESPUÉS de producir, antes de guardar el backlog.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const RAIZ = path.join(AQUI, '..');

// El mecanismo vive en el slide `concepto` del largo y del corto; en el recap no
// hay concepto, así que cada noticia aporta el suyo.
const texto = v =>
  typeof v === 'string' ? v
  : Array.isArray(v) ? v.map(texto).join(' ')
  : (v && typeof v === 'object') ? Object.values(v).map(texto).join(' ')
  : '';

function mecanismoDe(d) {
  for (const s of d.slides ?? []) {
    if (s.kind === 'concepto') return texto(s.defn) || texto(s.lista) || texto(s.title);
  }
  // recap: el arreglo es el conjunto de lo que cubrió esa semana
  const not = (d.slides ?? []).filter(s => s.kind === 'noticia');
  if (not.length) return not.map(s => texto(s.titular)).join(' · ');
  return '';
}

const carriles = [
  { dir: 'motor/data', prefijo: 'c', carril: 'largo' },
  { dir: 'corto/data', prefijo: 's', carril: 'corto' },
  { dir: 'recap/data', prefijo: 'r', carril: 'recap' },
];

const publicados = [];
for (const { dir, prefijo, carril } of carriles) {
  const ruta = path.join(RAIZ, dir);
  if (!existsSync(ruta)) continue;
  for (const f of readdirSync(ruta).filter(x => x.startsWith(prefijo) && x.endsWith('.json')).sort()) {
    const d = JSON.parse(readFileSync(path.join(ruta, f), 'utf8'));
    const slug = f.replace('.json', '');
    publicados.push({
      id: slug.split('-')[0],
      slug: slug.split('-').slice(1).join('-'),
      carril,
      titulo: d.titulo ?? '',
      arreglo: mecanismoDe(d).trim(),
    });
  }
}

const dest = path.join(AQUI, 'publicados.json');
const antes = existsSync(dest) ? JSON.parse(readFileSync(dest, 'utf8')).publicados?.length ?? 0 : 0;

writeFileSync(dest, JSON.stringify({
  nota: `Generado por actualizar.mjs el ${new Date().toISOString().slice(0, 10)} leyendo los mazos que existen. ` +
        `No se edita a mano: se regenera. El duplicado se detecta por el ARREGLO, no por el titulo.`,
  publicados,
}, null, 2) + '\n');

console.log(`publicados.json: ${antes} -> ${publicados.length} mazos`);
for (const c of ['largo', 'corto', 'recap']) {
  console.log(`  ${c}: ${publicados.filter(p => p.carril === c).length}`);
}

// Y avisa si un tema del backlog ya se produjo: se quedó ahí de más.
const pend = path.join(AQUI, 'pendientes.json');
if (existsSync(pend)) {
  const p = JSON.parse(readFileSync(pend, 'utf8'));
  const vivos = (p.temas ?? []).filter(t => {
    const suyo = String(t.arreglo ?? '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
    return !publicados.some(pu => {
      const otras = String(pu.arreglo ?? '').toLowerCase();
      return suyo.length >= 3 && suyo.filter(w => otras.includes(w)).length >= 3;
    });
  });
  if (vivos.length !== (p.temas ?? []).length) {
    console.log(`\n${(p.temas ?? []).length - vivos.length} tema(s) del backlog ya están publicados. Quítalos a mano o revisa si son de verdad el mismo.`);
  }
}
