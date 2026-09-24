# Mardi — intégration et mise en ligne du site Autonomia

Objectif : brancher le site public sans reconstruire l'acquisition ni modifier les funnels.

## État déjà préparé

### Site public
- Application Next.js autonome dans `site/`.
- Home "Autonomia — La force d'exécution IA".
- Univers Experts et Academy.
- Autonomia Scan v2 : 3 questions → lecture du besoin, priorité, profils / compétences à examiner, pistes de montée en compétences, prochaines étapes et point de vigilance.
- Passage Scan → formulaire sans ressaisie du besoin.
- LP Google Ads par intention, avec formulaire principal et Autonomia Scan en conversion secondaire lorsque le besoin est encore flou.
- Funnels / diagnostics Meta en logique value-first : l'orientation est affichée avant la demande de coordonnées.
- UTM, gclid, fbclid, IDs Meta et first-touch capturés.
- Formulaires progressifs.
- SEO / GEO, sitemap, robots, FAQ schema.
- Pages diagnostic en noindex.
- Endpoint serveur `/api/leads` prêt à forwarder vers Autonomia-MCP.
- Analytics chargés uniquement via la couche de consentement existante.

### Contrat lead
Le payload envoyé au backend contient notamment :
- identité et société ;
- service demandé ;
- besoin / message ;
- calendrier ou taille du groupe lorsqu'ils sont demandés ;
- landing page et referrer ;
- UTM ;
- Google Click ID / Facebook Click ID ;
- campaign / adset / ad / creative IDs lorsqu'ils sont présents ;
- first-touch et historique d'attribution ;
- consentement marketing ;
- contexte Autonomia Scan :
  - version et source du Scan ;
  - plan ;
  - objectif / stade / blocage + libellés ;
  - lecture du besoin ;
  - priorité ;
  - point de vigilance ;
  - prochaines étapes ;
  - profils à examiner ;
  - compétences à mobiliser ;
  - pistes de montée en compétences ;
  - route commerciale suggérée ;
  - questions à qualifier au prochain échange ;
  - date de complétion.

## À brancher mardi

### 1. Projet Vercel du site

Créer un projet Vercel distinct pour le site public.

Repository :
`aristote-app/Autonomia-MCP`

Root Directory :
`site`

Framework :
Next.js

Branche d’intégration actuelle :
`feat/autonomia-public-site-v2` — PR #10.

Production branch :
`main` après validation et merge de la PR #10.

Ne pas déployer le cockpit interne comme site public.

### 2. Variables site public

Config :
`NEXT_PUBLIC_SITE_URL=<domaine public final>`

Secrets :
`AUTONOMIA_INBOUND_URL=https://<autonomia-mcp-host>/api/inbound/leads`
`AUTONOMIA_INBOUND_TOKEN=<secret généré et stocké uniquement dans Vercel + backend>`

Optionnel au lancement si analytics validés :
`NEXT_PUBLIC_GA4_ID=`
`NEXT_PUBLIC_GOOGLE_ADS_ID=`
`NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=`
`NEXT_PUBLIC_META_PIXEL_ID=`

Signal marché :
`AUTONOMIA_CONTENT_SIGNALS_URL=<endpoint public read-only Autonomia-MCP>`

### 3. Backend inbound

Endpoint préparé côté Autonomia-MCP : `/api/inbound/leads`.

Mardi, appliquer la migration inbound puis valider que cet endpoint :
1. exige `Authorization: Bearer <AUTONOMIA_INBOUND_TOKEN>` ;
2. valide le contrat lead ;
3. conserve la preuve brute reçue ;
4. déduplique personne / entreprise / lead ;
5. conserve first-touch + touchpoints successifs ;
6. crée ou met à jour une opportunité commerciale ;
7. conserve le contexte Autonomia Scan ;
8. ne transforme jamais un consentement absent en consentement positif ;
9. journalise l'ingestion ;
10. retourne un identifiant interne.

Aucun token secret ne doit être exposé avec un préfixe `NEXT_PUBLIC_`.

### 4. Données / Supabase

Avant toute création de table :
- inspecter les migrations effectives ;
- définir le modèle lead / attribution / touchpoints ;
- activer RLS sur toute table exposée ;
- garder les écritures serveur avec la clé secrète uniquement ;
- lancer les advisors sécurité et performance après migration ;
- tester une ingestion réelle puis relire la ligne persistée.

