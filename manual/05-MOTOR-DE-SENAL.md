# Motor de señal semanal — @isaiscoding.ia

Cómo se decide, cada domingo, de qué van los cinco carruseles de la semana.
Esto corre **antes** que `produccion-semanal.md`: aquí salen los temas, allá se producen.

## Qué es y qué no es

**No es** un lector de noticias de IA. Si fuera eso, publicaríamos que salió un modelo nuevo,
que es exactamente el contenido que su audiencia ya recibe de veinte cuentas más grandes.

**Es** un detector de *síntomas*: qué le está pasando esta semana a un emprendedor no técnico
con su asistente, que ella pueda explicar y arreglar. El gancho de un carrusel siempre es un
síntoma en las palabras de quien lo sufre, nunca un titular de producto.

## La restricción que define el diseño

El contenedor **no tiene red** salvo GitHub (verificado el 3 de septiembre de 2026: `curl` a
arxiv, HN, Reddit y AlphaSignal devuelve `000` en los cuatro). Y `WebFetch` **pide aprobación
humana por cada URL** — en una tarea de domingo desatendida se queda colgada esperando.

**Solo `WebSearch` funciona sin aprobación.** Todo lo de abajo está diseñado para correr con
esa única herramienta. No intentes `curl`, no intentes `WebFetch`: no es que fallen, es que
la tarea se detiene a esperar a alguien que no está.

## Las tres capas

| Capa | Qué aporta | `allowed_domains` | Peso |
|---|---|---|---|
| **Síntoma** | el gancho, en palabras de quien lo sufre | `["community.openai.com"]` | **alto** |
| **Mecanismo** | el "por qué" que convierte queja en entendimiento | `["arxiv.org"]` | medio |
| **Cambio** | qué cambió que un negocio notaría (precio, acceso) | `["alphasignal.ai","alphasignalai.substack.com"]` · `["news.ycombinator.com"]` | bajo |

Sin la capa de síntoma no hay gancho. Sin la de mecanismo el carrusel es un consejo más.
La de cambio se descarta la mayoría de las semanas: casi todo es noticia para desarrolladores.

### Reddit está descartado, no olvidado

Se evaluó y **no se puede usar desde aquí**, por dos razones independientes:

1. El proxy **rechaza** `reddit.com` y `www.reddit.com` en `allowed_domains` (`PROXY_REJECTED`,
   HTTP 400), de forma consistente. *(Ojo: esto por sí solo no distingue nada — el proxy también
   bloquea `curl` a arXiv, HN y AlphaSignal, y esos tres sí se usan vía `WebSearch`.)*
2. **Esta es la razón de verdad**: Reddit bloquea el indexado de su contenido a todos los
   buscadores salvo Google desde 2024-2025, así que `WebSearch` no devuelve nada suyo.
   `old.reddit.com` y `m.reddit.com` sí se aceptan como dominio pero dan cero resultados.
   Cambiar la lista de permitidos no arreglaría esto.

`community.openai.com` lo sustituye, y para este propósito **es mejor**: son usuarios finales
de asistentes describiendo problemas concretos, no una mezcla de foro técnico y memes.
No vuelvas a intentar Reddit sin credenciales de su API.

## Cómo saber si algo es RECIENTE sin abrir la página

`WebSearch` ordena por relevancia, **no por fecha** — pedirle "papers de septiembre 2026"
devolvió como primer resultado uno de septiembre de 2025.

**arXiv es el caso fácil**: el ID es `YYMM.NNNNN` y se lee directo. `2608.11965` es agosto de
2026, `2307.03172` es julio de 2023. Sin ambigüedad.

**Los foros son el caso trampa, y ya cobró una víctima.** Los IDs de `community.openai.com` y
de Hacker News son secuenciales y crecientes, sí — pero **el ritmo no es constante**. Medido:
el foro de OpenAI produjo ~1.439 hilos/día entre diciembre de 2024 y abril de 2025, y ~344/día
entre abril de 2025 y julio de 2026. **Cuatro veces más lento.** Interpolar linealmente da
fechas muy equivocadas.

En la primera corrida de este motor pasó exactamente eso: se fijó "un piso de 1.1M" que este
documento nunca definió, y con él se etiquetaron como "de los últimos meses" tres hilos de
**febrero de 2025**. El piso no salió de ninguna medición: salió de la necesidad de que la
evidencia pasara. **Si te encuentras eligiendo un umbral después de ver la evidencia, ese es
el momento de parar.**

### La regla que sí funciona: dos señales, cero aritmética

Un hilo cuenta como reciente si cumple **las dos**:

