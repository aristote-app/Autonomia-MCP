# AUTONOMIA Growth Engine — cap 40 rendez-vous qualifiés par semaine
Date de conception : 16 octobre 2026 · État : développement sur branche, **non déployé**
 
## Périmètre et outils réellement possédés
- Waalaxy Pro aujourd'hui ; upgrade **Advanced annuel choisi**, activation et clé API à confirmer.
- Kaspr payé ; disponibilité de son API selon le forfait/les crédits à confirmer.
- Metricool gratuit : vérifier les droits effectifs de publication LinkedIn.
- Cockpit AUTONOMIA existant (Next, Supabase, collecte de signaux, comptes, contacts, pipeline).
- Gmail, Calendly, LinkedIn, site AUTONOMIA. Aucun achat de Lemlist, Brevo, Salesforce, Clay, BellumAI, 11x, Common Room ou Salesforge.
- Les moteurs peuvent être des jobs Node existants : ni MCP ni API ne constituent à eux seuls un service d'exécution permanent. Ne pas ajouter n8n par défaut.

## Définition du succès
Un « rendez-vous qualifié » = entreprise réelle ciblée + interlocuteur pertinent + besoin ou sujet à qualifier clairement identifié + créneau accepté + rendez-vous tenu distinctement suivi. Ne pas compter invitations, clics, réponses positives, réservations non tenues ou leads non qualifiés comme RDV tenus.

Le chiffre 40/semaine est une cible de capacité, **pas une prévision** ni un engagement de résultat. Elle représente en moyenne 8 RDV/jour sur cinq jours ouvrés : environ 4 heures de conversation/jour avec des appels de 30 minutes, hors préparation, qualification, relances et vente.

## Contrainte Waalaxy
Advanced : jusqu'à 800 invitations mensuelles / environ 200 hebdomadaires (plafond commercial dépendant du compte et des limites LinkedIn). La limite est partagée par toutes les campagnes.
Exemple hypothétique :
200 invitations * 35 % acceptation * 18 % réponse * 35 % réponses qui prennent rendez-vous = **4,41 RDV/semaine**.
Manqueraient 35,59 RDV via d'autres canaux dans cet exemple.
Interdiction de multiplier les comptes, contourner les contrôles ou manipuler l'engagement LinkedIn ; respecter les conditions d'utilisation. L'agent ne change pas les quotas.

## Les canaux à réunir sans abonnement supplémentaire
1. **LinkedIn ciblé** : Waalaxy Advanced après activation, validation des prospects, messages respectueux et stop sur réponse/opposition.
2. **Email B2B 1:1 via Gmail** : uniquement contacts professionnels pertinents, légalité et droit d'opposition vérifiés ; faible volume, réputation de domaine surveillée. Pas d'emailing de masse à partir d'un compte personnel.
3. **Réactivation des comptes connus** : contacts déjà présents, opportunités dormantes, devis, anciens prospects ; seulement si nouveau contexte et contact autorisé.
4. **Inbound** : posts Metricool si autorisé, newsletters LinkedIn natives, kits « Les Machines IA », pages à cas d'usage et formulaires/Calendly traçables.
5. **Partenariats et mises en relation** : Odexis, réseau de formateurs/consultants, clients existants, communautés professionnelles ; messages préparés, introduction réelle et volontaire.
6. **Démonstrations et événements courts** : atelier pratique BUILD ou ACADEMY, inscription explicite et relance des personnes intéressées.
7. **Marchés et consultations** : BOAMP/TED et besoins publics, approche conforme aux règles d'achat public ; ne pas transformer des AO en leads fictifs.

Aucun quota ni taux de conversion de ces canaux n'est établi avant observation. Construire un tableau de mesure **par source** et déplacer l'effort vers les sources qui produisent de vrais rendez-vous.

## ICP : clients finaux uniquement
- EXPERTS : CTO, DSI, Head of AI/Data, responsables recrutement sur annonces directes (AI Engineer, RAG, MLOps, product IA). Offrir renfort externalisé uniquement s'il est approprié, sans inventer de consultant disponible.
- ACADEMY : responsable formation, L&D, DRH, responsable adoption, DSI prescripteur. Signaux = déploiement Copilot/ChatGPT, politique IA, montée en compétences ; prospection proactive possible sans signal, en tant que question, pas affirmation.
- BUILD : DSI, COO, responsables opérations, chefs de projet transformation, DG de PME/ETI. Processus chronophages, projets IA, automatisation, digitalisation.
- Exclure ESN, SSII, cabinets de recrutement, job boards intermédiaires. Code NAF seul **insuffisant** pour vérifier l'employeur. Vérifier site officiel, dénomination et source directe. Incertitude -> revue humaine, pas d'envoi.

