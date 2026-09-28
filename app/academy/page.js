import Link from "next/link";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import {
  cleanSiret,
  lookupAcademyCompanyBySiret,
  listAcademyFundingRules,
  listAcademyCourses
} from "../../lib/db/academy.js";

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
  let dataState = databaseReady ? "ready" : "database_missing";

  if (databaseReady) {
    try {
      courses = await listAcademyCourses({ limit: 100 });
      if (siret.length === 14) {
        company = await lookupAcademyCompanyBySiret(siret);
        if (company) {
          fundingRules = await listAcademyFundingRules({
            opcoCode: company.opco_code,
            idcc: company.idcc,
            limit: 50
          });
        }
      }
    } catch (error) {
      console.error("Academy cockpit data error", error);
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
          <strong>1</strong>
          <span>SIRET recherché</span>
        </article>
        <article>
          <strong>{company ? "OK" : "—"}</strong>
          <span>OPCO identifié</span>
        </article>
        <article>
          <strong>{fundingRules.length}</strong>
          <span>règles de financement</span>
        </article>
        <article>
          <strong>{courses.length}</strong>
          <span>formations actives</span>
        </article>
        <article>
          <strong>SIRO</strong>
          <span>référentiel cible</span>
        </article>
      </section>

      <section className="territoryControls">
        <form className="territorySearch" method="get" action="/academy">
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

      {siret.length === 14 && dataState === "ready" && !company && (
        <section className="emptyState">
          Aucun rattachement SIRO trouvé pour le SIRET {siret}.
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
                        <span>{rule.opco_name || rule.opco_code}</span>
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
                    <span>Plafond horaire : {money(rule.hourly_ceiling)}</span>
                    <span>Plafond jour : {money(rule.day_ceiling)}</span>
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
            Le catalogue Academy sera alimenté dans la base AUTONOMIA.
          </div>
        )}
      </section>
    </main>
  );
}
