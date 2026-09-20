# Autonomia Organic Engine V1 — SEO / GEO

## Mission

Transformer la bibliothèque Autonomia en graphe organique piloté par la demande et la qualité, pas en usine de pages faibles.

Le système distingue quatre niveaux :

1. **400 intentions éditoriales** : 200 Execution / Experts + 200 Training / Academy.
2. **40 piliers indexables** : 20 par famille, 10 scénarios par pilier.
3. **guides long-form publiés** : uniquement lorsqu’ils passent les gates qualité.
4. **mesure organique** : Search Console, IA générative Google, Bing, ChatGPT et conversion business.

## Architecture URL

### Execution / Experts

Hub :
`/cas-usage-ia`

Piliers :
`/cas-usage-ia/<cluster-slug>`

Guides validés :
`/cas-usage-ia/<article-slug>`

### Training / Academy

Hub :
`/formation-ia/cas-usage`

Piliers :
`/formation-ia/cas-usage/<cluster-slug>`

Guides validés :
`/formation-ia/cas-usage/<article-slug>`

### Actifs méthodologiques originaux

- `/methodologie/execution-matrix`
- `/methodologie/learning-transfer`

Ces deux pages donnent au site une couche de connaissance propre à Autonomia et sont reliées depuis les piliers.

## Règle des 400 pages

Le repository contient bien 400 intentions.

Une intention de backlog ne devient PAS automatiquement une URL indexable longue.

Elle devient un guide indexable lorsqu’elle est ajoutée au registre `published-articles.js` et passe le validateur.

Cela évite :
- le scaled content faible ;
- la cannibalisation ;
- les pages quasi identiques ;
- les affirmations non vérifiées ;
- l’indexation de brouillons.

Les hubs peuvent afficher l’inventaire complet des 400 scénarios sans créer 394 pages faibles.

## Gates de publication

Un guide long-form publié doit notamment avoir :
- minimum 2 000 mots ;
- minimum 6 sections substantielles ;
- une intention / keyword primaire ;
- une preuve de demande déclarée ;
- des sources vérifiables ;
- une FAQ utile ;
- des signaux marché associés ;
- un scénario distinct ;
- limites / échecs / contrôle humain ;
- CTA cohérent.

Le CI vérifie également :
- 200 + 200 sujets ;
- 20 + 20 piliers ;
- 10 scénarios par pilier ;
- unicité des slugs ;
- absence de collision pilier / article ;
- présence du graphe interne ;
- présence de l’infrastructure IndexNow / Organic Insights ;
- accès OAI-SearchBot / OAI-AdsBot.

## Graphe sémantique automatique

Chaque article publié est automatiquement relié à :
- son pilier ;
- jusqu’à 3 articles sémantiquement proches ;
- son pendant Experts ↔ Academy lorsqu’un rapprochement existe ;
- des piliers adjacents ;
- son CTA commercial.

Les liens manuels `related` restent prioritaires et sont fusionnés avec le graphe automatique.

Les hubs pointent directement vers les 40 piliers.

## Sitemap

`/sitemap.xml` est construit à partir de `lib/organicUrls.js`.

Il contient uniquement les surfaces volontairement indexables :
- home ;
- Scan ;
- hubs ;
- pages commerciales hors diagnostics Meta ;
- 40 piliers ;
- guides publiés ;
- pages méthodologiques.

Les diagnostics Meta restent noindex et hors sitemap.

## IndexNow

Variables :

```
INDEXNOW_KEY=
AUTONOMIA_INDEXING_TOKEN=
```

Validation de propriété :

`/indexnow/<INDEXNOW_KEY>`

Soumission protégée :

`POST /api/indexnow`

Payload :

```json
{
  "urls": [
    "https://autonomia.fr/cas-usage-ia/...",
    "https://autonomia.fr/formation-ia/cas-usage/..."
  ]
}
```

Header :

`Authorization: Bearer <AUTONOMIA_INDEXING_TOKEN>`

N’envoyer que les URL réellement ajoutées ou modifiées.

IndexNow accélère la découverte ; il ne garantit pas l’indexation.

## Google Search Console / IA générative

Après mise en production :

1. valider la propriété Search Console ;
2. soumettre `/sitemap.xml` ;
3. suivre crawl, indexation, impressions, clics et requêtes ;
4. utiliser le rapport de performance IA générative lorsque disponible sur la propriété ;
5. relier les URLs à la conversion lead / opportunité / CA.

Le site expose un endpoint normalisé :

`POST /api/organic/insights`

Providers acceptés :
- `google_search_console`
- `google_generative_ai`
- `bing_webmaster`
- `bing_ai`
- `chatgpt_search`
- `manual_observation`

Ce endpoint transmet ensuite les records au stockage / cockpit Autonomia-MCP via :

```
AUTONOMIA_ORGANIC_INSIGHTS_URL=
AUTONOMIA_ORGANIC_INSIGHTS_TOKEN=
```

## Manifeste organique

`GET /api/organic/manifest`

Protégé par :

