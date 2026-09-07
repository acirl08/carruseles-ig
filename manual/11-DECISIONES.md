# 11 · Decisiones — qué se decidió, cuándo y por qué

Este registro existe para **no volver a discutir lo decidido**. Si algo de aquí se cambia, se
cambia aquí, con fecha y con el motivo.

## Estrategia

| Decisión | Cuándo | Por qué |
|---|---|---|
| La prioridad es **crecer y construir credibilidad**, no convertir | ago 2026 | Instagram es la cuenta chica frente a TikTok; primero hay que llegar |
| El mecanismo de conversión (keyword → DM) queda **apagado** | 2 sep | es engagement bait y dispara no-recomendación. El material sigue escrito por si algún día se enciende, pero no se enciende por cuenta propia |
| **Cinco publicaciones por semana**: 2 largos + 3 cortos | 2 sep | dos carriles con trabajos distintos, no una sola frecuencia |
| Convertir todo el backlog en carruseles y **no grabar video** por ahora | ago 2026 | el formato de carrusel no depende de su disponibilidad para grabar |
| Referencia de formato: **@noveira.dev** | ago 2026 | publica puros carruseles |
| Empezar con fuentes gratuitas antes de pagar por raspado | 2 sep | Apify cuesta ~$3/mes y **nunca** puede devolver guardados ni compartidos, que son las señales que importan |

## Formato

| Decisión | Cuándo | Por qué |
|---|---|---|
| El largo pasa de **11 a 10 slides** | 2 sep | la API de Instagram topa los carruseles en 10 imágenes. Se fusionaron `cierre` y `cta` en `final` |
| El slide 02 es una **segunda portada** | 2 sep | quien se sale de un carrusel a menudo lo retoma por el slide 2 (Mosseri, oct 2024 — dijo "often", sin número) |
| El cierre lleva **una línea de compartir** | 2 sep | los sends son una de las tres señales que más pesan. El skill decía "una sola petición"; Isabela autorizó la excepción |
| Ilustración **line-art monolineal**, sin sombreado | ago 2026 | tiene que compartir trazo con marcos y flechas y no verse pegada encima |
| **Pichu solo en el largo** | 2-3 sep | el corto tiene su propio sistema visual, con bocadillo y píldora |
| El corto lo genera el motor, **sin foto de Isabela** | 2 sep | el skill original la hacía en Canva con foto suya; así la producción no depende de ella |
| El corto usa **1080×1350**, no 540×675 | 2 sep | es el mismo 4:5 al doble, y los dos carriles comparten cuadrícula en el perfil |
| El corto **también** cierra pidiendo seguir y compartir | 2 sep | coherente con el apagado de la conversión |

## Publicación

| Decisión | Cuándo | Por qué |
|---|---|---|
| **Buffer**, no Metricool | 2 sep | El argumento original era de topes (Metricool 20/mes vs. Buffer 10 en cola) y **caducó el 7 sep**, cuando el plan de pago subió Buffer a 5000. La decisión se sostiene por otra razón, que era la de fondo: Buffer permite `schedulingType: notification`, y ese es el modo que deja a Isabela poner música al publicar. Sin música el carrusel no entra a Reels |
| **Modo notificación**, nunca automático | 2 sep | es la única forma de ponerle música, y sin música el carrusel no entra a Reels |
| Martes y jueves, 7 pm de Monterrey | 2 sep | los largos. Los cortos van lunes, miércoles y viernes |
| **Quitar largos de la cola para meter cortos**, y reponerlos | 2 sep | *"quito de la cola los últimos largos para dejarle espacio a los cortos y los repongo conforme se vacíe"*. **Autorización dada: no hace falta volver a preguntar** |
| Repo público `acirl08/carruseles-ig` para hospedar las imágenes | 2 sep | Buffer necesita URLs públicas, y GitHub es el único host que el entorno alcanza |

## Fuentes de señal

| Decisión | Cuándo | Por qué |
|---|---|---|
| arXiv + Hacker News + AlphaSignal como fuentes | 3 sep | gratis, indexadas, sin credenciales |
| **Reddit descartado** | 3 sep | **Reddit bloquea el indexado fuera de Google desde 2024**, así que `WebSearch` no devuelve nada suyo — esa es la razón que decide (el proxy también bloquea arXiv y HN, y esos sí se usan). No volver a intentarlo sin credenciales de su API |
| **`community.openai.com` sustituye a Reddit** | 3 sep | son usuarios finales describiendo problemas concretos, que es justo la materia prima de una portada |
| Todo el motor corre con **`WebSearch` únicamente** | 3 sep | `curl` no sale, y `WebFetch` pide aprobación humana por URL |
| No se copian estrategias de competidores | 3 sep | 11 de las 13 cuentas de referencia hacen reels a cámara, no su formato. Un estudio de *Journal of Marketing* de 2025 apunta en la misma dirección, **pero es sobre minoristas en X/Twitter y no traslada directo** — ver `13` Parte C |

## Proceso

| Decisión | Cuándo | Por qué |
|---|---|---|
| **Agente refutador obligatorio** antes de entregar | 2 sep | todas las rondas encontraron defectos que los scripts aprobaron |
| **Mirar los PNG** siempre, aunque los verificadores estén verdes | 2 sep | medir cajas no es ver |
| La **firma de Isabela** es obligatoria en el corto y el build se cae sin ella | 3 sep | nada en el pipeline puede comprobar lo que ella ve con sus clientes |
| Un falso positivo se arregla **cambiando la regla, no el copy** | 3 sep | pasó al revés una vez, y el orden de autoridad es: ella > la spec > las pruebas > el código |
| Cada guarda nueva **trae su caso roto** | 3 sep | dieciocho reglas resultaron ser comentarios sin prueba detrás |
| La suite prueba **las dos direcciones** | 3 sep | tres rondas seguidas se rompió por rechazar de más y no verlo |

## Lo que sigue abierto

- **Los 22 cortos pendientes y el backlog de ideas de Pilar 2** no están en este entorno, y
  su ubicación no está documentada en ninguna parte alcanzable. Hasta que estén, el motor de
  señal compara duplicados contra 13 temas y el universo real es mayor — cuánto, no se sabe.
  **Esto hay que resolverlo con Isabela**: es el hueco más grande del sistema.
- **Encender o no la conversión** más adelante. El material está escrito y apagado.
- **Apify**, apuntado solo a las dos cuentas que sí hacen su formato (`@ai._kid` y `@raycfu`),
  y con la instrucción invertida: no para copiar, para saber qué evitar.
