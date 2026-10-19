import Link from "next/link";
import AccountContacts from "../../lib/ui/AccountContacts.js";
import { isExcludedCommercialCompany } from "../../lib/intelligence/commercialLeadPolicy.js";
import { loadAccountIntelligence } from "../../lib/db/accountIntelligence.js";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import { readDecisionMakerSnapshot, getSnapshotCandidate } from "../../lib/intelligence/decisionMakerSnapshot.js";
import { getReviewedDecisionMaker, getReviewedOpportunityDecisionMaker } from "../../lib/intelligence/reviewedDecisionMakers.js";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function AccountsPage() {
  const live = hasAutonomiaDatabase()
    ? await loadAccountIntelligence({ limit: 150 }).catch(() => null)
    : null;

  const decisionSnapshot = await readDecisionMakerSnapshot().catch(() => ({version:1,accounts:{}}));
  // This is the direct-client prospecting view; known intermediaries stay out.
  const accounts = (live?.accounts || []).filter(account =>
    !account.intermediary_risk &&
    account.account_type !== "intermediary" &&
    !isExcludedCommercialCompany(account.name)
  );

  const reviewedAccount = account => Boolean(
    getReviewedDecisionMaker(account.name) ||
    (account.timeline || []).some(event =>
      getReviewedOpportunityDecisionMaker(event.company_name || account.name, event.id)
    )
  );
  const reviewedCount = accounts.filter(reviewedAccount).length;
  const candidateCount = accounts.filter(account =>
    !reviewedAccount(account) &&
    Boolean(getSnapshotCandidate(decisionSnapshot, account.name, { minScore: 85 }))
  ).length;
  const missingCount = accounts.length - reviewedCount - candidateCount;

  return (
    <main>
      <div className="detailBack">
        <Link href="/">← Retour au cockpit</Link>
      </div>

      <header className="accountHero">
        <div>
          <p className="eyebrow">AUTONOMIA · ACCOUNT INTELLIGENCE</p>
          <h1>Comptes 360°</h1>
          <p className="lede">
            Les signaux dispersés sont regroupés par entreprise pour faire apparaître les comptes
            à travailler, les besoins probables et le bon angle d'approche.
          </p>
        </div>
        <div className="accountHeroMetric">
          <strong>{accounts.length}</strong>
          <span>comptes ciblés · {reviewedCount} contacts documentés · {candidateCount} profils candidats · {missingCount} à identifier</span>
        </div>
      </header>

      {!live ? (
        <div className="emptyState">La base Autonomia n'est pas disponible.</div>
      ) : (
        <>
          <section className="accountSummaryStrip">
            <article>
              <strong>{accounts.filter((a) => a.heat_score >= 80).length}</strong>
              <span>Très chauds</span>
            </article>
            <article>
              <strong>{accounts.filter((a) => a.recent_7d > 0).length}</strong>
              <span>Nouveau signal ≤ 7 jours</span>
            </article>
            <article>
              <strong>{accounts.filter((a) => a.source_count >= 2).length}</strong>
              <span>Multi-sources</span>
            </article>
            <article>
              <strong>{accounts.filter((a) => a.offers.length >= 2).length}</strong>
              <span>Potentiel multi-offres</span>
            </article>
          </section>

          <section className="accountListSection">
            <div className="sectionTitle">
              <div>
                <p className="eyebrow">PRIORITÉ COMMERCIALE</p>
                <h2>Quels comptes travailler maintenant ?</h2>
              </div>
              <p>
                Le score est déterministe : récence, nombre de signaux, diversité des sources et
                convergence des besoins. Ce n'est pas une probabilité de vente.
              </p>
            </div>

            <div className="accountList">
              {accounts.length ? accounts.map((account) => (
                <article className="accountCard" key={account.slug}>
                  <div className="accountCardTop">
                    <div>
                      <p className="buyer">{account.name}</p>
                      <h3>{account.heat_label}</h3>
                    </div>
                    <div className="accountHeat">
                      <strong>{account.heat_score}</strong>
                      <span>HEAT / 100</span>
                    </div>
                  </div>

                  <div className="accountStats">
                    <span><strong>{account.signal_count}</strong> signaux</span>
                    <span><strong>{account.source_count}</strong> sources</span>
                    <span><strong>{account.recent_7d}</strong> sur 7 j</span>
                    <span><strong>{account.offers.length}</strong> offres possibles</span>
                  </div>

                  {account.why_now.length > 0 && (
                    <div className="whyNow">
                      <span>POURQUOI MAINTENANT ?</span>
                      <ul>
                        {account.why_now.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="chips">
                    {account.offers.slice(0, 4).map((offer) => <span key={offer}>{offer}</span>)}
                  </div>

                  <p className="accountLatest">
                    <strong>Dernier signal :</strong>{" "}
                    {account.timeline[0]?.title || "—"} · {formatDate(account.timeline[0]?.date)}
                  </p>

                  <AccountContacts account={account} decisionSnapshot={decisionSnapshot} />

                  <div className="oppActions">
                    <Link href={`/accounts/${account.slug}`}>Ouvrir le compte 360° →</Link>
                  </div>
                </article>
              )) : (
                <div className="emptyState">Aucun compte suffisamment identifié dans les signaux actuels.</div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
