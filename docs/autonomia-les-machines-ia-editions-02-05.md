# AUTONOMIA — LES MACHINES IA
## Éditions #02 à #05 — brouillons prêts pour relecture / programmation
**Ligne éditoriale :** Chaque semaine, une machine IA à construire avec son Kit IA prêt à l'emploi.
**Édition #01 déjà définie :** SAV e-commerce, « Où est mon colis ? ». Les éditions ci-dessous sont distinctes et poursuivent la même logique : problème concret → flux → kit réutilisable → mise en œuvre contrôlée.
**Statut :** aucun texte publié ni programmé via cet export.

---

## ÉDITION #02 — La machine qui qualifie les demandes B2B avant un rendez-vous
**Accroche LinkedIn :** « Bonjour, pouvez-vous m'envoyer un devis ? » Cette phrase peut cacher un projet prêt à démarrer… ou une demande encore trop floue.

### Le problème métier
Un formulaire générique transmet un nom et un e-mail. L'équipe rappelle sans connaître le contexte, relit la demande, pose les mêmes questions et oublie parfois de noter les prochaines étapes. Résultat : du temps de qualification perdu et une réponse peu adaptée.

### La machine à construire
**Demande entrante → extraction du besoin → questions manquantes → qualification structurée → proposition de suite → validation du commercial → CRM.**

Démarrez sans agent autonome : un formulaire ou e-mail déclenche la création d'un brouillon de fiche prospect. Un modèle peut reformuler le problème, détecter les informations absentes et proposer deux ou trois questions utiles. Il ne doit pas déduire un budget ou une autorité de décision inexistants.

### Kit IA à copier-coller
**Rôle :** assistant de préparation commerciale B2B.  
**Entrée :** texte de la demande, entreprise, secteur et provenance (données autorisées).  
**Instruction :** « Résume le besoin exprimé en deux phrases. Sépare les faits explicitement fournis des hypothèses. Liste trois informations manquantes nécessaires à un premier échange. Propose un e-mail de clarification de 90 mots maximum. Ne crée aucun chiffre, contact ou engagement. Retourne un objet JSON avec : besoin_exprime, faits, inconnues, questions, brouillon_email, points_a_valider. »  
**Sortie :** fiche de qualification + e-mail modifiable par la personne responsable.

### Contrôle humain indispensable
La personne chargée du compte vérifie les données, choisit le niveau de priorité et décide si le prospect doit recevoir un rendez-vous, des questions ou une réponse immédiate. Aucun envoi automatique au départ.

### Premier test
Essayez sur dix demandes fictives : 3 précises, 4 incomplètes, 3 hors périmètre. Mesurez le nombre de questions pertinentes, les erreurs d'interprétation et le temps de correction.

**À retenir :** Une machine utile ne juge pas le prospect. Elle prépare la prochaine conversation.
**Pour aller plus loin :** https://build-autonomia.com/agent-ia-ou-automatisation
**CTA final :** Quel formulaire ou type de demande voudriez-vous qualifier en premier ?

---

## ÉDITION #03 — La machine qui prépare les échéances d'un marché public
**Accroche LinkedIn :** Une échéance importante est souvent connue… mais dispersée entre un tableau, une pièce contractuelle et un e-mail.

### Le problème métier
Le suivi administratif et financier d'un marché nécessite des pièces, des dates, des situations à contrôler et des échanges entre services. Reconstituer le contexte d'une décision prend du temps.

### La machine à construire
**Pièces du marché → extraction des références → calendrier structuré → points à vérifier → alerte → visa du gestionnaire.**

Le moteur n'établit pas une conformité juridique : il prépare un registre de travail que le service doit contrôler. Les calculs engageants et les échéances réglementaires sont paramétrés et validés par les professionnels.

### Kit IA à copier-coller
**Rôle :** assistant administratif de préparation de suivi.  
**Entrée :** documents fictifs ou anonymisés d'un marché, index contractuel et règles validées.  
**Instruction :** « Extrais uniquement les références et dates explicitement présentes dans les pièces fournies. Pour chaque information, indique le nom du document source et la phrase justificative. Lorsqu'une donnée manque ou se contredit, marque-la A_VERIFIER. Prépare une liste d'actions et responsables suggérés, sans conclure à la conformité d'un acte ni autoriser un paiement. Retourne : reference, date, source, statut_verification, action_proposee. »  
**Sortie :** tableau de préparation de suivi + liste des éléments à viser.

### Contrôle humain indispensable
Le gestionnaire vérifie les versions documentaires, confirme les dates applicables et valide les éléments avant inscription au suivi officiel.

### Premier test
Commencer avec un jeu de 5 documents fictifs comportant une date contradictoire et une pièce manquante. Vérifier que l'outil remonte l'incertitude au lieu de l'inventer.

