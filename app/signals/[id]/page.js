import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobSignalDetail } from "../../../lib/db/jobSignals.js";
import { listConsultantsWithSkills } from "../../../lib/db/consultants.js";
import { rankConsultantsForOpportunity } from "../../../lib/staffing/matcher.js";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function money(value, currency = "EUR") {
  if (value == null) return "À qualifier";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function unique(values = []) {
  return [...new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))];
}

function remoteAllowed(signal) {
  const haystack = JSON.stringify({
    title: signal?.title,
    location: signal?.location,
    contract: signal?.contract_type,
    raw: signal?.raw_payload
  });
  return /remote|t[eé]l[eé]travail|hybride|hybrid/i.test(haystack);
}

function commercialProjection(tjm) {
  const buyRate = Number(tjm);
  if (!Number.isFinite(buyRate) || buyRate <= 0) return null;

  const margin = Math.max(100, Math.round((buyRate * 0.2) / 10) * 10);
  const clientRate = buyRate + margin;

  return {
    buyRate,
    clientRate,
    margin,
    marginRate: Math.round((margin / clientRate) * 100)
  };
}

export default async function SignalPage({ params }) {
  const { id } = await params;

  const [signal, consultants] = await Promise.all([
    getJobSignalDetail(id),
    listConsultantsWithSkills({ status: "active", limit: 500 }).catch(() => [])
  ]);

  if (!signal) notFound();

  const freelance = /freelance|ind[eé]pendant/i.test(signal.contract_type || "") ||
    (signal.signal_keys || []).includes("freelance");

  const description =
    signal.raw_payload?.search_description ||
    signal.raw_payload?.description ||
    "La source originale permet de compléter le détail opérationnel du besoin.";

  const requiredSkills = unique([...(signal.skills || []), ...(signal.tools || [])]);
  const preferredSkills = unique(signal.roles || []);

  const ranked = requiredSkills.length || preferredSkills.length
    ? rankConsultantsForOpportunity({
        opportunity: {
          id: signal.id,
          title: signal.title,
          requiredSkills,
          preferredSkills,
          location: signal.location,
          remoteAllowed: remoteAllowed(signal),
          startDate:
            signal.raw_payload?.start_date ||
            signal.raw_payload?.startDate ||
            signal.raw_payload?.date_debut ||
            null,
          tjmMax:
            signal.raw_payload?.tjm_max ||
            signal.raw_payload?.tjmMax ||
            signal.raw_payload?.daily_rate_max ||
            null
        },
        consultants,
        limit: 5
      })
    : { matches: [] };

  const consultantById = new Map(consultants.map((consultant) => [consultant.id, consultant]));
  const matches = ranked.matches
    .map((match) => ({
      ...match,
      consultant: consultantById.get(match.consultantId) || null
    }))
    .filter((match) => match.consultant);

  return (
    <main>
      <div className="detailBack">
        <Link href="/">← Retour au cockpit</Link>
      </div>

      <header className="detailHero">
        <div>
          <p className="eyebrow">{freelance ? "MISSION FREELANCE" : "SIGNAL ENTREPRISE"}</p>
          <h1 className="detailTitle">{signal.title}</h1>
          <p className="lede">{signal.company_name || "Entreprise à identifier"}</p>
        </div>
      </header>

      <section className="detailGrid">
        <article className="detailPanel">
          <p className="eyebrow">BESOIN DÉTECTÉ</p>
          <h2>Ce que la source révèle</h2>
          <p className="detailDescription">{description}</p>

          <dl className="detailFacts">
            <div><dt>Source</dt><dd>{signal.source_id}</dd></div>
            <div><dt>Entreprise</dt><dd>{signal.company_name || "À identifier"}</dd></div>
            <div><dt>Localisation</dt><dd>{signal.location || "À qualifier"}</dd></div>
            <div><dt>Contrat</dt><dd>{signal.contract_type || "À qualifier"}</dd></div>
            <div><dt>Publication</dt><dd>{formatDate(signal.published_at)}</dd></div>
            <div><dt>Dernière détection</dt><dd>{formatDate(signal.last_seen_at)}</dd></div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">LECTURE AUTONOMIA</p>
          <h2>Compétences et angle commercial</h2>

          <div className="chips detailChips">
            {unique([...(signal.skills || []), ...(signal.roles || [])])
              .map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="detailBlock">
            <span>Outils détectés</span>
            <strong>{signal.tools?.length ? signal.tools.join(" · ") : "À qualifier"}</strong>
          </div>

          <div className="detailBlock">
            <span>Cas d’usage détectés</span>
            <strong>{signal.use_cases?.length ? signal.use_cases.join(" · ") : "À qualifier"}</strong>
          </div>

          <div className="detailBlock">
            <span>Prochaine action</span>
            <strong>
              {freelance
                ? "Présenter rapidement les meilleurs consultants disponibles et qualifier le TJM client."
                : "Approcher le décideur avec des profils immédiatement mobilisables, puis qualifier mission, durée et budget."}
            </strong>
          </div>
        </article>
      </section>

      <section className="sourceSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">AUTONOMIA EXPERTS · STAFFING</p>
            <h2>Les profils à proposer sur ce besoin</h2>
          </div>
          <p>
            Matching interne à partir des compétences, outils, disponibilité, localisation et TJM connus.
            La projection commerciale ci-dessous utilise une base de travail à +20 % avec un minimum de 100 € / jour.
          </p>
        </div>

        {matches.length ? (
          <div className="grid">
            {matches.map((match) => {
              const consultant = match.consultant;
              const projection = commercialProjection(consultant.tjm);
              const profileUrl = consultant.metadata?.profile_url || null;

              return (
                <article className="card" key={consultant.id}>
                  <div className="oppTop">
                    <div>
                      <p className="eyebrow">MATCH {match.score ?? "—"} / 100</p>
                      <h3>{consultant.display_name}</h3>
                    </div>
                    <div className="score">
                      <strong>{match.score ?? "—"}</strong>
                      <span>FIT</span>
                    </div>
                  </div>

                  <div className="chips">
                    {(consultant.skills || []).slice(0, 8).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <dl className="detailFacts">
                    <div><dt>TJM consultant</dt><dd>{money(consultant.tjm, consultant.currency)}</dd></div>
                    <div><dt>TJM cible</dt><dd>{projection ? money(projection.clientRate, consultant.currency) : "À chiffrer"}</dd></div>
                    <div><dt>Marge / jour</dt><dd>{projection ? money(projection.margin, consultant.currency) : "À chiffrer"}</dd></div>
                    <div><dt>Marge sur 20 j</dt><dd>{projection ? money(projection.margin * 20, consultant.currency) : "À chiffrer"}</dd></div>
                    <div><dt>Disponibilité</dt><dd>{consultant.available_from ? formatDate(consultant.available_from) : "À confirmer"}</dd></div>
                    <div><dt>Remote</dt><dd>{consultant.remote ? "Oui" : "Sur site / à confirmer"}</dd></div>
                  </dl>

                  {match.required?.missing?.length > 0 && (
                    <div className="detailBlock">
                      <span>Écarts à vérifier</span>
                      <strong>{match.required.missing.join(" · ")}</strong>
                    </div>
                  )}

                  <div className="oppActions">
                    <Link href="/consultants">Ouvrir le pool consultants →</Link>
                    {profileUrl && (
                      <a href={profileUrl} target="_blank" rel="noreferrer">
                        Voir la source profil ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="emptyState">
            Le matching deviendra exploitable dès que la source fournit des compétences, outils ou rôles suffisamment précis.
          </div>
        )}
      </section>

      <section className="sourceSection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">SOURCE ORIGINALE</p>
            <h2>Vérifier le besoin</h2>
          </div>
        </div>

        {signal.source_url ? (
          <div className="oppActions">
            <a href={signal.source_url} target="_blank" rel="noreferrer">
              Ouvrir {signal.source_id} ↗
            </a>
          </div>
        ) : (
          <div className="emptyState">Lien source à compléter.</div>
        )}
      </section>
    </main>
  );
}
