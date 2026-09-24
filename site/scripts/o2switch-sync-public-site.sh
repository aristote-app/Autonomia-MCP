#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-public-site-src/site"
REPO_ROOT="/home/dide4169/autonomia-public-site-src"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-public-site-src/site/22/bin/activate"
BRANCH="public-site-production"
TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"
WORKER_LOG="$APP_ROOT/.runtime/self-deploy-worker.log"

mkdir -p "$APP_ROOT/.runtime"

# The /api/internal/self-deploy route launches this script detached. Keep this
# worker single-layered: Passenger already owns the HTTP lifecycle.
DEBUG_FILE="$APP_ROOT/public/__autonomia_deploy_debug.txt"
LOCK_TIMEOUT_SECONDS="${AUTONOMIA_PUBLIC_DEPLOY_LOCK_TIMEOUT_SECONDS:-180}"
mkdir -p "$APP_ROOT/public"
touch "$WORKER_LOG"

write_debug() {
  local state="$1"
  local detail="${2:-}"
  {
    printf 'timestamp=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf 'state=%s\n' "$state"
    printf 'target_sha=%s\n' "${TARGET_SHA:-public-site-production}"
    if [ -n "$detail" ]; then
      printf 'detail=%s\n' "$detail"
    fi
  } > "$DEBUG_FILE"
}

write_debug "starting"

if [ -t 1 ]; then
  echo "Interactive terminal detected; keeping deployment output on screen."
else
  exec >> "$WORKER_LOG" 2>&1
fi

# Server-side serialization is a safety net in addition to the GitHub Actions
# queue. A bounded wait prevents an orphaned worker from hiding the real cause
# of a blocked deployment for an unlimited amount of time.
PUBLIC_DEPLOY_LOCK="$APP_ROOT/.runtime/public-deploy.lock"
exec 9>"$PUBLIC_DEPLOY_LOCK"
if command -v flock >/dev/null 2>&1; then
  echo "Waiting for public deploy lock (max ${LOCK_TIMEOUT_SECONDS}s)..."
  write_debug "waiting-for-lock" "timeout=${LOCK_TIMEOUT_SECONDS}s"
  if ! flock -w "$LOCK_TIMEOUT_SECONDS" 9; then
    echo "Timed out waiting for public deploy lock." >&2
    write_debug "lock-timeout" "another public worker still owns the build lock"
    exit 75
  fi
  echo "Public deploy lock acquired."
else
  PUBLIC_DEPLOY_LOCK_DIR="$PUBLIC_DEPLOY_LOCK.d"
  echo "flock unavailable; waiting on mkdir deploy lock (max ${LOCK_TIMEOUT_SECONDS}s)..."
  write_debug "waiting-for-lock" "fallback=mkdir timeout=${LOCK_TIMEOUT_SECONDS}s"
  LOCK_WAIT_STARTED="$SECONDS"
  while ! mkdir "$PUBLIC_DEPLOY_LOCK_DIR" 2>/dev/null; do
    if [ $((SECONDS - LOCK_WAIT_STARTED)) -ge "$LOCK_TIMEOUT_SECONDS" ]; then
      echo "Timed out waiting for fallback public deploy lock." >&2
      write_debug "lock-timeout" "fallback mkdir lock remained owned"
      exit 75
    fi
    sleep 3
  done
  trap 'rmdir "$PUBLIC_DEPLOY_LOCK_DIR" 2>/dev/null || true' EXIT
  echo "Fallback public deploy lock acquired."
fi
write_debug "lock-acquired"

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
write_debug "building" "webpack production build"
npm run build

# During Passenger rolling restarts, an old worker can briefly keep serving old
# HTML. Preserve its hashed CSS/JS files inside the new build so those requests
# still resolve until every worker has switched to the new release.
if [ -d "$PREVIOUS_STATIC" ]; then
  echo "Merging previous hashed static assets into the new build..."
  mkdir -p .next/static
  cp -a "$PREVIOUS_STATIC"/. .next/static/
fi

write_debug "build-complete" "validating static assets"

# Avoid grep -q pipelines here: with pipefail, a successful early grep exit can
# SIGPIPE find and turn a valid asset tree into a false deployment failure.
STATIC_ASSET_SAMPLE="$(find .next/static -type f \( -name '*.css' -o -name '*.js' \) -size +0c -print -quit)"
if [ -z "$STATIC_ASSET_SAMPLE" ]; then
  echo "Refusing deploy: Next static assets are missing after build." >&2
  write_debug "failed" "Next static assets missing after build"
  exit 1
fi
echo "Validated Next static asset: $STATIC_ASSET_SAMPLE"

mkdir -p .runtime tmp
printf '%s\n' "$REMOTE_SHA" > .runtime/deployed-sha
touch tmp/restart.txt
write_debug "completed" "Passenger restart requested for $REMOTE_SHA"

echo "Autonomia public site deployed and Passenger restart requested: $REMOTE_SHA"

# ONE-TIME COCKPIT RECOVERY BRIDGE
# The cockpit detached self-deploy worker is currently accepted by Passenger
# but dies before switching the production SHA. The public worker is healthy,
# so use it once to execute the already-validated cockpit release synchronously.
COCKPIT_RECOVERY_SHA="2c2f3c231d7a8981a2556a51336814ed70badd76"
COCKPIT_SCRIPT="/home/dide4169/autonomia-cockpit-app/scripts/o2switch-sync-cockpit.sh"

if [ -f "$COCKPIT_SCRIPT" ]; then
  echo "Running one-time cockpit recovery bridge for $COCKPIT_RECOVERY_SHA..."
  AUTONOMIA_DEPLOY_DAEMONIZED=1 \
  AUTONOMIA_DEPLOY_SHA="$COCKPIT_RECOVERY_SHA" \
  FORCE_DEPLOY=1 \
  bash "$COCKPIT_SCRIPT"
  echo "One-time cockpit recovery bridge completed for $COCKPIT_RECOVERY_SHA."
else
  echo "Cockpit recovery script not found: $COCKPIT_SCRIPT" >&2
  exit 1
fi

