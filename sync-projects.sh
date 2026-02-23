#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BASE_DIR=$(dirname "$ROOT_DIR")
FOOD_SRC="$BASE_DIR/food-menu-picker"
LOTTO_SRC="$BASE_DIR/lotto-random-generator/public"

for required_dir in "$FOOD_SRC" "$LOTTO_SRC"; do
  if [ ! -d "$required_dir" ]; then
    echo "Missing source directory: $required_dir" >&2
    exit 1
  fi
done

mkdir -p \
  "$ROOT_DIR/food-menu-picker" \
  "$ROOT_DIR/lotto-random-generator" \
  "$ROOT_DIR/docs/food-menu-picker" \
  "$ROOT_DIR/docs/lotto-random-generator"

cp -f \
  "$FOOD_SRC/index.html" \
  "$FOOD_SRC/app.js" \
  "$FOOD_SRC/styles.css" \
  "$FOOD_SRC/robots.txt" \
  "$FOOD_SRC/sitemap.xml" \
  "$ROOT_DIR/food-menu-picker/"

cp -f \
  "$FOOD_SRC/index.html" \
  "$FOOD_SRC/app.js" \
  "$FOOD_SRC/styles.css" \
  "$FOOD_SRC/robots.txt" \
  "$FOOD_SRC/sitemap.xml" \
  "$ROOT_DIR/docs/food-menu-picker/"

cp -f "$LOTTO_SRC"/* "$ROOT_DIR/lotto-random-generator/"
cp -f "$LOTTO_SRC"/* "$ROOT_DIR/docs/lotto-random-generator/"

cp -f "$ROOT_DIR/index.html" "$ROOT_DIR/docs/index.html"
rm -rf \
  "$ROOT_DIR/docs/assets" \
  "$ROOT_DIR/docs/tools" \
  "$ROOT_DIR/docs/products" \
  "$ROOT_DIR/docs/now" \
  "$ROOT_DIR/docs/stories"

cp -R "$ROOT_DIR/assets" "$ROOT_DIR/docs/assets"
cp -R "$ROOT_DIR/tools" "$ROOT_DIR/docs/tools"
cp -R "$ROOT_DIR/products" "$ROOT_DIR/docs/products"
cp -R "$ROOT_DIR/now" "$ROOT_DIR/docs/now"
cp -R "$ROOT_DIR/stories" "$ROOT_DIR/docs/stories"

echo "Synced projects and site pages into docs/."