1. **Techo del día.** Busca primero el anuncio de modelo más nuevo que encuentres
   (`allowed_domains: ["community.openai.com"]`, consulta tipo `introducing <modelo> now
   available`). Anota su ID: ese es el techo de hoy. Un hilo por encima o cerca del techo es
   reciente; uno cientos de miles por debajo, no. **Nunca conviertas la distancia en días.**
2. **El hilo se fecha solo.** El título o el fragmento nombra un modelo o una función. Un hilo
   que dice *"4-turbo instead of 4-o"* es de la era de GPT-4, por muy alto que parezca su ID.
   **Esta segunda señal manda sobre la primera.**

   **Pero nombrar el modelo actual solo acota "posterior a su lanzamiento", no "de este mes".**
   Un hilo de la primera semana de un modelo que lleva un año fuera pasa las dos señales y aun
   así es viejo. Regla: si el modelo lleva **más de dos meses** publicado, el hilo necesita un
   **ancla de calendario en su propio texto** — "después del apagón del 19 de agosto", "desde
   la actualización de la semana pasada". Sin ancla de calendario, no digas "de este mes":
   di "posterior al lanzamiento de X" y ya.

Si un candidato no tiene la segunda señal, o búscalo mejor o descártalo. Casi siempre existe
la versión actual del mismo síntoma: la gente se sigue quejando de lo mismo con el modelo
nuevo, y ese hilo es el que va.

**AlphaSignal** no lleva fecha en la URL. Su ancla es que el título nombre el modelo **del
momento** — y comprueba cuál es, no lo supongas: un artículo sobre "Opus 4.8" es de generación
anterior si el sitio ya publica sobre "Opus 5".

## Las consultas

Corre estas seis. Están escritas en inglés a propósito: el foro y los papers están en inglés,
y la traducción al español pasa después, cuando se escribe el carrusel.

**Síntoma** — `allowed_domains: ["community.openai.com"]`
1. `why does the AI keep forgetting what I told it earlier in the conversation frustrating`
2. `it says it read my whole document but it clearly only used part of it long file ignored`
3. `it told me it completed the task but it never actually did it claimed to have done`
4. Una cuarta **rotativa**, del tema que no hayas tocado en un mes: números y hojas de
   cálculo, imágenes y capturas, tono y estilo, traducción al español, archivos adjuntos,
   instrucciones que ignora.

**Mecanismo** — `allowed_domains: ["arxiv.org"]`
5. La consulta sale del síntoma que más se repitió arriba, en términos de investigación.
   Ejemplo real: síntoma "leyó mi documento a medias" → `why language models fail on long
   context lost in the middle position 2026`.

**Cambio** — `allowed_domains: ["alphasignal.ai","alphasignalai.substack.com"]`
6. `AI news week <mes> <año> model release what changed`

## Los cuatro filtros

Un candidato tiene que pasar **los cuatro**. El que falla uno se cae, no se negocia.

**G1 — ¿Le pasa a ELLA?**
El síntoma tiene que vivirse en una ventana de chat, no en una API. *"GPT-4-turbo no lee el
archivo completo por la API"* → fuera. *"Le subí mi PDF y contestó con la mitad"* → dentro.
La mayoría de los hilos del foro son de desarrolladores; esta criba tira la mitad.

