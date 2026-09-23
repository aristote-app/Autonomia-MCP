export const editorialSeparations = [
  {
    slugs: [
      "creer-un-assistant-rh-connecte-aux-procedures-internes",
      "creer-un-assistant-connecte-aux-procedures-logistiques-internes"
    ],
    rationale:
      "Même pattern technique, mais intentions métier distinctes : politiques et procédures RH d’un côté ; opérations et procédures logistiques de l’autre. Les exemples, données, permissions, risques et CTA doivent rester propres à chaque fonction."
  },
  {
    slugs: [
      "apprendre-a-cartographier-un-processus-avant-de-l-automatiser",
      "apprendre-a-cartographier-un-processus-avant-de-creer-un-agent"
    ],
    rationale:
      "Le premier sujet enseigne la cartographie avant automatisation déterministe/no-code ; le second apprend à décider si davantage d’autonomie agentique est réellement justifiée, avec outils, permissions et supervision."
  }
];

export function isIntentionalSeparation(leftSlug, rightSlug) {
  return editorialSeparations.some(({ slugs }) =>
    slugs.includes(leftSlug) && slugs.includes(rightSlug)
  );
}
