# Lo que falta, y solo lo puede hacer Isabela

Al 7 de septiembre de 2026. El sistema corre entero: los dos motores construyen y los cinco
verificadores dan verde en un clon limpio. Lo de aquí **no es un defecto del código** — es lo
que el sistema, a propósito, no puede resolver solo.

**La tarea del domingo dispara el 13.** La del 6 ya pasó y se detuvo en su primer paso porque
el motor aún no estaba en el repo.

---

## 1 · Las cuatro firmas — bloquea 3 de las 5 publicaciones

El Corto 02 y el Corto 03 **no construyen** sin ellas: `build-corto.mjs` sale con exit 1. Eso
es la funcionalidad, no un fallo.

Nadie más puede ponerlas. `04-CARRUSEL-CORTO.md`: *"Nunca la pongas tú. Se pone cuando ella
lee la frase y confirma que es cierta."*

### Corto 02 — «Pegaste la tabla y te inventó los totales»

1. *"Me pasan reportes hechos con IA y los números no cuadran"* + *"Lo primero que reviso no es
   el análisis: es de dónde salió cada cifra. Casi siempre salió del chat, no de la hoja."*
2. *"En mis pruebas el cambio no es que acierte más: es que ya no tienes que desconfiar de cada
   cifra antes de usarla."*

### Corto 03 — «Le explicas tu negocio otra vez cada mañana»

3. *"Me escriben para preguntarme cómo hacer que se acuerde. No se acuerda de nada, y no hace
   falta: la hoja en blanco la llenas tú una vez."*
4. *"En mis pruebas la diferencia no está en la primera respuesta: está en que la décima ya no
   repite el error que corregiste en la segunda."*

**Si son ciertas**: pon `"verificado": true` en el slide que la lleva, dentro de
`corto/data/s02-totales.json` y `s03-contexto.json`.

**Si alguna no lo es**: reescríbela sin la afirmación. Reescribir *para esquivar el validador*
está prohibido; reescribir porque **decides no hacer esa afirmación** es legítimo.

```bash
source entorno.sh
cd corto && node build-corto.mjs      # sin errores = firmadas
```

---

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

## 3 · Confirmar el prompt del disparador — no verificable desde aquí

`07-AUTOMATIZACION.md` dice que el prompt se reescribió el 3 de septiembre para que mande leer
los dos documentos y programar por **Buffer** en modo notificación. **No se ha podido
comprobar**: las herramientas de tareas programadas no están disponibles en la sesión donde se
escribió esto.

Vale la pena mirarlo antes del 13, porque ese prompt ya estuvo mal una vez: decía Metricool
cuando la decisión era Buffer.

---

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
