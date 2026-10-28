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
STAGE_ROOT=""
DEPENDENCY_ROOT=""
DEPENDENCIES_PROMOTED=0

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
  LOCK_PID="$(cat "$LOCK_DIR/pid" 2>/dev/null || true)"
  if [[ "$LOCK_PID" =~ ^[0-9]+$ ]] && [ "$LOCK_PID" -gt 1 ] && kill -0 "$LOCK_PID" 2>/dev/null; then
    echo "Another cockpit deploy owner is alive (pid=$LOCK_PID); preserving its lock."
    exit 0
  fi
  if ! command -v pgrep >/dev/null 2>&1; then
    echo "Cannot verify deploy ownership; preserving the existing lock." >&2
    exit 1
  fi
  for OTHER_PID in $(pgrep -u "$(id -u)" -f '[o]2switch-sync-cockpit.sh|[n]ext build|[n]pm run build' || true); do
    if [ "$OTHER_PID" != "$$" ] && [ "$OTHER_PID" != "$PPID" ]; then
      echo "Another cockpit build is active (pid=$OTHER_PID); preserving its lock."
      exit 0
    fi
  done
  echo "Removing orphaned deploy lock after checking active owners."
  rm -f "$LOCK_DIR/started_at" "$LOCK_DIR/pid"
  rmdir "$LOCK_DIR"
  mkdir "$LOCK_DIR"
fi

CURRENT_STEP="worker-started"
on_deploy_error() {
  local code=$?
  trap - ERR
  write_debug "failed" "step=$CURRENT_STEP exit=$code"
  echo "Cockpit deploy failed at step=$CURRENT_STEP exit=$code" >&2
  exit "$code"
}
cleanup_deploy() {
  rm -rf "$LOCK_DIR"
  if [ -n "$STAGE_ROOT" ] && [ -d "$STAGE_ROOT" ]; then
    rm -rf "$STAGE_ROOT"
  fi
  if [ -n "$DEPENDENCY_ROOT" ] && [ "$DEPENDENCIES_PROMOTED" = "0" ]; then
    rm -rf "$DEPENDENCY_ROOT"
  fi
}
trap cleanup_deploy EXIT
trap on_deploy_error ERR

# Register cleanup before writing metadata, including on resource/write failure.
printf '%(%s)T\n' -1 > "$LOCK_DIR/started_at"
printf '%s\n' "$$" > "$LOCK_DIR/pid"

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

echo "Preparing validated Autonomia cockpit: $LOCAL_SHA -> $REMOTE_SHA"

# Build the target commit outside the live Passenger tree. A failed Next build
# must never mutate the currently served .next directory.
CURRENT_STEP="prepare-candidate"
write_debug "preparing-candidate" "$LOCAL_SHA -> $REMOTE_SHA"
STAGE_ROOT="$APP_ROOT/.runtime/candidate-$REMOTE_SHA"
rm -rf "$STAGE_ROOT"
mkdir -p "$STAGE_ROOT"
git archive "$REMOTE_SHA" | tar -x -C "$STAGE_ROOT"

# Changed manifests require an isolated dependency tree. Keep the current
# Passenger application's dependencies intact until the candidate has built.
DEPENDENCY_ROOT=""
if [ -x "$APP_ROOT/node_modules/.bin/next" ] && cmp -s "$APP_ROOT/package.json" "$STAGE_ROOT/package.json" && { { [ ! -f "$APP_ROOT/package-lock.json" ] && [ ! -f "$STAGE_ROOT/package-lock.json" ]; } || cmp -s "$APP_ROOT/package-lock.json" "$STAGE_ROOT/package-lock.json"; }; then
  ln -s "$APP_ROOT/node_modules" "$STAGE_ROOT/node_modules"
else
  CURRENT_STEP="candidate-dependencies"
  DEPENDENCY_ROOT="$APP_ROOT/.runtime/dependencies-$REMOTE_SHA-$$"
  mkdir -p "$DEPENDENCY_ROOT"
  cp "$STAGE_ROOT/package.json" "$DEPENDENCY_ROOT/package.json"
  cd "$DEPENDENCY_ROOT"
  if [ -f "$STAGE_ROOT/package-lock.json" ]; then
    cp "$STAGE_ROOT/package-lock.json" package-lock.json
    npm ci --ignore-scripts --no-audit --no-fund
  else
    npm install --ignore-scripts --no-audit --no-fund --package-lock=false
  fi
  ln -s "$DEPENDENCY_ROOT/node_modules" "$STAGE_ROOT/node_modules"
