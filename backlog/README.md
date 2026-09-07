# El backlog vive aquí

Cerraba el hueco 1 de `13-HUECOS`: existían **22 cortos pendientes** y un backlog de ideas de
Pilar 2, pero su ubicación no estaba documentada en ninguna parte alcanzable. Consecuencia:
el motor de señal comparaba duplicados contra los 13 temas publicados cuando el universo real
es mayor — una criba con el fondo abierto.

## Por qué en el repo y no en una carpeta local

La tarea del domingo **arranca en una sesión vacía**, sin la Mac de Isabela: no hay archivos
del pasado, no hay memoria de la conversación anterior. `07-AUTOMATIZACION.md` lo dice —
*"todo lo que necesite tiene que estar en los dos documentos del proyecto o en el repo"*.

Un archivo en `~/Documents` es invisible para esa sesión. El repo ya se lee por
`raw.githubusercontent.com` en el paso 4 del pipeline, así que no añade dependencia nueva:
usa el camino que ya funciona.

Un Google Doc o Notion tampoco sirven: `WebFetch` pide aprobación humana por cada URL, y un
domingo desatendido se queda esperando a alguien que no está.

## Los archivos

| Archivo | Qué lleva |
|---|---|
| `pendientes.json` | los temas que aún no se han publicado |
| `publicados.json` | lo que ya salió, para comparar duplicados |

## Cómo se usa el domingo

```
https://raw.githubusercontent.com/acirl08/carruseles-ig/main/backlog/pendientes.json
```

El motor de señal compara cada candidato contra **los dos** archivos. Y el duplicado se
detecta por el **arreglo**, no por el titular: dos síntomas distintos con el mismo mecanismo
son el mismo carrusel.

## Cómo se añade una idea

Edita `pendientes.json`, corre el verificador, sube:

```bash
node backlog/check-backlog.mjs      # "sin hallazgos" o no subas
```

## Lo que este archivo NO sabe

Los 22 cortos pendientes reales y el backlog de Pilar 2 **no están aquí**: nunca estuvieron en
un sitio alcanzable. Lo que hay es la estructura y el verificador. **El contenido lo pone
Isabela** — hasta que lo haga, el fondo de la criba sigue abierto y el motor debe decirlo en
la entrega, como manda `05`.
