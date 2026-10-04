#!/bin/sh
# Wraps the game sources (written as page fragments) into standalone pages for GitHub Pages.
# Run from anywhere: ./build.sh
set -e
cd "$(dirname "$0")"

wrap() {
  src="$1"; dst="$2"; lang="$3"
  mkdir -p "$(dirname "$dst")"
  {
    printf '<!doctype html>\n<html lang="%s">\n<head>\n<meta charset="utf-8">\n' "$lang"
    printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    printf '<style>body{margin:0}'
    printf '.zm-back{display:inline-flex;align-items:center;justify-self:center;align-self:center;font:900 0.95rem "Nunito","Arial Rounded MT Bold",system-ui,sans-serif;color:#f3f0f7;text-decoration:none;background:#3b3846;border:3px solid;border-color:#6e6a7c #1f1c27 #1f1c27 #6e6a7c;box-shadow:0 0 0 2px #000;padding:5px 12px;touch-action:manipulation;white-space:nowrap}'
    printf '.zm-back:focus-visible{outline:3px solid #4de8d6;outline-offset:3px}</style>\n'
    printf '<script src="../zm.js"></script>\n'
    # the <!--ZM-BACK--> marker becomes a link back to the menu (it stays invisible in the claude.ai versions)
    sed 's|<!--ZM-BACK-->|<a class="zm-back" href="../">← Meniu</a>|g' "$src"
    printf '\n</html>\n'
  } > "$dst"
}

wrap ../unicorn-star-catch/index.html unicorn/index.html en
wrap ../ore-rush/index.html ore-rush/index.html en
wrap ../key-siege/index.html key-siege/index.html lt
wrap ../robot-miner/index.html robot-miner/index.html lt
wrap ../word-builder/index.html word-builder/index.html lt
wrap ../element-craft/index.html element-craft/index.html lt
wrap ../bug-hunt/index.html bug-hunt/index.html lt
wrap ../sorting-factory/index.html sorting-factory/index.html lt
wrap ../bitas-draws/index.html bitas-draws/index.html lt
wrap ../binary-picture/index.html binary-picture/index.html lt
wrap ../robo-mokinys/index.html robo-mokinys/index.html lt
echo "built: 11 games"
