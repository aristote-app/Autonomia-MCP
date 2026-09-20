# Mardi — intégration et mise en ligne du site Autonomia

Objectif : brancher le site public sans reconstruire l'acquisition ni modifier les funnels.

## État déjà préparé

### Site public
- Application Next.js autonome dans `site/`.
- Home "Autonomia — La force d'exécution IA".
- Univers Experts et Academy.
- Autonomia Scan : 3 questions → premier Execution Plan.
- Passage Scan → formulaire sans ressaisie du besoin.
- LP Google Ads par intention.
- Funnels / diagnostics Meta.
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
  - plan ;
  - diagnostic / funnel d’origine lorsqu’il existe ;
  - objectif ;
  - stade ;
  - blocage ;
  - mission suggérée ;
  - compétences à mobiliser ;
  - profils à évaluer ;
  - besoins de formation ;
  - prochaines étapes ;
  - questions de qualification commerciale suivantes ;
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

Production branch :
branche choisie après validation / merge du site.

Ne pas déployer le cockpit interne comme site public.

### 2. Variables site public

Config :
`NEXT_PUBLIC_SITE_URL=<domaine public final>`

Secrets :
`AUTONOMIA_INBOUND_URL=<endpoint serveur Autonomia-MCP>`
`AUTONOMIA_INBOUND_TOKEN=<secret généré et stocké uniquement dans Vercel + backend>`

Optionnel au lancement si analytics validés :
`NEXT_PUBLIC_GA4_ID=`
`NEXT_PUBLIC_GOOGLE_ADS_ID=`
`NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=`
`NEXT_PUBLIC_META_PIXEL_ID=`

Signal marché :
`AUTONOMIA_CONTENT_SIGNALS_URL=<endpoint public read-only Autonomia-MCP>`

### 3. Backend inbound

Créer / valider un endpoint serveur Autonomia-MCP qui :
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
- autonomia_scan_cta.

À relier ensuite au pipeline Autonomia :
lead → qualified lead → meeting → proposal → won → revenue → margin.

### 10. Ordre de lancement

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

Quand la consigne « go Vercel » est donnée mardi, exécuter dans cet ordre sans reconstruire le site :

### A. Vérification GitHub
- branche source : `feat/autonomia-public-site-v1` tant qu’elle n’est pas mergée ;
- vérifier le dernier état de la PR #5 ;
- vérifier le workflow `Autonomia Public Site CI` ;
- ne pas déclarer le build valide sans run vert observé.

### B. Configuration projet Vercel
- Repository : `aristote-app/Autonomia-MCP`
- Root Directory : `site`
- Framework Preset : Next.js
- Node.js : 22.x
- Install Command : `npm install --no-audit --no-fund`
- Build Command : `npm run build`

### C. Variables indispensables avant test lead
```
NEXT_PUBLIC_SITE_URL=<url finale ou url de preview utilisée pour le test>
AUTONOMIA_INBOUND_URL=<endpoint inbound réel>
AUTONOMIA_INBOUND_TOKEN=<secret serveur>
```

Variables à ajouter uniquement lorsque les comptes de mesure sont validés :
```
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL=
NEXT_PUBLIC_META_PIXEL_ID=
```

Signal marché, si endpoint disponible :
```
AUTONOMIA_CONTENT_SIGNALS_URL=
```

### D. Smoke test minimal avant domaine
1. ouvrir la home ;
2. lancer le Scan depuis la home ;
3. tester les 3 réponses ;
4. vérifier mission + compétences + profils + compétences internes + prochaines étapes ;
5. cliquer « Transformer ce plan en action » ;
6. vérifier que le formulaire reprend le Scan ;
7. envoyer un lead test ;
8. relire le lead côté Autonomia-MCP et vérifier `scan_context`.

### E. Test funnel Meta spécialisé
Utiliser par exemple :
```
/diagnostic-copilot?utm_source=meta&utm_medium=paid-social&utm_campaign=smoke-meta&campaign_id=1&adset_id=2&ad_id=3&creative_id=4&fbclid=test
```

Vérifier :
- aucune demande de coordonnées avant le résultat du Scan ;
- le lien vers le Scan contient `focus=diagnostic-copilot` ;
- le Scan affiche « Adoption Copilot » comme angle d’entrée ;
- `source_diagnostic=diagnostic-copilot` est conservé dans le lead ;
- first touch et historique d’attribution restent présents.

### F. Test Google Ads spécialisé
Utiliser par exemple :
```
/consultant-rag?utm_source=google&utm_medium=cpc&utm_campaign=smoke-google&utm_term=consultant-rag&gclid=test
```

Vérifier :
- contenu spécifique RAG ;
- formulaire Experts ;
- `requested_service=consultant-rag` ;
- UTM + gclid présents dans le lead.

### G. Vérification tracking après consentement
Avec consentement accepté :
- `form_start` ;
- `form_step` ;
- `autonomia_scan_answer` ;
- `autonomia_scan_cta` ;
- `generate_lead` dans GA4 ;
- conversion Google Ads uniquement si ID + label sont configurés ;
- événement Meta `Lead` uniquement si Pixel configuré.

Avec consentement refusé :
- aucun script GA4 / Google Ads / Meta ne doit être chargé.

### H. NO-GO immédiat si
- build CI non vert ou non vérifié ;
- formulaire renvoie 503/502 ;
- lead non persisté côté Autonomia ;
- secret exposé côté client ;
- canonical incorrect ;
- diagnostic Meta indexable ;
- tracker non essentiel chargé avant consentement ;
- mentions légales / privacy absentes au moment d’ouvrir réellement les campagnes ;
- mention Qualiopi non vérifiée ;
- preuve ou chiffre non vérifié visible.

### I. GO
Le domaine et les campagnes peuvent être ouverts uniquement après :
1. build vérifié ;
2. lead réel de bout en bout ;
3. attribution vérifiée ;
4. Scan context vérifié ;
5. mobile + desktop vérifiés ;
6. privacy / légal finalisés ;
7. trackers vérifiés avec consentement ;
8. aucune erreur runtime observée.
