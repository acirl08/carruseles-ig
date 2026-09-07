# 03 · Carrusel largo (10 slides)

El carril de **alcance**. Segunda persona, Isabela no aparece, explica **por qué** falla la IA.
Se publica martes y jueves a las 7 pm de Monterrey.

## Archivos

| Archivo | Qué hace |
|---|---|
| `engine.js` | El motor: CSS, primitivas SVG y el render por `kind`. ~29 KB |
| `doodles.js` | La biblioteca de ilustraciones line-art |
| `pichu/` | 60 archivos: las poses de la ninfa |
| `poses.json` | 54 poses catalogadas con su descripción |
| `fonts/` | Bebas Neue, Instrument Serif (roman + itálica), DM Sans (roman + itálica) |
| `data/cNN-slug.json` | Un archivo por carrusel. Diez producidos |
| `build.mjs` | `data/*.json` → `build/*.html` autocontenidos (las fuentes van en base64) |
| `grid.mjs` | `build/*.html` → PNG a 1080×1350 |
| `check.mjs` | Verificador de geometría |
| `check-titulares.py` | Verificador de los titulares del slide 02 |
| `SCHEMA.md` | **La spec. Se sigue al pie de la letra** |

## Los 10 beats

| n | `kind` | Rol |
|---|---|---|
| 1 | `cover` | portada: `eyebrow` en mayúsculas, `hook`, `tape` |
| 2 | `ciclo` | **la segunda portada** (ver abajo). 4 pares causa→efecto |
| 3 | `quotes` **o** `costo` | tres frases entre «» + la frase de alivio |
| 4 | `concepto` | la definición. El slide más guardable |
| 5 | `split` **o** `stack` | tres líneas + banda |
| 6 | `negs` | tres "No significa…" + UNA frase de lo que sí |
| 7 | `nums` | tantos números como prometa el titular |
| 8 | `vs` **o** `caso` | comparación de dos columnas, o un caso narrado |
| 9 | `checks` **o** `list6` | exactamente 6 |
| 10 | `final` | mantra + pregunta abierta + seguir + compartir |

**Cada carrusel debe usar al menos dos alternas** para no verse igual que sus hermanos.

### Por qué son 10 y no 11

El esquema original tenía 11, con `cierre` y `cta` separados. **La API de publicación de
Instagram topa los carruseles en 10 imágenes**, así que los dos últimos se fusionaron en
`final`. Lo único que se perdió fue la pregunta "¿Te sirvió esto?"; el resto sobrevivió. Es lo
mismo que hace @noveira.dev.

`SCHEMA.md` describía 11 hasta el 3 de septiembre de 2026, cuando se corrigió. Si encuentras
un `cta` en algún sitio, es documentación vieja.

## El slide 02 es una segunda portada

El detalle de formato más importante del carril largo, y viene de una declaración de Adam
Mosseri (octubre de 2024): quien se sale de un carrusel **a menudo** lo vuelve a ver empezando
por el slide 2, no por el 1. *(Él dijo "often", sin dar un número — no lo conviertas en una
estadística.)*

Consecuencia práctica: **el slide 02 tiene que funcionar solo**, sin haber visto el 01. Su
titular tiene que decir de qué habla. Por eso hay un verificador dedicado.

`python3 check-titulares.py` comprueba tres reglas, y las tres se rompieron al menos una vez:

1. **Ancla de dominio** — el titular dice de qué habla para quien no vio el 01.
2. **Cero repeticiones de 3+ palabras seguidas** contra cualquier otro texto del mismo
   carrusel, incluido el `eyebrow` y el `hook` del slide 01.
3. **Arranques distintos** entre los diez: las dos primeras palabras no se repiten.

## El pipeline

```bash
node build.mjs             # data/*.json -> build/*.html
node grid.mjs              # build/*.html -> PNG 1080x1350
node check.mjs             # geometría. Tiene que decir "sin hallazgos"
python3 check-titulares.py # titulares del 02. Tiene que decir "sin hallazgos"
# luego: mirar los PNG, y lanzar un agente a refutar
```

## Qué mide `check.mjs`, y por qué

**Solo la ruta del arte mide la tinta**: baja hasta el `<g>` dentro del SVG, porque un `<g>`
puede tener una caja enorme y dibujar cuatro trazos en una esquina. Ahí medir la caja daba
falsos negativos y falsos positivos a la vez, y ese error ya se cometió.

El resto de `check.mjs` **sí mide cajas** (`scrollHeight` del contenedor, y el *bounding box* de
cada hijo de `.inner` para el detector de huecos). No es una afirmación general sobre el
verificador: es una corrección puntual de la ruta del arte.

## Lo que sigue roto y no se ha arreglado

- **Titulares idénticos entre carruseles** en los slides 06 y 09: *"Qué significa esto y qué
  no"* aparece en seis de los diez, y *"Lo que sí te conviene recordar"* en seis. Está
  detectado y sin corregir. Los diez ya están programados en Buffer con esos titulares.
- **c07 y c09 comparten el mismo caso** en su slide 08.
