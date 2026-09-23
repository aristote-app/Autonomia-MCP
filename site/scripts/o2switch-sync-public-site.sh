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

echo "Using Next 15.5.18 Webpack build for o2switch legacy glibc compatibility..."
unset NODE_OPTIONS || true

echo "Validating editorial content..."
npm run content:validate

# Atomic asset note: keep prior hashed assets available until Passenger has
# fully switched workers, preventing transient unstyled HTML during rolling deploys.
PREVIOUS_STATIC="$APP_ROOT/.runtime/previous-next-static"
rm -rf "$PREVIOUS_STATIC"
if [ -d .next/static ]; then
  echo "Preserving previous Next static assets during build..."
  mkdir -p "$PREVIOUS_STATIC"
  cp -a .next/static/. "$PREVIOUS_STATIC"/
fi

echo "Building public site Next.js 15.5.18 with Webpack..."
npm run build

# During Passenger rolling restarts, an old worker can briefly keep serving old
# HTML. Preserve its hashed CSS/JS files inside the new build so those requests
# still resolve until every worker has switched to the new release.
if [ -d "$PREVIOUS_STATIC" ]; then
  echo "Merging previous hashed static assets into the new build..."
  mkdir -p .next/static
  cp -a "$PREVIOUS_STATIC"/. .next/static/
fi

if ! find .next/static -type f \( -name '*.css' -o -name '*.js' \) -size +0c | grep -q .; then
  echo "Refusing deploy: Next static assets are missing after build." >&2
  exit 1
fi

mkdir -p .runtime tmp
printf '%s\n' "$REMOTE_SHA" > .runtime/deployed-sha
touch tmp/restart.txt

echo "Autonomia public site deployed and Passenger restart requested: $REMOTE_SHA"


# Keep the cockpit synchronized too. The public-site worker survives o2switch
# Passenger reliably, so it can bootstrap cockpit releases when the cockpit's
# own detached worker is reaped by the hosting lifecycle.
COCKPIT_ROOT="/home/dide4169/autonomia-cockpit-app"
COCKPIT_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
COCKPIT_BRANCH="main"

if [ -d "$COCKPIT_ROOT/.git" ] && [ -f "$COCKPIT_ROOT/package.json" ]; then
  echo "Checking cockpit synchronization..."
  set +u
  source "$COCKPIT_ACTIVATE"
  set -u
  cd "$COCKPIT_ROOT"

  git fetch --depth=200 origin "$COCKPIT_BRANCH"
  COCKPIT_SHA="$(git rev-parse "origin/$COCKPIT_BRANCH")"
  COCKPIT_LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || true)"

  COCKPIT_STAMP_FILE="$COCKPIT_ROOT/lib/runtime/buildStamp.generated.js"
  COCKPIT_STAMP_OK="0"
  if [ -f "$COCKPIT_STAMP_FILE" ] && grep -Fq "$COCKPIT_SHA" "$COCKPIT_STAMP_FILE"; then
    COCKPIT_STAMP_OK="1"
  fi

  if [ "$COCKPIT_LOCAL_SHA" != "$COCKPIT_SHA" ] || [ "$COCKPIT_STAMP_OK" != "1" ]; then
    echo "Syncing cockpit: $COCKPIT_LOCAL_SHA -> $COCKPIT_SHA"
    git reset --hard "$COCKPIT_SHA"

    if [ -x node_modules/.bin/next ]; then
      echo "Reusing installed cockpit dependencies."
    else
      echo "Cockpit node_modules incomplete; installing dependencies."
      npm install --no-audit --no-fund --package-lock=false
    fi

    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export UV_THREADPOOL_SIZE=1
    export AUTONOMIA_DEPLOY_SHA="$COCKPIT_SHA"
    unset GITHUB_SHA || true
    unset NEXT_PUBLIC_SITE_URL || true

    rm -rf .next
    echo "Building cockpit with constrained o2switch worker settings..."
    npm run build

    mkdir -p .runtime tmp
    printf '%s\n' "$COCKPIT_SHA" > .runtime/deployed-sha
    touch tmp/restart.txt
    echo "Cockpit synchronized and Passenger restart requested: $COCKPIT_SHA"
  else
    echo "Cockpit already at origin/$COCKPIT_BRANCH: $COCKPIT_SHA"
  fi
else
  echo "Cockpit repo unavailable at $COCKPIT_ROOT; skipping cockpit sync."
fi
