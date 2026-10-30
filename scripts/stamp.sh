#!/bin/sh
# Stamp index.html with a version taken from the code itself, so browsers fetch fresh copies
# of the scripts and styles after every change instead of mixing cached old files with new ones.
# Run before committing a change to css/ or js/.
cd "$(dirname "$0")/.." || exit 1
v=$(cat css/style.css js/viewer.js js/pyramids/*.js | shasum | cut -c1-8)
sed -i.bak -E "s/\?v=[a-z0-9]+/?v=$v/g" index.html && rm index.html.bak
echo "index.html stamped v=$v"
