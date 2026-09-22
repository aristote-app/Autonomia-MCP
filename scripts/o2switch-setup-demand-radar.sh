#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
NODE_ACTIVATE="/home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/activate"
ENV_FILE="$APP_ROOT/.env.production.local"

cd "$APP_ROOT"
source "$NODE_ACTIVATE"

git fetch --depth=1 origin main
git reset --hard origin/main

if [ ! -f "$ENV_FILE" ]; then
  touch "$ENV_FILE"
fi

if ! grep -q '^FRANCE_TRAVAIL_CLIENT_ID=' "$ENV_FILE"; then
  printf "Identifiant client France Travail : "
  read -r FT_CLIENT_ID
  printf 'FRANCE_TRAVAIL_CLIENT_ID=%s\n' "$FT_CLIENT_ID" >> "$ENV_FILE"
fi

if ! grep -q '^FRANCE_TRAVAIL_CLIENT_SECRET=' "$ENV_FILE"; then
  printf "Clé secrète France Travail : "
  read -rs FT_CLIENT_SECRET
  printf '\n'
  printf 'FRANCE_TRAVAIL_CLIENT_SECRET=%s\n' "$FT_CLIENT_SECRET" >> "$ENV_FILE"
fi

if ! grep -q '^FRANCE_TRAVAIL_SCOPE=' "$ENV_FILE"; then
  printf 'FRANCE_TRAVAIL_SCOPE="api_offresdemploiv2 o2dsoffre"\n' >> "$ENV_FILE"
fi

chmod 600 "$ENV_FILE"

npm install --no-audit --no-fund --package-lock=false
npm run build

mkdir -p tmp
touch tmp/restart.txt

JOBS_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-jobs.mjs >> /home/dide4169/autonomia-cockpit-app/jobs-refresh.log 2>&1'
PUBLIC_CMD='cd /home/dide4169/autonomia-cockpit-app && /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node --env-file=.env.production.local scripts/o2switch-refresh-public.mjs >> /home/dide4169/autonomia-cockpit-app/public-refresh.log 2>&1'

TMP_CRON="$(mktemp)"
{
  crontab -l 2>/dev/null | grep -v 'o2switch-refresh-jobs.mjs' | grep -v 'o2switch-refresh-public.mjs' || true
  echo "*/30 * * * * $JOBS_CMD"
  echo "0 */2 * * * $PUBLIC_CMD"
} > "$TMP_CRON"

if command -v crontab >/dev/null 2>&1; then
  crontab "$TMP_CRON"
  echo "Crons installés : demandes toutes les 30 min, marchés publics toutes les 2 h."
else
  echo "ATTENTION: commande crontab indisponible sur ce serveur. Ajoute les deux commandes via cPanel > Tâches Cron."
fi

rm -f "$TMP_CRON"

echo "Lancement de la première collecte..."
node --env-file="$ENV_FILE" scripts/o2switch-refresh-jobs.mjs || true

echo
echo "Installation terminée."
echo "Cockpit : https://cockpit.build-autonomia.com"
echo "Diagnostic : https://cockpit.build-autonomia.com/api/health"
