#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-public-site-src/site"
REPO_ROOT="/home/dide4169/autonomia-public-site-src"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-public-site-src/site/22/bin/activate"
BRANCH="public-site-production"
TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"
WORKER_LOG="$APP_ROOT/.runtime/self-deploy-worker.log"

mkdir -p "$APP_ROOT/.runtime"

# Long children launched by Passenger can be interrupted by the hosting process
# lifecycle. Re-parent the real deployment once, then let the HTTP shell exit.
if [ "${AUTONOMIA_PUBLIC_DEPLOY_DAEMONIZED:-0}" != "1" ]; then
  echo "Launching detached public-site deploy worker..."
  AUTONOMIA_PUBLIC_DEPLOY_DAEMONIZED=1 \
  AUTONOMIA_DEPLOY_SHA="$TARGET_SHA" \
  nohup bash "$0" >> "$WORKER_LOG" 2>&1 </dev/null &
  echo "Detached public deploy worker pid=$! log=$WORKER_LOG"
  exit 0
fi

DEBUG_FILE="$APP_ROOT/public/__autonomia_deploy_debug.txt"
mkdir -p "$APP_ROOT/public"
: > "$DEBUG_FILE"
if [ -t 1 ]; then
  echo "Interactive terminal detected; keeping deployment output on screen."
else
  exec >> "$WORKER_LOG" 2>&1
fi

echo
echo "=== PUBLIC DETACHED DEPLOY WORKER $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "target_sha=${TARGET_SHA:-public-site-production}"

source "$NODE_ENV_ACTIVATE"
set -u
cd "$REPO_ROOT"

echo "node=$(node -v) npm=$(npm -v)"
echo "Fetching origin/$BRANCH..."
git fetch --depth=200 origin "$BRANCH"
BRANCH_SHA="$(git rev-parse "origin/$BRANCH")"

if [ -n "$TARGET_SHA" ]; then
  if ! [[ "$TARGET_SHA" =~ ^[a-f0-9]{40}$ ]]; then
    echo "Invalid AUTONOMIA_DEPLOY_SHA: $TARGET_SHA" >&2
    exit 1
  fi

  if ! git cat-file -e "$TARGET_SHA^{commit}" 2>/dev/null; then
    git fetch --depth=1 origin "$TARGET_SHA"
  fi

  if [ "$TARGET_SHA" != "$BRANCH_SHA" ] && ! git merge-base --is-ancestor "$TARGET_SHA" "$BRANCH_SHA"; then
    echo "Refusing deploy: target SHA is not on origin/$BRANCH." >&2
    exit 1
  fi

  REMOTE_SHA="$TARGET_SHA"
else
  REMOTE_SHA="$BRANCH_SHA"
fi

LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || true)"
DEPLOYED_SHA="$(cat "$APP_ROOT/.runtime/deployed-sha" 2>/dev/null || true)"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ] && [ "$DEPLOYED_SHA" = "$REMOTE_SHA" ]; then
  echo "Autonomia public site already deployed: $REMOTE_SHA"
  exit 0
fi

echo "Deploying validated Autonomia public site: $LOCAL_SHA -> $REMOTE_SHA"
git reset --hard "$REMOTE_SHA"

cd "$APP_ROOT"

if [ -x node_modules/.bin/next ]; then
  echo "Reusing installed public-site dependencies."
else
  echo "node_modules incomplete; installing dependencies."
  npm install --ignore-scripts --no-audit --no-fund --package-lock=false
fi

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PUBLIC_SITE_URL="https://build-autonomia.com"

echo "Forcing Next SWC WebAssembly for o2switch legacy glibc..."
rm -rf node_modules/@next/swc-linux-x64-gnu node_modules/@next/swc-linux-x64-musl || true
rm -rf "$HOME/.cache/next-swc" || true
export NODE_OPTIONS="--no-addons"

echo "Validating editorial content..."
npm run content:validate

echo "Building public site Next.js with SWC WASM..."
npm run build

mkdir -p .runtime tmp
printf '%s\n' "$REMOTE_SHA" > .runtime/deployed-sha
touch tmp/restart.txt

echo "Autonomia public site deployed and Passenger restart requested: $REMOTE_SHA"
