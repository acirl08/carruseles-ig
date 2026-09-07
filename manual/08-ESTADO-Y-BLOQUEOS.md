# 08 · Estado y bloqueos — al 7 de septiembre de 2026

Todo lo de aquí está comprobado con `curl`, `list_posts` o corriendo el código, no de memoria.

## Semáforo

| Pieza | Estado |
|---|---|
| Motor del carrusel largo | ✅ funciona. Diez mazos producidos, 100 PNG |
| Motor del carrusel corto | ✅ funciona. 85/85 guardas |
| Motor de señal | ✅ escrito y corrido una vez |
| Tarea programada del domingo | ⚠️ **ya se disparó el 6 de septiembre** sin el motor en el repo: se detuvo en su primer paso. El próximo tiro es el 13 |
| Buffer conectado | ✅ diez largos programados, verificados |
| Los 100 PNG de los largos en el repo | ✅ los cien, comprobados uno por uno |
| `motor/` en el repo | ✅ subido el 7 de septiembre |
| `corto/` en el repo | ✅ subido el 7 de septiembre |
| PNG del Corto 01 en el repo | ✅ los 7, comprobados |
| Corto 01 | ✅ firmado, construido, 7 PNG |
| Corto 02 | ⏸ esperando dos firmas |
| Corto 03 | ⏸ esperando dos firmas |
| Cadencia real esta semana | ⚠️ **2 de 5** |

## Bloqueo 1 — RESUELTO el 7 de septiembre de 2026

`motor/`, `corto/`, `fonts/` y los siete `img/s01-*.png` están en el repo: 106 archivos,
comprobados uno por uno contra `raw.githubusercontent.com`. La tarea del domingo ya no se
detiene en su primer paso.

Al empaquetar salieron dos defectos que no eran del motor sino de cómo venía la carpeta:

1. **`fonts/` faltaba en la raíz.** `corto/build-corto.mjs` las busca en `../fonts`; venían
   solo en `motor/fonts/` y el build moría con ENOENT antes de validar nada.
2. **La ruta de Chromium estaba fija** en `/opt/pw-browsers/chromium`, la del contenedor
   Linux donde se construyó. Cuatro sitios. Ahora leen `CHROMIUM_PATH` con ese mismo default.

### Lo que decía antes

`corto/build-corto.mjs`, `corto/SCHEMA-CORTO.md`, `motor/engine.js`: **todos 404** en
`raw.githubusercontent.com`. El repo solo tiene `README.md`, `.gitignore` e `img/01-01 …
10-10`.

`produccion-semanal.md` manda detenerse si falta cualquiera de los dos. Así que **la tarea del
domingo 6 se va a parar en su primer paso**, aunque todo lo demás estuviera listo.

## Bloqueo 2 — RESUELTO: era de aquella sesión, no del proxy

En la Mac de Isabela `gh` está autenticado como `acirl08` con scope `repo`, y la API confirma
`push: true`, `admin: true`, rama `main` sin protección. Por ahí se subió.

La lectura correcta es la que ya trae este archivo: **eran dos mecanismos distintos**. Los
demás hosts dan `000` (proxy de egreso); `github.com` daba **403** de la integración de
GitHub de aquella sesión. Nunca fue el proxy: era permiso de escritura que aquella sesión no
tenía y esta sí.

### Lo que decía antes

**Son dos mecanismos distintos, no uno.** Los demás hosts (arXiv, HN, Reddit, AlphaSignal)
devuelven `000`: los corta el proxy de egreso. `github.com` y `api.github.com` **sí responden**,
con un **403** de la integración de GitHub de la sesión:

> `GitHub access to this repository is not enabled for this session.`

O sea: no es el proxy, es que esta sesión no tiene permiso de escritura sobre ese repo. Y la
herramienta que ese mensaje sugiere para pedirlo **no existe en esta sesión** (comprobado).
No hay vuelta que dar desde aquí.

**Consecuencia**: sin URL pública, Buffer no puede referenciar las imágenes de los cortos, así
que no se puede programar ninguno. Y por eso el intercambio de largos por cortos —que está
autorizado desde hace días— sigue sin ejecutarse.

