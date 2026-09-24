import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  claimUnassignedPublicInboundLeads,
  listInboundLeads
} from "../../lib/db/inboundLeads.js";
import {
  drainInboundSpool,
  listQueuedInboundLeads
} from "../../lib/inbound/spool.js";
import { updateInboundLeadFollowUpAction } from "../actions/inbound-leads.js";

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

const PRIORITIES = [
  ["low", "Basse"],
  ["normal", "Normale"],
  ["high", "Haute"],
  ["urgent", "Urgente"]
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

function dateInputValue(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value).slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function sourceTitle(lead) {
  return (
    lead.latest_touch?.landing_page_topic ||
    lead.latest_touch?.form_id ||
    lead.latest_touch?.landing_page_url ||
    "Source non renseignée"
  );
}

function statusLabel(status) {
  return STATUSES.find(([value]) => value === status)?.[1] || status || "Nouveau";
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

  const workspace = context?.membership?.workspaces;
  const workspaceSlug = Array.isArray(workspace) ? workspace[0]?.slug : workspace?.slug;
  const workspaceName = Array.isArray(workspace) ? workspace[0]?.name : workspace?.name;
  const isAutonomiaWorkspace =
    workspaceSlug === "autonomia" ||
    /autonomia/i.test(String(workspaceName || ""));

  if (hasSession && canWrite && isAutonomiaWorkspace) {
    await claimUnassignedPublicInboundLeads({
      workspaceId: context.membership.workspace_id
    }).catch(() => 0);
  }

  if (hasSession && canWrite && isAutonomiaWorkspace) {
    await drainInboundSpool({ limit: 10, timeoutMs: 5000 }).catch(() => ({ processed: 0, failed: 0 }));
  }

  const [persistedLeads, queuedLeads] = hasSession
    ? await Promise.all([
        listInboundLeads({
          workspaceId: context.membership.workspace_id,
          limit: 500
        }).catch(() => []),
        isAutonomiaWorkspace ? listQueuedInboundLeads({ limit: 100 }).catch(() => []) : Promise.resolve([])
      ])
    : [[], []];

  const persistedExternalIds = new Set(persistedLeads.map((lead) => lead.external_lead_id).filter(Boolean));
  const leads = [
    ...queuedLeads.filter((lead) => !persistedExternalIds.has(lead.external_lead_id)),
    ...persistedLeads
  ].sort((a, b) => new Date(b.last_received_at || 0) - new Date(a.last_received_at || 0));

  const visible = filtered(leads, active);

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · INBOUND</p>
        <h1>Leads entrants.</h1>
        <p className="lede">
          Chaque demande entrante, sa provenance et son suivi commercial dans une seule vue.
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

      <div className="inboundLeadList">
        {visible.length ? visible.map((lead) => {
          const solution = lead.scan_context?.solution_context;
          const priority = lead.scan_context?.priority || "normal";
          const nextAction = lead.scan_context?.next_action || "";
          const followUpNote = lead.scan_context?.follow_up_note || "";
          const followUpDueAt = lead.scan_context?.follow_up_due_at || "";

          return (
            <article className="inboundLeadCard" key={lead.id}>
              <header className="inboundLeadHeader">
                <div>
                  <span>REÇU LE {formatDate(lead.last_received_at)}</span>
                  <h2>{lead.company_name}</h2>
                  <p>{lead.first_name} {lead.last_name}</p>
                </div>
                <div className="inboundLeadHeaderStatus">
                  {lead.queued && <span className="inboundQueuedBadge">EN ATTENTE DE SYNCHRO</span>}
                  <strong className={"inboundStatus inboundStatus-" + (lead.status || "new")}>
                    {statusLabel(lead.status)}
                  </strong>
                </div>
              </header>

              <div className="inboundLeadBody">
                <section className="inboundLeadSection">
                  <small>CONTACT</small>
                  <dl className="inboundFieldList">
                    <div>
                      <dt>Prénom</dt>
                      <dd>{lead.first_name || "—"}</dd>
                    </div>
                    <div>
                      <dt>Nom</dt>
                      <dd>{lead.last_name || "—"}</dd>
                    </div>
                    <div>
                      <dt>Entreprise</dt>
                      <dd>{lead.company_name || "—"}</dd>
                    </div>
                    <div>
                      <dt>E-mail</dt>
                      <dd>{lead.email ? <a href={"mailto:" + lead.email}>{lead.email}</a> : "—"}</dd>
                    </div>
                    <div>
                      <dt>Téléphone</dt>
                      <dd>{lead.phone ? <a href={"tel:" + lead.phone}>{lead.phone}</a> : "—"}</dd>
                    </div>
                    <div>
                      <dt>Marketing</dt>
                      <dd>{lead.marketing_consent ? "Consentement oui" : "Consentement non"}</dd>
                    </div>
                  </dl>
                </section>

                <section className="inboundLeadSection inboundLeadRequest">
                  <small>DEMANDE</small>
                  <span className="attentionBucket">
                    {lead.scan_context?.classification || "besoin à qualifier"}
                  </span>
                  <strong>{lead.requested_service}</strong>
                  {lead.message && <p>{lead.message}</p>}

                  {solution && (
                    <div className="inboundSolutionContext">
                      <span>AI MATCH · {(solution.route || "orientation").toUpperCase()}</span>
                      {solution.summary && <p>{solution.summary}</p>}

                      {(solution.recommended_roles || []).length > 0 && (
                        <div>
                          <small>MÉTIER RECOMMANDÉ</small>
                          <div className="inboundSolutionTags">
                            {solution.recommended_roles.map((role, index) => {
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

                      {(solution.recommended_training || []).length > 0 && (
                        <div>
                          <small>FORMATION RECOMMANDÉE</small>
                          <div className="inboundSolutionTags">
                            {solution.recommended_training.map((training, index) => {
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
                </section>

                <section className="inboundLeadSection">
                  <small>PROVENANCE</small>
                  <dl className="inboundFieldList">
                    <div>
                      <dt>Module / page</dt>
                      <dd><strong>{sourceTitle(lead)}</strong></dd>
                    </div>
                    <div>
                      <dt>Date / heure</dt>
                      <dd>{formatDate(lead.last_received_at)}</dd>
                    </div>
                    <div>
                      <dt>Canal</dt>
                      <dd>{lead.source_channel || "—"}</dd>
                    </div>
                    <div>
                      <dt>Plateforme</dt>
                      <dd>{lead.source_platform || "—"}</dd>
                    </div>
                    {lead.latest_touch?.landing_page_url && (
                      <div>
                        <dt>URL</dt>
                        <dd>
                          <a
                            href={lead.latest_touch.landing_page_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ouvrir la page ↗
                          </a>
                        </dd>
                      </div>
                    )}
                    {lead.latest_touch?.utm_campaign && (
                      <div>
                        <dt>Campagne</dt>
                        <dd>{lead.latest_touch.utm_campaign}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              </div>

              <section className="inboundFollowUp">
                <div className="inboundFollowUpHeading">
                  <div>
                    <small>SUIVI COMMERCIAL</small>
                    <strong>Prochaine action et historique de travail</strong>
                  </div>
                  {followUpDueAt && <span>Relance : {formatDate(followUpDueAt)}</span>}
                </div>

                {canWrite && !lead.queued ? (
                  <form action={updateInboundLeadFollowUpAction} className="inboundFollowUpForm">
                    <input type="hidden" name="lead_id" value={lead.id} />

                    <label>
                      <span>Statut</span>
                      <select name="status" defaultValue={lead.status}>
                        {STATUSES.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Priorité</span>
                      <select name="priority" defaultValue={priority}>
                        {PRIORITIES.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Date de relance</span>
                      <input
                        type="date"
                        name="follow_up_due_at"
                        defaultValue={dateInputValue(followUpDueAt)}
                      />
                    </label>

                    <label className="inboundFollowUpWide">
                      <span>Prochaine action</span>
                      <input
                        name="next_action"
                        defaultValue={nextAction}
                        placeholder="Ex. Appeler pour qualifier le périmètre"
                        maxLength={500}
                      />
                    </label>

                    <label className="inboundFollowUpWide">
                      <span>Note interne</span>
                      <textarea
                        name="follow_up_note"
                        defaultValue={followUpNote}
                        placeholder="Contexte, échange, objection, décision…"
                        rows={3}
                        maxLength={3000}
                      />
                    </label>

                    <div className="inboundFollowUpSubmit">
                      <button type="submit">Enregistrer le suivi</button>
                    </div>
                  </form>
                ) : (
                  <div className="inboundFollowUpReadOnly">
                    <strong>
                      {lead.queued
                        ? "Lead conservé localement. La synchronisation avec la base sera retentée automatiquement."
                        : (nextAction || "Aucune prochaine action renseignée.")}
                    </strong>
                    {followUpNote && <p>{followUpNote}</p>}
                  </div>
                )}
              </section>
            </article>
          );
        }) : (
          <div className="emptyState">Aucun lead dans cette étape.</div>
        )}
      </div>
    </main>
  );
}
