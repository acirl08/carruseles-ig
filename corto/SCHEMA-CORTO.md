# Esquema del carrusel CORTO — `corto/data/sNN-slug.json`

Carril de **confianza**, no de alcance. Aquí Isabela sí aparece; en el largo nunca.
`node build-corto.mjs` lo convierte en 5-7 slides de 1080×1350.

La fuente original de esta spec es `carrusel-isaiscoding/references/slide-rules.md`.
**Ojo: el cuerpo del `SKILL.md` de ese skill se perdió** — solo queda el frontmatter y
las cuatro correcciones. `slide-rules.md` es la fuente de verdad hasta que se reescriba.

## Los siete beats

| # | `kind` | Rol | Campos |
|---|---|---|---|
| 1 | `portada` | Detener el scroll | `ts`, `hook` (va en MAYÚSCULAS por CSS; **debe nombrar a Claude**, envuélvelo en `<span class="o">` para el acento), `tape` (opcional) |
| 2 | `diagnostico` | "eso soy yo" | `ts`, `copy`, `boc` — el bocadillo lleva **la frase-mentira** que el lector se cuenta |
| 3 | `credibilidad` | Por qué escucharla | `ts`, `copy`, `boc`, **`verificado`** |
| 4 | `concepto` | La idea que viaja sola. El slide más guardable | `ts`, `copy`, `lista` (**2 o 3**, cada uno `{nombre, descripcion}`), `boc` opcional |
| 5 | `solucion` | El cómo, con Claude | `ts`, `copy`, `dato` (la línea sensorial, obligatoria), `boc` (prompt de ejemplo) |
| 6 | `resultado` | Qué cambia | `ts`, `copy`, `boc`, `pale` opcional |
| 7 | `cierre` | Pedir seguir y compartir | `ts`, `copy`, `ask`, `follow`, `send` |

Campos raíz: `id`, `titulo`, `audiencia`, `etiqueta` (`NEGOCIO` | `PERSONAL` |
`NEGOCIO/PERSONAL`, sale en la píldora de arriba a la derecha), `nota`, `caption`,
`captionVerificado` / `captionFuente` / `captionNoEsMetrica` (sólo si el caption los
necesita), `slides`.

`ts` es el tamaño base del titular en Bebas Neue. Guía: corto `120px`, medio `100px`,
largo `88px`. El motor lo reduce solo si aun así no cabe. **Tiene que ser exactamente
`NNpx`**: es el único campo que entra en un atributo HTML, y el validador lo rechaza si
trae cualquier otra cosa (un `ts` con comillas inyectaba atributos en el `<p>`).

`verificado` es **la firma de Isabela**, y es lo único que separa una frase cierta de una
inventada, porque nada en el pipeline puede comprobar lo que ella ve con sus clientes.
Se exige en dos casos, y sin ella el build sale con exit 1:

1. **Siempre** en el beat `credibilidad`, exista o no una frase sospechosa.
2. En **cualquier** slide, y también en el `caption`, cuyo texto haga una afirmación en
   primera persona sobre sus clientes, sus alumnos, su consultoría o sus pruebas:
   `mis clientas`, `los emprendedores que acompaño`, `trabajo con`, `lo veo todos los
   días`, `nadie me ha pasado`, `llevo años viendo`, `en mis pruebas`, `mi experiencia`…
   La lista viva está en `CLAIM`, arriba de `valida()` en `build-corto.mjs`. Va por texto
   y no por `kind` a propósito: la regla de fusión de abajo autoriza mudar "lo veo en los
   negocios que asesoro" al diagnóstico, y atada al `kind` esa mudanza colaba la frase.
   **`CLAIM` es un colador, no una red**: reconoce las formas que ya se usaron, no el
   idioma entero. Si escribes una paráfrasis que se le escapa, agrégala ahí y agrégale su
   caso en `pruebas/prueba-guardas.mjs`.

