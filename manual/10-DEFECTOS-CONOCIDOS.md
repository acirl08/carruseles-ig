# 10 · Defectos conocidos

Cada uno se cometió de verdad. Reviso esta lista antes de entregar cualquier cosa.

## De contenido

| Defecto | Cómo se ve | Guarda |
|---|---|---|
| **Titulares clonados** | nueve de diez slides 02 empezaban con "El ciclo que…" | `check-titulares.py`, regla de arranques distintos |
| **Titular que se copia a sí mismo** | un titular repetía siete palabras del `eyebrow` de su propio slide 01 | `check-titulares.py`, regla de repeticiones |
| **Titular que dice la tesis de otro** | un slide 02 enunciaba el tema de otro carrusel del lote | ninguna. Solo el refutador |
| **Titulares idénticos entre carruseles** | "Qué significa esto y qué no" en seis de diez; "Lo que sí te conviene recordar" en seis | ninguna. **Sigue sin corregir** |
| **Un titular que cuenta mal** | *"Un archivo. CUATRO cosas."* sobre una lista de tres | sí, en `build-corto.mjs` |
| **Arreglo duplicado** | un corto cuyo consejo era palabra por palabra el del largo del día siguiente | ninguna. Se compara a mano, **por arreglo, no por titular** |
| **Mecanismo equivocado** | un paper de 2023 explicando el comportamiento de un producto de 2026 | ninguna. Solo el refutador |
| **Dato técnico falso** | "el asistente no tiene tareas en segundo plano" — sí las tiene | ninguna. Solo el refutador |
| **Métrica disfrazada de anécdota** | *"el error **siempre** está en las páginas de en medio"* | sí, la regla de cifras |

## De verificación

| Defecto | Qué pasaba |
|---|---|
| **Umbral elegido después de ver la evidencia** | se inventó "un piso de 1.1M" para que tres hilos de febrero de 2025 pasaran como recientes |
| **Guarda inerte** | medía `\|arriba − abajo\|`, que con `justify-content:center` vale siempre ~5: una constante de CSS, no una medición |
| **Guarda sin prueba** | dieciocho reglas se podían borrar sin que la suite bajara de verde |
| **Suite de un solo lado** | solo probaba rechazos, así que no veía cuándo la regla rechazaba de más |
| **Punto ciego del vacío** | todas las guardas empezaban con `if (tinta.length)`, así que cero tinta daba cero hallazgos |
| **Tabla de referencia rancia** | el registro de largos tenía 7 de 10 mal numerados: siguiendo "quita el del final" se habría borrado el equivocado |
| **Spec rancia** | `SCHEMA.md` describió 11 slides y un beat `cta` durante días después de la fusión a 10 |

## Técnicos

| Defecto | Causa |
|---|---|
| `vector-effect` no se hereda en SVG | va en cada forma, no en el `<g>` padre |
| El verificador medía la caja, no la tinta | un `<g>` puede tener caja enorme y dibujar cuatro trazos |
| `fit()` encogía sin motivo | `getBoundingClientRect` devuelve la caja **ya transformada**, y la hoja de contacto usa `transform:scale(.5)`. Hay que normalizar con `k = 1350 / altura_medida` |
| `</script>` en el copy rompía la página | ahora se escapa con `<` y una lista blanca |
| Un `<` suelto se comía el resto del slide | mismo escapado |
| `const chrome` chocaba con `window.chrome` | renombrado a `marco` |
| `String.raw` en el render | dejaba `${}` literal; la página salía con cero slides |
| Inyección de atributo por `ts` | `"40px\" data-x=\""` abría un atributo. Cerrado en dos capas |
| `$1` y `$2` marcados como dinero | contar dígitos no distingue un marcador de prompt de un precio |
| El `\b` mató los porcentajes | `%`, `€` y `$` no son caracteres de palabra: un `\b` detrás nunca dispara |
| Un `TypeError` dejaba la página vacía y el check aprobaba | ahora escucha `pageerror` y compara el conteo de slides |

## De proceso

- **Presentar un bloqueo con la causa equivocada.** Se dijo "los cortos no existen todavía"
  cuando la causa real era "no puedo escribir en el repo". La primera suena a que falta
  trabajo; la segunda dice quién tiene que actuar.
- **Devolverle a Isabela una decisión que ya había tomado.** Ya había autorizado el
  intercambio de cola, y se le volvió a preguntar.
- **Reescribir su texto para complacer a un validador.** El orden de autoridad es al revés.
