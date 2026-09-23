#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
PUBLIC_SITE_ROOT="$APP_ROOT/site"
NODE_ENV_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
BRANCH="main"
FORCE_DEPLOY="${FORCE_DEPLOY:-0}"
TARGET_SHA="${AUTONOMIA_DEPLOY_SHA:-}"
WORKER_LOG="$APP_ROOT/.runtime/self-deploy-worker.log"

mkdir -p "$APP_ROOT/.runtime"

# The Node self-deploy endpoint already launches this script as a detached,
# unreferenced child process. Do not daemonize a second time here: on o2switch
# Passenger that grandchild can be reaped before the build actually starts.
echo "Running detached deploy child directly (spawned by Node self-deploy endpoint)."

DEBUG_FILE="$APP_ROOT/public/__autonomia_cockpit_deploy_debug.txt"
mkdir -p "$APP_ROOT/public"
: > "$DEBUG_FILE"
if [ -t 1 ]; then
  echo "Interactive terminal detected; keeping deployment output on screen."
else
  exec >> "$WORKER_LOG" 2>&1
fi

echo
echo "=== DETACHED DEPLOY WORKER $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
echo "target_sha=${TARGET_SHA:-main}"

source "$NODE_ENV_ACTIVATE"
set -u
cd "$APP_ROOT"

echo "node=$(node -v) npm=$(npm -v)"
echo "Fetching origin/$BRANCH..."
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
node scripts/ensure-inbound-token.mjs

echo "Building cockpit Next.js..."
npm run build

# The production public site lives in its own o2switch Node application.
# Bootstrap/sync it from the working cockpit deploy path so future public-site
# self-deploys can run independently.
PUBLIC_PROD_REPO="/home/dide4169/autonomia-public-site-src"
PUBLIC_PROD_APP="$PUBLIC_PROD_REPO/site"
PUBLIC_PROD_ACTIVATE="/home/dide4169/nodevenv/autonomia-public-site-src/site/22/bin/activate"
PUBLIC_PROD_BRANCH="public-site-production"

if [ -d "$PUBLIC_PROD_REPO/.git" ] && [ -f "$PUBLIC_PROD_APP/package.json" ]; then
  echo "Syncing production public site from origin/$PUBLIC_PROD_BRANCH..."
  set +u
  source "$PUBLIC_PROD_ACTIVATE"
  set -u
  cd "$PUBLIC_PROD_REPO"
  git fetch --depth=200 origin "$PUBLIC_PROD_BRANCH"
  PUBLIC_PROD_SHA="$(git rev-parse "origin/$PUBLIC_PROD_BRANCH")"
  git reset --hard "$PUBLIC_PROD_SHA"

  cd "$PUBLIC_PROD_APP"
  echo "Repairing production public-site dependencies..."
  npm install --ignore-scripts --no-audit --no-fund --package-lock=false

  export NODE_ENV=production
  export NEXT_TELEMETRY_DISABLED=1
  export NEXT_PUBLIC_SITE_URL="https://build-autonomia.com"

  echo "Forcing Next SWC WebAssembly for o2switch legacy glibc..."
  rm -rf node_modules/@next/swc-linux-x64-gnu node_modules/@next/swc-linux-x64-musl || true
  rm -rf "$HOME/.cache/next-swc" || true
  export NODE_OPTIONS="--no-addons"

  echo "Cleaning previous public Next build..."
  rm -rf .next
  npm run content:validate
  npm run build
  mkdir -p .runtime tmp
  printf '%s\n' "$PUBLIC_PROD_SHA" > "$PUBLIC_PROD_APP/.runtime/deployed-sha"
  touch tmp/restart.txt
  echo "Production public site synced: $PUBLIC_PROD_SHA"

  set +u
  source "$NODE_ENV_ACTIVATE"
  set -u
  cd "$APP_ROOT"
else
  echo "Production public-site repo unavailable at $PUBLIC_PROD_REPO; skipping bootstrap sync."
fi

mkdir -p .runtime tmp

TALENT_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-talent.mjs >> /home/dide4169/autonomia-cockpit-app/talent-refresh.log 2>&1'
SEO_GEO_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-seo-geo.mjs >> /home/dide4169/autonomia-cockpit-app/seo-geo-refresh.log 2>&1'
if command -v crontab >/dev/null 2>&1; then
  TMP_CRON="$(mktemp)"
  {
    crontab -l 2>/dev/null | grep -v 'o2switch-refresh-talent.mjs' | grep -v 'o2switch-refresh-seo-geo.mjs' || true
    echo "17 4 * * * $TALENT_CMD"
    echo "23 */6 * * * $SEO_GEO_CMD"
  } > "$TMP_CRON"
  crontab "$TMP_CRON"
  rm -f "$TMP_CRON"
  echo "Talent Intelligence cron installed: daily at 04:17 server time."
  echo "SEO/GEO Intelligence cron installed: every 6 hours at minute 23."
else
  echo "crontab unavailable; Talent and SEO/GEO refreshes remain manually executable."
fi

touch tmp/restart.txt

echo "Autonomia cockpit + public site deployed and Passenger restarts requested: $REMOTE_SHA"