**Nunca la pongas tú.** Se pone cuando Isabela lee la frase y confirma que es cierta.
Ojo: `"en mis pruebas"` **no es un salvoconducto**, es una afirmación más — también pide
firma.

`fuente` respalda las cifras. Cualquier cifra en texto visible — dígitos o palabras
(`4 horas`, `cuatro horas`, `4h`, `500 pesos`, `40%`, `40 %`, `$300`, `nueve de cada
diez`) — necesita `fuente` con **texto** que diga de dónde sale (`"fuente": true` no
cuenta), o `"verificado": true` si el número es de ella. Si no, el build se cae.

**Lee bien qué es esto y qué no.** `fuente`, `noEsMetrica` y `verificado` son
**declaraciones explícitas y atribuibles**, no verificaciones: nada comprueba que la
fuente exista ni que el número sea cierto. Lo que hace la regla es obligar a que alguien
lo declare a propósito en vez de que una cifra inventada se cuele sin que nadie la mire.
Un `85/85` verde **no garantiza que las cifras publicadas sean ciertas** — garantiza que
ninguna pasó sin que alguien la declarara.

**Cuando la regla marque un número que no es una métrica** — cuenta pasos, intentos o
ejemplos ("le cambiaste el prompt tres veces") — la salida es `noEsMetrica` con una frase
que explique por qué. **Nunca `verificado`.** Firmar de más devalúa la firma, que es lo
único sobre lo que descansa todo esto. Y si el falso positivo se repite, **arregla la
regla, no el copy**: ya pasó una vez que el validador le reescribió una frase a Isabela,
y el orden de autoridad es al revés — lo que ella dice manda sobre la spec, la spec sobre
las pruebas, las pruebas sobre el código.

El `caption` pasa por las dos reglas con sus propios campos raíz: `captionVerificado` y
`captionFuente`. Antes era terreno libre — y es el texto más largo del archivo.

`boc` acepta `<em>` para meter Instrument Serif en cursiva dentro del bocadillo naranja —
es el único lugar donde va esa tipografía en este formato.

## Bajar de 7 a 6 o 5

Se fusionan beats, nunca se recortan:

- Diagnóstico + Credibilidad: el diagnóstico cierra con "lo veo con los negocios que
  asesoro". Esa frase sigue necesitando `"verificado": true` en el slide donde acabe.
- Solución + Resultado: el paso del proceso incluye el dato de resultado en el bocadillo.
- Concepto + Solución: la lista es el flujo.

**Nunca fusionar la portada ni el cierre.** Esos van solos siempre.

## Diferencias con el largo (no las confundas)

| | Corto | Largo |
|---|---|---|
| Titular | **Bebas Neue en MAYÚSCULAS** | Instrument Serif |
| Instrument Serif | solo dentro del bocadillo | los titulares |
| Voz | **primera persona**, Isabela aparece | segunda persona, nunca aparece |
| Pichu | **no lleva** | 6 slides obligatorios |
| Óvalo numerado | **no lleva** | slides 02–10 |
| Subrayado del titular | **no lleva** | siempre |
| Píldora NEGOCIO/PERSONAL | **sí**, arriba derecha | no |
| Botón de flecha → | **sí**, abajo derecha | no |
| Puntitos de progreso | no | sí, 02–10 |

## Lo que este motor NO hace, por decisión de Isabela (2 de septiembre de 2026)

`slide-rules.md` y `cta-patterns.md` describen un cierre de conversión: `comenta "KEYWORD" 👇`
y te mando el entregable por DM, con gancho a asesoría. **Eso está apagado.** El `cierre`
pide seguir y compartir, igual que el largo. Si algún día se enciende, el material ya está
escrito en `cta-patterns.md` y `cheat-sheets.md` — pero no lo enciendas por tu cuenta.

La portada del skill original se hace en Canva con una foto de Isabela. **Este motor la
genera sin foto**, para que la producción no dependa de ella.

## Reglas de contenido que hay que validar, no solo renderizar