Ne pas toucher au projet Studio Aristote.

Projet Autonomia :
`haazpzbwcryaksgtormn`

### 5. Qualiopi / preuves

Avant publication :
- confirmer l'entité juridique réellement certifiée Qualiopi ;
- confirmer le périmètre exact de certification ;
- utiliser la formulation légale exacte ;
- ne publier aucun logo client sans autorisation ;
- ne publier aucun volume d'experts / formateurs non vérifié ;
- ne publier aucun résultat ou témoignage non sourcé.

### 6. Juridique / privacy

À compléter avant ouverture des campagnes :
- mentions légales ;
- politique de confidentialité ;
- informations sur le responsable de traitement ;
- finalités du formulaire ;
- durée / logique de conservation ;
- base légale ;
- gestion du consentement marketing ;
- CMP / Consent Mode avant trackers non essentiels.

### 7. Tests fonctionnels

Desktop + mobile :

Home :
- CTA Scan ;
- 3 réponses ;
- Execution Plan ;
- CTA vers formulaire ;
- contexte Scan visible dans le formulaire ;
- soumission lead.

Experts :
- CTA ;
- choix expertise ;
- délai ;
- identité ;
- lead reçu dans Autonomia.

Academy :
- CTA ;
- thème ;
- nombre de collaborateurs ;
- identité ;
- lead reçu dans Autonomia.

Google Ads :
- tester au moins une LP expert et une LP formation avec :
  `?utm_source=google&utm_medium=cpc&utm_campaign=test&utm_term=test&gclid=test`

Meta :
- tester au moins un diagnostic avec :
  `?utm_source=meta&utm_medium=paid-social&utm_campaign=test&campaign_id=1&adset_id=2&ad_id=3&creative_id=4&fbclid=test`
- vérifier que le résultat du Scan apparaît avant le formulaire de coordonnées ;
- vérifier que `requested_service` conserve le slug du funnel diagnostic ;
- vérifier que `scan_context.source` identifie le funnel d'origine.

Google Ads :
- vérifier aussi le lien secondaire vers `/scan-ia` lorsque le visiteur ne sait pas encore exactement quoi demander.

Vérifier :
- first-touch ;
- attribution_history ;
- landing_page_url ;
- form_id ;
- requested_service ;
- scan_context ;
- consent.

### 8. Tests SEO / GEO

- canonical = domaine final ;
- sitemap accessible ;
- robots accessible ;
- LP Google indexables ;
- diagnostics Meta noindex ;
- metadata uniques ;
- FAQ schema valide ;
- pages scénario indexables uniquement si contenu utile et non dupliqué ;
- aucun environnement preview indexé accidentellement.

### 9. Mesure

Événements préparés / à vérifier :
- form_start ;
- form_step ;
- generate_lead ;
- autonomia_scan_answer ;
- autonomia_scan_back ;
- autonomia_scan_cta ;
- autonomia_scan_restart.

Après consentement explicite :
- les événements sont transmis à GA4 si configuré ;
- `generate_lead` envoie la conversion Google Ads si ID + label sont configurés ;
- `generate_lead` envoie l’événement Meta `Lead` si le Pixel est configuré.

Sans consentement :
- les scripts GA4 / Google Ads / Meta ne doivent pas être chargés ;
- aucun événement analytics / ad ne doit être envoyé à ces plateformes.

À relier ensuite au pipeline Autonomia :
lead → qualified lead → meeting → proposal → won → revenue → margin.

### 10. Validation code avant intégration

Depuis la racine du repository :

```bash
cd site
npm install --ignore-scripts
npm run content:validate
npm run build
```

Le workflow GitHub `validate-public-site` (`.github/workflows/validate-site.yml`) doit être vert sur la PR #10.

### 11. Ordre de lancement

1. CI site verte.
2. Merge code validé.
3. Créer projet Vercel `site/`.
4. Ajouter variables non secrètes.
5. Créer le secret inbound directement dans Vercel/backend.
6. Brancher l'endpoint inbound.
7. Test lead réel.
8. Vérifier Supabase.
9. Ajouter domaine.
10. Vérifier canonical/sitemap/robots.
11. Ajouter juridique + Qualiopi vérifiée.
12. Brancher analytics avec consentement.
13. Test Google Ads.
14. Test Meta.
15. Ouvrir la production.

