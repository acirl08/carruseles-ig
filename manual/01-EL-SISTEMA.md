# 01 · El sistema

## Qué es

Una máquina para publicar cinco carruseles por semana en Instagram (`@isaiscoding.ia`) sin
que Isabela tenga que pensar en publicar. La cuenta enseña IA a emprendedores no técnicos en
español; el objetivo actual es **crecer y construir credibilidad**, no convertir.

TikTok (`@isaiscoding`) es la cuenta grande. Instagram es la que se está construyendo, y los
carruseles son el vehículo. La referencia de formato es **@noveira.dev**, que publica puros
carruseles.

## Los dos carriles

No son dos tamaños del mismo formato. Son dos cosas distintas con reglas opuestas, y
confundirlas es el error más caro del proyecto.

| | **Largo** | **Corto** |
|---|---|---|
| Slides | 10 | 5 a 7 |
| Días | martes y jueves | lunes, miércoles y viernes |
| Carril | **alcance** | **confianza** |
| Qué hace | explica **por qué** falla la IA | dice **qué hacer** |
| Voz | segunda persona. **Isabela no aparece nunca** | primera persona. **Isabela aparece** |
| Titular | Instrument Serif | Bebas Neue en MAYÚSCULAS |
| Pichu (la ninfa) | sí, en 5 o 6 slides | no lleva |
| Firma de Isabela | no aplica | **obligatoria** en toda frase sobre sus clientes |
| Motor | `engine.js` + `build.mjs` | `corto/engine-corto.js` + `corto/build-corto.mjs` |
| Esquema | `SCHEMA.md` | `corto/SCHEMA-CORTO.md` |

El largo trae gente nueva: es un diagnóstico que cualquiera reconoce, sin nadie vendiendo
nada. El corto convierte a quien ya llegó en alguien que confía: por eso ahí sí aparece ella.

### Ojo: hay DOS numeraciones y no coinciden

`cNN` es el nombre del archivo de datos. `img/NN` es el orden de publicación y el prefijo de
los PNG en el repo. **Son cosas distintas**, y confundirlas ya estuvo a punto de borrar el
carrusel equivocado de la cola:

| `img/NN` | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| `cNN` | c02 | c10 | c01 | c04 | c03 | c08 | c06 | c05 | c09 | c07 |

Cuando el manual dice "c06" habla del **archivo**; cuando dice "img/06" o "el del 8 de
octubre", habla de la **cola**. La tabla de `06` es la que manda para borrar o reponer.

**Se emparejan a propósito.** El largo del martes explica un mecanismo; un corto de esa misma
semana puede dar la vuelta práctica del mismo tema. Lo que no puede pasar es que los dos
terminen en la misma acción — eso no es un par, es un duplicado. Ver `05`.

## El ciclo semanal

```
DOMINGO
  1. Motor de señal          -> qué temas tocan esta semana        (doc 05)
  2. Revisión de la cola      -> cuántos huecos hay en Buffer       (doc 06)
  3. Producción               -> JSON -> HTML -> PNG                (docs 03 y 04)
  4. Verificadores            -> geometría, titulares, guardas   (docs 03 y 04)
  5. Mirar los PNG            -> con los ojos, no con un script   (docs 03 y 04)
  6. Agente refutador         -> que intente tumbar el resultado  (doc 09)
  7. Entrega a Isabela        -> PNG + captions + frases a firmar

ELLA
  8. Firma las frases en primera persona que la involucran          (doc 04)
  9. Aprueba

DESPUÉS
 10. Programar en Buffer en modo notificación                       (doc 06)
 11. Buffer le avisa a la hora; ella publica a mano y le pone música
```

**Nada se publica sin su aprobación.** Y el paso 6 no es ceremonia: en la producción de los
diez primeros largos, en las cuatro rondas del motor corto y en las tres del motor de señal,
**todas y cada una** encontraron defectos reales que los verificadores automáticos no vieron.

## Por qué hay dos verificaciones distintas

Hay cosas que un script puede comprobar y cosas que no.

- **Un script comprueba**: que el texto no se salga del área segura, que no se monte sobre el
  handle, que la escala no se haya forzado. Y **solo en el carril corto**: que los hashtags
  sean cinco, que un titular que dice "tres cosas" tenga tres, que una cifra traiga respaldo
  declarado. **El motor del largo no tiene ninguna de esas tres guardas** — ahí las reglas de
  marca se cumplen a mano y las revisa el agente refutador.
- **Un script NO comprueba**: si el mecanismo que explicas es el correcto, si el tema ya lo
  dijiste hace dos semanas con otras palabras, si la frase que le atribuyes a Isabela es
  cierta, si el consejo funciona.

Por eso el pipeline tiene tres capas: scripts, ojos, y un agente al que se le pide
explícitamente que **refute** el trabajo. Y por eso existe la firma de Isabela: es lo único
que puede decidir si una frase sobre sus clientes es verdad.

## Qué NO hace este sistema, por decisión

- **No convierte.** El cierre pide seguir y compartir. El mecanismo de "comenta KEYWORD y te
  mando la guía por DM" está escrito y **apagado**: es engagement bait y dispara
  no-recomendación en Instagram.
- **No publica solo.** Buffer manda una notificación y ella publica a mano, para poder ponerle
  música — sin música el carrusel no entra a la pestaña de Reels.
- **No inventa métricas.** Ver `02`.