fi

if [ -f "$APP_ROOT/.env.production.local" ]; then
  ln -s "$APP_ROOT/.env.production.local" "$STAGE_ROOT/.env.production.local"
fi

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "Building isolated cockpit candidate..."
CURRENT_STEP="candidate-build"
write_debug "building-candidate" "$REMOTE_SHA"
cd "$STAGE_ROOT"
AUTONOMIA_DEPLOY_SHA="$REMOTE_SHA" npm run build

if [ ! -f "$STAGE_ROOT/.next/BUILD_ID" ]; then
  echo "Refusing deploy: candidate Next build has no BUILD_ID." >&2
  exit 1
fi

echo "Candidate build succeeded; switching live checkout and assets."
cd "$APP_ROOT"
if [ -n "$DEPENDENCY_ROOT" ]; then
  CURRENT_STEP="dependency-switch"
  if [ -L "$APP_ROOT/node_modules" ]; then
    ln -s "$DEPENDENCY_ROOT/node_modules" "$APP_ROOT/.runtime/node_modules-next-$$"
    mv -Tf "$APP_ROOT/.runtime/node_modules-next-$$" "$APP_ROOT/node_modules"
  elif [ -d "$APP_ROOT/node_modules" ]; then
    mv "$APP_ROOT/node_modules" "$APP_ROOT/.runtime/node_modules-previous-$$"
    ln -s "$DEPENDENCY_ROOT/node_modules" "$APP_ROOT/node_modules"
  else
    ln -s "$DEPENDENCY_ROOT/node_modules" "$APP_ROOT/node_modules"
  fi
  DEPENDENCIES_PROMOTED=1
fi
CURRENT_STEP="git-sync"
write_debug "syncing" "$LOCAL_SHA -> $REMOTE_SHA"
git reset --hard "$REMOTE_SHA"

# The build stamp is generated inside the isolated candidate. Copy it only
# after the target commit is ready to become live.
cp "$STAGE_ROOT/lib/runtime/buildStamp.generated.js" "$APP_ROOT/lib/runtime/buildStamp.generated.js"

CURRENT_STEP="asset-switch"
write_debug "switching-assets" "$REMOTE_SHA"
rm -rf "$APP_ROOT/.next.previous"
if [ -d "$APP_ROOT/.next" ]; then
  mv "$APP_ROOT/.next" "$APP_ROOT/.next.previous"
fi
mv "$STAGE_ROOT/.next" "$APP_ROOT/.next"

echo "Ensuring shared inbound lead token..."
CURRENT_STEP="ensure-inbound-token"
node scripts/ensure-inbound-token.mjs

# Public site deployment is intentionally independent.
# build-autonomia.com has its own validated o2switch self-deploy workflow.
echo "Public-site build skipped here; deploying cockpit only."

mkdir -p .runtime tmp

TALENT_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-talent.mjs >> /home/dide4169/autonomia-cockpit-app/talent-refresh.log 2>&1'
SEO_GEO_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-seo-geo.mjs >> /home/dide4169/autonomia-cockpit-app/seo-geo-refresh.log 2>&1'
INBOUND_DRAIN_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-drain-inbound.mjs >> /home/dide4169/autonomia-cockpit-app/inbound-drain.log 2>&1'
JOBS_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-jobs.mjs >> /home/dide4169/autonomia-cockpit-app/job-refresh.log 2>&1'
DECISION_MAKERS_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-decision-makers.mjs >> /home/dide4169/autonomia-cockpit-app/decision-makers-refresh.log 2>&1'
if command -v crontab >/dev/null 2>&1; then
  TMP_CRON="$(mktemp)"
  {
    crontab -l 2>/dev/null | grep -v 'o2switch-refresh-talent.mjs' | grep -v 'o2switch-refresh-seo-geo.mjs' | grep -v 'o2switch-refresh-jobs.mjs' | grep -v 'o2switch-drain-inbound.mjs' | grep -v 'o2switch-refresh-decision-makers.mjs' || true
    echo "37 5 * * * $DECISION_MAKERS_CMD"
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

echo "Priming decision-maker research (daily quota enforced)..."
/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-decision-makers.mjs >> decision-makers-refresh.log 2>&1 || echo "Decision-maker refresh deferred to daily cron."

CURRENT_STEP="passenger-restart"
touch tmp/restart.txt
write_debug "completed" "Passenger restart requested for $REMOTE_SHA"

echo "Autonomia cockpit deployed and Passenger restart requested: $REMOTE_SHA"