## Critère GO

Le site peut être ouvert lorsque :
- un lead réel traverse le funnel de bout en bout ;
- l'attribution est conservée ;
- aucune donnée sensible / secret n'est exposé ;
- les mentions légales et privacy sont présentes ;
- la mention Qualiopi est exacte ;
- aucun élément de preuve n'est inventé ;
- mobile et desktop ont été vérifiés ;
- production n'affiche aucune erreur runtime.


## Carte opérationnelle « GO VERCEL »

Quand la consigne « go Vercel » est donnée mardi, ne pas reconstruire l’acquisition. Exécuter cette séquence.

### A. GitHub
1. ouvrir la PR #10 ;
2. confirmer que le head est `feat/autonomia-public-site-v2` ;
3. vérifier que `validate-public-site` est vert ;
4. vérifier qu’aucun conflit n’est signalé ;
5. merger uniquement après validation du build.

### B. Vercel
- Repository : `aristote-app/Autonomia-MCP`
- Root Directory : `site`
- Framework : Next.js
- Node.js : 22.x
- Install Command : `npm install --ignore-scripts --no-audit --no-fund`
- Build Command : `npm run build`
- Production Branch : `main`

### C. Variables minimales
```
NEXT_PUBLIC_SITE_URL=<url publique finale>
AUTONOMIA_INBOUND_URL=https://<autonomia-mcp-host>/api/inbound/leads
AUTONOMIA_INBOUND_TOKEN=<secret serveur>
```

### D. Variables de mesure — seulement lorsque validées
```
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=
NEXT_PUBLIC_META_PIXEL_ID=
```

### E. Qualiopi — uniquement si vérifié
```
QUALIOPI_PUBLIC_LABEL=
QUALIOPI_CERTIFICATE_URL=
```
Laisser vide si l’entité, le périmètre ou la formulation ne sont pas confirmés.

### F. Smoke test Meta
Exemple :
```
/diagnostic-copilot?utm_source=meta&utm_medium=paid-social&utm_campaign=smoke-meta&campaign_id=1&adset_id=2&ad_id=3&creative_id=4&fbclid=test
```

Contrôler :
- Scan affiché avant toute demande de coordonnées ;
- résultat complet visible ;
- formulaire seulement après « Continuer avec ce plan » ;
- `requested_service=diagnostic-copilot` ;
- `scan_context.source=diagnostic_diagnostic-copilot` ;
- version, réponses, priorité, point de vigilance, profils, compétences et commercial_handoff présents ;
- attribution Meta conservée.

### G. Smoke test Google Ads
Exemple :
```
/consultant-rag?utm_source=google&utm_medium=cpc&utm_campaign=smoke-google&utm_term=consultant-rag&gclid=test
```

Contrôler :
- contenu RAG spécifique ;
- bloc problème → compétences → profil / mission ;
- formulaire Experts ;
- `requested_service=consultant-rag` ;
- UTM + gclid présents ;
- lien secondaire Autonomia Scan présent.

### H. Test conversion
Avec consentement accepté :
- GA4 reçoit les événements si ID configuré ;
- Google Ads reçoit la conversion lead si ID + label configurés ;
- Meta reçoit `Lead` si Pixel configuré.

Avec consentement refusé :
- aucun script non essentiel chargé ;
- aucune conversion externe envoyée.

### I. NO-GO
Ne pas ouvrir le domaine / campagnes si un seul de ces points échoue :
- CI non verte ou non vérifiée ;
- formulaire 502 / 503 ;
- lead non persisté côté Autonomia-MCP ;
- attribution perdue ;
- secret client-side ;
- canonical incorrect ;
- diagnostics Meta indexables ;
- trackers chargés avant consentement ;
- mentions légales / privacy absentes ;
- Qualiopi non vérifiée mais affichée ;
- erreur runtime mobile ou desktop.

### J. GO
Le site est prêt à ouvrir lorsque :
1. PR #10 mergée avec CI verte ;
2. preview Vercel testée ;
3. lead réel reçu de bout en bout ;
4. contexte Scan + attribution vérifiés ;
5. mobile et desktop vérifiés ;
6. juridique / privacy présents ;
7. tracking testé avec consentement ;
8. aucune erreur runtime observée.


