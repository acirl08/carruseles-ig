// Verificador de captions, para los dos carriles.
//
//   node check-caption.mjs                    # todos los data/*.json de los dos motores
//   node check-caption.mjs ruta/al/mazo.json  # uno solo
//
// POR QUÉ EXISTE: el hueco 4 de 13-HUECOS decía que "no hay estructura ni ejemplo
// comentado" para escribir un caption. Las reglas sueltas sí existían (cinco
// hashtags, #claudeai, nada de bait), pero nada las comprobaba: el caption es el
// único texto que se publica sin pasar por ningún verificador.
//
// Lo que mide NO es gusto: son las reglas escritas en 02-MARCA.md más la
// regularidad medida sobre los 13 captions publicados — 13/13 cumplen las cuatro
// (cinco hashtags, #claudeai, separador ⸻, pregunta abierta). Donde los datos no
// mandan nada, este script no opina.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const HASHTAGS_EXACTOS = 5;          // 02-MARCA.md: "Exactamente 5 hashtags"
const OBLIGATORIO = '#claudeai';     // 02-MARCA.md: "siempre entre ellos"
const SEPARADOR = '⸻';               // 13/13 publicados
const TYPO = '#gastosintelgente';    // 02-MARCA.md: va corregido

// 02-MARCA.md: "Nada de 'comenta SÍ y te mando la guía'. Es engagement bait."
const BAIT = [
  /comenta\s+["“]?s[ií]\b/i,
  /escribe\s+["“]?s[ií]\b/i,
  /manda\s+un\s+dm\b/i,
  /te\s+mando\s+(la|el)\s+\w+/i,
  /link\s+en\s+(la\s+)?bio/i,
  /comenta\s+la\s+palabra/i,
];

// 02-MARCA.md: sin título técnico ante audiencia no técnica.
const TITULO_TECNICO = /\b(AI|IA)\s+Engineer\b|\bDevOps\b|\bML\s+Engineer\b/i;

// 02-MARCA.md: el verbo en B2B es "asesoro", no "ayudo".
const VERBO_PROHIBIDO = /\bles?\s+ayudo\s+a\b|\bayudo\s+a\s+(negocios|empresas|equipos)/i;

// 02-MARCA.md: nunca se le atribuye intención a la MÁQUINA. Ojo con el sujeto:
// c09 dice "El paper no miente: miente el puente" y ahí el sujeto es el titular
// periodístico, no el modelo — es legítimo. Por eso la regla exige que el verbo
// vaya pegado a un sujeto que sea la máquina, en vez de cazar el verbo suelto.
const SUJETO_MAQUINA = '(la\\s+)?(ia|i\\.a\\.|máquina|modelo|claude|chatgpt|gpt)';
const ANTROPOMORFISMO = new RegExp(
  `\\b${SUJETO_MAQUINA}\\s+(te\\s+)?(miente|engaña|se\\s+hace\\s+la\\s+tonta|quiere|decide)\\b`, 'i');

function revisa(cap, nombre) {
  const h = [];
  if (!cap || !cap.trim()) return [`${nombre}: no tiene caption`];

  const tags = cap.match(/#[\wáéíóúñ]+/gi) ?? [];
  if (tags.length !== HASHTAGS_EXACTOS)
    h.push(`${tags.length} hashtags, tienen que ser exactamente ${HASHTAGS_EXACTOS}`);
  if (!tags.some(t => t.toLowerCase() === OBLIGATORIO))
    h.push(`falta ${OBLIGATORIO}`);
  const dup = tags.map(t => t.toLowerCase()).filter((t, i, a) => a.indexOf(t) !== i);
  if (dup.length) h.push(`hashtag repetido: ${[...new Set(dup)].join(', ')}`);
  if (cap.includes(TYPO)) h.push(`el typo ${TYPO} — va "#gastosinteligente"`);

  if (!cap.includes(SEPARADOR))
    h.push(`falta el separador ${SEPARADOR} antes de los hashtags`);
  if (!cap.includes('?'))
    h.push('no hay pregunta abierta');

  for (const re of BAIT) if (re.test(cap)) h.push(`engagement bait: "${cap.match(re)[0]}"`);
  if (TITULO_TECNICO.test(cap)) h.push(`título técnico: "${cap.match(TITULO_TECNICO)[0]}"`);
  if (VERBO_PROHIBIDO.test(cap)) h.push(`en B2B el verbo es "asesoro", no "ayudo"`);
  if (ANTROPOMORFISMO.test(cap)) h.push(`intención atribuida a la máquina: "${cap.match(ANTROPOMORFISMO)[0]}"`);

  // La primera línea trabaja para búsqueda: las cuentas profesionales están
  // indexadas por Google desde julio de 2025 (02-MARCA.md).
  const primera = cap.split('\n')[0].trim();
  if (primera.length < 40)
    h.push(`la primera línea tiene ${primera.length} caracteres: es la que trabaja para búsqueda`);

  return h.map(x => `${nombre}: ${x}`);
}

const arg = process.argv[2];
const archivos = arg
  ? [arg]
  : ['motor/data', 'corto/data']
      .flatMap(d => {
        const dir = path.resolve(process.cwd(), '..', d);
        const alt = path.resolve(process.cwd(), d);
        const real = existsSync(dir) ? dir : (existsSync(alt) ? alt : null);
        return real ? readdirSync(real).filter(f => f.endsWith('.json')).map(f => path.join(real, f)) : [];
      });

if (!archivos.length) { console.error('no encontré ningún data/*.json'); process.exit(1); }

let todos = [];
for (const f of archivos) {
  const d = JSON.parse(readFileSync(f, 'utf8'));
  todos = todos.concat(revisa(d.caption ?? '', path.basename(f, '.json')));
}

if (todos.length === 0) {
  console.log(`sin hallazgos — ${archivos.length} caption(s) revisados`);
} else {
  console.log(`${todos.length} hallazgo(s):`);
  for (const x of todos) console.log('  · ' + x);
  process.exit(1);
}
