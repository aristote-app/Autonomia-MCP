#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
BRANCH="main"

source "$NODE_ENV_ACTIVATE"
set -u
cd "$APP_ROOT"

git fetch --depth=1 origin "$BRANCH"

LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || true)"
REMOTE_SHA="$(git rev-parse "origin/$BRANCH")"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
  echo "Autonomia cockpit already up to date: $LOCAL_SHA"
  exit 0
fi

echo "Deploying Autonomia cockpit: $LOCAL_SHA -> $REMOTE_SHA"
git reset --hard "origin/$BRANCH"

npm install --no-audit --no-fund --package-lock=false
npm run build

mkdir -p tmp
touch tmp/restart.txt

echo "Autonomia cockpit deployed: $REMOTE_SHA"
