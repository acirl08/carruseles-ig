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
| `completo` | hasta 20 | quien quiere no perderse nada | qué pasó, sin más |

**El mismo motor de señal alimenta las cuatro**, y de ahí sale la eficiencia: se buscan las
noticias una vez y se reparten según lo que cada variante pide. La misma noticia puede salir
en `completo` como una línea y en `mecanismo` como un slide explicado.

Ojo con una cosa: `05-MOTOR-DE-SENAL.md` detecta duplicados **por el arreglo**. Dos variantes
que expliquen la misma noticia con el mismo enfoque son el mismo post dos veces. Lo que las
separa tiene que ser el **ángulo**, no solo el recorte.

### El tope de 10 no aplica aquí, y esto corrige lo que decía `03`

Son **dos topes distintos**, y confundirlos costó una vuelta:

| Vía | Tope |
|---|---|
| API de publicación (la que usa Buffer) | **10** |
| App de Instagram, publicando a mano | **20**, desde agosto de 2024 |

`03-CARRUSEL-LARGO.md` dice que el esquema bajó de 11 a 10 slides porque *"la API de
publicación de Instagram topa los carruseles en 10 imágenes"*. Eso sigue siendo cierto **para
la API**. Pero este sistema **no publica por API**: Buffer avisa e Isabela publica desde el
teléfono, porque la música no se puede poner por API (`07-AUTOMATIZACION.md`, paso 13).

Así que el tope real aquí es **20**, y por eso `@evolving.ai` puede publicar 17 en una sola
pieza. Vale la pena revisar si el carril largo también podría volver a 11 por lo mismo.

*(Ojo: el 20 no está en todas las cuentas — se reporta que algunas antiguas siguen en 10.
Compruébalo en la app antes de armar un mazo de 17.)*

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

## El pipeline

```bash
cd recap
node build-recap.mjs      # valida, comprueba las fuentes ABRIÉNDOLAS, y construye
node shots-recap.mjs      # HTML -> PNG 1080x1350
cd ../corto && CORTO_BUILD=../recap/build node check-corto.mjs   # geometría
```

`build-recap.mjs` corre `comprobar-fuentes.mjs` **por dentro**, no como paso aparte: el fraude
del primer mazo pasó porque nadie se acordó de correrlo. Si una fuente no respalda su slide,
no se construye nada.

`--sin-fuentes` lo salta para trabajar sin red, y avisa en cada corrida. No publiques así.

## Cifras

Las noticias traen cifras ("$12.9B", "45% menos"). Cada una necesita `fuente` en su slide —
la misma regla del carril corto, y ahora también la comprueba `check-cifras.mjs` en el largo.
