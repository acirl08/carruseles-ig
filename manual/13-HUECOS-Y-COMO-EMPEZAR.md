# 13 · Huecos del manual, y qué hacer cuando algo se rompe

Este archivo existe porque un juez adversario leyó los otros doce como si llegara hoy y anotó
lo que **no podía hacer** con ellos. Está aquí para que nadie descubra los huecos a mitad de
un domingo.

---

## Parte A — Lo que se puede hacer ahora mismo

### El motor ya está en el repo — no hay zip que subir

Hecho el 7 de septiembre de 2026: `motor/`, `corto/`, `fonts/` y los siete `img/s01-*.png`,
106 archivos. Comprobado contra `raw.githubusercontent.com`, no de memoria.

Los siete zips del directorio de trabajo **ya no sirven para el repo**. Si alguno vuelve a
hacer falta, `manual-isaiscoding.zip` es este manual; el resto es historia.

Para comprobar que sigue en pie:

```bash
for p in motor/engine.js corto/build-corto.mjs corto/SCHEMA-CORTO.md img/s01-01.png; do
  printf '%-28s ' "$p"
  curl -sS -o /dev/null -w '%{http_code}\n' \
    "https://raw.githubusercontent.com/acirl08/carruseles-ig/main/$p"
done
```

Los cuatro tienen que dar **200**.

### Correr el motor fuera del entorno donde se construyó

La ruta de Chromium estaba fija en `/opt/pw-browsers/chromium`, que solo existe en aquel
contenedor. Ahora los cuatro sitios leen `CHROMIUM_PATH`:

```bash
export CHROMIUM_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"
cd corto && node pruebas/prueba-guardas.mjs     # 85/85
```

### Qué hacer si un verificador falla

| Falla | Qué significa | Qué hacer |
|---|---|---|
| `build-corto.mjs` pide `verificado` | una frase afirma algo sobre los clientes o las pruebas de Isabela | **mándale la frase y espera.** No la firmes tú, no reescribas el texto |
| `build-corto.mjs` pide `fuente` o `noEsMetrica` | hay una cifra sin respaldo | si afirma un resultado → `fuente` con texto, o su firma. Si cuenta pasos → `noEsMetrica` explicando por qué |
| `prueba-guardas.mjs` da menos de 85/85 | **depende de qué mitad falló** | si falló un caso de **rechazo**, una guarda está apagada: para y arréglala. Si falló uno de los que **deben pasar**, una regla rechaza de más: **arregla la regla, no el copy**. Las demás guardas siguen vivas |
| `check-corto.mjs` dice "tinta sube/baja a y=" | el texto se sale del área segura | baja el `ts` de ese slide, o acorta el titular |
| `check-corto.mjs` dice "escala forzada" | el slide entero tuvo que encoger a 0.80 o menos | **casi nunca es el titular**: `--ts` solo dimensiona el titular, `--sc` encoge todo. Medido: acortar un titular a tres letras no mueve el número. Recorta el `copy`, el `boc` o la `lista`, o parte el beat en dos |
| `check-corto.mjs` dice "slide vacío de contenido" | hay más de 400px de aire por lado | **subir el `ts` o alargar el bocadillo casi no sirve** (medido: de 439px baja solo a 402 y 419). El slide necesita un elemento más: añade el `dato`, o la `lista`, o fusiona este beat con el siguiente |
| `check-corto.mjs` dice "SIN TINTA" | el artboard salió en blanco | casi siempre es un `kind` que el motor no sabe pintar |
| `check.mjs` (largo) dice algo de **texto** (desborde, escala) | geometría del titular o del cuerpo | acortar el texto o bajar el `ts` |
| `check.mjs` (largo) dice algo de **arte** ("arte bajo y=1205", "arte encima de pie", "marco inflado") | la ilustración, no el texto | se arregla con `art.pos` y `art.h`, o con la caja. **El `ts` no lo toca** |
| `check-titulares.py` reporta algo | el titular del slide 02 repite palabras o arranca igual que otro | reescríbelo. **No relajes el verificador** |

**Regla general que ya se rompió una vez**: si el verificador marca un **falso positivo**,
gana el texto y se arregla la regla. Si el hallazgo es **verdadero** —una cifra sin fuente, una
frase sin firmar— cambiar el texto para callar al validador es justo el fraude que el sistema
existe para impedir. Decide primero cuál de los dos es.

