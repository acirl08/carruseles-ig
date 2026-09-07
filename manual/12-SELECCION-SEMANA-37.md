# Selección — semana del 7 al 11 de septiembre de 2026

**Cero temas asignados.** Los tres candidatos que propuso esta corrida se cayeron. Dos los
tumbó un agente refutador; el tercero —el que yo llamé "el más fuerte de la semana"— lo tumbó
un segundo juez por duplicar el arreglo del carrusel que se publica **al día siguiente**.

Esto no es un fallo del motor: es el motor haciendo lo que dice hacer. *"El que falla un filtro
se cae, no se negocia"* y *"entrega los que pasen y dilo"*. Lo que sí falló fue mi aplicación
de sus propias reglas, tres veces seguidas.

Todas las URL de abajo se verificaron con búsquedas de hoy, 3 de septiembre de 2026 — doce de
doce, ninguna inventada. Eso fue lo único limpio de las tres corridas.

---

## Lo que se cayó, y por qué

### «No sabes si leyó tu documento o solo lo hojeó» — **tumbado por duplicado (G4)**

Era el candidato del lunes 7. Su arreglo: *"dile en qué sección buscar, o pártelo"*.

El carrusel largo que se publica el **martes 8** — `img/01`, ya programado en Buffer — enseña
en su slide 07, literalmente: *"parte por tema, pega el fragmento y no el documento entero"*.

Es la misma acción, dos días seguidos. El motor define el duplicado exactamente así: *"El
duplicado se detecta por el ARREGLO, no por el titular. Dos carruseles que terminan en la
misma acción son un solo carrusel."* Yo declaré que la comparación de duplicados había sido
parcial **solo respecto al backlog** — pero contra los diez largos, que sí tenía delante, di
por bueno un cero solapamiento que no era cierto.

*Se puede rescatar más adelante*, con otro arreglo: el de la verificación (pedir la cita
textual y comprobarla con Ctrl+F en tu propio archivo) en vez del de la partición. Ese sí es
distinto de todo lo programado. Pero no esta semana, pegado al largo que dice lo mismo.

Defectos menores que el juez encontró en él, y que hay que arreglar si se rescata:

- El hilo [1387039](https://community.openai.com/t/gpt-5-6-sol-context-truncation-per-turn-issues/1387039)
  está en la categoría **Codex** — herramienta de desarrollador. Falla G1, el mismo criterio
  con el que maté al viernes.
- El hilo [1369961](https://community.openai.com/t/detecting-when-a-pdf-should-use-file-search-vs-full-context/1369961)
  está en **API** y describe el `file_search` de Assistants; yo le atribuí esa conducta a
  ChatGPT. El hilo correcto existe y estaba en la misma búsqueda:
  [1248263](https://community.openai.com/t/how-exactly-does-file-search-work-in-chatgpt-is-it-always-necessary-to-enable-it/1248263).
- El puente decía *"copia una frase de una página **del medio**"*. Si el mecanismo es "no sabes
  cuál de cuatro cosas pasó", el medio no tiene ningún estatus especial: esa palabra era un
  residuo de la hipótesis que ya había retirado.
- Y llamé a los hilos *"del mes pasado"* cuando nombrar "GPT-5.6 Sol" solo prueba *posterior al
  9 de julio*. Solo uno de los tres traía ancla de calendario. La regla de recencia ya se
  corrigió para exigirla.

### «Te dijo que ya lo hizo, y no lo hizo» — **tumbado por dato falso**

Iba a afirmar que el asistente *"no tiene reloj ni tareas en segundo plano"*. **Es falso**:
ChatGPT tiene Tareas programadas.
[1091180](https://community.openai.com/t/new-feature-tasks-beta-rolling-out/1091180) ·
[1389259](https://community.openai.com/t/scheduled-tasks-issue-about-timezone-chat-windows-rrule-setting-on-new-chatgpt-desktop-app-works-correctly-on-web/1389259)

Y como la frase iba dentro de la línea de primera persona, la firma de Isabela habría
certificado un error técnico. Además reincidía en la amnesia del chat, ya cubierta tres veces.

### «Bajó de precio y sigues pagando lo de antes» — **tumbado por tres capas**

Falla G1 (precio de API y despliegue empresarial: material de desarrollador), no tiene capa de
síntoma ni de mecanismo, cita un artículo de **Opus 4.8** cuando el mismo sitio ya publica
sobre **Opus 5**, y duplica el largo de "los 4 dólares la hora". Lo había marcado con una
advertencia en vez de tirarlo, que es negociar un filtro que no se negocia.

### Reserva R1 «Ignoró tus instrucciones a la tercera» — **tumbado por duplicado**

Su arreglo aterriza en el archivo de contexto, que es el slide de concepto del s03. *(Corrección:
también dije que su hilo era "probablemente de la API de Assistants". El foro lo clasifica en
ChatGPT. El motivo del duplicado se sostiene; esa conjetura sobraba.)*

---

## Qué hacer con la semana

**Los martes y jueves están cubiertos** por la cola: `img/01` el 8 y `img/02` el 10.

Para los tres cortos, en orden de menos a más trabajo:

1. **Sacar temas de los 22 cortos pendientes del backlog.** No los tengo en este entorno.
2. **Escribirlos a mano**, como el s02 y el s03.
3. **Publicar dos esta semana** con el s02 y el s03 una vez firmados, y dejar el viernes.

---

## Bloqueo real, dicho sin rodeos

El intercambio de largos por cortos está **autorizado** y no se ha hecho, y el motivo que di
antes era el equivocado. No es que los cortos "no existan": el s01 está firmado y sus siete
PNG existen. Es que **este entorno no puede escribir en el repo** — `github.com` está bloqueado
por el proxy y la API responde *"GitHub access to this repository is not enabled for this
session"*. Sin URL pública, Buffer no puede referenciar las imágenes.

Y hay un segundo bloqueo que ningún documento registraba: **`motor/` y `corto/` tampoco están
en el repo**. `motor/engine.js`, `corto/build-corto.mjs`, `corto/SCHEMA-CORTO.md` — todos 404.
`produccion-semanal.md` manda detenerse si falta cualquiera de los dos, así que una sesión del
domingo se para en el primer paso. Ya está anotado ahí.

> **Nota del 7 de septiembre de 2026 — este párrafo ya no describe el presente.** El motor se
> subió ese día y los tres archivos dan 200. Se deja el texto como estaba porque este archivo
> es la bitácora de la corrida del 3 de septiembre, no un parte de estado: el estado vive en
> `08-ESTADO-Y-BLOQUEOS.md`.

**Lo que desbloquea todo, y solo lo puede hacer Isabela**: subir al repo `corto/` (el motor) y
los PNG de los cortos. En cuanto tengan URL pública, el intercambio es un paso.
