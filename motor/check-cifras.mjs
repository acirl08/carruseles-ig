// Inventario de cifras del carril LARGO.
//
//   node check-cifras.mjs          lista las cifras y cuáles no tienen respaldo
//   node check-cifras.mjs --duro   sale con exit 1 si alguna no lo tiene
//
// POR QUÉ EXISTE: `02-MARCA.md` dice que un número sin fuente verificable no va,
// y que "solo el motor del corto lo comprueba". En el largo la regla se cumplía
// a mano — y hay cifras ya publicadas ("151 milisegundos", "28 investigadores")
// que ningún script respaldó. Esto no las inventa ni las borra: las hace
// VISIBLES, que es el primer paso para poder decidir sobre ellas.
//
// El modo por defecto NO rompe el build: los diez mazos ya están publicados y
// fallar sobre ellos cada domingo sería ruido. `--duro` es para mazos nuevos.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const DATA = process.env.DATA_DIR || path.join(AQUI, 'data');

// Mismos patrones que el motor del corto: dígitos y también palabras.
// Solo DÍGITOS con unidad, o dinero, o porcentaje. Las cantidades en palabras
// ("dos veces", "mil veces") son giros del idioma —"te lo dije mil veces"— y
// cazarlas daba trece falsos positivos sobre trece slides. El corto sí las caza
// porque ahí el copy afirma resultados propios; aquí el largo explica mecanismos.
const CIFRA = /(\$\s?\d[\d.,]*|\b\d[\d.,]*\s*(%|ms|milisegundos?|segundos?|minutos?|horas?|días?|semanas?|meses?|años?|métodos?|investigadores?|personas?|pesos?|dólares?|veces)\b)/gi;

const limpio = s => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

function textos(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => textos(x, out));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => {
    if (k !== 'fuente' && k !== 'nota') textos(x, out);   // la fuente no se audita a sí misma
  });
  return out;
}

const archivos = readdirSync(DATA).filter(f => f.endsWith('.json')).sort();
let totalSin = 0;
const filas = [];

for (const f of archivos) {
  const d = JSON.parse(readFileSync(path.join(DATA, f), 'utf8'));
  for (const [i, sl] of (d.slides ?? []).entries()) {
    const texto = limpio(textos(sl).join(' '));
    const cifras = [...new Set((texto.match(CIFRA) ?? []).map(c => c.trim()))];
    if (!cifras.length) continue;
    // Mismos campos de respaldo que el corto, más `fuente` en el propio slide.
    const respaldo = (typeof sl.fuente === 'string' && sl.fuente.trim().length > 3) ? sl.fuente
                   : sl.noEsMetrica ? 'no es métrica'
                   : sl.verificado === true ? 'firmada' : null;
    if (!respaldo) totalSin += cifras.length;
    filas.push({ mazo: f.replace('.json', ''), slide: i + 1, kind: sl.kind, cifras, respaldo });
  }
}

const sinRespaldo = filas.filter(r => !r.respaldo);

console.log(`${filas.length} slide(s) con cifras en ${archivos.length} mazo(s).\n`);
for (const r of filas) {
  const marca = r.respaldo ? '·' : '!';
  console.log(`${marca} ${r.mazo} slide ${r.slide} (${r.kind}): ${r.cifras.join(', ')}`);
  if (r.respaldo) console.log(`    respaldo: ${r.respaldo}`);
}

if (sinRespaldo.length) {
  console.log(`\n${totalSin} cifra(s) sin respaldo en ${sinRespaldo.length} slide(s).`);
  console.log('Cada una necesita en su slide "fuente" (texto que diga de dónde sale),');
  console.log('"noEsMetrica" (si cuenta pasos y no afirma un resultado), o "verificado": true.');
  if (process.argv.includes('--duro')) process.exit(1);
} else {
  console.log('\ntodas las cifras tienen respaldo.');
}
