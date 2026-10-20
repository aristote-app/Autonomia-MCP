import { personalLinkedInProfileUrl } from "./commercialLeadPolicy.js";
import { isOutsideFranceTarget } from "./franceCommercialScope.js";

// CRM is authoritative for consent, outreach and verification. Never overwrite
// it from historical public research or merge people by guessed names.
export function reconcileHistoricalWithCrm(archive, crmContacts = []) {
  const byLinkedIn = new Map();
  for (const crm of crmContacts) {
    const url=personalLinkedInProfileUrl(crm.linkedin_url);
    if (!url) continue;
    const current=byLinkedIn.get(url);
    if (!current || (crm.verification_status==="verified" && current.verification_status!=="verified")) byLinkedIn.set(url,crm);
  }
  const people=(archive.people || []).map(person=>{
    const crm=person.linkedinUrl ? byLinkedIn.get(person.linkedinUrl) : null;
    const excluded=person.scope!=="a_qualifier" || isOutsideFranceTarget(person.company);
    return {
      ...person,
      reconciliation:crm ? "already_in_crm" : person.linkedinUrl ? "not_in_crm" : "identity_to_verify",
      crmContactId:crm?.id || null,
      crmVerification:crm?.verification_status || null,
      crmOutreach:crm?.outreach_status || null,
      doNotContact:Boolean(crm?.do_not_contact),
      // Historical role/company matches NEVER grant approval for outreach.
      actionable:Boolean(crm && crm.verification_status==="verified" && !crm.do_not_contact && !excluded)
    };
  });
  const matched=people.filter(person=>person.reconciliation==="already_in_crm").length;
  const unlinked=people.filter(person=>person.reconciliation==="not_in_crm").length;
  const unknown=people.filter(person=>person.reconciliation==="identity_to_verify").length;
  const crmUnique=new Set(crmContacts.map(contact=>personalLinkedInProfileUrl(contact.linkedin_url)).filter(Boolean));
  return {
    ...archive,
    people,
    reconciliation:{matched,unlinked,unknown,crmTotal:crmContacts.length,crmUnique:crmUnique.size,crmOnly:[...crmUnique].filter(url=>!people.some(p=>p.linkedinUrl===url)).length}
  };
}
