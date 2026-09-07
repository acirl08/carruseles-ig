# 09 · Verificación — por qué hay agentes que atacan el trabajo

## La postura

**Un reporte es un conjunto de afirmaciones, no evidencia.** Nada se cree que no se haya
observado. "Los verificadores pasan" no es lo mismo que "está bien", y esta sesión es la
prueba: **todas y cada una** de las rondas de revisión adversaria encontraron defectos reales
que los verificadores automáticos habían aprobado.

## Las tres capas, y qué caza cada una

| Capa | Caza | No caza |
|---|---|---|
| **Scripts** | desbordes, choques, escalas forzadas, hashtags, cifras sin respaldo, titulares que cuentan mal | si el mecanismo es correcto, si el tema se repite, si la frase es cierta |
| **Ojos** | composición, aire, un titular que dice "cuatro" sobre una lista de tres | duplicados con material que no estás mirando, atribuciones falsas |
| **Agente refutador** | mecanismos equivocados, duplicados, fechas falsas, umbrales convenientes, datos falsos | lo que solo Isabela sabe |

**Y encima de las tres está su firma**, que es la única capa que puede decidir si una frase
sobre sus clientes es verdad.

## Cómo se lanza un refutador

No se le pide que revise: se le pide que **refute**. La diferencia es todo.

- Se le da el trabajo y **las afirmaciones concretas** que se hacen sobre él.
- Se le pide que **ejecute** las verificaciones él mismo, no que las lea.
- Se le nombran las vías de ataque: ¿la fuente existe y dice lo que se afirma?, ¿la fecha se
  sostiene?, ¿esto ya se dijo?, ¿el experimento prueba lo que dice probar?, ¿se tocó algo
  fuera de alcance?
- Se le prohíbe arreglar nada, y se le exige restaurar lo que toque.
- Se le pide el veredicto en la primera línea, sin suavizar y sin inflar.

**Truco que funciona**: pedirle que apague cada guarda una por una y compruebe que la suite
baja. Así descubrió que dieciocho "guardas" del motor corto no tenían ninguna prueba detrás —
eran comentarios, no guardas.

## Los ocho fraudes que hay que buscar

De más a menos frecuente:

1. **Verificación debilitada** — la prueba se relajó para que pasara.
2. **Completitud falsa** — se declara verde sin haber corrido nada.
3. **Umbral conveniente** — se elige un límite **después** de ver la evidencia, para que la
   evidencia pase. *Ya pasó aquí, con las fechas de los hilos de foro.*
4. **Traición a la spec** — se cambia el contenido para que el validador calle. *Ya pasó aquí:
   el validador le reescribió una frase a Isabela.*
5. **Métricas fabricadas** — cifras sin fuente que exista.
6. **Datos rancios** — un paper de 2023 explicando un producto de 2026.
7. **Alcance creciente** — se tocó lo que no se pidió.
8. **Restos** — archivos de prueba, código comentado, docs contradictorios.

## Los tres que más daño hacen aquí, con ejemplo real

**El umbral conveniente.** Se etiquetaron como "de los últimos meses" tres hilos de febrero de
2025, apoyándose en "un piso de 1.1M" que ningún documento definía. El piso se eligió después
de ver la evidencia. *Antídoto: si te sorprendes eligiendo un umbral después de mirar los
datos, para.*

**El paper extrapolado.** Se atribuyó "la IA leyó mi PDF a medias" a un estudio de julio de
2023 sobre modelos con ventana de 16k, en una tarea de laboratorio. Entre ese paper y un PDF
subido a ChatGPT en 2026 hay extracción de texto, truncamiento y la decisión del producto de
leer o indexar — cualquiera de las tres produce el mismo síntoma. *Antídoto: es exactamente lo
que denuncia su propio carrusel c09, "el paper no miente: miente el puente".*

**La suite de un solo lado.** Una suite que solo prueba lo que la regla debe rechazar no puede
ver el día en que la regla empieza a rechazar de más. Pasó tres rondas seguidas, hasta que la
suite del corto ganó su segunda mitad: **casos que deben pasar**.

## La regla de oro

**Cuando el validador marca un FALSO POSITIVO, gana el copy** — y se arregla la regla, no el
texto. Ojo con la condición, porque sin ella la regla se vuelve su contrario: ante un
**verdadero** positivo (una cifra sin fuente, una frase sin firmar) "gana el copy" **es** el
fraude nº4 de esta misma lista. Primero decide si la regla se equivocó; solo entonces cámbiala.

El orden de autoridad completo: **lo que dice Isabela > las reglas de marca > la spec > las
pruebas > el código.**

Esto no es teoría: pasó, y se corrigió devolviendo la frase original de Isabela y cambiando el
regex.
