# Manual de @isaiscoding.ia — índice

Todo el sistema de producción y publicación de carruseles de Instagram, documentado para que
funcione sin la conversación donde se construyó. Escrito el 3 de septiembre de 2026.

**Si solo vas a leer una cosa: lee `08-ESTADO-Y-BLOQUEOS.md`.** Ahí está qué falta hoy y
quién lo tiene que hacer. **Si algo se rompió: `13-HUECOS-Y-COMO-EMPEZAR.md`.**

## Los archivos

| # | Archivo | Para qué |
|---|---|---|
| 01 | `01-EL-SISTEMA.md` | Qué es todo esto y cómo encajan las piezas. Empieza aquí si no conoces el proyecto |
| 02 | `02-MARCA.md` | Las reglas que no se negocian: voz, métricas, hashtags, lo que nunca se dice |
| 03 | `03-CARRUSEL-LARGO.md` | El formato de 10 slides: motor, esquema, pipeline |
| 04 | `04-CARRUSEL-CORTO.md` | El formato de 5-7 slides: motor, la firma de Isabela, las 85 guardas |
| — | `recap/SCHEMA-RECAP.md` *(en el repo)* | **El tercer carril**: el resumen semanal de noticias, en cuatro variantes |
| 05 | `05-MOTOR-DE-SENAL.md` | Cómo se eligen los temas cada domingo |
| 06 | `06-PUBLICACION.md` | Buffer: la cola, el intercambio, cómo se programa |
| 07 | `07-AUTOMATIZACION.md` | **Qué corre solo, qué no, y por qué** |
| 08 | `08-ESTADO-Y-BLOQUEOS.md` | **Dónde está todo hoy y qué está detenido** |
| 09 | `09-VERIFICACION.md` | Por qué hay agentes que atacan el trabajo, y qué han encontrado |
| 10 | `10-DEFECTOS-CONOCIDOS.md` | El catálogo de errores ya cometidos, para no repetirlos |
| 11 | `11-DECISIONES.md` | Qué se decidió, cuándo y por qué. Para no volver a discutirlo |
| 12 | `12-SELECCION-SEMANA-37.md` | La corrida real del motor de señal, con lo que se cayó y por qué |
| 13 | `13-HUECOS-Y-COMO-EMPEZAR.md` | **Qué hacer cuando algo falla, y qué NO explica este manual** |

## Cómo se relaciona esto con los docs del proyecto

Dos de estos archivos existen también como **documentos del proyecto en claude.ai**, porque
son los que lee la tarea programada de los domingos:

- `claude/produccion-semanal.md` ← equivale a `06-PUBLICACION.md` más el pipeline de 03 y 04
- `claude/motor-de-senal.md` ← equivale a `05-MOTOR-DE-SENAL.md`

**Los del proyecto son los operativos**: si cambias algo que afecte al domingo, cámbialo ahí.
Este manual es la versión completa, con el porqué y la historia que un instructivo no lleva.

## Dónde vive el código

| Qué | Dónde | ¿Está en el repo público? |
|---|---|---|
| Motor largo | `motor/engine.js`, `doodles.js`, `build.mjs`, `grid.mjs`, `check.mjs`, `check-titulares.py`, `SCHEMA.md`, `data/`, `pichu/` | **Sí** |
| Motor corto | `corto/` | **Sí** |
| Tipografías | `fonts/` (y también en `motor/fonts/`) | **Sí** |
| Los 100 PNG de los largos | `img/NN-MM.png` | **Sí** |
| PNG del Corto 01 | `img/s01-NN.png` | **Sí** |

Repo: **https://github.com/acirl08/carruseles-ig** (público, rama `main`).
**Desde el 7 de septiembre de 2026 todo está en el repo**: `motor/`, `corto/`, `fonts/` y los
siete PNG del Corto 01. El bloqueo principal del proyecto era ese, y ya no existe. Ver `08`.

## Honestidad sobre este manual

Lo revisó un juez adversario antes de entregarlo y **lo refutó**: encontró que el prompt de la
tarea del domingo decía Metricool en vez de Buffer, una cifra atribuida a un documento que no
la dice, referencias cruzadas rotas, y siete cosas que el manual no explicaba cómo hacer.
Todo eso está corregido, y lo que no se pudo corregir está listado en `13`.

No se volvió a pasar el juez sobre la versión corregida.
