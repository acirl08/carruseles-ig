# 04 · Carrusel corto (5-7 slides)

El carril de **confianza**. Primera persona, Isabela aparece, dice **qué hacer**. Lunes,
miércoles y viernes a las 7 pm de Monterrey. Construido el 2 y 3 de septiembre de 2026.

## Archivos — todo vive en `corto/`

| Archivo | Qué hace |
|---|---|
| `engine-corto.js` | CSS + render. Bebas Neue en mayúsculas, bocadillo naranja, píldora, flecha |
| `build-corto.mjs` | **El validador y el compilador.** Aquí vive casi toda la inteligencia |
| `check-corto.mjs` | Verificador visual: área segura, choques, aire, slides en blanco |
| `shots.mjs` | HTML → PNG 1080×1350 |
| `pruebas/prueba-guardas.mjs` | **85 casos.** Va primero, siempre |
| `SCHEMA-CORTO.md` | La spec |
| `data/sNN-slug.json` | Un archivo por carrusel |

## Los siete beats

| n | `kind` | Rol |
|---|---|---|
| 1 | `portada` | detener el scroll. El `hook` **debe nombrar a Claude** |
| 2 | `diagnostico` | "eso soy yo". El bocadillo lleva **la mentira que el lector se cuenta** |
| 3 | `credibilidad` | por qué escucharla. **Siempre necesita `verificado`** |
| 4 | `concepto` | la idea que viaja sola. `lista` de 2 o 3 |
| 5 | `solucion` | el cómo, con un prompt de ejemplo real |
| 6 | `resultado` | qué cambia |
| 7 | `cierre` | pregunta + seguir + compartir |

Para bajar a 6 o 5 **se fusionan beats, nunca se recortan**. Nunca se fusionan la portada ni
el cierre.

## La firma de Isabela — el corazón del sistema

Nada en el pipeline puede comprobar lo que ella ve con sus clientes. Así que **cualquier frase
en primera persona sobre sus clientes, sus alumnos, su consultoría o sus pruebas necesita
`"verificado": true`**, y sin eso el build sale con exit 1.

Se exige en dos casos:

1. **Siempre** en el beat `credibilidad`, exista o no una frase sospechosa.
2. En **cualquier** slide, y también en el `caption`, cuyo texto haga una afirmación de ese
   tipo. Va por texto y no por `kind` a propósito: la regla de fusión permite mudar *"lo veo en
   los negocios que asesoro"* al diagnóstico, y atada al `kind` esa mudanza colaba la frase.

**Reglas de uso, que ya se rompieron:**

- **Nunca la pongas tú.** Se pone cuando ella lee la frase y confirma que es cierta.
- **`"en mis pruebas"` no es un salvoconducto.** Es otra afirmación suya — también pide firma.
- **Nunca la uses para silenciar un falso positivo del validador.** Para eso está
  `noEsMetrica`. Firmar de más devalúa la firma.
- **Si un falso positivo se repite, arregla la regla, no el copy.** Ya pasó una vez que el
  validador le reescribió una frase a Isabela para no tener que corregir un regex.

## Las cifras

Cualquier cifra en texto visible — dígitos o palabras: `4 horas`, `cuatro horas`, `4h`,
`500 pesos`, `40%`, `$300`, `nueve de cada diez` — necesita una de tres cosas:

| Campo | Cuándo | Qué significa |
|---|---|---|
| `fuente` | el número viene de algún lado | texto que diga de dónde. `true` no cuenta |
| `noEsMetrica` | el número cuenta pasos, intentos o ejemplos | texto que diga por qué no afirma un resultado |
| `verificado` | el número es de ella | su firma |

Para el caption, los mismos con prefijo: `captionFuente`, `captionNoEsMetrica`,
`captionVerificado`.

## Las 85 guardas

`node pruebas/prueba-guardas.mjs` **va antes que nada**. Rompe el mazo a propósito y exige que
el pipeline lo cace. Si da menos de 85/85, **mira cuál caso falló antes de concluir nada**: un
caso de rechazo caído significa una guarda apagada; uno de los que deben pasar significa que
una regla rechaza de más. Son problemas opuestos con arreglos opuestos.

La suite tiene **dos mitades**, y la segunda importa igual:

- **Lo que debe rechazar**: kind desconocido, credibilidad sin firmar, lista vacía, `ts`
  inyectado, cifra sin respaldo, 4 slides, portada sin Claude, 6 hashtags, slide en blanco,
  slide famélico, `</script>` en el copy, un titular que cuenta mal los items…
- **Lo que debe dejar pasar**: `$1` y `$2` como marcadores en un prompt, "el trabajo con IA",
  "lo veo así de simple", "docenas de formas", una cifra con fuente citada.

**Esa segunda mitad existe por un fallo que se repitió tres rondas seguidas**: una suite que
solo prueba rechazos no puede ver el día en que la regla empieza a rechazar de más.

**Cuando agregues una guarda, agrégale su caso roto.** Una guarda sin prueba es un comentario:
se comprobó apagando cada una y viendo que la suite baja.

## Verificación visual

`check-corto.mjs` mira nueve cosas, cada una motivada por un defecto real:

| Guarda | Nació de |
|---|---|
| slide sin tinta | un `kind` válido que el motor no sabía pintar producía un artboard en blanco, y el check decía "sin hallazgos" |
| `kind` desconocido | el mismo caso, por si queda tinta |
| área segura (150 … 1215) | el titular se montaba sobre el handle y el pie |
| choque contra el chrome | caja contra caja |
| recorte horizontal | una palabra larga se cortaba a media letra |
| la palabra "undefined" | un campo faltante pintaba un bocadillo que decía "undefined" |
| escala forzada ≤ 0.80 | el titular encogía sin motivo |
| hueco > 300px entre elementos / aire > 400px por lado | 552px muertos pasaban limpios |
| error de página / conteo de slides | un TypeError dejaba la página vacía y el check aprobaba |

**Y aun así hay que mirar los PNG.** El defecto de *"Un archivo. CUATRO cosas."* sobre una
lista de tres salió mirando, no verificando — y ahora sí tiene guarda.

## El pipeline

```bash
node pruebas/prueba-guardas.mjs   # 85/85 o no sigas
node build-corto.mjs              # si se cae pidiendo verificado, NO es un bug
node shots.mjs                    # PNG
node check-corto.mjs              # "sin hallazgos"
# mirar los PNG · agente refutador · entregar a Isabela
```

`CORTO_DATA`, `CORTO_BUILD` y `CORTO_OUT` permiten apuntar a directorios temporales. Sirven
para enseñarle un PNG firmado a mano en `/tmp` para que decida — **nunca para dejar un render
sin firmar dentro del repo**.
