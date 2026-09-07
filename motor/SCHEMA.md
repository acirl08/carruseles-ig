# Esquema de `data/cNN-slug.json`

Un archivo por carrusel. El motor (`engine.js` + `build.mjs`) lo convierte en **10 slides** de
1080×1350. **No inventes campos ni kinds nuevos**: si un campo falta, el slide sale roto.

Usa `data/c02-olvida.json` como plantilla viva. Estructura raíz:

```json
{
  "id": "Carrusel 07",
  "titulo": "…",
  "audiencia": "devs" | "emprendedores",
  "nota": "…",
  "caption": "…texto completo del caption con \n\n entre párrafos, cerrando con los 5 hashtags…",
  "poses": [ { "id":"p37", "slide":1, "desc":"…" }, … ],
  "slides": [ …10 objetos… ]
}
```

## Los 10 slides — kind fijo por beat

> **Fusión del 2 de septiembre de 2026.** Este esquema describía 11 slides con un beat `cta`
> aparte. La API de publicación de Instagram topa los carruseles en **10 imágenes**, así que
> los beats 10 (`cierre`) y 11 (`cta`) se fusionaron en uno solo, `final`. Los diez mazos
> reales tienen 10 slides y ninguno usa `cta`. Si ves `cta` en algún sitio, es documentación
> vieja.

| n | kind | campos propios |
|---|---|---|
| 1 | `cover` | `eyebrow` (MAYÚSCULAS, sin punto), `hook` (puede llevar `<em>…</em>`), `tape` (una línea) |
| 2 | `ciclo` | `ts`, `title`, `chain`: 4 pares `["causa","efecto"]` (sin punto final, el motor lo pone), `band`:{`lab`,`txt`} |
| 3 | `quotes` **o** `costo` | `ts`, `title`, `quotes`: 3 frases entre «», `solid` (la frase de alivio), y `card` (sólo `quotes`) |
| 4 | `concepto` | `ts`, `title`, `defn` (puede llevar `<span class="hl">…</span>`), `box`: [línea1, línea2], `pp`:{`h`,`t`} |
| 5 | `split` **o** `stack` | `ts`, `title`, `lines`: 3 frases, `band`:{`lab`,`txt`} |
| 6 | `negs` | `ts`, `title`, `negs`: 3 frases que empiezan con "No significa…", `si`: UNA frase |
| 7 | `nums` | `ts`, `title`, `nums`: **tantos como prometa el titular** (4, 5 o 6), `label` |
| 8 | `vs` **o** `caso` | `vs`: `cols`: [[LABEL,texto],[LABEL,texto]], `foot`. `caso`: `lab`, `lines` (3–4), `foot` |
| 9 | `checks` **o** `list6` | `ts`, `title`, `checks`: **exactamente 6**, `band`:{`lab`,`txt`} |
| 10 | `final` | `ts`, `title`, `chips`: 3–4 palabras sueltas, `ask` (la pregunta abierta), `follow` ("Sígueme para más"), `send` (la línea de compartir) |

El `final` es el `cierre` y el `cta` en un solo artboard. Lo que se perdió en la fusión fue la
pregunta "¿Te sirvió esto?" del viejo `cta`; el resto sobrevivió entero. Es lo mismo que hace
@noveira.dev, la cuenta que se toma de referencia de formato.

`ts` es el tamaño base del titular. Guía: título corto `"90px"`, medio `"84px"`, largo `"76px"`,
muy largo `"68px"`. El motor reduce solo si aun así no cabe, así que **no** te pases de largo.
Los `lab` de banda y columna van en MAYÚSCULAS y cortos (2–4 palabras).

## Elegir entre alternas

Cada carrusel debe usar **al menos dos** de las alternas para no verse igual que sus hermanos:
`costo` en vez de `quotes`, `stack` en vez de `split`, `caso` en vez de `vs`, `list6` en vez de
`checks`. Elige la que le quede mejor al contenido: `caso` sirve cuando el beat 08 es un caso
narrado y no una comparación; `stack` cuando el 05 es una secuencia y no una imagen + texto.

## El campo `art` (obligatorio en los 10 slides)

```json
"art": { "type":"pichu",  "id":"p37", "pos":"bl", "fallback":"lupa" }
"art": { "type":"doodle", "id":"lupa", "pos":"br", "h":250 }
```

- **5 o 6 slides con `type:"pichu"`; el resto, `type:"doodle"`.** Medido en los diez mazos
  reales: cinco carruseles llevan 5 Pichu y cinco llevan 6. La regla vieja decía "exactamente
  6 y 5", que sumaba 11 y dejó de cuadrar con la fusión a 10 slides.
