#!/usr/bin/env bash
set -euo pipefail

TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"
if ! [[ "$TARGET_SHA" =~ ^[a-fA-F0-9]{40}$ ]]; then
  echo "Invalid AUTONOMIA_DEPLOY_SHA"
  exit 1
fi

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_DIR="$(cd "$SITE_DIR/.." && pwd)"
cd "$REPO_DIR"

echo "Deploying public site commit $TARGET_SHA"
git fetch origin public-site-production

if ! git merge-base --is-ancestor "$TARGET_SHA" "origin/public-site-production"; then
  echo "Target SHA is not an ancestor of origin/public-site-production"
  exit 1
fi

git reset --hard "$TARGET_SHA"

cd "$SITE_DIR"
npm install --ignore-scripts --no-audit --no-fund
npm run content:validate
npm run build

mkdir -p .runtime tmp
printf '%s\n' "$TARGET_SHA" > .runtime/deployed-sha
touch tmp/restart.txt

echo "Public site deployed: $TARGET_SHA"
