#!/usr/bin/env bash
set -euo pipefail

# Paths
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BINDINGS_DIR="$ROOT_DIR/../GeoPlegma/gp-bindings/js"
NATIVE_DIR="$ROOT_DIR/src/native"

# Ensure target dir exists
mkdir -p "$NATIVE_DIR"

echo "🚀 Building native bindings from GeoPlegma..."
(
  cd "$BINDINGS_DIR"
  napi build --output-dir $BINDINGS_DIR/dist --release
)

echo "📦 Copying .node files to GeoPlegma-js/src/native/"
cp "$BINDINGS_DIR/dist"/*.node "$NATIVE_DIR/"
cp "$BINDINGS_DIR/dist"/*.d.ts "$NATIVE_DIR/"

echo "✅ Done! Native files available in $NATIVE_DIR"
