import { buildTrainingArticle } from "./training-article-factory.js";

const managerSpecs = [
  {
    family: "direction",
    cluster: "Managers",
    title: "Former les managers à utiliser l’IA sans perdre le contrôle du travail",
    audience: "managers de proximité, responsables d’équipe et managers de fonctions support",
    objective: "utiliser l’IA comme assistance au travail sans déléguer implicitement les décisions, la qualité ou la responsabilité managériale",
    workshop: "analyser une semaine de tâches managériales et choisir pour chacune ce qui peut être assisté, préparé, automatisé ou doit rester entièrement humain",
    deliverable: "une matrice équipe par tâche avec niveau d’usage IA, garde-fou, validation et règle de reprise",
    assessment: "revoir un nouveau processus managérial et justifier le niveau d’autonomie acceptable pour chaque étape",
    transfer: "utiliser la matrice lors des points d’équipe pour encadrer les nouveaux usages IA",
    guardrail: "l’IA prépare, structure ou suggère ; le manager reste responsable des arbitrages, feedbacks, décisions individuelles et engagements pris au nom de l’équipe",
    example: "les collaborateurs utilisent déjà différents assistants pour rédiger, résumer ou analyser, mais le manager ne sait pas toujours quels usages sont fiables ni où fixer les limites"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Apprendre à un manager à créer des briefs de meilleure qualité avec l’IA",
    audience: "managers, chefs d’équipe et responsables de projet",
    objective: "transformer une demande floue en brief exploitable avec objectif, contexte, contraintes, livrable et critères de qualité",
    workshop: "partir de trois demandes managériales vagues et utiliser l’IA pour révéler les informations manquantes avant de produire un brief final",
    deliverable: "un modèle de brief réutilisable avec questions de cadrage et critères de réception",
    assessment: "transformer une nouvelle demande imprécise en brief clair sans laisser l’IA inventer les contraintes absentes",
    transfer: "réutiliser le modèle dans les délégations, projets, demandes fournisseurs et productions internes",
    guardrail: "un champ inconnu reste une question à poser ; le modèle ne complète pas silencieusement une contrainte ou une décision que le manager n’a pas formulée",
    example: "une demande comme « prépare-moi une présentation pour demain » déclenche beaucoup d’allers-retours parce que l’objectif, le public, le niveau de détail et le résultat attendu n’ont pas été précisés"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Former les managers à revoir et valider un travail produit avec l’IA",
    audience: "managers responsables de livrables produits ou assistés par IA",
    objective: "évaluer un contenu IA selon des critères explicites plutôt qu’en se fiant à la fluidité ou au ton convaincant de la réponse",
    workshop: "comparer plusieurs livrables IA contenant erreurs factuelles, omissions, formulations génériques et bonnes réponses afin de construire une grille de revue",
    deliverable: "une checklist de validation adaptée aux livrables de l’équipe avec critères factuels, métier, forme, sources et risques",
    assessment: "auditer un nouveau livrable assisté par IA et documenter les corrections nécessaires avant validation",
    transfer: "intégrer la checklist dans les workflows de production et de revue de l’équipe",
    guardrail: "aucun texte bien rédigé n’est considéré comme correct sans vérification des faits, contraintes et sources lorsque celles-ci sont nécessaires",
    example: "un collaborateur gagne du temps grâce à l’IA mais le manager passe ensuite beaucoup de temps à vérifier des livrables dont la qualité varie fortement"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Apprendre à préparer des réunions et comptes rendus avec l’IA",
    audience: "managers, chefs de projet et responsables d’équipe",
    objective: "utiliser l’IA pour préparer l’ordre du jour, structurer les notes et extraire les actions sans transformer une synthèse en décision officielle",
    workshop: "préparer une réunion à partir d’actions ouvertes puis transformer une transcription en décisions, actions, responsables proposés et points à confirmer",
    deliverable: "un modèle réunion avant pendant après avec règles de validation et format de compte rendu",
    assessment: "traiter une nouvelle réunion et distinguer clairement discussion, proposition, décision et action",
    transfer: "standardiser les rituels d’équipe sans supprimer la validation du manager sur les engagements",
    guardrail: "une formulation détectée dans une transcription ne devient une décision ou une échéance officielle qu’après confirmation humaine",
    example: "les réunions produisent beaucoup de notes mais les actions et décisions restent dispersées, puis le manager reconstitue manuellement le suivi après chaque échange"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Former les managers à identifier les tâches automatisables de leur équipe",
    audience: "managers opérationnels et responsables de transformation d’équipe",
    objective: "repérer les tâches répétitives qui méritent une automatisation sans confondre fréquence, irritation et pertinence",
    workshop: "cartographier vingt tâches d’une équipe selon déclencheur, répétition, données, règles, exceptions, risque et besoin de jugement humain",
    deliverable: "un backlog d’automatisation priorisé avec trois candidats à prototyper et les raisons de leur sélection",
    assessment: "analyser un nouveau portefeuille de tâches et écarter celles dont les exceptions ou le risque rendent l’automatisation prématurée",
    transfer: "maintenir le backlog lors des revues de processus et alimenter les équipes techniques avec des besoins mieux cadrés",
    guardrail: "une tâche n’est pas automatisée uniquement parce qu’elle est pénible ; les données, règles, exceptions et conséquences d’erreur doivent être comprises",
    example: "une équipe dit perdre du temps mais mélange dans la même liste des tâches administratives répétitives, des arbitrages complexes et des échanges humains sensibles"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Apprendre à construire des règles d’usage IA dans une équipe",
    audience: "managers qui doivent encadrer les pratiques IA quotidiennes",
    objective: "traduire une politique générale en règles simples et applicables aux tâches réelles de l’équipe",
    workshop: "prendre dix situations d’usage et définir pour chacune données autorisées, outil, vérification, niveau d’autonomie et cas d’escalade",
    deliverable: "une charte opérationnelle d’équipe d’une page avec exemples autorisés, interdits et soumis à validation",
    assessment: "qualifier de nouvelles situations et expliquer la règle applicable sans créer d’interdiction générale inutile",
    transfer: "réviser les règles à partir des usages observés et des nouveaux outils plutôt qu’une fois par an",
    guardrail: "les règles sont suffisamment précises pour guider une action concrète et suffisamment proportionnées pour ne pas pousser les usages dans l’ombre",
    example: "l’entreprise dispose d’une charte IA mais les collaborateurs demandent encore au manager s’ils peuvent utiliser tel outil avec tel document ou pour telle tâche"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Former les managers à détecter les mauvaises automatisations",
    audience: "managers supervisant des workflows, automatisations ou projets IA métier",
    objective: "repérer les signes d’une automatisation fragile avant qu’elle ne devienne une dépendance quotidienne",
    workshop: "auditer plusieurs workflows volontairement mal conçus : permissions excessives, absence de validation, doublons, sortie non structurée, erreur silencieuse ou propriétaire absent",
    deliverable: "une grille d’audit rapide couvrant déclencheur, données, règles, IA, action, exception, logs, droits et propriétaire",
    assessment: "examiner un nouveau workflow et identifier les risques qui doivent être corrigés avant mise en production",
    transfer: "utiliser la grille avant de valider une automatisation construite en interne ou par un prestataire",
    guardrail: "un workflow qui fonctionne en démonstration n’est pas considéré comme prêt tant que ses erreurs, doublons, permissions et procédures de reprise ne sont pas traités",
    example: "une automatisation créée rapidement devient critique pour l’équipe alors que personne ne sait quoi faire si un connecteur expire ou si le scénario traite deux fois la même demande"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Apprendre à transformer un processus d’équipe en workflow IA",
    audience: "managers, responsables opérationnels et chefs de projet non développeurs",
    objective: "décomposer un processus en déclencheurs, données, règles, étape IA, actions et validations avant de choisir l’outil",
    workshop: "dessiner le workflow actuel d’un processus réel puis construire sa version cible avec branches d’exception et contrôle humain",
    deliverable: "un schéma fonctionnel prêt à être discuté avec un intégrateur ou construit en no-code",
    assessment: "modéliser un nouveau processus en distinguant ce qui relève d’une règle exacte et ce qui justifie une interprétation IA",
    transfer: "utiliser ce langage de workflow pour améliorer les briefs remis à la DSI, aux consultants ou aux équipes automation",
    guardrail: "le processus est compris et documenté avant d’ajouter un modèle ou un agent ; l’IA n’est pas utilisée pour masquer des règles métier inexistantes",
    example: "l’équipe veut « automatiser avec l’IA » un processus qui passe aujourd’hui par e-mails, tableur, validation et ressaisie mais personne n’a encore représenté les étapes"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Former les managers à accompagner les collaborateurs réticents à l’IA",
    audience: "managers qui conduisent l’adoption de l’IA dans leurs équipes",
    objective: "traiter les réticences à partir du travail réel, des risques perçus et des compétences plutôt que par une injonction générale à adopter l’IA",
    workshop: "analyser plusieurs objections et construire pour chaque profil une expérimentation faible risque liée à une tâche réelle",
    deliverable: "un plan d’accompagnement avec cas d’usage pilote, temps de pratique, règle de sécurité, soutien et boucle de retour",
    assessment: "concevoir un parcours pour une équipe fictive présentant des niveaux d’usage et des inquiétudes différents",
    transfer: "utiliser les retours des collaborateurs pour ajuster formation, outils et règles plutôt que mesurer uniquement les connexions à la plateforme",
    guardrail: "aucun collaborateur n’est évalué négativement sur une supposée résistance sans distinguer manque de compétence, risque réel, mauvais cas d’usage et absence de temps de pratique",
    example: "certains membres de l’équipe utilisent déjà l’IA quotidiennement tandis que d’autres l’évitent par crainte de l’erreur, de la confidentialité ou d’une dégradation de leur travail"
  },
  {
    family: "direction",
    cluster: "Managers",
    title: "Apprendre à mesurer l’adoption de l’IA dans une équipe",
    audience: "managers, RH, responsables de transformation et sponsors IA",
    objective: "mesurer l’usage utile et la progression des pratiques plutôt que le simple nombre de licences activées",
    workshop: "construire un tableau de bord d’adoption à partir de cas d’usage, fréquence, qualité, corrections, autonomie et besoins de formation",
    deliverable: "une grille d’indicateurs avec définition, source, fréquence de mesure et limites d’interprétation",
    assessment: "choisir les métriques adaptées à une nouvelle population et expliquer ce qu’elles permettent ou non de conclure",
    transfer: "utiliser les indicateurs dans les revues d’équipe pour décider formation, support et nouveaux cas d’usage",
    guardrail: "un volume élevé de prompts ou de connexions n’est jamais assimilé automatiquement à un gain de performance, à une compétence ou à une adoption saine",
    example: "la direction sait combien de licences sont actives mais ne sait pas si les collaborateurs utilisent l’IA sur des tâches pertinentes, s’ils corrigent beaucoup les sorties ou s’ils abandonnent après quelques essais"
  }
];

export const marketDemandExecutionArticlesWave23 = [];
export const marketDemandTrainingArticlesWave23 = managerSpecs.map(buildTrainingArticle);
