// Baja lo que publican las fuentes y lo deja con su fecha real.
//
//   node fuentes/ingesta.mjs              últimos 7 días
//   node fuentes/ingesta.mjs --dias 3
//
// POR QUÉ EXISTE: hasta ahora el motor de señal dependía de lo que WebSearch
// devolviera ese día, y la fecha de un hilo se estimaba por su ID. El manual
// documenta que eso falló: se publicaron como recientes tres hilos de febrero de
// 2025. Estas dos fuentes traen la fecha REAL —`created_at` y `pubDate`— así que
// la estimación sobra.
//
// Esto NO elige temas. Baja material fechado; elegir sigue siendo del motor de
// señal con sus cuatro filtros, y comprobar-fuentes.mjs sigue abriendo cada URL
// antes de publicar.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const CRUDO = path.join(AQUI, 'crudo');

const i = process.argv.indexOf('--dias');
const DIAS = i > -1 ? Number(process.argv[i + 1]) : 7;
const CORTE = Date.now() - DIAS * 864e5;

const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' };

async function baja(url, tipo = 'text') {
  const r = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return tipo === 'json' ? r.json() : r.text();
}

// --- síntoma: el foro de usuarios --------------------------------------------
// Es la capa de peso alto: son usuarios finales describiendo un problema concreto,
// no desarrolladores discutiendo una API.
async function foro() {
  // Una sola página trae 30 hilos y ~3 caen dentro de la ventana. Se pagina
  // hasta salir del rango: en cuanto una página entera es más vieja que el
  // corte, las siguientes también lo son (vienen ordenadas).
  const todos = [];
  for (let pag = 0; pag < 8; pag++) {
    const d = await baja(`https://community.openai.com/latest.json?page=${pag}`, 'json');
    const t = (d.topic_list?.topics ?? []).filter(x => !x.pinned);
    if (!t.length) break;
    todos.push(...t);
    const masNuevo = Math.max(...t.map(x => new Date(x.created_at).getTime()));
    if (masNuevo < CORTE) break;
  }
  // Pre-filtro de G1: el síntoma tiene que vivirse en una ventana de chat, no en
  // una API. Esto NO sustituye al filtro del motor de señal —marca, no descarta—
  // porque un regex no distingue "mi API falla" de "la app falla y uso la API".
  const API = /\b(api|endpoint|sdk|webhook|token limit|rate limit|curl|python|node\.?js|typescript|dev(eloper)? forum|billing|invoice)\b/i;
  return todos
    .filter(t => new Date(t.created_at).getTime() >= CORTE)
    .map(t => ({
      // `probableApi` lo decide luego el motor de señal mirando el hilo.
      probableApi: API.test(t.title),
      capa: 'sintoma',
      fuente: 'community.openai.com',
      id: t.id,
      titulo: t.title,
      fecha: t.created_at.slice(0, 10),
      url: `https://community.openai.com/t/${t.slug}/${t.id}`,
      // Señales de que a alguien le importa, no solo de que lo escribió.
      vistas: t.views, respuestas: t.reply_count,
    }));
}

// --- cambio: qué salió y qué hace --------------------------------------------
function itemsRSS(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
    const campo = n => {
      const x = new RegExp(`<${n}[^>]*>([\\s\\S]*?)</${n}>`).exec(m[1]);
      return x ? x[1].replace(/<!\[CDATA\[|\]\]>/g, '')
                     .replace(/&apos;/g, "'").replace(/&amp;/g, '&')
                     .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : '';
    };
    return { titulo: campo('title'), url: campo('link'),
             resumen: campo('description'), pub: campo('pubDate') };
  });
}

async function alphasignal() {
  const xml = await baja('https://alphasignal.ai/feed.xml');
  return itemsRSS(xml)
    .filter(x => new Date(x.pub).getTime() >= CORTE)
    .map(x => ({
      capa: 'cambio', fuente: 'alphasignal.ai',
      titulo: x.titulo, fecha: new Date(x.pub).toISOString().slice(0, 10),
      url: x.url,
      // El resumen del RSS ya dice QUÉ HACE la cosa. Es justo lo que faltaba
      // cuando el recap salía superficial.
      resumen: x.resumen,
    }));
}

async function hackernews() {
  const xml = await baja('https://news.ycombinator.com/rss');
  const clave = /\b(AI|LLM|GPT|Claude|Gemini|model|agent|OpenAI|Anthropic)\b/i;
  return itemsRSS(xml)
    .filter(x => clave.test(x.titulo))
    .map(x => ({
      capa: 'cambio', fuente: 'news.ycombinator.com',
      titulo: x.titulo,
      fecha: x.pub ? new Date(x.pub).toISOString().slice(0, 10) : '',
      url: x.url,
    }));
}

const fuentes = [['foro', foro], ['alphasignal', alphasignal], ['hackernews', hackernews]];
const salida = { generado: new Date().toISOString(), dias: DIAS, items: [] };
const fallos = [];

for (const [nombre, fn] of fuentes) {
  try {
    const r = await fn();
    salida.items.push(...r);
    console.log(`  ${nombre}: ${r.length} items`);
  } catch (e) {
    // Una fuente caída no tumba la corrida, pero SÍ se anota: una ingesta que
    // silencia un fallo hace creer que esa semana no hubo nada.
    fallos.push({ fuente: nombre, error: e.message });
    console.log(`  ${nombre}: FALLÓ (${e.message})`);
  }
}

if (fallos.length) salida.fallos = fallos;
salida.items.sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));

if (!existsSync(CRUDO)) mkdirSync(CRUDO, { recursive: true });
const f = path.join(CRUDO, `${new Date().toISOString().slice(0, 10)}.json`);
writeFileSync(f, JSON.stringify(salida, null, 2) + '\n');

console.log(`\n${salida.items.length} items de los últimos ${DIAS} días -> ${path.basename(f)}`);
for (const capa of ['sintoma', 'cambio']) {
  const n = salida.items.filter(x => x.capa === capa).length;
  console.log(`  ${capa}: ${n}`);
}
if (fallos.length) console.log(`\n${fallos.length} fuente(s) fallaron: revísalas antes de fiarte del resultado.`);
