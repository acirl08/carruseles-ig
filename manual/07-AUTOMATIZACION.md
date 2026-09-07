# 07 · Automatización — qué corre solo y qué no

## La tarea programada existe y está encendida

| | |
|---|---|
| Nombre | **Generación semanal de carruseles — domingos** |
| ID | `trig_01XJz1eEEu4aDxcPGphJhFUE` |
| Cron | `0 15 * * 0` — domingos 15:00 UTC = **9:00 am de Monterrey** |
| Estado | activa |
| Creada | 2 de septiembre de 2026 |
| Próxima ejecución | **domingo 6 de septiembre de 2026** |

**Cada disparo arranca una sesión nueva y vacía.** No hay archivos del pasado, no hay memoria
de la conversación anterior, no hay contexto. Todo lo que necesite tiene que estar en los dos
documentos del proyecto o en el repo. Por eso esos documentos están escritos como
instrucciones y no como notas.

Se gestiona con las herramientas de tareas programadas (`create_trigger`, `list_triggers`,
`update_trigger`, `delete_trigger`). **Nunca con las herramientas de cron locales**: esas
corren dentro de la sesión y se pierden cuando la sesión termina, así que la tarea nunca se
dispararía.

## La cadena completa, y dónde está el humano

```
   [domingo 9am]  la tarea se dispara sola
        │
        ├─ 1. lee claude/motor-de-senal.md y claude/produccion-semanal.md      AUTOMÁTICO
        ├─ 2. busca señal con WebSearch (arXiv, HN, community.openai, AlphaSignal)  AUTOMÁTICO
        ├─ 3. aplica los cuatro filtros y asigna slots                          AUTOMÁTICO
        ├─ 4. baja el motor del repo con raw.githubusercontent.com              AUTOMÁTICO
        ├─ 5. escribe los JSON, construye, saca los PNG                         AUTOMÁTICO
        ├─ 6. corre los verificadores                                           AUTOMÁTICO
        ├─ 7. mira los PNG y lanza un agente refutador                          AUTOMÁTICO
        ├─ 8. entrega los PNG, los captions y las frases a firmar               AUTOMÁTICO
        │
        ├─ 9. ISABELA FIRMA las frases en primera persona                       ◀── HUMANO
        ├─10. ISABELA APRUEBA el mazo                                           ◀── HUMANO
        │
        ├─11. subir los PNG al repo público                                     ◀── HUMANO (hoy)
        ├─12. programar en Buffer, liberando huecos si hace falta               AUTOMÁTICO
        │
        └─13. Buffer avisa a la hora; ISABELA publica y le pone música          ◀── HUMANO
```

Cuatro puntos humanos. Tres son a propósito (9, 10, 13) y uno es una limitación técnica (11).

## El carril recap dentro del domingo

Desde el 7 de septiembre hay un tercer carril. Entra en la misma cadena, con dos pasos propios:

```
   ├─ 3b. busca ANUNCIOS de la semana (no síntomas)         AUTOMÁTICO
   ├─ 5b. node recap/comprobar-fuentes.mjs                  AUTOMÁTICO
   │      una fuente que no respalda tumba la noticia, no el mazo
```

El resto es igual: construye, verifica, y para en la aprobación de Isabela.

**Por qué el paso 5b y no confiar en el validador**: `check-recap.mjs` comprueba que `fuente`
tenga forma de URL y que alguien haya puesto `comprobada: true`. Eso son declaraciones. El
paso 5b **abre la página** y comprueba que las cifras y los nombres del slide estén ahí. Nació
de un fraude real: el primer mazo citaba tres páginas que no decían lo que el slide afirmaba.

**El recap no lleva firma de Isabela** — habla de lo que hicieron otros, no de sus clientes.
Pero sí lleva su aprobación, como todo.

## Los tres humanos que NO se van a quitar

**9 · La firma.** Nada en el pipeline puede comprobar lo que Isabela ve con sus clientes. Si
se automatiza, se automatiza inventar. El motor del corto se cae sin la firma, y esa caída es
la funcionalidad, no un fallo.

