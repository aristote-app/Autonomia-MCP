import DecisionMaker from "./DecisionMaker.js";
import { getReviewedDecisionMaker, getReviewedOpportunityDecisionMaker } from "../intelligence/reviewedDecisionMakers.js";
import { getSnapshotCandidate } from "../intelligence/decisionMakerSnapshot.js";
import { personalLinkedInProfileUrl } from "../intelligence/commercialLeadPolicy.js";

// Show source-backed contacts ahead of algorithmic candidates. Neither a search
// result nor a role match alone proves purchasing authority for the current need.
export default function AccountContacts({ account, decisionSnapshot = null }) {
  const contacts = new Map();
  for (const event of account.timeline || []) {
    const company = event.company_name || account.name;
    const contact = getReviewedOpportunityDecisionMaker(company, event.id);
    if (!contact) continue;
    const key = [contact.linkedin || contact.name, contact.resolvedCompany || company, contact.phone || ""].join("|");
    if (!contacts.has(key)) contacts.set(key, { company, opportunityId: event.id });
  }
  if (contacts.size) {
    return <div className="accountContacts">{[...contacts.entries()].map(([key, props]) => (
      <DecisionMaker key={key} {...props} compact />
    ))}</div>;
  }

  const reviewed = getReviewedDecisionMaker(account.name);
  if (reviewed) return <div className="accountContacts"><DecisionMaker company={account.name} compact /></div>;

  const candidate = getSnapshotCandidate(decisionSnapshot, account.name, { minScore: 85 });
  const linkedIn = personalLinkedInProfileUrl(candidate?.linkedin_url);
  if (linkedIn && Number(candidate?.relevance_score || 0) >= 85) {
    return <div className="accountContacts">
      <div><strong>{candidate.name_guess}</strong><p>{candidate.matched_role || "Fonction à confirmer"}</p>
      <small>Profil candidat issu d'une recherche publique · entreprise, poste actuel et pouvoir de décision à confirmer</small></div>
      <a href={linkedIn} target="_blank" rel="noopener noreferrer">Voir le profil LinkedIn ↗</a>
    </div>;
  }

  return <div className="accountContacts"><DecisionMaker company={account.name} compact /></div>;
}