## Architecture d'agents (séparation pensée / action)
1. **Scout** — collecter les annonces et signaux autorisés (déjà partiellement présent).
2. **Account Graph** — regrouper les mentions par entreprise, éviter faux doublons SIREN / domaine / libellé.
3. **Buyer Mapper** — trouver les rôles et vérifier les coordonnées / liens LinkedIn déjà disponibles.
4. **Solution Matcher** — choisir BUILD / EXPERTS / ACADEMY et la pièce de preuve/document réellement disponible.
5. **Writer** — proposer un message sans signal inventé et sans résultats clients fictifs.
6. **Compliance Guard** — client final, contacts opt-out, source des données, règles de prospection, doublons, vérification.
7. **Delivery Adapter** — API REST Waalaxy sur action validée. L'API importe dans **une campagne existante** ; elle ne couvre pas toutes les fonctions de messagerie.
8. **Revenue Analyst** — suivi réponses → créneaux acceptés → RDV tenus → propositions → CA signé, et ajustement des priorités avec des données historiques suffisantes.

Les agents de lecture peuvent fonctionner sur une cadence planifiée et produire une file de validation. Les agents d'écriture sur les réseaux restent subordonnés à des autorisations et confirmations adaptées. Aucun contournement LinkedIn.

## Ce qui vient d'être développé sur cette branche
- \`lib/intelligence/growthEngine.js\` : classification, priorisation vérifiable, sélection du décideur, prospection proactive depuis les contacts déjà stockés, exclusion ESN/opposition, messages sans information inventée, estimation capacité.
- \`app/growth/page.js\` + styles : page Growth Engine privée, filtres par offre / prochaine action, statistiques réelles du pipeline, calcul illustratif, sources et liens de preuve.
- \`app/api/growth/plays/route.js\` : endpoint lecture seule protégé par session workspace ; réutilisable à terme par un agent interne authentifié.
- \`scripts/smoke-growth-engine.mjs\` : scénarios ESN, opt-out, ACADEMY/L&D, sources, déduplication, absence de signal, plafond commercial.
- Navigation ajoutée dans \`app/layout.js\`.

## Exigences restantes pour une véritable machine de réservation
1. Brancher les identifiants Waalaxy Advanced et **tester** les listes/campagnes/API sur un profil autorisé.
2. Tester les variables personnalisées Waalaxy dans les séquences et les retours par prospect ; ne pas présumer leur rendu.
3. Ajouter une table/flux d'événements RDV avec \`booked_at\`, \`held_at\`, \`qualified_at\`, \`channel\`, \`campaign\`, \`outcome\` pour les indicateurs réellement hebdomadaires.
4. Relier Calendly à cette mesure et dédupliquer avec les leads existants. Préparer les réunions depuis le compte 360°.
5. Renforcer la vérification « client final » avant envoi. Un score élevé ne signifie jamais « autorisé à contacter ».
6. Vérifier la disponibilité des sources de recrutement en production ; sources actuellement codées ≠ sources opérationnelles.
7. Mettre au point les règles de qualification métier et une file de validation pour éviter les faux positifs.
8. Vérifier le forfait Metricool gratuit : la planification LinkedIn peut nécessiter un niveau payant selon les droits actuels.
9. Mesurer 2 à 4 semaines pilotes avant d'augmenter les volumes.
10. Déployer seulement après recette Next, autorisations du cockpit, contrôle RGPD et validation éditoriale.

## Tests et sécurité
- Le dashboard doit rester accessible uniquement aux membres authentifiés du workspace.
- Jamais d'API key, d'email direct ou de données personnelles dans des journaux publics, pages publiques ou query params.
- Pas de source sans URL et date valable présentée comme preuve récente.
- Une entreprise ou un contact interdit ne doit pas être intégré automatiquement.
- Mesurer réellement les RDV **tenus** et qualifiés ; les valeurs de simulation doivent être labellisées hypothétiques.
- Dans le marketing, employer « objectif 40 RDV/semaine » et non « 40 RDV garantis ».
