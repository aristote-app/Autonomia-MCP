#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
PUBLIC_SITE_ROOT="$APP_ROOT/site"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
BRANCH="main"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"
TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"
WORKER_LOG="$APP_ROOT/.runtime/self-deploy-worker.log"
LOCK_DIR="$APP_ROOT/.runtime/self-deploy.lock"

mkdir -p "$APP_ROOT/.runtime"

# Passenger may reap long-lived children created by the request worker.
# Re-parent the actual deployment once with nohup, then let the HTTP child exit.
if [ "${AUTONOMIA_DEPLOY_DAEMONIZED:-0}" != "1" ]; then
  echo "Launching detached o2switch deploy worker..."
  AUTONOMIA_DEPLOY_DAEMONIZED=1 \
  FORCE_DEPLOY="$FORCE_DEPLOY" \
  AUTONOMIA_DEPLOY_SHA="$TARGET_SHA" \
  nohup bash "$0" >> "$WORKER_LOG" 2>&1 </dev/null &
  echo "Detached deploy worker pid=$! log=$WORKER_LOG"
  exit 0
fi

DEBUG_FILE="$APP_ROOT/public/__autonomia_cockpit_deploy_debug.txt"
mkdir -p "$APP_ROOT/public"

write_debug() {
  local state="$1"
  local detail="${2:-}"
  {
    printf 'timestamp=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf 'state=%s\n' "$state"
    printf 'target_sha=%s\n' "${TARGET_SHA:-main}"
    if [ -n "$detail" ]; then
      printf 'detail=%s\n' "$detail"
    fi
  } > "$DEBUG_FILE"
}

# A retry must never start a second Next build in the same application tree.
# mkdir is atomic and works on o2switch without relying on flock.
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  LOCK_STARTED="$(cat "$LOCK_DIR/started_at" 2>/dev/null || echo 0)"
  NOW="$(date +%s)"
  LOCK_AGE=$((NOW - LOCK_STARTED))
  if [ "$LOCK_STARTED" -gt 0 ] && [ "$LOCK_AGE" -gt 900 ]; then
    echo "Removing stale deploy lock age=${LOCK_AGE}s."
    rm -rf "$LOCK_DIR"
    mkdir "$LOCK_DIR"
  else
    echo "Another cockpit deploy worker is already active; exiting without starting a concurrent build."
    exit 0
  fi
fi

date +%s > "$LOCK_DIR/started_at"
printf '%s\n' "$" > "$LOCK_DIR/pid"

CURRENT_STEP="worker-started"
on_deploy_error() {
  local code=$?
  trap - ERR
  write_debug "failed" "step=$CURRENT_STEP exit=$code"
  echo "Cockpit deploy failed at step=$CURRENT_STEP exit=$code" >&2
  exit "$code"
}
trap 'rm -rf "$LOCK_DIR"' EXIT
trap on_deploy_error ERR

# o2switch does not expose /dev/fd reliably under Passenger. Avoid Bash
# process substitution here; it previously killed the deploy before git fetch.
touch "$WORKER_LOG"
write_debug "worker-started"
exec >> "$WORKER_LOG" 2>&1

echo
echo "=== DETACHED DEPLOY WORKER $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "target_sha=${TARGET_SHA:-main}"

source "$NODE_ENV_ACTIVATE"
set -u
cd "$APP_ROOT"

echo "node=$(node -v) npm=$(npm -v)"
echo "Fetching origin/$BRANCH..."
CURRENT_STEP="git-fetch"
write_debug "fetching" "origin/$BRANCH"
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

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ] && [ "$FORCE_DEPLOY" != "1" ] && [ -f .runtime/deployed-sha ] && [ "$(cat .runtime/deployed-sha 2>/dev/null || true)" = "$REMOTE_SHA" ]; then
  echo "Autonomia cockpit already deployed: $LOCAL_SHA"
  exit 0
fi

echo "Deploying validated Autonomia cockpit: $LOCAL_SHA -> $REMOTE_SHA"
CURRENT_STEP="git-sync"
write_debug "syncing" "$LOCAL_SHA -> $REMOTE_SHA"
git reset --hard "$REMOTE_SHA"

cat > lib/runtime/buildStamp.generated.js <<EOF
// Generated during o2switch deployment. Do not edit on the server.
export const BUILD_SHA = "$REMOTE_SHA";
EOF

# Recent cockpit changes did not add runtime dependencies. Reuse the installed
# Node tree when Next is present; fall back to npm install only if it is missing.
if [ -x node_modules/.bin/next ]; then
  echo "Reusing existing node_modules; skipping npm install."
else
  echo "node_modules incomplete; installing dependencies."
  npm install --no-audit --no-fund --package-lock=false
fi

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "Ensuring shared inbound lead token..."
CURRENT_STEP="ensure-inbound-token"
node scripts/ensure-inbound-token.mjs

echo "Building cockpit Next.js..."
CURRENT_STEP="next-build"
write_debug "building" "$REMOTE_SHA"
npm run build

# Public site deployment is intentionally independent.
# build-autonomia.com has its own validated o2switch self-deploy workflow.
echo "Public-site build skipped here; deploying cockpit only."

mkdir -p .runtime tmp

TALENT_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-talent.mjs >> /home/dide4169/autonomia-cockpit-app/talent-refresh.log 2>&1'
SEO_GEO_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-seo-geo.mjs >> /home/dide4169/autonomia-cockpit-app/seo-geo-refresh.log 2>&1'
INBOUND_DRAIN_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-drain-inbound.mjs >> /home/dide4169/autonomia-cockpit-app/inbound-drain.log 2>&1'
JOBS_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-jobs.mjs >> /home/dide4169/autonomia-cockpit-app/job-refresh.log 2>&1'
if command -v crontab >/dev/null 2>&1; then
  TMP_CRON="$(mktemp)"
  {
    crontab -l 2>/dev/null | grep -v 'o2switch-refresh-talent.mjs' | grep -v 'o2switch-refresh-seo-geo.mjs' | grep -v 'o2switch-refresh-jobs.mjs' | grep -v 'o2switch-drain-inbound.mjs' || true
    echo "17 4 * * * $TALENT_CMD"
    echo "23 */6 * * * $SEO_GEO_CMD"
    echo "*/5 * * * * $INBOUND_DRAIN_CMD"
    echo "*/15 * * * * $JOBS_CMD"
  } > "$TMP_CRON"
  crontab "$TMP_CRON"
  rm -f "$TMP_CRON"
  echo "Talent Intelligence cron installed: daily at 04:17 server time."
  echo "SEO/GEO Intelligence cron installed: every 6 hours at minute 23."
  echo "Inbound spool drain cron installed: every 5 minutes."
  echo "Market/job refresh cron installed: every 15 minutes; source-specific throttling remains enforced by the refresh script."
else
  echo "crontab unavailable; Talent and SEO/GEO refreshes remain manually executable."
fi

CURRENT_STEP="passenger-restart"
touch tmp/restart.txt
write_debug "completed" "Passenger restart requested for $REMOTE_SHA"

echo "Autonomia cockpit deployed and Passenger restart requested: $REMOTE_SHA"