`AUTONOMIA_ORGANIC_TOKEN`

Il expose :
- taille du backlog ;
- nombre de piliers ;
- nombre de guides publiés ;
- inventaire de toutes les URL indexables ;
- type de chaque URL.

Ce manifeste devient le contrat entre le site et le monitoring Autonomia-MCP.

## GEO / ChatGPT

`robots.txt` autorise explicitement :
- `OAI-SearchBot`
- `OAI-AdsBot`

À vérifier en production :
- réponse HTTP 200 pour les pages publiques ;
- pas de challenge JS / CAPTCHA pour ces crawlers ;
- CDN / WAF ne bloque pas les user-agents / IP officielles ;
- contenu principal visible dans le DOM ;
- canonical correcte ;
- pas de noindex accidentel.

## Bing AI

Brancher Bing Webmaster Tools après le domaine :
- sitemap ;
- IndexNow ;
- suivi des données de recherche ;
- suivi AI Performance lorsque disponible.

Les données peuvent être normalisées vers `/api/organic/insights`.

## Actifs citables

Autonomia ne doit pas seulement reformuler des informations existantes.

Actifs V1 :
- Matrice Autonomia d’exécution IA :
  processus → interprétation → action → contrôle ;
- Matrice Autonomia de transfert :
  tâche → méthode → garde-fous → transfert ;
- signal marché dynamique issu des besoins emploi ;
- taxonomie structurée des scénarios d’exécution et de formation.

Les futurs benchmarks doivent être publiés uniquement à partir de données réelles documentées.

## Images

Chaque guide et chaque pilier dispose d’une image Open Graph générée à partir :
- famille ;
- cluster ;
- titre ;
- identité Autonomia.

Aucun visuel stock générique n’est requis.

## Vidéo / Shorts

Endpoint :

`GET /api/organic/media-manifest`

Protégé par `AUTONOMIA_ORGANIC_TOKEN`.

Pour chaque guide publié, il fournit :
- URL canonique ;
- URL du visuel social ;
- hook vidéo ;
- promesse ;
- séquence de scènes basée sur les sections du guide ;
- closing ;
- CTA.

Ce manifeste est destiné à alimenter ultérieurement le pipeline YouTube / LinkedIn / Shorts / Reels sans créer de vidéo fictive avant connexion des comptes.

## Boucle de publication

Cycle cible :

```
signal de demande
→ recherche / vérification
→ rédaction profonde
→ gate CI
→ publication
→ sitemap
→ IndexNow pour URL modifiée
→ Search Console / Bing / GEO
→ impressions / citations / clics
→ lead / opportunité / CA
→ amélioration ou extension du cluster
```

## Priorisation

Ne jamais confondre :
- demande emploi ;
- volume de recherche ;
- visibilité IA ;
- performance business.

Une page peut être priorisée lorsqu’au moins un signal réel existe, mais chaque type de signal reste identifié séparément.

La meilleure page à renforcer est celle qui combine progressivement :
- demande observée ;
- capacité à produire une réponse distincte ;
- adéquation commerciale ;
- premières impressions / citations ;
- conversion réelle.

## Critère de réussite

Organic Engine V1 est correctement branché lorsque :
- les 40 piliers sont accessibles et dans le sitemap ;
- les guides validés sont indexables ;
- les 394 sujets non validés ne génèrent pas de thin pages ;
- IndexNow accepte une URL de test ;
- Search Console reçoit le sitemap ;
- OAI-SearchBot peut crawler une page ;
- les insights organiques remontent dans Autonomia-MCP ;
- une URL organique peut être reliée jusqu’au lead puis au revenu.


## Vérification d’identité moteur et flux récent

Variables :
```
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

Le layout publie les balises de propriété uniquement lorsque les valeurs sont configurées.

Flux récent :
`/feed.xml`

Le RSS contient uniquement les guides long-form réellement publiés et complète le sitemap pour la découverte des contenus récents.

Workflow de production :
`.github/workflows/seo-production-smoke.yml`

Il vérifie :
- robots ;
- OAI-SearchBot ;
- sitemap ;
- volume minimal d’URL ;
- absence des diagnostics Meta du sitemap ;
- canonical des surfaces critiques ;
- RSS ;
- pages méthodologiques ;
- piliers ;
- guides Wave 3.


## Observatoire Autonomia

URL :
`/observatoire-ia`

Objectif :
- publier un actif original et citable ;
- montrer les rôles, outils, compétences et cas d’usage observés dans l’échantillon emploi ;
- séparer explicitement demande emploi, demande Search et performance business.

Le composant n’affiche aucun chiffre lorsque `AUTONOMIA_CONTENT_SIGNALS_URL` n’est pas configuré ou ne répond pas.

Lorsque les données sont disponibles, la page publie un schema `Dataset` et rappelle que :
- l’échantillon n’est pas exhaustif ;
- les comptes ne représentent pas le volume total du marché ;
- ils ne représentent pas le volume de recherche Google ;
- ils ne constituent pas une prévision.
