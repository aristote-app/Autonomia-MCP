import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import {
  listConsultantsWithSkills,
  getConsultantPoolSummary,
  listConsultantCandidates,
  getConsultantDiscoverySummary
} from "../../lib/db/consultants.js";
import { consultantImportTemplate } from "../../lib/consultants/import.js";
import {
  importConsultantsFromText,
  discoverConsultantsFromWeb,
  reviewConsultantCandidate
} from "../actions/consultants.js";
import { loadAccountIntelligence } from "../../lib/db/accountIntelligence.js";
import { rankAccountsForConsultant } from "../../lib/intelligence/consultantAccounts.js";

export const dynamic = "force-dynamic";

function money(value, currency = "EUR") {
  if (value == null) return "TJM non renseigné";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 0
  }).format(Number(value)) + " / j";
}

function date(value) {
  if (!value) return "Disponibilité inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function ConsultantsPage({ searchParams }) {
  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));
  const hasSession = Boolean(context?.claims?.sub && context?.membership?.workspace_id);
  const canImport = ["admin", "direction", "staffing"].includes(context?.membership?.role);
  const params = await searchParams;
  const importedCount = Number(params?.imported || 0);
  const importedSkillLinks = Number(params?.skills || 0);
  const discoveredCount = Number(params?.discovered || 0);
  const updatedCount = Number(params?.updated || 0);
  const foundCount = Number(params?.found || 0);
  const reviewed = String(params?.reviewed || "");
  const lastQuery = String(params?.query || "");
  const discoverySummary = await getConsultantDiscoverySummary().catch(() => ({
    candidates: 0,
    rejected: 0,
    malt: 0,
    freelance_com: 0,
    linkedin: 0
  }));

  if (!hasSession) {
    return (
      <main>
        <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>
        <header className="integrationHero">
          <p className="eyebrow">AUTONOMIA · CONSULTANT INTELLIGENCE</p>
          <h1>Consultants.</h1>
          <p className="lede">
            Pool privé pour le matching mission ↔ consultant et l'approche proactive des comptes.
          </p>
        </header>
        <div className="lockedContactState">
          <strong>Pool privé prêt</strong>
          <span>Visible uniquement après authentification du workspace.</span>
          <span>
            Talent Hunter : {discoverySummary.candidates} candidat{discoverySummary.candidates > 1 ? "s" : ""} en attente de validation.
          </span>
        </div>
      </main>
    );
  }

  const [consultants, candidates, summary, accountResult] = await Promise.all([
    listConsultantsWithSkills({ limit: 500 }).catch(() => []),
    listConsultantCandidates({ limit: 120 }).catch(() => []),
    getConsultantPoolSummary().catch(() => ({
      total: 0, active: 0, available_now: 0, remote: 0, tjm_known: 0
    })),
    loadAccountIntelligence({ limit: 250 }).catch(() => ({ accounts: [] }))
  ]);

  const accounts = accountResult.accounts || [];
  const proactiveMatches = new Map(
    consultants.map((consultant) => [
      consultant.id,
      rankAccountsForConsultant({
        consultant,
        accounts,
        limit: 3
      }).matches
    ])
  );

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · CONSULTANT INTELLIGENCE</p>
        <h1>Consultants.</h1>
        <p className="lede">
          La même donnée sert dans les deux sens : trouver le meilleur profil pour une mission
          et trouver les meilleurs comptes à attaquer pour un profil disponible.
        </p>
      </header>

      {importedCount > 0 && (
        <div className="adminFlash">
          <strong>{importedCount} consultant{importedCount > 1 ? "s" : ""} importé{importedCount > 1 ? "s" : ""}</strong>
          <span>{importedSkillLinks} lien{importedSkillLinks > 1 ? "s" : ""} de compétences enregistré{importedSkillLinks > 1 ? "s" : ""}.</span>
        </div>
      )}

      {(foundCount > 0 || discoveredCount > 0 || updatedCount > 0) && (
        <div className="adminFlash">
          <strong>Talent Hunter : {foundCount} profil{foundCount > 1 ? "s" : ""} pertinent{foundCount > 1 ? "s" : ""} trouvé{foundCount > 1 ? "s" : ""}</strong>
          <span>
            {discoveredCount} nouveau{discoveredCount > 1 ? "x" : ""} candidat{discoveredCount > 1 ? "s" : ""} · {updatedCount} déjà connu{updatedCount > 1 ? "s" : ""} actualisé{updatedCount > 1 ? "s" : ""}.
          </span>
        </div>
      )}

      {reviewed && (
        <div className="adminFlash">
          <strong>{reviewed === "active" ? "Consultant validé dans le pool actif." : "Candidat rejeté."}</strong>
        </div>
      )}

      {canImport && (
        <section className="talentHunterPanel">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">TALENT HUNTER · MALT + FREELANCE.COM + LINKEDIN</p>
              <h2>Chercher les profils dont Autonomia a besoin.</h2>
            </div>
            <p>
              Trois recherches web ciblées maximum par déclenchement, mises en cache 12 h. Les résultats restent candidats jusqu'à validation humaine.
            </p>
          </div>
          <form action={discoverConsultantsFromWeb} className="talentHunterForm">
            <label>
              <span>Compétences / type de profil</span>
              <input
                type="text"
                name="query"
                required
                minLength={3}
                maxLength={180}
                defaultValue={lastQuery || "AI Engineer LangGraph RAG Python"}
                placeholder="Ex. Formateur IA Copilot adoption"
              />
            </label>
            <button type="submit">Chercher sur 3 sources</button>
          </form>
          <div className="talentHunterPresets">
            <span>Exemples :</span>
            <strong>AI Engineer LangGraph RAG</strong>
            <strong>Formateur IA Copilot adoption</strong>
            <strong>Automatisation IA n8n Make</strong>
            <strong>AI Product / Project Manager</strong>
          </div>
          <small>
            Aucun profil n'est contacté automatiquement. Aucun crédit Kaspr n'est consommé. Le profil source reste lié au candidat.
          </small>
        </section>
      )}

      {canImport && (
        <section className="detailPanel" style={{ marginBottom: 24 }}>
          <p className="eyebrow">IMPORT CONSULTANTS</p>
          <h2>Coller depuis Excel / CSV.</h2>
          <p className="accountHint">
            Une ligne par consultant. Séparateur principal : point-virgule ou tabulation.
            Les compétences et localisations peuvent être séparées par des virgules.
          </p>
          <form action={importConsultantsFromText} className="workflowForm" style={{ gridTemplateColumns: "1fr auto" }}>
            <label className="workflowWide">
              <span>Données consultants</span>
              <textarea
                name="rows"
                rows={7}
                required
                defaultValue={consultantImportTemplate()}
                style={{ width: "100%", minHeight: 180, padding: 10, border: "1px solid #cfd4ce", font: "inherit", fontSize: 12 }}
              />
            </label>
            <button type="submit">Importer</button>
          </form>
          <small className="accountHint">
            L'import met à jour un consultant existant portant le même identifiant manuel et ajoute les compétences sans supprimer l'historique.
          </small>
        </section>
      )}

      <section className="consultantMetrics">
        <article><strong>{summary.active}</strong><span>Actifs</span></article>
        <article><strong>{summary.available_now}</strong><span>Disponibles maintenant</span></article>
        <article><strong>{discoverySummary.candidates}</strong><span>Candidats à vérifier</span></article>
        <article><strong>{summary.tjm_known}</strong><span>TJM connus</span></article>
      </section>

      {canImport && candidates.length > 0 && (
        <section className="talentCandidateSection">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">CANDIDATS DÉCOUVERTS</p>
              <h2>Vérifier avant d'activer.</h2>
            </div>
            <p>
              Les noms, compétences, TJM et localisations ci-dessous proviennent uniquement des éléments publics trouvés dans l'index web. Les champs absents restent non renseignés.
            </p>
          </div>

          <div className="talentCandidateList">
            {candidates.map((candidate) => (
              <article key={candidate.id}>
                <div className="talentCandidateHead">
                  <div>
                    <span>{candidate.metadata?.source_label || candidate.metadata?.source_platform || "Web"}</span>
                    <h3>{candidate.display_name}</h3>
                    {candidate.metadata?.headline && <p>{candidate.metadata.headline}</p>}
                  </div>
                  <strong>{candidate.metadata?.relevance_score || 0}/100</strong>
                </div>

                <div className="consultantFacts">
                  <span>{money(candidate.tjm, candidate.currency)}</span>
                  <span>{candidate.locations?.length ? candidate.locations.join(", ") : "Localisation non renseignée"}</span>
                  <span>{candidate.remote ? "Remote / hybride mentionné" : "Remote non renseigné"}</span>
                </div>

                {(candidate.skills || []).length > 0 && (
                  <div className="chips">
                    {candidate.skills.slice(0, 14).map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                )}

                <div className="talentCandidateActions">
                  {candidate.metadata?.profile_url && (
                    <a href={candidate.metadata.profile_url} target="_blank" rel="noreferrer">
                      Vérifier le profil source ↗
                    </a>
                  )}
                  <form action={reviewConsultantCandidate}>
                    <input type="hidden" name="consultant_id" value={candidate.id} />
                    <input type="hidden" name="decision" value="approve" />
                    <button type="submit">Valider dans le pool</button>
                  </form>
                  <form action={reviewConsultantCandidate}>
                    <input type="hidden" name="consultant_id" value={candidate.id} />
                    <input type="hidden" name="decision" value="reject" />
                    <button type="submit" className="secondary">Rejeter</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {consultants.length ? (
        <section className="consultantList">
          {consultants.map((consultant) => (
            <article key={consultant.id}>
              <div>
                <p className="buyer">{consultant.status}</p>
                <h3>{consultant.display_name}</h3>
                <div className="consultantFacts">
                  <span>{date(consultant.available_from)}</span>
                  <span>{money(consultant.tjm, consultant.currency)}</span>
                  <span>{consultant.remote ? "Remote possible" : "Remote non renseigné"}</span>
                  {consultant.years_experience != null && (
                    <span>{consultant.years_experience} ans d'expérience</span>
                  )}
                </div>
              </div>
              <div className="chips">
                {(consultant.skills || []).slice(0, 12).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              {(proactiveMatches.get(consultant.id) || []).length > 0 && (
                <div className="nextAction">
                  <span>COMPTES À ATTAQUER POUR CE PROFIL</span>
                  <div className="offerStack">
                    {(proactiveMatches.get(consultant.id) || []).map((match) => (
                      <div key={match.account_slug}>
                        <strong>
                          <Link href={"/accounts/" + match.account_slug}>
                            {match.account_name} · {match.score}/100
                          </Link>
                        </strong>
                        <small>
                          {match.matched_skills.length
                            ? "Convergence : " + match.matched_skills.slice(0, 4).join(" · ")
                            : match.reason}
                        </small>
                        {match.trigger && <small>Signal : {match.trigger}</small>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      ) : (
        <div className="emptyState">
          Le moteur est prêt mais le pool contient actuellement 0 consultant.
          Aucun profil n'est inventé : l'import réel alimentera ensuite le matching bidirectionnel.
        </div>
      )}
    </main>
  );
}
