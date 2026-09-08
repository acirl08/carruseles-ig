# De dónde sale la información

El motor de señal tiene tres capas (`manual/05-MOTOR-DE-SENAL.md`). Este directorio es la
**ingesta**: baja lo que publican esas fuentes y lo deja en un archivo con fecha, para que
elegir tema deje de depender de qué devuelva un buscador ese día.

## Las fuentes, y por qué cada una

| Fuente | Qué aporta | Cómo se lee | Trae fecha |
|---|---|---|---|
| `community.openai.com` | **el síntoma**: alguien sufriendo algo en su chat | `latest.json` | **sí**, `created_at` |
| `alphasignal.ai` | **qué hace** lo que salió, no que salió | `feed.xml` (RSS) | **sí**, `pubDate` |
| `arxiv.org` | el mecanismo, el *por qué* | búsqueda | sí, en el ID |
| `news.ycombinator.com` | qué cambió que un negocio note | `rss` | sí |

**`evolving.ai` no está aquí**, y es deliberado: es una cuenta de Instagram, no una fuente
con feed. De ella se toma la **idea de formato** —contar qué hace la cosa, no que salió— no
sus datos ni sus imágenes. Tomar el hecho «OpenAI sacó un modelo» es legítimo; descargar sus
fotos de prensa no.

## Lo que esto resuelve

**Recencia sin adivinar.** Antes había que estimar la fecha de un hilo por su ID, y el manual
documenta que eso ya falló: se publicaron como recientes tres hilos de febrero de 2025.
`latest.json` y el RSS traen la fecha real. Se acabó el cálculo.

**Cobertura.** Buscar devuelve lo que el buscador considera relevante, que suele ser lo más
citado — y lo más citado es lo más viejo. Bajar el feed devuelve lo más nuevo.

## Cómo se usa

```bash
node fuentes/ingesta.mjs            # baja todo a fuentes/crudo/<fecha>.json
node fuentes/ingesta.mjs --dias 3   # solo lo de los últimos 3 días
```

Deja un archivo por corrida. El motor de señal lee de ahí en vez de buscar a ciegas, y los
cuatro filtros (G1 a G4) se aplican igual.

## Lo que la ingesta NO hace

No decide temas. Baja material con su fecha y su URL; **elegir sigue siendo del motor de
señal**, con sus cuatro filtros. Y `comprobar-fuentes.mjs` sigue abriendo cada URL antes de
publicar: que algo venga de un feed no prueba que el slide diga lo que la página dice.
