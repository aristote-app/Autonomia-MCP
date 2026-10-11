import { getReviewedDecisionMaker, getReviewedOpportunityDecisionMaker } from "../intelligence/reviewedDecisionMakers.js";
import { cache } from "react";
import { decisionCompanyKey, getSnapshotCandidate, readDecisionMakerSnapshot } from "../intelligence/decisionMakerSnapshot.js";

const readSnapshot = cache(readDecisionMakerSnapshot);

export default async function DecisionMaker({ company, opportunityId }) {
  let contact = getReviewedOpportunityDecisionMaker(company, opportunityId) || getReviewedDecisionMaker(company);
  if (!contact) {
    const snapshot = await readSnapshot();
    const candidate = getSnapshotCandidate(snapshot, company);
    if (candidate) contact = {
      name: candidate.name_guess,
      role: candidate.headline || candidate.matched_role,
      status: "Décideur potentiel · entreprise et poste à vérifier",
      linkedin: candidate.linkedin_url,
      source: candidate.linkedin_url,
      reason: candidate.snippet || "Profil trouvé dans l’index public. Son pouvoir de décision sur cette opportunité reste à confirmer.",
      reviewedAt: snapshot.accounts[decisionCompanyKey(company)].checkedAt.slice(0, 10),
      automatic: true
    };
  }
  return (
    <section className="decisionContact" aria-label={`Décideur pour ${company || "cette opportunité"}`}>
      <span className="decisionContactLabel">DÉCIDEUR / CONTACT À APPROCHER</span>
      {contact ? (
        <>
          {contact.resolvedCompany && <p>Entreprise identifiée : {contact.resolvedCompany}</p>}
          <strong>{contact.name}</strong>
          <p>{contact.role}</p>
          <span className="decisionContactStatus">{contact.status}</span>
          <p className="decisionContactReason">{contact.reason}</p>
          <div className="decisionContactLinks">
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">Voir le profil LinkedIn ↗</a>
            <a href={contact.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
            {contact.additionalSource && <a href={contact.additionalSource} target="_blank" rel="noopener noreferrer">Source complémentaire ↗</a>}
          </div>
          <small>{contact.automatic ? "Recherche automatique du " : "Sources consultées le "}{contact.reviewedAt.split("-").reverse().join("/")}</small>
        </>
      ) : (
        <>
          <strong>Décideur non identifié</strong>
          <p>Aucun profil personnel suffisamment étayé pour cette entreprise. Nom, fonction et lien LinkedIn restent à vérifier.</p>
        </>
      )}
    </section>
  );
}
