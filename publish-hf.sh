#!/usr/bin/env bash
# Publish this mirror to Hugging Face (dataset repo modelfit/modelfit-hardware-dataset).
#
# Requires: hf CLI logged in with a WRITE token (hf auth login), or HF_TOKEN env.
# Usage: bash publish-hf.sh
#
# README.md on the Hub is the dataset card (hf-card.md here); the GitHub-facing
# README stays clean. models.json/models.csv are regenerated first.
set -euo pipefail

REPO="modelfit/modelfit-hardware-dataset"
cd "$(dirname "$0")"

node generate.mjs

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

cp models.json models.csv LICENSE CITATION.cff generate.mjs "$WORK/"
cp hf-card.md "$WORK/README.md"

hf upload "$REPO" "$WORK" . --repo-type dataset \
  --commit-message "Sync $(date -u +%Y-%m-%d): $(python3 -c 'import json;print(len(json.load(open("models.json"))["models"]))') models"

echo "Done: https://huggingface.co/datasets/$REPO"