**À retenir :** L'IA prépare le contrôle ; le professionnel applique la règle.
**Pour aller plus loin :** https://build-autonomia.com/suivi-marches-publics-ia
**CTA final :** Dans quel service les échéances sont-elles aujourd'hui les plus difficiles à suivre ?

---

## ÉDITION #04 — La machine qui transforme un compte rendu de réunion en actions
**Accroche LinkedIn :** « On en reparle la semaine prochaine. » Et si, cette fois, chaque décision avait un responsable et une échéance clairement retrouvables ?

### Le problème métier
Après une réunion, les décisions, points ouverts et actions sont dispersés dans des notes. Les collaborateurs ne sont pas toujours certains de ce qui a été décidé, proposé ou simplement évoqué.

### La machine à construire
**Notes ou transcription → séparation décisions / discussions → extraction des actions → propriétaire et échéance → validation → publication dans l'outil de travail.**

Un modèle peut détecter des formulations utiles mais doit distinguer « à faire » de « à envisager ». Il doit éviter d'attribuer des responsabilités et dates non confirmées.

### Kit IA à copier-coller
**Rôle :** assistant de comptes rendus opérationnels.  
**Entrée :** notes de réunion partagées avec autorisation, participants et ordre du jour.  
**Instruction :** « Extrais les décisions explicites, les actions évoquées et les questions ouvertes dans trois rubriques séparées. Pour chaque action, indique : description, responsable (ou NON_PRECISÉ), échéance (ou À_FIXER), citation source, degré de certitude. Ne transforme jamais une proposition en décision. Prépare un e-mail de synthèse à relire avant diffusion. »  
**Sortie :** plan d'actions validable, prêt à intégrer à Teams, Notion, Trello ou un outil de suivi selon les accès.

### Contrôle humain indispensable
L'organisateur vérifie le sens des décisions et le consentement à partager la transcription ; les responsables confirment les échéances.

### Premier test
Créer un compte rendu fictif contenant deux décisions, trois idées, une action sans propriétaire et une date ambiguë. Vérifier que la machine ne comble pas les vides.

**À retenir :** Une synthèse utile conserve les incertitudes visibles.
**Pour aller plus loin :** https://build-autonomia.com/solutions-ia
**CTA final :** Souhaitez-vous le modèle de tableau de suivi associé ?

---

## ÉDITION #05 — La machine qui prépare l'arrivée d'un nouveau collaborateur
**Accroche LinkedIn :** Le premier jour d'un nouveau collaborateur ne devrait pas dépendre de dix e-mails manuels envoyés au bon moment.

### Le problème métier
Un onboarding implique RH, manager, informatique et parfois plusieurs sites. Les tâches se répètent, mais certaines informations sont sensibles et les accès doivent être accordés par les personnes habilitées.

### La machine à construire
**Date d'arrivée confirmée → checklist par rôle → notifications → préparation des accès → validation par les responsables → suivi d'intégration.**

Une automatisation classique suffit pour une grande partie du flux ; une IA peut aider à adapter le guide d'accueil aux questions du poste en utilisant uniquement les documents internes autorisés.

### Kit IA à copier-coller
**Rôle :** assistant de préparation onboarding.  
**Entrée :** modèle de checklist approuvé, poste, service, date d'arrivée et responsabilités (sans données sensibles non nécessaires).  
**Instruction :** « À partir de la checklist approuvée, prépare la séquence de tâches d'onboarding en identifiant le responsable du contrôle et la date cible relative à l'arrivée. Distingue tâches automatiques (notification, rappel) et tâches nécessitant validation (création de droits, achats, documents RH). N'ajoute aucune procédure absente du référentiel. Retourne : tâche, responsable, date_cible, action_autorisée, statut. »  
**Sortie :** liste de tâches à confirmer par RH et IT.

### Contrôle humain indispensable
La RH valide le contenu transmis, le manager les attentes et l'équipe IT les habilitations. L'IA ne crée pas d'accès sensibles seule.

### Premier test
Simulation pour deux types de postes fictifs, avec une exception d'arrivée décalée. Vérifier que les notifications ne partent qu'après confirmation.

**À retenir :** Automatiser la coordination n'est pas déléguer les décisions d'habilitation.
**Pour aller plus loin :** https://build-autonomia.com/application-metier-ia
**CTA final :** Quelle tâche répétitive de votre onboarding élimineriez-vous en premier ?

---

## Mini-protocole de publication
1. Relecture de l'angle, des exemples, de la confidentialité et de la promesse.
2. Vérifier que les liens sont en production et que les kits n'intègrent aucune donnée personnelle.
3. Préparer un visuel au format LinkedIn à partir d'un diagramme schématique authentique, sans faux client ni gains inventés.
4. Programmer les éditions dans LinkedIn / Metricool après validation du calendrier et accès confirmé.
5. Mesurer ouvertures si disponibles, clics vers le site, messages qualifiés et demandes de démonstration.
