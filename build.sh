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
    printf '<style>body{margin:0}</style>\n'
    cat "$src"
    printf '\n</html>\n'
  } > "$dst"
}

wrap ../unicorn-star-catch/index.html unicorn/index.html en
wrap ../ore-rush/index.html ore-rush/index.html en
wrap ../key-siege/index.html key-siege/index.html lt
echo "built: unicorn, ore-rush, key-siege"
