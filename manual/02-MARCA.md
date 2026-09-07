# 02 · Marca — lo que no se negocia

Estas reglas ganan a cualquier brief, a cualquier idea buena y a cualquier verificador. El
orden de autoridad es: **lo que dice Isabela > estas reglas > la spec > las pruebas > el
código**. Si una regla y una prueba chocan, gana la regla y se arregla la prueba.

## Identidad visual

| | |
|---|---|
| Acento | `#C4613A` (terracota) |
| Fondo | `#F7F6F4` |
| Tinta | `#111` · gris `#555` |
| Pálido | `#F0D5CA` |
| Retícula | `rgba(0,0,0,.055)`, cuadro de 54px |
| Lienzo | 1080 × 1350 (4:5) |
| Tipos | Bebas Neue · Instrument Serif · DM Sans |
| Símbolo | el asterisco ✳ |
| Handle | **`@isaiscoding.ia`** |
| Sitio | `isaiscoding.com` |

Los tres tipos tienen trabajos distintos y **no se intercambian entre carriles**: en el largo
los titulares van en Instrument Serif; en el corto van en Bebas Neue en mayúsculas, e
Instrument Serif solo aparece dentro del bocadillo naranja.

**La ilustración es line-art monolineal**: contorno de un solo grosor, relleno plano, sin
sombra. Se rechazó explícitamente el lápiz de color con sombreado, porque la ilustración
tiene que compartir trazo con los marcos y las flechas y no verse pegada encima.

**Pichu** es la ninfa amarilla, hembra, una de las tres aves de Isabela (dos ninfas y un ring
neck verde). Aparece en el carril largo porque la audiencia ya la reconoce por el ruido de
fondo de sus videos. **No es un personaje con arco narrativo**: es una ilustración
acompañante. En el carril corto no aparece.

## Voz

- **Largo: segunda persona. Isabela no aparece.** El lector es el protagonista.
- **Corto: primera persona. Isabela aparece** — ese carril existe para construir confianza.
- **El verbo en contexto B2B es "asesoro", no "ayudo".**
- **Sin título técnico** (AI engineer, DevOps) ante audiencia no técnica.
- Nunca se le atribuye intención a la máquina: no "miente", no "engaña", no "se hace la
  tonta". Son mecanismos, y explicar el mecanismo es todo el valor del carril largo.

## Nunca inventar métricas

La regla más importante, porque una audiencia técnica detecta un número inventado y ya no te
cree nada más.

- Un número sin fuente verificable **no va**.
- **"Siempre", "todos", "ninguno", "cada vez" son cifras disfrazadas.** Cuentan igual.
- Un hedge en el copy no exime: *"en mis pruebas"* es otra afirmación de Isabela, y por lo
  tanto también pide su firma.
- **Ojo: solo el motor del corto lo comprueba.** En el largo esta regla se cumple a mano —
  y hay captions ya programados con cifras duras ("151 milisegundos", "28 investigadores",
  "8 horas", "150 métodos") que ningún script respaldó. Vinieron de fuentes leídas, pero nada
  lo verifica automáticamente.
- En el motor del corto esto está **hecho código**: una cifra en texto visible necesita
  `fuente` (texto que diga de dónde sale), o `noEsMetrica` (si el número cuenta pasos y no
  afirma un resultado), o `verificado: true`. Sin nada de eso, el build se cae.

**Ojo con lo que eso significa.** `fuente`, `noEsMetrica` y `verificado` son **declaraciones
atribuibles, no verificaciones**: nada comprueba que la fuente exista. Lo que hace la regla es
impedir que una cifra pase sin que alguien la declare a propósito.

## Nunca posicionar a Isabela como alguien que perdió

No se la presenta como alguien que perdió clientes, falló o tuvo deudas. El skill `carrusel-isaiscoding` trae, en
`references/slide-rules.md`, una plantilla que empieza *"En 2019 tenía una deuda de [MONTO]"*:
**no se usa**, choca de frente con esta regla.

## Caption y hashtags

- **Exactamente 5 hashtags**, y `#claudeai` siempre entre ellos.
- El typo `#gastosintelgente` que arrastra `cta-patterns.md` va corregido a
  `#gastosinteligente`.
- El caption **es** la descripción que sale publicada. No se sustituye por un resumen. Su
  primera línea trabaja para búsqueda: las cuentas profesionales están indexadas por Google
  desde julio de 2025.
- Nada de *"comenta SÍ y te mando la guía"*. Es engagement bait.

## Cero producto

En los slides de contenido no hay oferta, no hay servicio, no hay enlace. El cierre pide
seguir y compartir, nada más. Esto es una decisión de etapa: la prioridad es credibilidad, no
conversión, y se puede revisar cuando ella lo decida.

## La firma

En el carril corto, cualquier frase que afirme algo sobre los clientes, los alumnos, la
consultoría o las pruebas de Isabela **necesita que ella la confirme**. El motor la exige y el
build se cae sin ella. Detalle completo en `04`.

**Nunca la pongas tú, y nunca la uses para silenciar un falso positivo del validador.** Firmar
de más devalúa la firma, que es lo único que separa una frase cierta de una inventada.
