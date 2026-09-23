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
  ["due", "Relances dues"],
  ["active", "Prospection"],
  ["replied", "Réponses"],
  ["meeting", "RDV"],
  ["proposal", "Propositions"],
  ["won", "Gagnés"],
  ["lost", "Perdus"]
];

const VIEWS = [
  ["list", "Liste"],
  ["kanban", "Kanban"],
  ["calendar", "Calendrier"]
];

const KANBAN_STAGES = [
  ["candidate", "Candidats"],
  ["verified", "Vérifiés"],
  ["active", "Prospection"],
  ["replied", "Réponses"],
  ["meeting", "RDV"],
  ["proposal", "Propositions"]
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
  if (filter === "due") {
    const now = Date.now();
    return items.filter((item) => {
      if (!item.next_action_at || item.do_not_contact) return false;
      if (["won","lost","stopped"].includes(item.outreach_status)) return false;
      const ts = new Date(item.next_action_at).getTime();
      return Number.isFinite(ts) && ts <= now;
    });
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

function dateLong(value) {
  if (!value) return "Sans date";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function datetimeLocal(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: process.env.AUTONOMIA_TIMEZONE || "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return formatter.format(parsed).replace(" ", "T");
}

function stageOf(contact) {
  if (contact.verification_status === "candidate") return "candidate";
  if (
    contact.verification_status === "verified" &&
    contact.outreach_status === "not_started"
  ) return "verified";
  if (["queued", "active"].includes(contact.outreach_status)) return "active";
  if (["replied", "meeting", "proposal"].includes(contact.outreach_status)) {
    return contact.outreach_status;
  }
  return null;
}

function CalendarView({ contacts }) {
  const actionable = contacts
    .filter((contact) => {
      if (!contact.next_action_at || contact.do_not_contact) return false;
      return !["won","lost","stopped"].includes(contact.outreach_status);
    })
    .sort((a, b) => new Date(a.next_action_at) - new Date(b.next_action_at));

  const groups = new Map();
  for (const contact of actionable) {
    const key = String(contact.next_action_at).slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(contact);
  }

  if (!actionable.length) {
    return <div className="emptyState">Aucune prochaine action planifiée.</div>;
  }

  return (
    <div className="contactCalendar">
      {[...groups.entries()].map(([day, dayContacts]) => (
        <section key={day}>
          <div className="contactCalendarDay">
            <strong>{dateLong(day)}</strong>
            <span>{dayContacts.length} action{dayContacts.length > 1 ? "s" : ""}</span>
          </div>
          <div className="contactCalendarCards">
            {dayContacts.map((contact) => (
              <article key={contact.id}>
                <p className="buyer">{contact.account_name}</p>
                <strong>{contact.full_name || contact.role_title || "Contact LinkedIn"}</strong>
                <span>{contact.matched_role || contact.role_title || "Fonction à qualifier"}</span>
                {contact.trigger_title && <small>{contact.trigger_title}</small>}
                <Link href={`/accounts/${contact.account_key}`}>Compte 360° →</Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function KanbanView({ contacts }) {
  return (
    <div className="contactKanban">
      {KANBAN_STAGES.map(([stage, label]) => {
        const stageItems = contacts.filter((contact) => stageOf(contact) === stage);
        return (
          <section key={stage}>
            <header>
              <strong>{label}</strong>
              <span>{stageItems.length}</span>
            </header>
            <div>
              {stageItems.length ? stageItems.map((contact) => (
                <article key={contact.id}>
                  <p className="buyer">{contact.account_name}</p>
                  <strong>{contact.full_name || contact.role_title || "Contact LinkedIn"}</strong>
                  <span>{contact.matched_role || contact.role_title || "Fonction à qualifier"}</span>
                  {contact.next_action_at && (
                    <small className={new Date(contact.next_action_at).getTime() <= Date.now() ? "contactDue" : ""}>
                      Action : {date(contact.next_action_at)}
                    </small>
                  )}
                  <Link href={`/accounts/${contact.account_key}`}>Ouvrir →</Link>
                </article>
              )) : (
                <div className="contactKanbanEmpty">—</div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default async function ContactsPage({ searchParams }) {
  const params = await searchParams;
  const active = FILTERS.some(([key]) => key === params?.filter)
    ? params.filter
    : "all";
  const activeView = VIEWS.some(([key]) => key === params?.view)
    ? params.view
    : "list";

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

      <nav className="contactViewSwitch" aria-label="Vue du pipeline">
        {VIEWS.map(([key, label]) => (
          <Link
            key={key}
            className={activeView === key ? "active" : ""}
            href={`/contacts?filter=${active}&view=${key}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <nav className="contactPipelineFilters">
        {FILTERS.map(([key, label]) => (
          <Link
            key={key}
            className={active === key ? "active" : ""}
            href={`/contacts?filter=${key}&view=${activeView}`}
          >
            <strong>{count(contacts, key)}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {activeView === "kanban" ? (
        <KanbanView contacts={visible} />
      ) : activeView === "calendar" ? (
        <CalendarView contacts={visible} />
      ) : (
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
                  <span className={new Date(contact.next_action_at).getTime() <= Date.now() ? "contactDue" : ""}>
                    Action : {date(contact.next_action_at)}
                  </span>
                )}

                {canWrite &&
                  contact.verification_status === "verified" &&
                  !contact.do_not_contact && (
                    <form action={updateContactPipelineStage} className="contactStageForm">
                      <input type="hidden" name="contact_id" value={contact.id} />
                      <label>
                        <span>Étape</span>
                        <select name="status" defaultValue={contact.outreach_status}>
                          <option value="active">Prospection</option>
                          <option value="replied">Réponse reçue</option>
                          <option value="meeting">RDV obtenu</option>
                          <option value="proposal">Proposition envoyée</option>
                          <option value="won">Gagné</option>
                          <option value="lost">Perdu</option>
                          <option value="stopped">Arrêter</option>
                        </select>
                      </label>
                      <label>
                        <span>Prochaine action</span>
                        <input
                          type="datetime-local"
                          name="next_action_at"
                          defaultValue={datetimeLocal(contact.next_action_at)}
                        />
                      </label>
                      <label className="contactStageNote">
                        <span>Note</span>
                        <input
                          name="note"
                          placeholder="Ex. relancer après validation budget"
                          maxLength={1000}
                        />
                      </label>
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
      )}
    </main>
  );
}
