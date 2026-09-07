# `recap` — el resumen semanal de noticias

**Estado: propuesta.** Tercer carril, además del largo y el corto.

## Cuatro variantes, cuatro publicaciones

No es un formato: son **cuatro**, cada uno su propia publicación y su propio público. Igual
que el largo y el corto conviven hoy con reglas distintas.

| `variante` | Slides | Para quién | Qué lleva cada noticia |
|---|---|---|---|
| `negocio` | 7 | quien tiene un negocio y usa IA | qué pasó + **qué cambia para ti** |
| `mecanismo` | 7 | quien quiere entender | qué pasó + **por qué pasa** |
| `accionable` | 5-6 | quien quiere hacer algo hoy | qué pasó + **qué haces mañana** |
| `completo` | 10 | quien quiere no perderse nada | qué pasó, sin más |

**El mismo motor de señal alimenta las cuatro**, y de ahí sale la eficiencia: se buscan las
noticias una vez y se reparten según lo que cada variante pide. La misma noticia puede salir
en `completo` como una línea y en `mecanismo` como un slide explicado.

Ojo con una cosa: `05-MOTOR-DE-SENAL.md` detecta duplicados **por el arreglo**. Dos variantes
que expliquen la misma noticia con el mismo enfoque son el mismo post dos veces. Lo que las
separa tiene que ser el **ángulo**, no solo el recorte.

`completo` es el más parecido a la referencia, pero **no puede llegar a sus 17**: la API de
Instagram topa los carruseles en 10 imágenes (`03-CARRUSEL-LARGO.md`), así que con portada y
cierre caben **8 noticias**. evolving.ai publica 17 porque usa varias publicaciones; aquí, si
una semana hay más de ocho, se parte en dos.

Es legítimo como formato aparte —cubre a quien solo quiere el titular— pero **no debe ser el
único**: `11-DECISIONES.md` dice que no se copian estrategias de competidores, y publicar solo
ese sería exactamente eso.

## Los slides

| n | `kind` | Rol |
|---|---|---|
| 1 | `portadaRecap` | la semana en una frase + "desliza" |
| 2..n-1 | `noticia` | una por slide |
| n | `cierreRecap` | pregunta abierta + seguir + compartir |

## El slide `noticia`

| Campo | Obligatorio | Qué es |
|---|---|---|
| `titular` | sí | qué pasó, en mayúsculas, máximo 8 palabras |
| `resumen` | sí | 2-3 líneas. Qué es, sin adjetivos |
| `mecanismo` | en `mecanismo` | **por qué** pasa. Una frase |
| `paraTi` | en `negocio` | qué cambia para el negocio de quien lee |
| `accion` | en `accionable` | qué puede hacer mañana. Un verbo al principio |
| `fuente` | **siempre** | URL. Sin esto no construye, en ninguna variante |
| `imagen` | no | ver la cascada |

El campo obligatorio depende de la variante: `negocio` sin `paraTi` no construye, igual que
`mecanismo` sin `mecanismo`. `completo` solo pide titular, resumen y fuente.

`fuente` es obligatorio y va en el JSON, no en el slide: una noticia sin URL no se puede
comprobar, y `02-MARCA.md` prohíbe publicar lo que no se puede verificar.

## La cascada de imagen

Por cada noticia, en este orden:

1. **Captura oficial** — del blog o kit de prensa de la propia empresa. Va con `imagen.url` y
   `imagen.licencia` describiendo de dónde salió. **Requiere aprobación de Isabela**: nada
   automático descarga material de terceros.
2. **Line-art** — lo dibuja el motor. Sin créditos, sin derechos, y es lo que manda
   `02-MARCA.md`.
3. **Higgsfield** — `nano_banana_pro`, 2 créditos. Para cuando la noticia merece algo propio.
4. **Solo texto** — tipografía y retícula, como los carruseles actuales.

**Nunca**: fotos de agencia, capturas de video de terceros, retratos de prensa. La referencia
las usa; aquí no, porque el sistema las publicaría 52 veces al año sin que nadie revise el
derecho de cada una.

## Cifras

Las noticias traen cifras ("$12.9B", "45% menos"). Cada una necesita `fuente` en su slide —
la misma regla del carril corto, y ahora también la comprueba `check-cifras.mjs` en el largo.
