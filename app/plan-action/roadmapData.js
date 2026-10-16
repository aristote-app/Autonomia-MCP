export const ROADMAP_VERSION = "autonomia-plan-90j-2026-10";
export const ROADMAP_PHASES = [
  {
    id:"socle",name:"Socle & publication",start:"2026-10-15",end:"2026-10-22",
    hint:"Un socle opérationnel et une version effectivement accessible sur o2switch.",
    tasks:[
      {id:"s-01",title:"Structurer les 4 offres AUTONOMIA BUILD",detail:"Automatisation, agent IA, application métier et accompagnement, avec livrables et validation humaine.",owner:"IA",priority:"P0",due:"2026-10-15",done:true,link:"https://build-autonomia.com/solutions-ia"},
      {id:"s-02",title:"Créer le guide « Combien coûte un agent IA ? »",detail:"Guide de cadrage avec simulation de budget explicitement indicative.",owner:"IA",priority:"P1",due:"2026-10-15",done:true,link:"https://build-autonomia.com/cout-agent-ia"},
      {id:"s-03",title:"Créer le hub des démonstrateurs IA",detail:"Urbanisme et conservatoire interactifs fictifs, plus présentation de l'usage marchés publics.",owner:"IA",priority:"P0",due:"2026-10-15",done:true,link:"https://build-autonomia.com/demonstrateurs-ia"},
      {id:"s-04",title:"Relier la Home, BUILD et les nouvelles pages",detail:"Maillage interne et sitemap mis à jour dans le dépôt.",owner:"IA",priority:"P0",due:"2026-10-15",done:true},
      {id:"s-05",title:"Confirmer la mise en production sur o2switch",detail:"Comparer le SHA GitHub au /api/health public, tester les trois pages et le sitemap. Le succès Vercel ne suffit pas.",owner:"IA",priority:"P0",due:"2026-10-17",link:"https://github.com/aristote-app/Autonomia-MCP/issues/70",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/actions/runs/38890007713"},
      {id:"s-06",title:"Valider l'affichage mobile et desktop",detail:"Vérifier notamment le héros, les cartes, les formulaires et les boutons de prise de rendez-vous.",owner:"IA",priority:"P0",due:"2026-10-20"},
      {id:"s-07",title:"Tester les leads du site jusqu'au cockpit",detail:"Soumettre une demande de test et vérifier sa réception, son origine et son traitement.",owner:"IA",priority:"P0",due:"2026-10-22"}
    ]
  },
  {
    id:"offres",name:"Produits & conversion",start:"2026-10-19",end:"2026-10-30",
    hint:"Prouver les usages réels et rendre le parcours de demande fluide.",
    tasks:[
      {id:"o-01",title:"Enrichir le hub avec captures de démonstrations",detail:"Captures fidèles des démos, légendes « données fictives », lecture simple des étapes et bénéfices.",owner:"IA",priority:"P0",due:"2026-10-24"},
      {id:"o-02",title:"Construire une fiche commerciale de l'outil marchés publics",detail:"Fonctions réelles, suivi administratif et financier, rôles du technicien et validations humaines. Aucun logo client fictif.",owner:"IA",priority:"P0",due:"2026-10-28"},
      {id:"o-03",title:"Définir les modalités de vente BUILD",detail:"Cadrage, réalisations sur mesure, maintenance, responsabilités et limites ; chiffrage proposé pour validation.",owner:"IA",priority:"P1",due:"2026-10-27",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-build-offres-chiffrage-proposition.md"},
      {id:"o-04",title:"Valider la grille tarifaire et les conditions commerciales",detail:"Approuver les offres et tarifs avant publication de prix contractuels.",owner:"Direction",priority:"P0",due:"2026-10-30"},
      {id:"o-05",title:"Fiabiliser le parcours Calendly et les formulaires",detail:"Vérifier les CTA /start, Calendly, consentements et absence de friction sur téléphone.",owner:"IA",priority:"P0",due:"2026-10-25"},
      {id:"o-06",title:"Contrôler les deux landing pages BUILD",detail:"Promesses commerciales, deux angles de conversion et mesures d'attribution.",owner:"IA",priority:"P1",due:"2026-10-29"},
      {id:"o-07",title:"Finaliser notre positionnement Numérique360",detail:"Préparer le référencement sous Odexis, réunir deux références publiques vérifiables et présenter les trois outils pilotes comme des démonstrateurs.",owner:"Partagé",priority:"P0",due:"2026-10-30"}
    ]
  },
  {
    id:"seo",name:"SEO, GEO & contenus",start:"2026-10-22",end:"2026-11-15",
    hint:"Attirer les visiteurs qui cherchent déjà une solution IA concrète.",
    tasks:[
      {id:"r-01",title:"Auditer le SEO technique et l'indexation",detail:"Robots, sitemap, canonical, JSON-LD, Core Web Vitals, 404, Search Console et pages réellement indexées.",owner:"IA",priority:"P0",due:"2026-10-28"},
      {id:"r-02",title:"Publier un contenu sur le prix de l'automatisation IA",detail:"Intention achat, facteurs de coût, simulation distinguée d'une offre commerciale.",owner:"IA",priority:"P1",due:"2026-11-02",done:true,link:"https://build-autonomia.com/cout-automatisation-ia"},
      {id:"r-03",title:"Publier un comparatif agent IA / workflow / application",detail:"Aider le décideur à choisir la bonne architecture selon son besoin.",owner:"IA",priority:"P1",due:"2026-11-05",done:true,link:"https://build-autonomia.com/agent-ia-ou-automatisation"},
      {id:"r-04",title:"Publier le guide d'une application métier IA sur mesure",detail:"Étapes, livrables, sécurité, intégrations et évaluation d'un projet.",owner:"IA",priority:"P1",due:"2026-11-09",done:true,link:"https://build-autonomia.com/application-metier-ia"},
      {id:"r-05",title:"Publier un cas d'usage sur les marchés publics",detail:"Traitement administratif et financier, limites métier, rôle de validation et intégrations possibles.",owner:"IA",priority:"P1",due:"2026-11-13",done:true,link:"https://build-autonomia.com/suivi-marches-publics-ia"},
      {id:"r-06",title:"Construire un maillage commercial entre pages et démonstrateurs",detail:"Relier contenus, offres BUILD, ressources et CTA sans dupliquer les pages existantes.",owner:"IA",priority:"P1",due:"2026-11-15",done:true,link:"https://build-autonomia.com/solutions-ia"}
    ]
  },
  {
    id:"autorite",name:"Presse, LinkedIn & autorité",start:"2026-10-23",end:"2026-11-25",
    hint:"Des prises de parole utiles, non promotionnelles, adaptées à chaque média.",
    tasks:[
      {id:"m-01",title:"Préparer deux tribunes originales et sourcées",detail:"IA opérationnelle en entreprise ; IA dans les collectivités avec contrôle des agents.",owner:"IA",priority:"P0",due:"2026-10-26",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-growth-kit-2026-10.md"},
      {id:"m-02",title:"Préparer les messages média personnalisés",detail:"JDN, Acteurs publics, Siècle Digital et Maddyness ; vérifier modalités et contacts au moment d'envoyer.",owner:"IA",priority:"P1",due:"2026-10-28",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-growth-kit-2026-10.md"},
      {id:"m-03",title:"Connecter le Gmail choisi pour la prospection",detail:"Autoriser la connexion du bon compte Google ; ne pas envoyer depuis une autre adresse.",owner:"Direction",priority:"P0",due:"2026-10-28"},
      {id:"m-04",title:"Envoyer les propositions éditoriales approuvées",detail:"Envois nominatifs avec le compte autorisé, sans spam ni achat automatique de tribune.",owner:"Partagé",priority:"P1",due:"2026-11-03"},
      {id:"m-05",title:"Préparer quatre éditions des Machines IA",detail:"Une machine, un cas métier et un kit pratique par édition ; conserver la ligne éditoriale.",owner:"IA",priority:"P1",due:"2026-11-09",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-les-machines-ia-editions-02-05.md"},
      {id:"m-06",title:"Relancer les rédactions contactées",detail:"Relances ciblées et raisonnables selon les règles de chaque rédaction.",owner:"Partagé",priority:"P2",due:"2026-11-20"}
    ]
  },
  {
    id:"prospection",name:"Prospection B2B directe",start:"2026-10-29",end:"2026-12-15",
    hint:"Viser des clients finaux, détecter un besoin précis et proposer un échange.",
    tasks:[
      {id:"p-01",title:"Construire une liste de 50 comptes finaux qualifiés",detail:"PME, ETI, grandes entreprises et collectivités ; besoins métier documentés, provenance vérifiable.",owner:"IA",priority:"P0",due:"2026-11-09"},
      {id:"p-02",title:"Identifier les décideurs et leurs coordonnées vérifiées",detail:"Direction métiers, DSI, transformation, RH selon l'offre. Respecter les données professionnelles.",owner:"IA",priority:"P1",due:"2026-11-15"},
      {id:"p-03",title:"Préparer 3 séquences de prospection personnalisées",detail:"BUILD, EXPERTS et collectivités, avec un lien Calendly et un problème métier concret.",owner:"IA",priority:"P1",due:"2026-11-17",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-growth-kit-2026-10.md"},
      {id:"p-04",title:"Mettre en place le suivi des réponses au cockpit",detail:"Prospect, besoin, contact, prochaine action, devis et statut commercial.",owner:"IA",priority:"P1",due:"2026-11-25"},
      {id:"p-05",title:"Lancer les prises de contact validées",detail:"Contacts professionnels sourcés et envois via un canal autorisé ; mesurer les réponses réelles.",owner:"Partagé",priority:"P1",due:"2026-12-01"}
    ]
  },
  {
    id:"ads",name:"Google Ads & mesure",start:"2026-11-03",end:"2026-12-15",
    hint:"N'investir qu'une fois le suivi des demandes et la conversion opérationnels.",
    tasks:[
      {id:"a-01",title:"Préparer les groupes d'annonces BUILD",detail:"Mots-clés transactionnels, négatifs, annonces et deux angles à tester.",owner:"IA",priority:"P1",due:"2026-11-12",done:true,link:"https://github.com/aristote-app/Autonomia-MCP/blob/main/docs/autonomia-growth-kit-2026-10.md"},
      {id:"a-02",title:"Installer et vérifier la mesure de conversion",detail:"Formulaire soumis, rendez-vous obtenu, campagnes UTM ; contrôle du consentement.",owner:"IA",priority:"P0",due:"2026-11-19"},
      {id:"a-03",title:"Valider le budget de lancement Google Ads",detail:"Arbitrer dans l'enveloppe envisagée de 500 à 1 000 € par mois avant toute dépense.",owner:"Direction",priority:"P0",due:"2026-11-20"},
      {id:"a-04",title:"Activer les campagnes approuvées",detail:"Activation après validation des pages, du tracking et du budget.",owner:"Partagé",priority:"P1",due:"2026-11-27"},
      {id:"a-05",title:"Créer le tableau de bord conversion et ventes",detail:"Sessions qualifiées, leads, RDV, devis, contrats, coût par lead et marge.",owner:"IA",priority:"P1",due:"2026-12-02"},
      {id:"a-06",title:"Optimiser les pages selon les résultats observés",detail:"Prioriser la qualité des leads et les ventes plutôt que le seul trafic.",owner:"IA",priority:"P1",due:"2026-12-15"}
    ]
  },
  {
    id:"pilotage",name:"Pilotage & itérations",start:"2026-12-01",end:"2027-01-13",
    hint:"Décider sur les données et construire une activité rentable.",
    tasks:[
      {id:"t-01",title:"Faire une revue des leads et rendez-vous",detail:"Sources, besoins récurrents, obstacles, temps de traitement et suites commerciales.",owner:"Partagé",priority:"P1",due:"2026-12-15"},
      {id:"t-02",title:"Comparer les offres selon la marge et la conversion",detail:"Nombre de devis, taux de signature et rentabilité observée par pilier.",owner:"Partagé",priority:"P1",due:"2027-01-06"},
      {id:"t-03",title:"Définir le plan commercial du trimestre suivant",detail:"Réallouer les efforts aux canaux et prestations qui génèrent des opportunités vérifiées.",owner:"Direction",priority:"P1",due:"2027-01-13"}
    ]
  }
];