- **Nunca inventar métricas.** El validador lo exige: toda cifra necesita `fuente` con
  texto o la firma de Isabela (ver arriba). Un hedge en el copy **no** exime — `"en mis
  pruebas"` es otra afirmación suya, y de hecho también pide firma.
- **Nunca posicionar a Isabela como alguien que perdió clientes, falló o tuvo deudas.**
  `cta-patterns.md` trae un template que dice "En 2019 tenía una deuda de [MONTO]":
  **no se usa.** Choca de frente con esta regla.
- El verbo en contexto B2B es **"asesoro"**, no "ayudo".
- Sin título técnico (AI engineer, DevOps) ante audiencia no técnica.
- El prompt de ejemplo del slide 05 muestra que es real y ejecutable; no es el prompt completo.
- Handle `@isaiscoding.ia`. Cinco hashtags en el caption, `#claudeai` siempre entre ellos.
- El typo `#gastosintelgente` de `cta-patterns.md` va corregido a `#gastosinteligente`.

## Verificación

```
node pruebas/prueba-guardas.mjs   # ¿las guardas siguen vivas? 85 casos: rotos a propósito, y legítimos
node build-corto.mjs              # data/*.json -> build/*.html
node shots.mjs                    # build/*.html -> out/sNN/*.png a 1080×1350
node check-corto.mjs              # desbordes, escala baja, aire, choques, slides en blanco
```

`prueba-guardas.mjs` va **primero**. Rompe el mazo a propósito (kind desconocido,
credibilidad sin firmar, lista vacía, `ts` inyectado, cifra sin fuente, 4 slides, portada
sin Claude, 6 hashtags, campo faltante, slide en blanco, slide famélico, `</script>` en el
copy) y exige que el pipeline cache cada caso. Si sale menos de 85/85, hay una guarda
apagada y el resto del pipeline no vale nada. **Cuando agregues una guarda, agrégale su
caso roto aquí**; una guarda sin prueba es un comentario.

La suite tiene **dos mitades**, y la segunda importa igual: además de lo que el pipeline
debe rechazar, prueba lo que debe **dejar pasar** (`$1` y `$2` como marcadores en un
prompt, "el trabajo con IA", "lo veo así de simple", "docenas de formas"). Una suite que
sólo prueba rechazos no puede ver el día en que la regla empieza a rechazar de más —
que es el fallo que se repitió tres rondas seguidas aquí.

Si el paso 2 se cae con "necesita verificado", **no es un bug: es el pipeline haciendo su
trabajo**. Nadie firma por Isabela. Los pasos 3 y 4 son inalcanzables hasta que ella lea
la frase y confirme, y por eso `out/` sólo debe existir para mazos que ya construyeron
desde `data/`. Si necesitas enseñarle un PNG para que decida, constrúyelo con
`CORTO_DATA`/`CORTO_BUILD` apuntando a una copia temporal en `/tmp` y bórrala después:
un render firmado a mano dentro del repo es exactamente la trampa que esto viene a cerrar.

`check-corto.mjs` tiene que decir "sin hallazgos", **y aun así hay que mirar los PNG**.

Umbrales de aire, y por qué están donde están:

- La portada está **exenta** de la guarda de aire: el hueco bajo la cinta (~270px) es el
  espacio del asterisco, a propósito.
- Hueco **entre** dos elementos: más de 300px es defecto.
- Aire **absoluto** arriba o abajo del bloque: más de 400px es defecto. Ojo con la trampa
  que ya cayó una vez: `.inner` usa `justify-content:center`, así que medir el
  *desbalance* (`|arriba − abajo|`) mide una constante de CSS que vale siempre ~5, no la
  composición. El mazo real llega a **352px** por lado (slide 03 de s01); el caso roto que
  hay que atrapar son 439/444. Si mueves el umbral, **mide el mazo otra vez** en vez de
  copiar el número de aquí: la cifra anterior (333) venía de un mazo viejo y quedó falsa.
