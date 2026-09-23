import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { listInboundLeads } from "../../lib/db/inboundLeads.js";
import { updateInboundLeadStatus } from "../actions/inbound-leads.js";

export const dynamic = "force-dynamic";

const FILTERS = [
  ["all", "Tous"],
  ["new", "Nouveaux"],
  ["qualified", "Qualifiés"],
  ["contacted", "Contactés"],
  ["meeting", "RDV"],
  ["proposal", "Propositions"],
  ["won", "Gagnés"],
  ["lost", "Perdus"],
  ["disqualified", "Disqualifiés"]
];

const STATUSES = [
  ["new", "Nouveau"],
  ["enriched", "Enrichi"],
  ["qualified", "Qualifié"],
  ["needs_review", "À vérifier"],
  ["contacted", "Contacté"],
  ["meeting", "RDV"],
  ["proposal", "Proposition"],
  ["negotiation", "Négociation"],
  ["won", "Gagné"],
  ["lost", "Perdu"],
  ["disqualified", "Disqualifié"]
];

function filtered(items, filter) {
  return filter === "all" ? items : items.filter((item) => item.status === filter);
}

function count(items, filter) {
  return filtered(items, filter).length;
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: process.env.AUTONOMIA_TIMEZONE || "Europe/Paris"
  }).format(new Date(value));
}

export default async function InboundPage({ searchParams }) {
  const params = await searchParams;
  const active = FILTERS.some(([key]) => key === params?.filter) ? params.filter : "all";

  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));

  const hasSession = Boolean(context?.claims?.sub && context?.membership?.workspace_id);
  const canWrite = hasSession && context.membership.role !== "viewer";

  const leads = hasSession
    ? await listInboundLeads({
        workspaceId: context.membership.workspace_id,
        limit: 500
      }).catch(() => [])
    : [];

  const visible = filtered(leads, active);

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · INBOUND</p>
        <h1>Leads entrants.</h1>
        <p className="lede">
          Attribution conservée, déduplication, besoin probable et prochaine action dans la même vue.
        </p>
      </header>

      <nav className="inboundFilters">
        {FILTERS.map(([key, label]) => (
          <Link
            key={key}
            className={active === key ? "active" : ""}
            href={`/inbound?filter=${key}`}
          >
            <strong>{count(leads, key)}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="inboundList">
        {visible.length ? visible.map((lead) => (
          <article key={lead.id}>
            <div className="inboundIdentity">
              <p className="buyer">{lead.company_name}</p>
              <h3>{[lead.first_name, lead.last_name].filter(Boolean).join(" ")}</h3>
              <div className="inboundChannels">
                <a href={"mailto:" + lead.email}>{lead.email}</a>
                {lead.phone && <a href={"tel:" + lead.phone}>{lead.phone}</a>}
              </div>
            </div>

            <div className="inboundNeed">
              <span className="attentionBucket">
                {lead.scan_context?.classification || "besoin à qualifier"}
              </span>
              <strong>{lead.requested_service}</strong>
              {lead.message && <p>{lead.message}</p>}

              {lead.scan_context?.solution_context && (
                <div className="inboundSolutionContext">
                  <span>
                    AI MATCH · {(lead.scan_context.solution_context.route || "orientation").toUpperCase()}
                  </span>

                  {lead.scan_context.solution_context.summary && (
                    <p>{lead.scan_context.solution_context.summary}</p>
                  )}

                  {(lead.scan_context.solution_context.recommended_roles || []).length > 0 && (
                    <div>
                      <small>MÉTIERS RECOMMANDÉS</small>
                      <div className="inboundSolutionTags">
                        {lead.scan_context.solution_context.recommended_roles.map((role, index) => {
                          const label = role.label || role.id || role.slug;
                          const key = (role.slug || role.id || role.label || "role") + index;
                          return role.slug ? (
                            <a
                              key={key}
                              href={"https://build-autonomia.com/metiers-ia/" + role.slug}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {label} ↗
                            </a>
                          ) : <b key={key}>{label}</b>;
                        })}
                      </div>
                    </div>
                  )}

                  {(lead.scan_context.solution_context.recommended_training || []).length > 0 && (
                    <div>
                      <small>FORMATIONS RECOMMANDÉES</small>
                      <div className="inboundSolutionTags">
                        {lead.scan_context.solution_context.recommended_training.map((training, index) => {
                          const label = training.title || training.id || training.slug;
                          const key = (training.slug || training.id || training.title || "training") + index;
                          return training.slug ? (
                            <a
                              key={key}
                              href={"https://build-autonomia.com/formation-ia/" + training.slug}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {label} ↗
                            </a>
                          ) : <b key={key}>{label}</b>;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="inboundAttribution">
              <span>{lead.source_channel} · {lead.source_platform}</span>
              <strong>
                {lead.latest_touch?.utm_campaign ||
                  lead.latest_touch?.landing_page_topic ||
                  "Attribution organique / directe"}
              </strong>
              <small>Reçu : {formatDate(lead.last_received_at)}</small>
              <small>
                Consentement marketing : {lead.marketing_consent ? "oui" : "non"}
              </small>
            </div>

            <div className="inboundAction">
              <span>PROCHAINE ACTION</span>
              <strong>{lead.scan_context?.next_action || "Qualifier le besoin."}</strong>

              {canWrite && (
                <form action={updateInboundLeadStatus}>
                  <input type="hidden" name="lead_id" value={lead.id} />
                  <select name="status" defaultValue={lead.status}>
                    {STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button type="submit">Mettre à jour</button>
                </form>
              )}
            </div>
          </article>
        )) : (
          <div className="emptyState">Aucun lead dans cette étape.</div>
        )}
      </div>
    </main>
  );
}
