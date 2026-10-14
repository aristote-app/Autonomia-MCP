import DecisionMaker from "./DecisionMaker.js";
import { getReviewedOpportunityDecisionMaker } from "../intelligence/reviewedDecisionMakers.js";

export default function AccountContacts({ account }) {
  const contacts = new Map();
  for (const event of account.timeline || []) {
    const company = event.company_name || account.name;
    const contact = getReviewedOpportunityDecisionMaker(company, event.id);
    if (!contact) continue;
    // Keep platform contacts scoped to their actual employer and exact source ad.
    const key = [contact.linkedin || contact.name, contact.resolvedCompany || company, contact.phone || ""].join("|");
    if (!contacts.has(key)) contacts.set(key, { company, opportunityId: event.id });
  }
  return (
    <div className="accountContacts">
      {contacts.size ? [...contacts.entries()].map(([key, props]) => (
        <DecisionMaker key={key} {...props} compact />
      )) : <DecisionMaker company={account.name} compact />}
    </div>
  );
}