**G2 — ¿Hay puente?**
Isabela tiene que poder **reproducir el síntoma en su propio chat en menos de diez minutos**.
Si no lo puede reproducir, no lo puede afirmar. Escribe cómo se reproduce, en una línea, o
descarta el tema. *(Este filtro es literalmente su propio carrusel c09: "El paper no miente:
miente el puente". Un hallazgo de laboratorio que ella no puede tocar no llega al feed.)*

Y el puente tiene que **poder salir mal**. Si el procedimiento ya anuncia su resultado
("la del medio es la que falla"), no es una prueba: es una demostración, y no distingue el
mecanismo que afirmas de los otros tres que producirían lo mismo. Antes de aceptar un puente,
escribe **qué otra causa daría el mismo resultado** y si el experimento la descarta. Si no la
descarta, o cambias el experimento o cambias el mecanismo — nunca publiques el mecanismo más
interesante como si el experimento lo hubiera probado.

**Extrapolar un paper es la forma más fácil de romper esto.** Un estudio de 2023 sobre modelos
de ventana corta, en una tarea de laboratorio, no explica lo que hace un producto de 2026 con
un PDF: entre medias hay extracción de texto, truncamiento, y la decisión del producto de leer
el archivo entero o indexarlo y buscar por trozos. Cualquiera de esas tres produce "leyó mi
documento a medias" y ninguna es el paper. **Cita el paper como lo que es —una explicación
posible— o no lo cites.**

**G3 — ¿Hay arreglo?**
¿Existe una acción concreta que el lector pueda hacer mañana? Si sí, es **corto**. Si el tema
solo se puede explicar, es **largo**. No fuerces un arreglo que no existe: inventar la vuelta
es peor que no publicar.

**G4 — ¿Es nuevo?**
No duplica nada del registro de abajo ni otro tema de la misma semana. Dos carruseles que
terminan en "dale más contexto" son el mismo carrusel dos veces.

**El registro de abajo NO es el universo completo.** `produccion-semanal.md` habla de 22
cortos pendientes y de un backlog de ideas de Pilar 2 que no está en este entorno — ni su
ubicación ni su tamaño están documentados en ningún sitio alcanzable, así que **no cites un
número**: di que existe y que no lo tienes. Comparar solo contra los 13
publicados es una criba con el fondo abierto. Antes de aceptar un candidato, compáralo también
contra el backlog; si no lo tienes a mano en esa sesión, **dilo en la entrega** en vez de
declarar "cero solapamiento" sobre una comparación parcial.

**El duplicado se detecta por el ARREGLO, no por el titular.** Dos temas con síntomas distintos
que terminan en la misma acción son un solo carrusel. Escribe el arreglo de cada candidato en
una frase y compáralas entre sí antes de asignar slots.

## El carril recap busca otra cosa

Las tres capas de arriba buscan **síntomas**: alguien que sufre algo en su chat. Eso alimenta
el largo y el corto. El recap necesita lo contrario: **hechos con fecha** — qué lanzó quién
esta semana.

| | largo y corto | recap |
|---|---|---|
| Qué se busca | una queja que se repite | un anuncio con fecha |
| Dónde | `community.openai.com`, `arxiv.org` | blogs oficiales, notas de versión |
| Cuándo importa | el síntoma no caduca | **caduca en días** |
| Qué lo tumba | no hay puente, no hay arreglo | la fuente no lo respalda |

Consultas que sirven, en `WebSearch`:

```
site:releasebot.io anthropic september 2026
"release notes" OR "changelog" anthropic OR openai OR google ai <semana>
```

**El filtro que manda aquí no es G1 ni G2: es la fuente.** Una noticia cuya página no diga lo
que el slide afirma no se publica, y eso se comprueba con:

```bash
cd recap && node comprobar-fuentes.mjs
```

Ese script existe porque el fallo ya ocurrió: el primer mazo tenía tres noticias citando
páginas que no las respaldaban, y ni el validador ni quien lo escribió lo vieron. Caza que la
página no hable del tema y caza una cifra ausente; **no caza un matiz falso** sobre algo que
la página sí menciona. Eso sigue pidiendo que alguien la abra.

### Cuántas noticias, y de qué variante

`recap/SCHEMA-RECAP.md` define cuatro variantes y cada una pide un campo distinto. El domingo
elige **una** —no las cuatro— según lo que dé la semana:

- muchas noticias sin fondo → `completo`
- pocas pero explicables → `mecanismo`
- alguna con acción clara → `accionable` o `negocio`

Y ojo con el duplicado: dos variantes que expliquen la misma noticia con el mismo enfoque son
el mismo post dos veces.

## Asignación de slot

| Slot | Días | Formato | Voz | Lo que hace |
|---|---|---|---|---|
| Largo | martes, jueves | 10 slides | segunda persona, **Isabela no aparece** | explica **por qué** falla |
| Corto | lunes, miércoles, viernes | 5-7 slides | primera persona, **Isabela aparece** | dice **qué hacer** |

Un tema con mecanismo fuerte y sin arreglo → largo. Con arreglo claro → corto.
Un tema con las dos cosas se puede partir en pareja: el largo el martes explica el porqué, el
corto del viernes da la vuelta. Los pares funcionan; los duplicados no.

## Lo que entrega el domingo

Una tabla de **cinco filas asignadas y tres de reserva**. Cada fila:

| Campo | Qué lleva |
|---|---|
| `síntoma` | la queja en palabras de quien la escribió, no parafraseada a la marca |
| `evidencia` | la URL del hilo o el paper, tal cual salió de la búsqueda |
| `recencia` | el ID leído de la URL, para que se pueda auditar |
| `mecanismo` | por qué pasa, en una frase |
| `puente` | cómo lo reproduce ella en su chat |
| `arreglo` | la acción concreta, o "no hay — va de largo" |
| `slot` | día y formato |
| `firma pendiente` | **solo cortos**: la frase de credibilidad propuesta, para que Isabela la confirme |

Esa última columna es el enganche con el motor del formato corto: `build-corto.mjs` **se cae**
si una frase en primera persona sobre sus clientes no trae `"verificado": true`. La tarea del
domingo no produce carruseles cerrados: produce carruseles **más una lista corta de frases que
solo ella puede firmar**. Eso es a propósito y no se salta.

**Todo corto lleva frase de firma, sin excepción**, porque el beat de credibilidad la exige
exista o no una frase sospechosa. Un corto entregado con esa celda vacía no se puede construir.

**La frase de firma no puede colar una métrica.** "Siempre", "todos", "ninguno", "el 80%" son
cifras disfrazadas de anécdota, y la firma de Isabela no las vuelve ciertas: las blanquea. Las
frases que ya existen en el mazo dan el patrón correcto — *"Casi siempre salió del chat"*,
*"Me escriben para preguntarme…"*: observacionales, con cobertura, sin absolutos. Y no le
atribuyas una práctica que no consta en ningún lado.

### Espacio en la cola (comprobar ANTES de asignar slots)

Buffer gratuito topa en **10 publicaciones en cola**. Si la cola ya está llena de largos, los
cortos de esta semana **no caben**, y publicarlos exige sacar largos primero — los más lejanos,
empezando por el del final. Eso está descrito en `produccion-semanal.md` y **no es gratis ni
automático**: si no lo haces, la semana se publica sin cortos y nadie se entera hasta el lunes.
Corre `list_posts` antes de asignar, y si no hay huecos, dilo en la entrega.

## Registro de lo ya cubierto

No propongas ninguno de estos. Actualiza la lista cuando se publique algo nuevo.

**Largos — en ORDEN DE PUBLICACIÓN, que es el que importa**

El número es el prefijo de `img/NN-MM.png` en el repo **y** el orden en la cola de Buffer.
Una versión anterior de esta tabla usaba otra numeración y **7 de 10 no coincidían**: una
sesión que siguiera la regla *"quita el del final hacia atrás"* habría borrado el carrusel
equivocado. Si renumeras algo, comprueba contra `list_posts` y contra `img/`.

| `img/NN` | Publica | Tema | Arreglo que enseña |
|---|---|---|---|
| 01 | 8 sep | por qué olvida lo que ya le dijiste | **parte por tema, pega el fragmento y no el documento entero** |
| 02 | 10 sep | le preguntas por hoy y contesta con el mundo de hace meses | duda de la fecha, confirma el dato |
| 03 | 15 sep | sonaba perfecto y no era lo que pediste | muestra en vez de describir, verifica |
| 04 | 17 sep | el prompt mágico que en tus manos no hace nada | quita lo que adorna, deja lo que informa |
| 05 | 22 sep | misma pregunta, otra respuesta | repite, compara, elige con criterio propio |
| 06 | 24 sep | por qué no aprende de lo que le corriges | anota la corrección fuera del chat |
| 07 | 29 sep | te interrumpe o te deja hablando solo (voz) | decide qué prefieres, no hay ajuste perfecto |
| 08 | 1 oct | ves "pensando…" y bajas la guardia | pregunta al revés, pide contras |
| 09 | 6 oct | el paper no miente: miente el puente (devs) | abre la fuente, busca la condición |
| 10 | 8 oct | los 4 dólares la hora no son 4 dólares la hora (devs) | cuenta los intentos antes de opinar |

**La columna del arreglo es la que se compara**, no la del tema. Es lo que se saltó la primera
corrida: propuso un corto cuyo arreglo ("dile en qué sección buscar, o pártelo") es palabra por
palabra el del largo del día siguiente.

**Cortos**

| # | Tema | Estado |
|---|---|---|
| s01 | le pediste que escribiera como tú y salió un folleto | firmado, listo |
| s02 | pegaste la tabla y te inventó los totales | falta firma |
| s03 | le explicas tu negocio otra vez cada mañana | falta firma |

**Territorio quemado**: la amnesia del chat está cubierta tres veces (c02, c08, s03). No más
carruseles sobre memoria salvo que aparezca un ángulo que ninguno toque.

## Verificación del propio motor

Antes de entregar la selección del domingo:

1. Cada URL salió de un resultado de búsqueda **de esta corrida**, no de memoria. Una URL que
   no puedas señalar en una salida de `WebSearch` de hoy no va.
2. Cada candidato trae su ancla de recencia leída de la URL.
3. Los cinco pasan G1-G4, y está escrito por qué.
4. Cero solapamiento con el registro.
5. Lanza un agente a **refutar** la selección: que busque un tema duplicado, un puente que no
   se sostiene, una fuente vieja disfrazada de nueva, o un arreglo inventado.

Si una semana no salen cinco temas que pasen los filtros, **entrega los que pasen y dilo**.
Cuatro temas buenos y una explicación honesta valen más que cinco con uno forzado.