### Qué hacer si la firma no llega antes del día de publicación

El mazo **no construye**, así que no hay nada que publicar. En orden:

1. **Reescribe la frase sin la afirmación** — y ojo con la diferencia: reescribir *para esquivar
   el validador* está prohibido; reescribir porque **decides no hacer esa afirmación** es legítimo
   y es lo que el propio error sugiere. Casi siempre se puede: *"Lo veo en los negocios
   que asesoro"* → algo que no afirme nada sobre sus clientes. El carrusel pierde fuerza pero
   se publica.
2. **Cambia ese corto por otro que ya esté firmado.**
3. **Publica menos esa semana** y dilo. Cuatro publicaciones honestas valen más que cinco con
   una frase inventada.

**Lo que nunca**: firmar por ella, o esquivar el validador.

### Qué hacer si la corrida del domingo se cae a medias

Cada disparo arranca vacío y **no hay reanudación automática**. Si se cayó:

1. Mira qué quedó: `list_posts` dice qué se programó, y el repo dice qué imágenes existen.
2. **Nada se publica solo**, así que una caída a medias no puede haber publicado nada malo.
3. Vuelve a correr con `fire_trigger` sobre `trig_01XJz1eEEu4aDxcPGphJhFUE`, o produce a mano.
4. Antes de reprogramar algo, comprueba con `list_posts` que no quedó duplicado.

---

## Parte B — Lo que este manual NO explica, y hay que resolver con Isabela

Son huecos reales. Están aquí en vez de disimulados.

### 1 · Dónde vive el backlog — TIENE SITIO, FALTA EL CONTENIDO

Desde el 7 de septiembre vive en **`backlog/` del repo**, con verificador:

```bash
node backlog/check-backlog.mjs
```

`publicados.json` ya trae los 13 temas con su mecanismo, sacado del slide `concepto` de cada
mazo. `pendientes.json` **está vacío a propósito**: los 22 cortos y el backlog de Pilar 2
nunca estuvieron en un sitio alcanzable, así que la estructura existe pero **el contenido lo
pone Isabela**.

**Va en el repo y no en una carpeta local** porque el domingo arranca en una sesión vacía, sin
su Mac: solo alcanza los dos documentos del proyecto y este repo. Un Doc o un Notion tampoco
sirven — `WebFetch` pide aprobación humana por cada URL y un domingo desatendido se queda
esperando a alguien que no está.

Mientras `temas` siga vacío, la criba sigue con el fondo abierto y el motor **tiene que decirlo
en la entrega**, como manda `05`.

### 2 · Cómo se genera arte nuevo de Pichu — CERRADO

Está en **`motor/pichu/COMO-GENERAR-POSES.md`**, probado el 7 de septiembre generando una pose
real a partir de `p01`.

En corto: **`nano_banana_pro`** con una pose existente como `image_references` —desde que el
motor está en el repo, las 54 tienen URL pública—. **Soul no sirve**: es identidad de personas
fotorrealistas, no line-art. El prompt completo, los cuatro estados de cresta por bloque y qué
hay que rechazar están en ese archivo. 2 créditos por imagen.

**Requiere mirar el resultado.** En la prueba el ave salió mirando al lado contrario y con la
cresta más levantada que el `half mast` pedido. Sale reconociblemente Pichu, pero no es
automático a ciegas.

Lo que sigue siendo suyo: **si una pose entra al repo o no.** Aquí está cómo producir una
candidata, no el permiso para publicarla.

El campo `fallback` de cada `art` sigue dibujando un doodle si la pose no existe.

### 3 · Cómo se eligen las poses de un carrusel nuevo — CERRADO

Está documentado en `motor/SCHEMA.md`, sección `` ## `poses` ``, y desde el 7 de septiembre
ese archivo está en el repo. La regla es más detallada de lo que decía aquí:

- Una entrada por cada slide con `type:"pichu"` — **5 o 6 según el carrusel**, no fijo.
- `desc` va **en inglés**, una sola frase, con tres cosas: qué hace, con qué objeto, y el
  estado de la cresta.
