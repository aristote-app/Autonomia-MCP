import Link from "next/link";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import {
  cleanSiret,
  lookupAcademyCompanyBySiret,
  lookupAcademyCompaniesBySiren,
  listAcademyFundingRules,
  listAcademyCourses,
  getAcademySummary,
  listAcademyOpcoCoverage
} from "../../lib/db/academy.js";
import { lookupCfaDockOpco } from "../../lib/academy/opcoFallback.js";

export const dynamic = "force-dynamic";

function money(value) {
  if (value == null || value === "") return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function date(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(d);
}

export default async function AcademyPage({ searchParams }) {
  const params = await searchParams;
  const siret = cleanSiret(params?.siret);
  const databaseReady = hasAutonomiaDatabase();

  let company = null;
  let fundingRules = [];
  let courses = [];
  let summary = { opcos: 0, fundingSources: 0, fundingRules: 0, siroRows: 0, latestSiroRun: null };
  let opcoCoverage = [];
  let dataState = databaseReady ? "ready" : "database_missing";
  let lookupState = siret.length === 14 ? "pending" : "idle";
  let lookupError = null;
  let sirenFallback = [];
  let externalFallback = null;
  let summaryError = null;
  let coverageError = null;
  let coursesError = null;

  if (databaseReady) {
    const [summaryResult, coverageResult, coursesResult] = await Promise.allSettled([
      getAcademySummary(),
      listAcademyOpcoCoverage(),
      listAcademyCourses({ limit: 100 })
    ]);

    if (summaryResult.status === "fulfilled") {
      summary = summaryResult.value;
    } else {
      summaryError = summaryResult.reason?.message || String(summaryResult.reason || "");
      console.error("Academy summary error", summaryResult.reason);
    }

    if (coverageResult.status === "fulfilled") {
      opcoCoverage = coverageResult.value;
    } else {
      coverageError = coverageResult.reason?.message || String(coverageResult.reason || "");
      console.error("Academy coverage error", coverageResult.reason);
    }

    if (coursesResult.status === "fulfilled") {
      courses = coursesResult.value;
    } else {
      coursesError = coursesResult.reason?.message || String(coursesResult.reason || "");
      console.error("Academy courses error", coursesResult.reason);
    }

    if (siret.length === 14) {
      try {
        company = await lookupAcademyCompanyBySiret(siret);

        if (!company) {
          sirenFallback = await lookupAcademyCompaniesBySiren(siret.slice(0, 9), { limit: 20 });
          const fallback = sirenFallback.find((row) => row.opco_code || row.opco_name || row.idcc) || null;

          if (fallback) {
            company = fallback;
            lookupState = "found_siren";
          } else {
            externalFallback = await lookupCfaDockOpco(siret);

            if (externalFallback?.found) {
              company = {
                siret,
                siren: siret.slice(0, 9),
                opco_code: externalFallback.opco_code,
                opco_name: externalFallback.opco_name,
                idcc: externalFallback.idcc,
                source_updated_at: null
              };
              lookupState = "found_external";
            } else {
              lookupState = "not_found";
            }
          }
        } else {
          lookupState = "found";
        }

        if (company) {
          try {
            fundingRules = await listAcademyFundingRules({
              opcoCode: company.opco_code,
              idcc: company.idcc,
              limit: 50
            });
          } catch (error) {
            console.error("Academy funding rules error", error);
          }
        }
      } catch (error) {
        lookupState = "error";
        lookupError = error?.message || String(error);
        console.error("Academy SIRET lookup error", error);
      }
    }

    if (summaryError && coverageError && coursesError && lookupState === "error") {
      dataState = "schema_missing";
    }
  }

  return (
    <main>
      <section className="territoryHero">
        <div>
          <p className="eyebrow">AUTONOMIA / ACADEMY</p>
          <h1>OPCO Intelligence</h1>
          <p>
            Identifier l’OPCO et l’IDCC d’une entreprise à partir de son SIRET,
            puis rapprocher les règles de financement des formations Autonomia Academy.
          </p>
        </div>
        <Link className="territoryBack" href="/">← Market Intelligence</Link>
      </section>

      <section className="territoryMetrics">
        <article>
          <strong>{summary.opcos}</strong>
          <span>OPCO référencés</span>
        </article>
        <article>
          <strong>{summary.fundingSources}</strong>
          <span>sources officielles 2026</span>
        </article>
        <article>
          <strong>{summary.fundingRules}</strong>
          <span>règles normalisées</span>
        </article>
        <article>
          <strong>{new Intl.NumberFormat("fr-FR").format(summary.siroRows)}</strong>
          <span>SIRET SIRO chargés</span>
        </article>
        <article>
          <strong>{summary.latestSiroRun?.status || "—"}</strong>
          <span>dernier import SIRO</span>
        </article>
      </section>

      <section className="territoryControls">
        <form className="territorySearch" method="get" action="/academy#academy-result">
          <input
            name="siret"
            inputMode="numeric"
            pattern="[0-9]{14}"
            maxLength={14}
            defaultValue={siret}
            placeholder="SIRET à 14 chiffres"
            aria-label="SIRET"
          />
          <button type="submit">Identifier l’OPCO</button>
        </form>
      </section>

      {siret.length === 14 && (
        <section id="academy-result" className="commandCenter" style={{ scrollMarginTop: "24px" }}>
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">RÉSULTAT OPCO</p>
              <h2>SIRET {siret}</h2>
            </div>
            <p>
              {lookupState === "found"
                ? "Rattachement SIRO trouvé pour ce SIRET."
                : lookupState === "found_siren"
                  ? "Le SIRET exact est absent de SIRO, mais un rattachement existe pour un autre établissement du même SIREN."
                  : lookupState === "found_external"
                    ? "Rattachement trouvé via la recherche CFA Dock."
                    : lookupState === "not_found"
                  ? "Aucun rattachement trouvé dans les données SIRO actuellement chargées."
                  : lookupState === "error"
                    ? "La recherche a rencontré une erreur."
                    : "Recherche en cours."}
            </p>
          </div>

          {(lookupState === "found" || lookupState === "found_siren" || lookupState === "found_external") && company && (
            <div className="commandGrid">
              <article>
                <span>OPCO</span>
                <strong>{company.opco_name || company.opco_code || "—"}</strong>
                <p>{company.opco_code || "Code OPCO non renseigné"}</p>
              </article>
              <article>
                <span>IDCC</span>
                <strong>{company.idcc || "—"}</strong>
                <p>Convention collective rattachée dans SIRO.</p>
              </article>
              <article>
                <span>SIREN</span>
                <strong>{company.siren || "—"}</strong>
                <p>Établissement : {company.siret}</p>
              </article>
              <article>
                <span>DONNÉE SIRO</span>
                <strong>{date(company.source_updated_at)}</strong>
                <p>Dernière date de source enregistrée.</p>
              </article>
            </div>
          )}

          {lookupState === "not_found" && (
            <div className="emptyState">
              Aucun rattachement OPCO trouvé dans SIRO local, par SIREN, ni via CFA Dock pour ce SIRET.
            </div>
          )}

          {lookupState === "error" && (
            <div className="emptyState">
              Erreur de recherche SIRO : {lookupError || "erreur inconnue"}.
            </div>
          )}
        </section>
      )}

      {dataState === "database_missing" && (
        <section className="emptyState">
          La base AUTONOMIA n’est pas connectée à cette instance du cockpit.
        </section>
      )}

      {dataState === "schema_missing" && (
        <section className="emptyState">
          L’onglet Academy est actif. Les tables SIRO / financements / catalogue doivent encore être chargées dans la base AUTONOMIA.
        </section>
      )}

      {siret && siret.length !== 14 && (
        <section className="emptyState">
          Le SIRET doit contenir exactement 14 chiffres.
        </section>
      )}

      {siret.length === 14 && lookupState === "not_found" && (
        <section className="emptyState">
          <strong>SIRET {siret}</strong><br />
          Ce SIRET n’apparaît pas dans le snapshot SIRO actuellement chargé et aucun autre établissement du même SIREN n’a fourni de rattachement exploitable.
          L’absence dans SIRO ne signifie pas qu’aucun OPCO n’existe.
        </section>
      )}

      {siret.length === 14 && lookupState === "error" && (
        <section className="emptyState">
          <strong>La recherche du SIRET {siret} a échoué.</strong><br />
          {lookupError || "Erreur de lecture du référentiel SIRO."}
        </section>
      )}

      {company && (
        <>
          <section className="commandCenter">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">ENTREPRISE</p>
                <h2>{company.opco_name || company.opco_code || "OPCO identifié"}</h2>
              </div>
              <p>Rattachement issu du référentiel SIRO chargé dans AUTONOMIA.</p>
            </div>

            <div className="commandGrid">
              <article>
                <span>SIRET</span>
                <strong>{company.siret}</strong>
                <p>SIREN {company.siren || "—"}</p>
              </article>
              <article>
                <span>OPCO</span>
                <strong>{company.opco_name || "—"}</strong>
                <p>{company.opco_code || "Code non renseigné"}</p>
              </article>
              <article>
                <span>IDCC</span>
                <strong>{company.idcc || "—"}</strong>
                <p>Convention collective issue du référentiel SIRO.</p>
              </article>
              <article>
                <span>DONNÉE SIRO</span>
                <strong>{date(company.source_updated_at)}</strong>
                <p>Date de mise à jour de la source chargée.</p>
              </article>
            </div>
          </section>

          <section className="todaySection">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">FINANCEMENTS</p>
                <h2>Règles correspondant à cet OPCO</h2>
              </div>
              <p>
                Les montants restent indicatifs tant qu’une règle n’est pas marquée comme vérifiée avec sa source officielle.
              </p>
            </div>

            <div className="opportunityList">
              {fundingRules.length ? fundingRules.map((rule) => (
                <article className="opportunity" key={rule.id}>
                  <div className="oppTop">
                    <div>
                      <div className="attentionLine">
                        <span className="attentionBucket">{rule.scheme || "Financement"}</span>
                        <span>{rule.opco_code}</span>
                        {rule.idcc && <span>IDCC {rule.idcc}</span>}
                      </div>
                      <h3>
                        {rule.annual_ceiling != null
                          ? `Plafond annuel ${money(rule.annual_ceiling)}`
                          : "Règle de prise en charge"}
                      </h3>
                    </div>
                  </div>
                  <div className="oppMeta">
                    <span>
                      Effectif : {rule.company_size_min ?? "—"}–{rule.company_size_max ?? "—"} salariés
                    </span>
                    <span>Plafond horaire : {money(rule.hourly_ceiling)}</span>
                    <span>Plafond jour : {money(rule.day_ceiling)}</span>
                    {rule.coverage_percent != null && <span>Prise en charge : {rule.coverage_percent}%</span>}
                    <span>Vérifié : {date(rule.verified_at)}</span>
                  </div>
                  {rule.notes && <p>{rule.notes}</p>}
                  {rule.source_url && (
                    <div className="oppActions">
                      <a href={rule.source_url} target="_blank" rel="noreferrer">Source officielle ↗</a>
                    </div>
                  )}
                </article>
              )) : (
                <div className="emptyState">
                  Aucune règle de financement vérifiée n’est encore enregistrée pour cet OPCO / IDCC.
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="todaySection">
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">COUVERTURE OPCO 2026</p>
            <h2>11 OPCO, sources officielles et règles normalisées</h2>
          </div>
          <p>
            Les règles sont ajoutées uniquement lorsqu’un barème est explicitement vérifiable sur une source officielle.
            Les autres OPCO restent reliés à leur source 2026 pour enrichissement par branche.
          </p>
        </div>

        <div className="grid">
          {opcoCoverage.map((opco) => (
            <article className="card" key={opco.code}>
              <small>{opco.code}</small>
              <h3>{opco.short_name}</h3>
              <p>{opco.funding_source_count} source{opco.funding_source_count > 1 ? "s" : ""} officielle{opco.funding_source_count > 1 ? "s" : ""} · {opco.verified_rule_count} règle{opco.verified_rule_count > 1 ? "s" : ""} vérifiée{opco.verified_rule_count > 1 ? "s" : ""}</p>
              {opco.funding_sources?.[0] && (
                <a href={opco.funding_sources[0].source_url} target="_blank" rel="noreferrer">
                  Source 2026 ↗
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">ACADEMY</p>
            <h2>Catalogue formations</h2>
          </div>
          <p>
            Cette base servira ensuite au matching OPCO → financement → formation compatible.
          </p>
        </div>

        {courses.length ? (
          <div className="grid">
            {courses.map((course) => (
              <article className="card" key={course.id}>
                <small>{course.family || "Autonomia Academy"}</small>
                <h3>{course.title}</h3>
                <p>
                  {course.duration_hours ? `${course.duration_hours} h` : "Durée à préciser"}
                  {course.duration_days ? ` · ${course.duration_days} j` : ""}
                </p>
                <p>
                  Intra : {money(course.price_intra_day)}/jour · Inter : {money(course.price_inter_day)}/jour
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            {coursesError
              ? "Le catalogue Academy n’est pas encore disponible, mais cela ne bloque plus la recherche OPCO."
              : "Le catalogue Academy sera alimenté dans la base AUTONOMIA."}
          </div>
        )}
      </section>
    </main>
  );
}