## Organic Engine V1 — branchement mardi

### Variables
```
INDEXNOW_KEY=
AUTONOMIA_INDEXING_TOKEN=
AUTONOMIA_ORGANIC_TOKEN=
AUTONOMIA_ORGANIC_INSIGHTS_URL=
AUTONOMIA_ORGANIC_INSIGHTS_TOKEN=
```

### Après domaine / canonical
1. ouvrir `/sitemap.xml` et vérifier les 40 piliers + guides publiés ;
2. ouvrir `/robots.txt` et vérifier `OAI-SearchBot` + `OAI-AdsBot` ;
3. tester `/indexnow/<INDEXNOW_KEY>` ;
4. envoyer UNE URL réellement créée/modifiée vers `POST /api/indexnow` ;
5. vérifier réception dans Bing Webmaster Tools ;
6. ajouter le sitemap à Google Search Console ;
7. vérifier qu’aucun diagnostic Meta n’est indexable ;
8. tester le crawl d’une page publique sans challenge CDN/WAF.

### Monitoring SEO / GEO
Le site expose :
- `GET /api/organic/manifest` : inventaire organique ;
- `POST /api/organic/insights` : Search Console / Google GenAI / Bing / ChatGPT ;
- `GET /api/organic/media-manifest` : briefs visuels/vidéos pour guides publiés.

Tous sont protégés par les tokens organiques.

### Politique 400 pages
- 400 intentions restent dans le backlog ;
- 40 piliers sont des surfaces sémantiques indexables ;
- un guide use case n’est indexable que lorsqu’il est réellement publié et passe le gate CI ;
- ne jamais générer 394 thin pages pour atteindre artificiellement un volume d’URL.

### Search Console
Après validation de propriété :
- soumettre sitemap ;
- vérifier Pages / Indexation ;
- vérifier requêtes et impressions ;
- exploiter le rapport IA générative disponible sur la propriété ;
- envoyer les métriques normalisées vers Autonomia-MCP.

### Bing / IndexNow
- connecter Bing Webmaster Tools ;
- vérifier IndexNow ;
- exploiter AI Performance si disponible ;
- renvoyer les métriques au format organique normalisé.

### ChatGPT
- vérifier que OAI-SearchBot obtient 200 sur home, pilier et guide ;
- vérifier CDN / WAF / bot protection ;
- suivre les observations de citations sans inventer une métrique non disponible.

### GO Organic
Le moteur organique est considéré branché lorsque :
- 40 piliers présents au sitemap ;
- guides publiés présents au sitemap ;
- backlog non publié absent du sitemap ;
- IndexNow accepte une URL modifiée ;
- Search Console reçoit le sitemap ;
- OAI-SearchBot peut crawler ;
- manifest organique accessible avec token ;
- insights peuvent être forwardés vers Autonomia-MCP.


### Vérification moteurs / RSS
Variables optionnelles à ajouter lorsque les propriétés sont créées :
```
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

Après production :
- vérifier que les balises de vérification sont présentes ;
- ajouter la propriété dans Google Search Console ;
- ajouter la propriété dans Bing Webmaster Tools ;
- soumettre `/sitemap.xml` ;
- vérifier `/feed.xml` ;
- lancer le workflow GitHub `seo-production-smoke` avec l’URL de production ;
- vérifier les guides Wave 3 :
  - `/cas-usage-ia/creer-un-assistant-support-qui-cite-les-procedures-internes`
  - `/formation-ia/cas-usage/apprendre-a-concevoir-un-agent-avec-validation-humaine`.


### Observatoire Autonomia
Après branchement de `AUTONOMIA_CONTENT_SIGNALS_URL` :
- ouvrir `/observatoire-ia` ;
- vérifier que le nombre d’offres observées est cohérent avec l’endpoint ;
- vérifier rôles / outils / compétences / cas d’usage ;
- vérifier période et disclaimer ;
- vérifier que le schema Dataset n’apparaît que lorsque les données sont réellement chargées ;
- vérifier que l’Observatoire est présent dans le sitemap.

<!-- o2switch deploy trigger: 2026-09-24T10:24:00Z -->

<!-- o2switch deploy trigger: 2026-09-24T11:58:00Z -->