- La cresta sigue el bloque emocional: **01-03** alerta (*fully upright, three feathers
  separated*), **04-05** duda (*half mast, tilted to one side*), **06-08** atención (*neutral,
  body faces front*), **09-10** calma (*relaxed and settled down*).
- El objeto tiene que ser **genérico y sin texto legible**.

Y `art.fallback` dibuja un doodle si la pose no existe: ponlo siempre.

### 4 · Cómo se escribe un caption — con verificador desde el 7 de septiembre

Sigue sin haber una regla de estilo escrita por Isabela, y este manual **no la inventa**. Lo
que sí hay ahora es `corto/check-caption.mjs`, que comprueba lo que ya era regla en `02` más
la regularidad medida sobre los trece captions publicados. Medido, no supuesto: **13 de 13**
cumplen las cuatro (cinco hashtags exactos, `#claudeai`, separador `⸻`, pregunta abierta).

```bash
cd corto && node check-caption.mjs        # los dos carriles
```

Caza: hashtags que no son cinco, repetidos, `#claudeai` ausente, el typo
`#gastosintelgente`, separador ausente, sin pregunta, engagement bait, título técnico,
*"ayudo"* en vez de *"asesoro"*, intención atribuida a la máquina, y primera línea demasiado
corta para buscarse.

**Lo que el verificador NO decide**: el tono, el orden de las ideas, ni si el gancho funciona.
Eso sigue siendo tuyo. La estructura observada en los publicados —síntoma en la primera
línea, un emoji, el mecanismo, la pregunta, `⸻`, los cinco hashtags— es descripción de lo que
hay, no una regla que alguien más pueda escribir por ti.

**Un falso positivo que ya apareció**: la regla de antropomorfismo marcó *"El paper no miente:
miente el puente"* de `c09`. El sujeto ahí es el titular periodístico, no el modelo, así que
ganó el copy y se arregló la regla — que es lo que manda `09`.

---

## Parte C — Cifras que este manual no puede verificar

Están en los otros archivos y son verdad hasta donde se sabe, pero **no se pueden comprobar
desde el entorno de trabajo**. Si alguna es load-bearing para una decisión nueva, confírmala
antes.

| Afirmación | Estado |
|---|---|
| Tope de 5 hashtags, anunciado el 18 dic 2025 | el tope **existe** y está reportado; la fecha exacta no se pudo confirmar |
| Cuentas profesionales indexadas por Google desde el 10 jul 2025 | **corroborado** en varias fuentes |
| *Journal of Marketing* 2025: diferenciarse gana a imitar | el estudio **existe** (Lysyakov et al., *Retailer Differentiation in Social Media*) — pero es sobre **minoristas en X/Twitter**, no sobre Instagram ni creadores. La conclusión no traslada directo |
| Mosseri, oct 2024: se reentra por el slide 2 "often" | no verificable aquí. Se maneja bien: se cita el "often" y no se convierte en estadística |
| Mosseri, ene 2025: sends entre las tres señales que más pesan | no verificable aquí |
| **~1.439 y ~344 hilos/día** en `community.openai.com` (`05`) | **la cifra más load-bearing del manual**: toda la regla de recencia descansa en ella, y el foro es inalcanzable desde aquí. La aritmética interna sí cuadra (1439/344 ≈ 4,2 = "cuatro veces más lento") |
| "las cuatro rondas del motor corto y las tres del de señal", "todas y cada una encontraron defectos" | historia de la conversación donde se construyó. No recomprobable |
| "dieciocho guardas sin prueba detrás" (`09`, `10`, `11`) | ídem |
| "22 cortos pendientes" | ídem, y su ubicación es el hueco B1 |
| "151 milisegundos" del c06, "28 investigadores / 8 horas / 150 métodos" del c07 | vienen de fuentes leídas en su momento; **ningún script del carril largo las respalda** |
| Apify ~$3/mes | no verificable aquí |
| ~~Metricool 20/mes~~ | irrelevante desde el 7 sep: la decisión de Buffer ya no se apoya en topes sino en el modo notificación |
| ~~Buffer 10 en cola~~ | **verificado el 7 sep con `get_account`: el tope es 5000** desde que subió de plan. El 10 era cierto con el plan gratuito |
| "11 de las 13 cuentas de referencia hacen reels a cámara" | conteo hecho sobre capturas que ya no están en el entorno |
