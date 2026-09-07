# 06 · Publicación — Buffer

## Por qué Buffer y no Metricool

Las dos están conectadas. Metricool funciona en gratuito, pero su tope es de **20
publicaciones al mes**, y a cinco por semana no alcanza. Buffer sale en cero y su tope es de
~~**10 publicaciones en cola**~~ → **5000 desde el 7 de septiembre de 2026**, cuando Isabela
subió de plan. El tope dejó de ser una restricción de diseño: ya no hay que sacar un largo
para meter un corto.

Metricool se queda solo como fuente de analítica si hace falta.

## Los identificadores (verificados el 2 de septiembre de 2026)

| | |
|---|---|
| Organización | `6a9873c49b0fc4678fe4679c` ("My organization") |
| Canal de Instagram | `6a9873f0065799be4676892d` — `isaiscoding.ia`, tipo business |
| Timezone de la cuenta | `America/Monterrey` (UTC-6 todo el año) |
| Hora de publicación | 7 pm de Monterrey = `T19:00:00-06:00` |

## Cómo se crea un post

`create_post` con:

- **`schedulingType: "notification"`** — obligatorio y no negociable. El esquema lo describe
  como "manual approval": Buffer le manda un recordatorio y ella publica a mano. **Es la única
  forma de ponerle música**, y sin música el carrusel no entra a la pestaña de Reels.
  `automatic` publicaría sin música: nunca se usa.
- `mode: "customScheduled"` + `dueAt` en ISO 8601 con offset `-06:00`.
- `assets`: array de `{image: {url, metadata: {altText}}}`, en orden del primer slide al
  último. **`altText` es obligatorio** — describe el slide, no lo dejes vacío.
- `metadata.instagram`: `{type: "post", shouldShareToFeed: true}`.
- `text`: el caption completo, cerrando con los cinco hashtags. **Esto ES la descripción que
  sale publicada.** No lo sustituyas por un resumen: la primera línea trabaja para búsqueda,
  porque las cuentas profesionales están indexadas por Google desde julio de 2025.

Las URLs salen de
`https://raw.githubusercontent.com/acirl08/carruseles-ig/main/img/NN-MM.png`.
**Verifícalas con `curl` antes de crear el post.** GitHub es el único host que el entorno
alcanza, así que esta comprobación sí se puede hacer de verdad.

Después de crear, **lee la cola de vuelta con `list_posts`** y confirma fechas, número de
imágenes y que `schedulingType` quedó en `notification`. No confíes en la respuesta de
creación.

**Instagram topa los carruseles en 10 imágenes. Nunca más de diez.**

## La cola: cómo se rellena

Diez huecos. A cinco por semana son dos semanas de margen, así que rellenar es parte del
trabajo del domingo, no un extra.

1. `list_posts` con `status: ["scheduled"]` — cuántas hay y hasta cuándo llegan.
2. Huecos = `5000 − las que hay`. En la práctica: siempre hay.
3. Llenar con lo que **esté listo**, en este orden: los cortos de la semana si existen; si no,
   el siguiente largo sin programar.
4. **Nunca dejes huecos vacíos** habiendo contenido listo.
5. **Nunca borres un post programado para hacerle espacio a contenido que todavía no existe.**
   Y aquí "existe" significa **con sus PNG publicados en el repo**: un carrusel que solo vive
   en el entorno de trabajo no se puede programar, y borrar un largo por él deja un hueco de
   verdad.

## El intercambio de largos por cortos — ya autorizado

Isabela lo autorizó con estas palabras: *"quito de la cola los últimos largos para dejarle
espacio a los cortos y los repongo conforme se vacíe"*. **No hace falta volver a preguntar**:
se ejecuta en cuanto un corto tenga sus imágenes publicadas.

Se quita **desde el final hacia atrás**, uno por cada corto que entre.

## El orden real de la cola — úsalo, no lo deduzcas

Estado al 3 de septiembre de 2026: **diez posts, cero huecos.**

| `img/NN` | Publica | Tema | ID de Buffer |
|---|---|---|---|
| 01 | mar 8 sep | por qué olvida lo que ya le dijiste | `6a987662c0ae50dfa76604ca` |
| 02 | jue 10 sep | contesta con el mundo de hace meses | `6a9876961194449138864534` |
| 03 | mar 15 sep | sonaba perfecto, no era lo que pediste | `6a9876a5745b4eaed13c0c72` |
| 04 | jue 17 sep | el prompt mágico | `6a9876b41194449138864677` |
| 05 | mar 22 sep | misma pregunta, otra respuesta | `6a9876c4119444913886473c` |
| 06 | jue 24 sep | no aprende de lo que le corriges | `6a9876d4c88e5f6f6c0736ad` |
| 07 | mar 29 sep | te interrumpe o te deja hablando solo | `6a9876e48cf23942997e997d` |
| 08 | jue 1 oct | ves "pensando…" y bajas la guardia | `6a9876f48cf23942997e9a60` |
| 09 | mar 6 oct | el paper no miente: miente el puente | `6a987704c88e5f6f6c073a5d` |
| 10 | jue 8 oct | los 4 dólares la hora | `6a9877151194449138864d96` |

**Confirma siempre con `list_posts` antes de borrar.** Una tabla desactualizada te hace borrar
el carrusel equivocado — el registro tuvo 7 de 10 mal numerados y estuvo a punto de pasar.

## Lo que Instagram premia, verificado

- Las tres señales que más pesan son **tiempo de visualización, likes y sends**, todas
  **normalizadas por alcance**. Los sends pesan mucho: por eso el slide de cierre pide
  compartir.
- Los carruseles con música son elegibles para la pestaña de Reels. **La música no se puede
  poner por API** — solo desde la app. De ahí el modo notificación.
- Las cuentas profesionales (públicas, +18) están **indexadas por Google desde el 10 de julio
  de 2025**. La primera línea del caption trabaja para búsqueda.
- El tope de hashtags anunciado oficialmente el 18 de diciembre de 2025 es de **5**.
