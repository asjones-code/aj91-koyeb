#!/usr/bin/env bash
# Copy Offshore's shared code from its own repo (the source of truth) into offshore/src.
# Runs Offshore's unit tests first and refuses to copy if they fail.
# Pages (offshore/*.html) are owned by this repo and are not touched.
#
# Usage: scripts/sync-offshore.sh [path-to-offshore-repo]
set -euo pipefail

SRC="${1:-${OFFSHORE_REPO:-$HOME/Development/offshore}}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/offshore"

[ -d "$SRC/src/core" ] || { echo "No Offshore repo at $SRC" >&2; exit 1; }

echo "Running Offshore unit tests in $SRC"
(cd "$SRC" && npm test --silent)

mkdir -p "$DEST/src/styles" "$DEST/src/scripts"
rsync -a --delete "$SRC/src/core/" "$DEST/src/core/"
rsync -a --delete "$SRC/src/platform/" "$DEST/src/platform/"
cp "$SRC/src/styles/ocean.css" "$DEST/src/styles/ocean.css"
cp "$SRC/src/scripts/ocean.js" "$DEST/src/scripts/ocean.js"

COMMIT="$(git -C "$SRC" rev-parse --short HEAD)"
DIRTY="$(git -C "$SRC" status --porcelain -- src/core src/platform src/styles/ocean.css src/scripts/ocean.js)"
{
  echo "Copied from the Offshore repo by scripts/sync-offshore.sh. Do not edit these here; change them there and re-sync."
  echo "commit: $COMMIT${DIRTY:+ (with uncommitted changes)}"
  echo "paths: src/core/ src/platform/ src/styles/ocean.css src/scripts/ocean.js"
} > "$DEST/VENDORED_FROM"

echo "Synced from $COMMIT${DIRTY:+ (dirty)} into $DEST"
