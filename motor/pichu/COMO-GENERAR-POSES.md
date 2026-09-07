# Cómo se genera una pose nueva de Pichu

Cerraba el hueco 2 de `13-HUECOS`: se sabía que se usa Higgsfield, pero *"con qué herramienta,
con qué prompt, con qué proceso de aprobación"* no estaba escrito en ningún sitio.

Probado el 7 de septiembre de 2026 generando una pose nueva a partir de `p01.png`.

## El modelo

**`nano_banana_pro`**, con la pose existente como `image_references`.

**No sirve Soul.** Soul (`soul_2`, `soul_cast`) es identidad de *personas fotorrealistas*;
Pichu es line-art plano de un ave. Lo que hace que la pose nueva salga igual no es un modelo
entrenado: es pasarle una pose existente como referencia visual.

## El procedimiento

**1. Importa una pose existente como referencia.** Desde que el motor está en el repo, las
poses tienen URL pública. Ojo con los dos números, que no son el mismo: hay **60 PNG** en
`motor/pichu/` y **54 catalogadas** en `motor/poses.json` (contados, no de memoria). Cualquiera
de los 60 sirve como referencia visual; solo las catalogadas tienen `desc` escrito.

```
media_import_url("https://raw.githubusercontent.com/acirl08/carruseles-ig/main/motor/pichu/p01.png")
```

Elige una referencia cuya cresta esté en el mismo estado que la que quieres.

**2. Genera con este prompt**, cambiando solo la pose y el objeto:

> Same cockatiel character, same flat line-art style as the reference: **single uniform black
> outline weight, flat pastel yellow fill, orange cheek circle, no shading, no gradients, no
> texture**, plain white background with a soft flat orange elliptical shadow under the feet.
> New pose: `<qué hace>`, `<con qué objeto>`, its crest `<estado>`. The `<objeto>` is generic
> with **no legible text or letters anywhere**. Keep the exact same character design,
> proportions, eye style and line weight as the reference image.

Los estados de cresta salen de `SCHEMA.md` y dependen del bloque del slide:

| Slides | Bloque | Cresta |
|---|---|---|
| 01-03 | alerta | `fully upright with the three feathers separated` |
| 04-05 | duda | `at half mast and tilted to one side` |
| 06-08 | atención | `neutral and its body faces front` |
| 09-10 | calma | `relaxed and settled down` |

**3. Revisa antes de aceptarla.** En la prueba, dos cosas salieron distintas de lo pedido: el
ave miraba al lado contrario y la cresta salió más levantada que el `half mast` solicitado.
Ninguna rompe la marca, pero **no es automático a ciegas**: mira la imagen y repite si hace
falta.

Lo que sí hay que rechazar siempre:
- sombreado, degradado o textura — rompe el line-art monolineal de `02-MARCA.md`
- contorno de grosor variable
- cualquier texto legible en el objeto
- fondo que no sea transparente o blanco liso

**4. Guárdala** como `motor/pichu/pNN.png` con el siguiente número libre, y añade su entrada a
`poses` en el JSON del carrusel: `desc` en inglés, una frase, con qué hace + con qué objeto +
estado de la cresta.

## Coste

2 créditos por imagen en `nano_banana_pro` a 2k — consultado con `get_cost` el 7 de septiembre
de 2026, no está fijado por contrato y puede cambiar. **Compruébalo antes de una tanda grande**:
`get_cost: true` en la llamada devuelve el costo sin generar nada, y `balance` da el saldo.

## Lo que este documento NO cubre

**El proceso de aprobación sigue siendo de Isabela.** Aquí está cómo producir una candidata;
si una pose entra al repo o no, lo decide ella. Se sabe que prefiere que se generen poses
nuevas sin preguntar cuando el carrusel las necesita, pero eso no es lo mismo que publicarlas
sin que las vea.
