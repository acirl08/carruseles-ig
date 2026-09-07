# Lo que falta, y solo lo puede hacer Isabela

Al 7 de septiembre de 2026. El sistema corre entero: los dos motores construyen y los cinco
verificadores dan verde en un clon limpio. Lo de aquí **no es un defecto del código** — es lo
que el sistema, a propósito, no puede resolver solo.

**La tarea del domingo dispara el 13.** La del 6 ya pasó y se detuvo en su primer paso porque
el motor aún no estaba en el repo.

---

## 1 · Las cuatro firmas — HECHO el 7 de septiembre

Isabela las confirmó con `node corto/firmar.mjs`. Los tres cortos construyen, `check-corto.mjs`
no reporta hallazgos y sus 20 PNG están en el repo y programados en Buffer.

Para la próxima tanda, el flujo ya no es editar JSON a mano:

```bash
cd corto && node firmar.mjs
```

Muestra cada frase pendiente con su contexto y escribe `"verificado": true` solo donde ella
dice que sí. No tiene "marcar todas" a propósito: firmar de más devalúa la firma. Con `[n]`
abre `$EDITOR` para reescribir y revalida al guardar.

## 2 · Los cortos pendientes del backlog — no bloquea, pero degrada el domingo

`backlog/pendientes.json` está vacío. Mientras siga así, el motor de señal compara duplicados
contra los 13 temas publicados cuando el universo real es mayor: una criba con el fondo
abierto.

*(El manual habla de "22 cortos pendientes". Esa cifra viene de la conversación donde se
construyó el sistema y **no hay ningún archivo aquí que la respalde** — puede ser otro número.
Lo que importa no es cuántos son, sino que hoy no están.)*

Cada tema necesita `id`, `titulo`, `carril` (`largo` o `corto`) y **`arreglo`** — el mecanismo,
que es por donde se detecta el duplicado, no por el titular.

```bash
node backlog/check-backlog.mjs        # "sin hallazgos" antes de subir
```

---

## 3 · La cola se deja llena a propósito — decisión del 7 de septiembre

Buffer topa en **10 posts programados** y la cola está en 10/10. Isabela decidió **no dejar
huecos libres** antes del domingo: prefiere ver los temas que propone la tarea y decidir ella
qué entra y qué sale.

**Consecuencia esperada, no un fallo**: el domingo entrega los cinco temas con su evidencia y
sus frases de firma, pero **no programa nada**, porque `05-MOTOR-DE-SENAL.md` manda comprobar
el espacio en la cola antes de asignar slots y no hay. La entrega sirve igual: es la lista de
lo que se puede publicar en cuanto se libere un hueco.

Para liberar espacio, sacar el post más lejano de la cola y volver a crearlo después: los
JSON y los PNG siguen en el repo, así que reprogramar es rehacer la llamada, no rehacer el
carrusel.

## 4 · Confirmar el prompt del disparador — no verificable desde aquí

`07-AUTOMATIZACION.md` dice que el prompt se reescribió el 3 de septiembre para que mande leer
los dos documentos y programar por **Buffer** en modo notificación. **No se ha podido
comprobar**: las herramientas de tareas programadas no están disponibles en la sesión donde se
escribió esto.

Vale la pena mirarlo antes del 13, porque ese prompt ya estuvo mal una vez: decía Metricool
cuando la decisión era Buffer.

---

## La cola hoy (7 de septiembre)

| Fecha | Formato | Tema |
|---|---|---|
| mar 8 sep | largo | Olvida lo que le dijiste |
| **mié 9 sep** | **corto** | Escribiera como tú → folleto |
| jue 10 sep | largo | Fecha de corte |
| **vie 11 sep** | **corto** | Te inventó los totales |
| **dom 14 sep** | **corto** | Le explicas otra vez cada mañana |
| mar 15 sep | largo | Predice |
| jue 17 sep | largo | Prompt |
| mar 22 sep | largo | Otra respuesta |
| jue 24 sep | largo | No aprende |
| lun 29 sep | largo | Interrumpe |

Los tres cortos van en **modo notificación**: Buffer avisa a la hora, Isabela abre, pone
música y publica. Sin música el carrusel no entra a la pestaña de Reels.

Salieron de la cola para hacerles sitio, y se pueden reprogramar cuando haya hueco:
**Cuatro dólares**, **Titular** y **Razonamiento**.

## Lo que ya NO falta

| | |
|---|---|
| Motor largo y corto en el repo | ✅ comprobado por URL, archivo por archivo |
| Los dos pipelines corren desde un clon limpio | ✅ comprobado |
| 85 guardas | ✅ 85/85 |
| Captions | ✅ 13/13 |
| Backlog: estructura y verificador | ✅ falta el contenido |
| Poses de Pichu: procedimiento | ✅ `motor/pichu/COMO-GENERAR-POSES.md` |

## Arrancar en una máquina nueva

```bash
./preparar.sh          # instala todo y descarga el navegador
source entorno.sh
```
