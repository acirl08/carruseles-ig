// Abre cada fuente del mazo y comprueba si respalda lo que afirma el slide.
//
//   node comprobar-fuentes.mjs              todos los data/*.json
//   node comprobar-fuentes.mjs data/rNN.json
//
// POR QUÉ EXISTE: `comprobada: true` es una declaración, igual que la firma del
// corto — no prueba nada por sí sola. Y el fraude que ya pasó fue exactamente ese:
// tres noticias citaban una página que no decía lo que el slide afirmaba, y tanto
// el validador como yo las dimos por buenas.
//
// Esto NO decide si la noticia es cierta: comprueba que los ANCLAJES del slide
// aparezcan en la página citada. Anclaje = cifra, nombre propio o término técnico.
//
// Compara solo eso a propósito. El primer intento comparaba todas las palabras y
// daba falso positivo en las tres noticias buenas: las fuentes están en inglés y
// los slides en español, así que "recorte" nunca aparece donde dice "cut". Lo que
// SÍ cruza idiomas son los números, los nombres y los tecnicismos — y son justo lo
// que más daño hace si no está en la fuente.
//
// LÍMITE CONOCIDO, dicho para que nadie lo confunda con una garantía: caza que la
// página no hable del tema, y caza una cifra ausente. NO caza un matiz falso sobre
// algo que la página sí menciona. Probado: de las dos fuentes falsas del fraude
// original, caza la de "$40 mil millones" (la cifra no está) y deja pasar la de
// "primer modelo en activar el umbral" — porque esa página sí nombra a OpenAI y a
// Astra, solo que no dice lo del umbral. Ese segundo caso sigue siendo tuyo.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const DATA = process.env.RECAP_DATA || path.join(AQUI, 'data');

const limpio = s => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Un anclaje es lo que sobrevive a la traducción: nombres propios (mayúscula
// inicial en mitad de frase), versiones (5.1), siglas, y las cifras.
const NOMBRE = /\b([A-Z][A-Za-z]{2,}(?:\s+\d+(?:\.\d+)?)?)\b/g;
const SIGLA  = /\b([A-Z]{2,}\d*)\b/g;

// Normaliza para comparar: sin acentos, sin marcado, en minúsculas.
const norm = s => limpio(s).toLowerCase().normalize('NFD')
  .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s%$.]/g, ' ');

function anclajes(texto) {
  // Quitar acentos ANTES de buscar mayúsculas: si no, "BAJÓ" se parte en "BAJ"
  // y la salida se llena de fragmentos que no significan nada.
  const t = limpio(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const out = new Set();
  for (const m of t.matchAll(NOMBRE)) out.add(m[1]);
  for (const m of t.matchAll(SIGLA))  out.add(m[1]);
  return [...out].map(x => norm(x)).filter(x => x.length > 2);
}

// Las cifras son lo que más daño hace si no está en la fuente: van aparte y pesan más.
const cifras = texto => [...new Set((limpio(texto).match(/\d[\d.,]*\s*%|\$\s?\d[\d.,]*|\b\d[\d.,]{1,}\b/g) ?? [])
  .map(c => c.replace(/\s+/g, '')))];

async function baja(url) {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return { error: `HTTP ${r.status}` };
    const html = await r.text();
    return { texto: norm(html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                             .replace(/<style[\s\S]*?<\/style>/gi, ' ')) };
  } catch (e) {
    return { error: e.name === 'TimeoutError' ? 'sin respuesta en 20s' : e.message };
  }
}

const arg = process.argv[2];
const archivos = arg ? [arg]
  : (existsSync(DATA) ? readdirSync(DATA).filter(f => f.endsWith('.json')).map(f => path.join(DATA, f)) : []);

if (!archivos.length) { console.error('no encontré ningún data/*.json'); process.exit(1); }

let problemas = 0, revisadas = 0;
const cache = new Map();

for (const f of archivos) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  const nombre = path.basename(f, '.json');
  const noticias = (d.slides ?? []).filter(s => s.kind === 'noticia');

  for (const [i, s] of noticias.entries()) {
    const donde = `${nombre} · noticia ${i + 1}`;
    const url = limpio(s.fuente);
    if (!url) { console.log(`✗ ${donde}: sin fuente`); problemas++; continue; }

    if (!cache.has(url)) cache.set(url, await baja(url));
    const pag = cache.get(url);
    revisadas++;

    if (pag.error) {
      console.log(`? ${donde}: no pude abrir la fuente (${pag.error}) — compruébala a mano`);
      continue;
    }

    const texto = [s.titular, s.resumen].join(' ');
    const an = anclajes(texto);
    const anFaltan = an.filter(k => !pag.texto.includes(k));
    const cs = cifras(texto);
    const csFaltan = cs.filter(c => !pag.texto.replace(/\s/g, '').includes(c.replace(/\s/g, '')));

    if (csFaltan.length) {
      console.log(`✗ ${donde}: la cifra ${csFaltan.join(', ')} NO aparece en la fuente`);
      problemas++;
    } else if (an.length && anFaltan.length === an.length) {
      // Ni un solo nombre propio del slide está en la página: no habla de esto.
      console.log(`✗ ${donde}: ningún nombre del slide aparece en la fuente`);
      console.log(`    buscaba: ${an.slice(0, 8).join(', ')}`);
      problemas++;
    } else {
      const ok = an.length - anFaltan.length;
      console.log(`✓ ${donde}: respaldada (${ok}/${an.length} nombres${cs.length ? `, cifras ${cs.join(', ')}` : ''})`);
      if (anFaltan.length) console.log(`    ojo, no encontré: ${anFaltan.join(', ')}`);
    }
  }
}

console.log(`\n${revisadas} noticia(s) revisadas contra su fuente.`);
if (problemas) {
  console.log(`${problemas} con problema. Arregla la noticia o cambia la fuente antes de publicar.`);
  process.exit(1);
} else {
  console.log('todas las fuentes respaldan lo que afirma su slide.');
}