Se resuelve de dos formas: que Isabela suba los archivos a mano, o que le dé a la sesión
acceso de escritura al repo.

## Arrancar en una máquina nueva

Desde el 7 de septiembre el repo trae `preparar.sh`: instala las dependencias de los dos
motores, comprueba que sus versiones de Playwright coinciden, descarga el navegador si falta y
escribe `entorno.sh` con su ruta.

```bash
./preparar.sh && source entorno.sh
```

Comprobado clonando el repo en limpio y corriendo los dos pipelines enteros. Lo único que
queda fuera del código está en `FALTA.md`, en la raíz del repo.

## Bloqueo 3 — cuatro firmas pendientes

El Corto 02 y el Corto 03 no construyen hasta que Isabela confirme estas cuatro frases:

**Corto 02 — «Pegaste la tabla y te inventó los totales»**
1. *"Me pasan reportes hechos con IA y los números no cuadran"* + *"Lo primero que reviso no
   es el análisis: es de dónde salió cada cifra. Casi siempre salió del chat, no de la hoja."*
2. *"En mis pruebas el cambio no es que acierte más: es que ya no tienes que desconfiar de
   cada cifra antes de usarla."*

**Corto 03 — «Le explicas tu negocio otra vez cada mañana»**
3. *"Me escriben para preguntarme cómo hacer que se acuerde. No se acuerda de nada, y no hace
   falta: la hoja en blanco la llenas tú una vez."*
4. *"En mis pruebas la diferencia no está en la primera respuesta: está en que la décima ya no
   repite el error que corregiste en la segunda."*

*(El Corto 01 ya está firmado: ella confirmó sus dos frases el 3 de septiembre.)*

## La corrida del 6 de septiembre

Se disparó con el repo aún vacío, así que `produccion-semanal.md` la paró en el paso 1, que
es lo que manda hacer. **Nada se publicó mal**: sin aprobación no sale nada, y una caída a
medias no puede publicar. Conviene comprobar con `list_posts` que no quedó nada a medias
antes del tiro del 13.

## La semana del 7 al 11 de septiembre

**Cero temas nuevos asignados.** El motor de señal corrió y sus tres candidatos se cayeron —
dos por defectos de contenido, uno por duplicar el arreglo del carrusel del día siguiente.
Detalle completo en `12-SELECCION-SEMANA-37.md`.

Lo que sí está cubierto: **martes 8 y jueves 10**, con los largos ya programados.

Para los tres cortos, en orden de menos a más trabajo:

1. Sacar temas de los **22 cortos pendientes** del backlog *(no están en este entorno)*.
2. Escribirlos a mano, como el s02 y el s03.
3. Publicar dos con el s02 y el s03 una vez firmados, y dejar el viernes.

## Qué desbloquea qué

```
Isabela sube el zip al repo
   └─> la tarea del domingo deja de detenerse en el paso 1
   └─> el Corto 01 se puede programar
         └─> se quita el largo del 8 de octubre y entra el lunes
               └─> la semana pasa de 2 a 3 publicaciones

Isabela firma las cuatro frases
   └─> los Cortos 02 y 03 construyen
         └─> con el bloqueo del repo resuelto, la semana llega a 5
```

**Los dos son suyos y ninguno depende del otro.** Cualquiera de los dos mejora la semana; los
dos juntos la completan.

## Pendientes menores, sin bloquear nada

- Titulares idénticos entre carruseles largos en los slides 06 y 09 (seis y seis). Detectado,
  sin corregir, ya programado así.
- `c07` y `c09` comparten el mismo caso en su slide 08.
- ~~`generate_pdf.py`: handle incompleto y título técnico~~ **Corregido el 7 de septiembre.**
  Las dos apariciones visibles del handle dicen `@isaiscoding.ia` y la línea del título
  técnico se eliminó. El archivo vive en las skills locales, no en este repo:
  `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/.../pdf-guias-isaiscoding/scripts/generate_pdf.py`.
  Las líneas 3 y 18 siguen diciendo `@isaiscoding` a propósito: son comentarios internos, no
  salida visible.
