function first(values = []) {
  return values.find(Boolean) || null;
}

function track(account = {}) {
  const offer = String(account.recommended_offer || first(account.offers) || "").toLowerCase();
  if (/formation|adoption/.test(offer)) return "training";
  if (/staffing|freelance/.test(offer)) return "staffing";
  if (/marché public|ao|appel/.test(offer)) return "public";
  return "delivery";
}

const PLAYBOOKS = Object.freeze({
  training: {
    objective: "Qualifier le besoin de montée en compétences et le dispositif de déploiement.",
    questions: [
      "Quel public doit monter en compétence et sur quels usages IA concrets ?",
      "Quel niveau de départ et quel niveau attendu après la formation ?",
      "Quels outils sont déjà déployés : ChatGPT, Copilot, Gemini ou solutions internes ?",
      "Quelle contrainte de format : présentiel, distanciel, cohortes, multi-sites ?",
      "Comment sera mesurée l'adoption après la formation ?"
    ],
    objections: [
      ["Nous avons déjà un catalogue", "Positionner Autonomia sur l'adaptation aux cas d'usage réels et l'accompagnement de l'adoption."],
      ["Les équipes n'ont pas le temps", "Proposer un format court, ciblé et orienté tâches métier plutôt qu'un parcours générique."],
      ["Nous devons sécuriser les usages", "Intégrer gouvernance, confidentialité et règles d'usage au dispositif pédagogique."]
    ]
  },
  staffing: {
    objective: "Qualifier la mission, le contexte de delivery et les critères réellement bloquants.",
    questions: [
      "Quel résultat doit être livré par le consultant dans les 30 à 60 premiers jours ?",
      "Quelles compétences sont réellement indispensables versus simplement souhaitées ?",
      "Quel est le niveau d'autonomie attendu et à qui la mission reporte-t-elle ?",
      "Quelle date de démarrage, durée, localisation et politique de télétravail ?",
      "Le budget ou TJM cible est-il déjà cadré ?"
    ],
    objections: [
      ["Nous passons déjà par un panel", "Clarifier si Autonomia peut intervenir en sous-traitance, co-traitance ou sur un profil difficile à couvrir."],
      ["Nous cherchons un profil très rare", "Recentrer la recherche sur les résultats attendus et les compétences réellement non négociables."],
      ["Le budget est serré", "Arbitrer séniorité, périmètre, rythme d'intervention ou composition de l'équipe."]
    ]
  },
  public: {
    objective: "Comprendre la procédure, les critères et les preuves nécessaires sans extrapoler au-delà du dossier.",
    questions: [
      "Quelles exigences du dossier sont éliminatoires ?",
      "Quels critères de notation sont explicitement pondérés ?",
      "Quelles références ou capacités doivent être prouvées ?",
      "Quels livrables et jalons sont contractuellement attendus ?",
      "Existe-t-il des contraintes de sous-traitance, groupement ou sécurité ?"
    ],
    objections: [
      ["Le dossier est lourd", "Découper la réponse par exigences obligatoires, preuves et critères de notation."],
      ["Nous manquons d'une référence", "Identifier si un partenaire ou sous-traitant peut légalement couvrir l'exigence."],
      ["Le délai est court", "Prioriser les éléments éliminatoires avant tout travail de forme."]
    ]
  },
  delivery: {
    objective: "Qualifier le processus à transformer, les données disponibles et le résultat opérationnel attendu.",
    questions: [
      "Quel processus métier consomme aujourd'hui le plus de temps ou crée le plus de friction ?",
      "Quelles données et quels systèmes alimentent déjà ce processus ?",
      "Quel résultat concret doit être obtenu : délai, qualité, capacité ou coût ?",
      "Quelles validations humaines doivent absolument rester dans la boucle ?",
      "Quel périmètre permettrait de tester rapidement sans créer de dette technique ?"
    ],
    objections: [
      ["Nous voulons d'abord tester l'IA", "Cadrer un test sur un processus réel avec un résultat mesurable plutôt qu'une démonstration générique."],
      ["Nos données ne sont pas prêtes", "Commencer par cartographier les sources et choisir un cas d'usage qui fonctionne avec les données disponibles."],
      ["Nous craignons la sécurité", "Définir précisément les données autorisées, les accès, la journalisation et les validations humaines."]
    ]
  }
});

export function buildAccountBattlecard(account = {}) {
  const kind = track(account);
  const playbook = PLAYBOOKS[kind];
  const evidence = (account.timeline || []).slice(0, 5).map((event) => ({
    title: event.title,
    date: event.date || null,
    source_id: event.source_id || null,
    source_url: event.source_url || null,
    kind: event.kind || null
  }));

  return {
    kind,
    objective: playbook.objective,
    opener: account.playbook?.trigger
      ? `Partir du signal vérifiable : « ${account.playbook.trigger} » et confirmer qu'il correspond bien à une priorité actuelle.`
      : "Commencer par confirmer le contexte avant de présenter une solution.",
    target_role:
      account.primary_decision_role?.label ||
      account.playbook?.target_role ||
      "Direction métier / digitale",
    offer: account.recommended_offer || first(account.offers) || "Qualification IA",
    questions: playbook.questions,
    objections: playbook.objections.map(([objection, response]) => ({ objection, response })),
    evidence,
    guardrails: [
      "Ne présenter comme fait que ce qui est relié à une source.",
      "Ne pas inventer budget, calendrier, sponsor ou maturité.",
      "Utiliser les questions pour qualifier les inconnues plutôt que les supposer."
    ]
  };
}
