// Verificador del backlog.
//
//   node backlog/check-backlog.mjs
//
// Comprueba que pendientes.json y publicados.json estén bien formados y que no
// haya un tema pendiente que duplique algo ya publicado. El duplicado se detecta
// por el ARREGLO —el mecanismo—, no por el título: dos síntomas distintos con el
// mismo mecanismo son el mismo carrusel (05-MOTOR-DE-SENAL.md).

import { readFileSync } from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const lee = f => JSON.parse(readFileSync(path.join(dir, f), 'utf8'));

const pend = lee('pendientes.json');
const pub = lee('publicados.json');
const h = [];

if (!Array.isArray(pend.temas)) h.push('pendientes.json: "temas" tiene que ser un array');
if (!Array.isArray(pub.publicados)) h.push('publicados.json: "publicados" tiene que ser un array');

// Fuera el marcado antes de comparar: los textos traen <span class="hl">, y sin
// quitarlo "span" y "class" salen como palabras comunes en TODOS los mazos, que
// es un falso positivo en cada comparación.
const VACIAS = new Set(['span','class','para','como','cuando','porque','sobre','desde',
  'este','esta','esto','todo','toda','todos','todas','pero','sino','tambien','entre',
  'cada','otro','otra','mismo','misma','solo','sola','hace','hacer','tiene','tienen']);
const norm = s => (s ?? '')
  .replace(/<[^>]*>/g, ' ')
  .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9 ]/g, ' ').split(/\s+/)
  .filter(w => w.length > 3 && !VACIAS.has(w));

const ids = new Set();
for (const [i, t] of (pend.temas ?? []).entries()) {
  const donde = `pendientes[${i}]${t.id ? ` (${t.id})` : ''}`;
  for (const campo of ['id', 'titulo', 'carril', 'arreglo']) {
    if (!t[campo] || !String(t[campo]).trim()) h.push(`${donde}: falta "${campo}"`);
  }
  // Recencia: un síntoma real de hace un año no es noticia, y publicar sobre un
  // fallo ya arreglado es peor que no publicar. El manual documenta que esto ya
  // pasó: se etiquetaron como recientes tres hilos de febrero de 2025.
  // No se calcula la fecha —los IDs del foro no crecen a ritmo constante, y
  // convertir distancia en días es justo el error que costó aquella vez—: se
  // exige que alguien haya mirado y lo diga.
  if (!t.recencia)
    h.push(`${donde}: falta "recencia". Di contra qué techo lo comprobaste y si el síntoma sigue vivo`);
  else if (/SIN VERIFICAR/i.test(t.recencia) && t.estado !== 'por verificar')
    h.push(`${donde}: la recencia dice SIN VERIFICAR pero no está marcado "estado": "por verificar"`);

  if (t.carril && !['largo', 'corto'].includes(t.carril))
    h.push(`${donde}: carril "${t.carril}" — solo vale "largo" o "corto"`);
  if (t.id) {
    if (ids.has(t.id)) h.push(`${donde}: id repetido`);
    ids.add(t.id);
  }
  // duplicado por arreglo contra lo ya publicado
  const pal = norm(t.arreglo);
  if (pal.length >= 3) {
    for (const p of pub.publicados ?? []) {
      const otras = new Set(norm(p.arreglo));
      const comunes = [...new Set(pal)].filter(w => otras.has(w));
      if (comunes.length >= 3)
        h.push(`${donde}: el arreglo se parece al de ${p.id}-${p.slug} (comparten: ${comunes.slice(0, 4).join(', ')})`);
    }
  }
}

if (h.length === 0) {
  const n = (pend.temas ?? []).length;
  console.log(`sin hallazgos — ${n} pendiente(s), ${(pub.publicados ?? []).length} publicado(s)`);
  if (n === 0) console.log('  ojo: el backlog está vacío, así que la criba de duplicados sigue con el fondo abierto');
} else {
  console.log(`${h.length} hallazgo(s):`);
  for (const x of h) console.log('  · ' + x);
  process.exit(1);
}
