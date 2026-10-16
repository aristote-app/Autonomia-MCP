# AUTONOMIA — AUDIT SEO / GEO TECHNIQUE (premier passage)
**Date :** 16/10/2026 · **Source de vérification :** code du site public, validations CI et routes versionnées. Ce document distingue les faits testés des vérifications qui nécessitent l'accès réel à Search Console, au site et aux mesures de terrain.

## Constats établis sur le code
- **Robots** : un `app/robots.js` génère les règles. Navigation autorisée sur le contenu public, `/api/` exclu ; règles explicites notamment pour `OAI-SearchBot`. La navigation par les robots dépend également du serveur et des éventuelles règles réseau ou WAF.
- **Sitemap** : `app/sitemap.js` s'appuie sur `lib/organicUrls.js`, avec les pages structurantes et désormais les quatre guides BUILD. L'URL canonique du site est prévue sur `https://build-autonomia.com`.
- **Pages commerciales** : `/solutions-ia`, `/cout-agent-ia`, `/demonstrateurs-ia` et quatre nouvelles routes ont des titres, descriptions et canoniques explicites.
- **Données structurées** : les nouvelles pages utilisent `Article` + `FAQPage` en JSON-LD, avec des FAQ visibles sur la page. Elles évitent de revendiquer des gains, témoignages, clients ou déploiements fictifs.
- **Maillage** : accès depuis le hub BUILD ; liens entre les quatre guides, le guide de coût d'agent, les démonstrateurs et la route de contact `/start`.
- **Conversion** : les guides proposent un accès au formulaire et à Calendly. Le suivi réel jusqu'au cockpit doit être testé par une demande de recette.
- **Validation statique** : `npm run build-guides:test` vérifie la cohérence des quatre pages, leurs FAQ, leurs liens et leur présence dans le sitemap ; intégré au workflow `validate-public-site-production`. L'audit historique `npm run seo:audit` reste exécuté dans ce workflow.

## Vérifications non encore terminées
1. **Publication o2switch** : le SHA exact servi par `/api/health` doit correspondre au commit public et les quatre URLs doivent répondre avec leur texte attendu. Nouveau test automatique dans `deploy-public-o2switch-self`, avec statut distinct `o2switch/public-production`.
2. **Search Console** : contrôler couverture, indexation réelle des URL, erreurs d'exploration et resoumission du sitemap. Le workflow tente la resoumission et vérifie la connexion après déploiement, mais cela ne garantit pas l'indexation.
3. **Performance web** : mesurer Core Web Vitals sur mobile et desktop avec des données de terrain lorsqu'elles existent ; auditer LCP, INP, CLS, poids des images et polices.
4. **Expérience de conversion** : tests réels du formulaire, conservation des UTM et du consentement, réception dans la boîte inbound cockpit, redirection Calendly et confirmation des prises de rendez-vous.
5. **Accessibilité** : tests clavier, contrastes, annonces des erreurs, focus, formulaires et affichage 320–1440px sur une session de navigateur distante.
6. **GEO / indexabilité LLM** : JSON-LD et sitemap facilitent la compréhension, mais aucune méthode ne garantit l'indexation ni la citation par tous les modèles. Un éventuel `llms.txt` est une ressource facultative, pas un prérequis d'accès universel.

## Réserve éditoriale
Les nouveaux guides sont des ressources d'achat originales. Les scénarios sont explicitement illustratifs et les prix indicatifs ne doivent pas devenir des tarifs commerciaux sans validation de la direction.

## Décisions
- Ne pas cocher la tâche « audit SEO complet » avant les vérifications sur données réelles (CWV, Search Console, mobile, conversion).
- Cocher séparément les quatre contenus et leur maillage lorsque leur publication et leurs URL sont **confirmées** sur o2switch.
- Aucune campagne Google Ads à activer tant que les formulaires et les conversions ne sont pas vérifiés.
