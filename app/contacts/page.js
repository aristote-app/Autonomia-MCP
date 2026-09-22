import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { listWorkspaceSalesContacts } from "../../lib/db/salesContacts.js";
import {
  updateContactPipelineStage,
  optOutContact
} from "../actions/contact-pipeline.js";

export const dynamic = "force-dynamic";

const FILTERS = [
  ["all", "Tous"],
  ["candidate", "Candidats"],
  ["verified", "Vérifiés"],
  ["active", "Prospection"],
  ["replied", "Réponses"],
  ["meeting", "RDV"],
  ["proposal", "Propositions"],
  ["won", "Gagnés"],
  ["lost", "Perdus"]
];

function filterContacts(items, filter) {
  if (filter === "candidate") {
    return items.filter((item) => item.verification_status === "candidate");
  }
  if (filter === "verified") {
    return items.filter(
      (item) =>
        item.verification_status === "verified" &&
        item.outreach_status === "not_started"
    );
  }
  if (filter === "active") {
    return items.filter((item) => ["queued", "active"].includes(item.outreach_status));
  }
  if (["replied","meeting","proposal","won","lost"].includes(filter)) {
    return items.filter((item) => item.outreach_status === filter);
  }
  return items;
}

function count(items, filter) {
  return filterContacts(items, filter).length;
}

function date(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function ContactsPage({ searchParams }) {
  const params = await searchParams;
  const active = FILTERS.some(([key]) => key === params?.filter)
    ? params.filter
    : "all";

  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));

  const hasSession = Boolean(context?.claims?.sub && context?.membership?.workspace_id);
  const canWrite = hasSession && context.membership.role !== "viewer";

  if (!hasSession) {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <header className="integrationHero">
          <p className="eyebrow">AUTONOMIA · COMMERCIAL MEMORY</p>
          <h1>Contacts</h1>
          <p className="lede">
            Cette zone contient des données de prospection et reste fermée tant que
            l'authentification du cockpit n'est pas activée.
          </p>
        </header>
        <div className="lockedContactState">
          <strong>Zone sécurisée prête</strong>
          <span>Aucune donnée personnelle n'est exposée sans session de workspace.</span>
        </div>
      </main>
    );
  }

  const contacts = await listWorkspaceSalesContacts({
    workspaceId: context.membership.workspace_id,
    limit: 500
  }).catch(() => []);

  const visible = filterContacts(contacts, active);

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · COMMERCIAL MEMORY</p>
        <h1>Pipeline contacts</h1>
        <p className="lede">
          De la personne candidate au rendez-vous, à la proposition et au résultat commercial.
        </p>
      </header>

      <nav className="contactPipelineFilters">
        {FILTERS.map(([key, label]) => (
          <Link
            key={key}
            className={active === key ? "active" : ""}
            href={`/contacts?filter=${key}`}
          >
            <strong>{count(contacts, key)}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="contactPipelineList">
        {visible.length ? visible.map((contact) => (
          <article key={contact.id}>
            <div className="contactPipelineIdentity">
              <p className="buyer">{contact.account_name}</p>
              <h3>{contact.full_name || contact.role_title || "Contact LinkedIn"}</h3>
              <p>{contact.matched_role || contact.role_title || "Fonction à qualifier"}</p>
            </div>

            <div className="contactPipelineState">
              <span className={"contactStatus " + contact.verification_status}>
                {contact.verification_status}
              </span>
              <span>{contact.outreach_status}</span>
              <span>Kaspr : {contact.enrichment_status}</span>
            </div>

            <div className="contactPipelineProof">
              {contact.trigger_title && <strong>{contact.trigger_title}</strong>}
              <span>Score contact : {contact.relevance_score ?? "—"}/100</span>
              <span>Dernière MAJ : {date(contact.updated_at)}</span>
            </div>

            <div className="contactPipelineAction">
              <Link href={`/accounts/${contact.account_key}`}>Compte 360° →</Link>
              <a href={contact.linkedin_url} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              {contact.next_action_at && (
                <span>Action : {date(contact.next_action_at)}</span>
              )}

              {canWrite &&
                contact.verification_status === "verified" &&
                !contact.do_not_contact && (
                  <form action={updateContactPipelineStage} className="contactStageForm">
                    <input type="hidden" name="contact_id" value={contact.id} />
                    <select name="status" defaultValue={contact.outreach_status}>
                      <option value="active">Prospection</option>
                      <option value="replied">Réponse reçue</option>
                      <option value="meeting">RDV obtenu</option>
                      <option value="proposal">Proposition envoyée</option>
                      <option value="won">Gagné</option>
                      <option value="lost">Perdu</option>
                      <option value="stopped">Arrêter</option>
                    </select>
                    <button type="submit">Mettre à jour</button>
                  </form>
                )}

              {canWrite &&
                contact.verification_status === "verified" &&
                !contact.do_not_contact && (
                  <form action={optOutContact} className="contactOptOutForm">
                    <input type="hidden" name="contact_id" value={contact.id} />
                    <button type="submit">Ne plus contacter</button>
                  </form>
                )}

              {contact.do_not_contact && <span>Ne plus contacter</span>}
            </div>
          </article>
        )) : (
          <div className="emptyState">Aucun contact dans cette étape.</div>
        )}
      </div>
    </main>
  );
}
