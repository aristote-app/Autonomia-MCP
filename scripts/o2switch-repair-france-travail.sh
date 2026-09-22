#!/usr/bin/env bash
set -eo pipefail

APP_ROOT="/home/dide4169/autonomia-cockpit-app"
ENV_FILE="$APP_ROOT/.env.production.local"
TOKEN_URL="https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire"

cd "$APP_ROOT"

printf "Identifiant client France Travail : "
read -r FT_CLIENT_ID
printf "Clé secrète France Travail : "
read -rs FT_CLIENT_SECRET
printf "\n"
printf "Clé reçue : %s caractères\n" "${#FT_CLIENT_SECRET}"

TMP_ENV="$(mktemp)"
if [ -f "$ENV_FILE" ]; then
  grep -v '^FRANCE_TRAVAIL_CLIENT_ID=' "$ENV_FILE"     | grep -v '^FRANCE_TRAVAIL_CLIENT_SECRET='     | grep -v '^FRANCE_TRAVAIL_SCOPE=' > "$TMP_ENV" || true
fi

{
  cat "$TMP_ENV"
  printf 'FRANCE_TRAVAIL_CLIENT_ID=%s\n' "$FT_CLIENT_ID"
  printf 'FRANCE_TRAVAIL_CLIENT_SECRET=%s\n' "$FT_CLIENT_SECRET"
  printf 'FRANCE_TRAVAIL_SCOPE="api_offresdemploiv2 o2dsoffre"\n'
} > "$ENV_FILE"

rm -f "$TMP_ENV"
chmod 600 "$ENV_FILE"

echo "Test OAuth France Travail..."
TOKEN_RESPONSE="$(
  curl -sS -X POST "$TOKEN_URL"     -H "Content-Type: application/x-www-form-urlencoded"     --data-urlencode "grant_type=client_credentials"     --data-urlencode "client_id=$FT_CLIENT_ID"     --data-urlencode "client_secret=$FT_CLIENT_SECRET"     --data-urlencode "scope=api_offresdemploiv2 o2dsoffre"
)"

if printf '%s' "$TOKEN_RESPONSE" | grep -q '"access_token"'; then
  echo "OK : authentification France Travail valide."
  mkdir -p tmp
  touch tmp/restart.txt
  /home/dide4169/nodevenv/autonomia-cockpit-app/22/bin/node     --env-file="$ENV_FILE" scripts/o2switch-refresh-jobs.mjs
else
  echo "ECHEC France Travail :"
  printf '%s\n' "$TOKEN_RESPONSE"
  echo
  echo "Si le message contient invalid_client, vérifie sur francetravail.io :"
  echo "- que ces identifiants appartiennent à la bonne application ;"
  echo "- que l'application est souscrite à l'API Offres d'emploi v2."
  exit 1
fi
