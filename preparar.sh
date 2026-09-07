#!/usr/bin/env bash
# Deja el repo listo para correr los dos motores en una máquina nueva.
#
#   ./preparar.sh
#
# Instala las dependencias de motor/ y corto/, descarga el Chromium que pide
# Playwright si falta, y escribe entorno.sh con la ruta del navegador. Es
# idempotente: correrlo dos veces no rompe nada.
set -euo pipefail
cd "$(dirname "$0")"
raiz="$(pwd)"

command -v node >/dev/null || { echo "falta node (brew install node)"; exit 1; }
command -v python3 >/dev/null || echo "aviso: falta python3, check-titulares.py no correrá"

for d in motor corto recap; do
  echo "→ $d"
  (cd "$d" && npm i --silent --no-audit --no-fund)
done

# Las dos carpetas fijan la MISMA versión a propósito: con ^ una subía de menor
# y pedía un Chromium distinto al descargado, y los verificadores morían con
# "executable doesn't exist".
vm=$(node -e "console.log(require('$raiz/motor/node_modules/playwright/package.json').version)")
vc=$(node -e "console.log(require('$raiz/corto/node_modules/playwright/package.json').version)")
[ "$vm" = "$vc" ] || { echo "playwright desalineado: motor $vm, corto $vc"; exit 1; }

chromium=$(node -e "console.log(require('$raiz/corto/node_modules/playwright').chromium.executablePath())")
if [ ! -f "$chromium" ]; then
  echo "→ descargando chromium"
  (cd corto && npx --yes playwright install chromium)
  chromium=$(node -e "console.log(require('$raiz/corto/node_modules/playwright').chromium.executablePath())")
fi
[ -f "$chromium" ] || { echo "no se pudo obtener chromium"; exit 1; }

cat > entorno.sh <<EOS
# Generado por preparar.sh. Cárgalo antes de correr los verificadores:
#   source entorno.sh
export CHROMIUM_PATH="$chromium"
EOS

echo
echo "listo. playwright $vm"
echo
echo "  source entorno.sh"
echo "  cd corto  && node pruebas/prueba-guardas.mjs   # 85/85"
echo "  cd motor  && node build.mjs && node check.mjs"