**10 · La aprobación.** Es su cuenta y su cara. Nada se publica sin que ella lo vea.

**13 · Publicar a mano.** La música no se puede poner por API, y sin música el carrusel no
entra a la pestaña de Reels. Es un intercambio consciente: menos comodidad, más alcance.

## El humano que sí se puede quitar

**11 · Subir los PNG al repo.** Hoy lo bloquea que este entorno no puede escribir en
`acirl08/carruseles-ig`. Se resuelve dándole acceso de escritura a la sesión, o con un token
de despliegue. Ver `08`.

**Recordar el intercambio de cola.** Ya está automatizado: la regla está escrita, la
autorización está dada y el orden real de la cola está en `06`.

## Lo que se probó y no funciona

| Idea | Por qué no |
|---|---|
| `curl` a arXiv, HN, Reddit, AlphaSignal | el proxy de egreso los bloquea. Solo GitHub responde |
| `WebFetch` para leer una API | pide **aprobación humana por cada URL**: un domingo desatendido se queda esperando a alguien que no está |
| Reddit como fuente | el proxy rechaza `reddit.com` en `allowed_domains`, y Reddit bloquea el indexado fuera de Google desde 2024 |
| Apify para raspar competidores | ~$3/mes, pero **nunca puede devolver guardados ni compartidos** de un carrusel de feed, que son justo las señales que importan |
| Publicación automática en Buffer | publicaría sin música |
| Metricool para publicar | ~~20 al mes~~ — ese argumento caducó. La razón vigente es que Buffer tiene modo notificación, que es lo que permite poner música |

`WebSearch` sí corre sin aprobación, y sobre eso está construido el motor de señal.

## Por qué esto no es "100% automatizado", dicho sin adornos

Se puede automatizar todo lo que tenga una respuesta comprobable. **No se puede automatizar lo
que solo Isabela sabe**, y eso no es una limitación temporal de la tecnología: es que nadie
más tiene acceso a lo que ella ve con sus clientes.

Y hay algo más incómodo, documentado en `10`: en esta sesión, **cada ronda de revisión
adversaria encontró defectos reales que los verificadores automáticos no vieron.** Nueve
titulares idénticos. Un mecanismo mal atribuido. Un umbral inventado después de ver la
evidencia. Un tema que duplicaba el carrusel del día siguiente. Un dato técnico falso a punto
de llevar la firma de Isabela encima.

Ninguno de esos lo habría detectado un script, y todos habrían salido publicados.

Por eso el paso 7 (el agente refutador) es obligatorio y no ceremonial, y por eso la entrega
del domingo **no son carruseles cerrados**: son carruseles más una lista corta de frases que
solo ella puede firmar. Eso es el diseño, no un pendiente.

## El prompt de la tarea decía Metricool

Hasta el 3 de septiembre de 2026 el prompt guardado del disparador terminaba diciendo *"se
cargan en **Metricool** con `autoPublish: false`"* — contra la decisión de usar Buffer, tomada
el 2 de septiembre. También nombraba solo `produccion-semanal.md`, no el motor de señal.

Se reescribió entero ese día. El prompt vigente manda leer **los dos** documentos en orden,
programar por **Buffer** en modo notificación, revisar el espacio en la cola antes de asignar
slots, y no publicar nada sin la aprobación de Isabela.

**La lección**: el prompt del disparador es una copia de las instrucciones, y las copias se
quedan viejas. Por eso lleva lo mínimo y delega el resto a los dos documentos del proyecto,
que sí se editan cada vez que algo cambia.

## Cómo se cambia la tarea

- **Horario o nombre**: `update_trigger` con el `trigger_id`, sin tocar el prompt.
- **Instrucciones**: normalmente **no se toca el prompt de la tarea** — se editan
  `claude/motor-de-senal.md` y `claude/produccion-semanal.md`, que es lo que la tarea lee. Así
  el cambio queda versionado en el proyecto y visible para Isabela.
- **Probarla sin esperar al domingo**: `fire_trigger` con su `trigger_id`.
- Nunca borrar y recrear para cambiar algo: se pierde el historial de ejecuciones.
