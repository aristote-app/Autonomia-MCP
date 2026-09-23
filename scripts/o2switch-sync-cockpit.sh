#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
BRANCH="main"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"
TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"

source "$NODE_ENV_ACTIVATE"
set -u
cd "$APP_ROOT"

git fetch --depth=200 origin "$BRANCH"
MAIN_SHA="$(git rev-parse "origin/$BRANCH")"

if [ -n "$TARGET_SHA" ]; then
  if ! [[ "$TARGET_SHA" =~ ^[a-f0-9]{40}$ ]]; then
    echo "Invalid AUTONOMIA_DEPLOY_SHA: $TARGET_SHA" >&2
    exit 1
  fi

  if ! git cat-file -e "$TARGET_SHA^{commit}" 2>/dev/null; then
    git fetch --depth=1 origin "$TARGET_SHA"
  fi

  if [ "$TARGET_SHA" != "$MAIN_SHA" ] && ! git merge-base --is-ancestor "$TARGET_SHA" "$MAIN_SHA"; then
    echo "Refusing deploy: target SHA is not on origin/main." >&2
    exit 1
  fi

  REMOTE_SHA="$TARGET_SHA"
else
  REMOTE_SHA="$MAIN_SHA"
fi

LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || true)"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ] && [ "$FORCE_DEPLOY" != "1" ]; then
  echo "Autonomia cockpit already up to date: $LOCAL_SHA"
  exit 0
fi

echo "Deploying validated Autonomia cockpit: $LOCAL_SHA -> $REMOTE_SHA"
git reset --hard "$REMOTE_SHA"

npm install --no-audit --no-fund --package-lock=false
npm run build

mkdir -p .runtime tmp
printf '%s\n' "$REMOTE_SHA" > .runtime/deployed-sha
touch tmp/restart.txt

echo "Autonomia cockpit deployed: $REMOTE_SHA"