- El slide 01 (portada) y el 10 (`final`) **siempre** llevan Pichu.
- Los otros 3 o 4 Pichu los eliges tú entre los slides 02–09. **No repitas el mismo patrón de
  números que otro carrusel**: se te indica abajo cuál te toca.
- `pos`: `"big"` sólo en la portada; `"cc"` centrado abajo; `"bl"` abajo izquierda;
  `"br"` abajo derecha; `"cl"`/`"cr"` más chicos a los lados; `"inl"` **sólo** en el kind
  `split` (va dentro de la columna izquierda). En el `final` usa `"cc"`.
- `fallback` es el nombre de un doodle que se dibuja si la pose aún no existe. Siempre ponlo.
- `h` (opcional, sólo doodles): altura en px, 220–280. Por defecto 270.

### Nombres de doodle disponibles (no inventes otros)

```
reloj arena cronometro calendario ventana caja carpeta sobre postit papel recibo libro
etiqueta lupa diana brujula embudo balanza foco rayo bateria iman ciclo mapa ojo campana
onda microfono engrane laptop terminal nube escalera puente semaforo bandera llave candado
burbujas megafono taza monedas dado hilo tijeras ancla termometro
```

Elige el objeto por lo que dice ESE beat, no por decorar. Un doodle no se repite dentro del
mismo carrusel.

## `poses`

Una entrada por cada slide con `type:"pichu"` — **5 o 6, según el carrusel**. Que el número
coincida con los `art` de tipo pichu; no es fijo desde la fusión a 10 slides. `desc` es la descripción de la pose
en **inglés**, en una sola frase, con: qué hace, con qué objeto, y el estado de la cresta
(`its crest is fully upright with the three feathers separated` / `its crest is at half mast and
tilted to one side` / `its crest is neutral and its body faces front` / `its crest is relaxed and
settled down`), según el bloque de slides (01–03 alerta, 04–05 duda, 06–08 atención, 09–10 calma).
El objeto tiene que ser genérico y sin texto legible.

## Escapes

Es JSON: comillas dobles escapadas (`\"`), sin comentarios, sin comas colgantes. El HTML
permitido dentro de los textos es sólo `<em>`, `<br>` y `<span class="hl">`.

## El slide 02 es la segunda portada

Instagram puede reentrar al carrusel por el slide 02 cuando el lector no deslizó desde la
portada (Mosseri, oct 2024). Por eso el `title` del 02 **tiene que sostenerse solo**: dice de
qué trata el carrusel para alguien que nunca vio el slide 01.

Dos reglas que se rompieron y hay que revisar cada vez:

- **Ancla de dominio.** El titular tiene que nombrar de qué habla: prompt, chat, respuesta,
  paper, asistente de voz, la IA. Sin eso, "Entre más lo corriges, más se aleja" se lee igual
  de bien sobre un hijo o un bug, y el lector de reentrada nunca sabe que es de IA.
- **No empezar todos igual.** Los diez arrancaban con "El ciclo que…". Varía la construcción
  entre carruseles: afirmación, "Por qué…", "Lo que…", verbo en segunda persona.
- **El titular no repite 3+ palabras seguidas de NINGÚN otro texto de su carrusel**, empezando
  por el `eyebrow` y el `hook` del slide 01 — ahí se coló la peor: un titular que copiaba siete
  palabras del eyebrow. Tampoco del `chain`, la banda ni los titulares de los otros slides.
  Escribe la tesis del beat, no el resumen del primer eslabón.
- **Fiel al chain.** Si los cuatro eslabones describen una inferencia tuya, el titular no puede
  imputarle al sistema una omisión que el chain nunca dice.
- **El 02 describe estructura, no defecto del lector.** El alivio llega en el 03; un titular en
  pretérito acusatorio ("Copiaste la plantilla") acusa antes de que el 03 quite culpa.

`python3 check-titulares.py` verifica el ancla, las repeticiones y los arranques.

## El campo `send` del slide 10 (`final`)

`send` es la petición de compartir ("Mándaselo a quien le pasa esto."), y se renderiza en color
de acento debajo del recuadro de `follow`. Existe porque los *sends* son, según Mosseri
(enero 2025), la señal que más pesa para llegar a gente que no te sigue — junto con el tiempo
de visualización y los likes, y normalizada por alcance.

**Ojo:** el skill `carrusel-largo-isaiscoding` dice que el slide de cierre lleva "una sola petición" y
"pide seguir y nada más". Con `send` son dos. Isabela autorizó la excepción; si vuelve a querer
una sola, se borra el campo `send` de los diez JSON y se reconstruye — nada más.

El skill además dice "sin DM" dos veces. A la letra, "mándaselo" es un DM. En intención no:
esa regla prohíbe el DM de conversión (keyword → DM a Isabela), y esto pide un DM a un tercero.
Queda anotado para que nadie lo descubra después y crea que se pasó por alto.
