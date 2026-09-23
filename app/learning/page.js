import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { listWorkspaceSalesContacts } from "../../lib/db/salesContacts.js";
import { buildSalesLearningSnapshot } from "../../lib/intelligence/salesLearning.js";

export const dynamic = "force-dynamic";

function rate(value) {
  return value == null ? "—" : value.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) + " %";
}

function GroupTable({ title, items }) {
  return (
    <section className="learningGroup">
      <div className="sectionTitle">
        <div>
          <p className="eyebrow">APPRENTISSAGE</p>
          <h2>{title}</h2>
        </div>
        <p>
          Lecture descriptive des résultats observés. Aucun poids de scoring n'est modifié automatiquement.
        </p>
      </div>

      <div className="learningTable">
        <div className="learningRow header">
          <span>Segment</span>
          <span>Contacts</span>
          <span>Réponses</span>
          <span>RDV</span>
          <span>Propositions</span>
          <span>Gagnés</span>
          <span>Taux réponse</span>
          <span>Taux gagné*</span>
        </div>
        {items.length ? items.slice(0, 20).map((item) => (
          <div className="learningRow" key={item.key}>
            <strong>{item.key}</strong>
            <span>{item.contacts}</span>
            <span>{item.replies}</span>
            <span>{item.meetings}</span>
            <span>{item.proposals}</span>
            <span>{item.won}</span>
            <span>{rate(item.reply_rate)}</span>
            <span>{rate(item.observed_win_rate)}</span>
          </div>
        )) : (
          <div className="emptyState">Pas encore de données dans ce segment.</div>
        )}
      </div>
      <small className="learningFootnote">
        * Taux gagné calculé uniquement parmi les opportunités explicitement conclues gagnées/perdues.
      </small>
    </section>
  );
}

export default async function LearningPage() {
  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));

  const hasSession = Boolean(context?.claims?.sub && context?.membership?.workspace_id);

  const contacts = hasSession
    ? await listWorkspaceSalesContacts({
        workspaceId: context.membership.workspace_id,
        limit: 500
      }).catch(() => [])
    : [];

  const snapshot = buildSalesLearningSnapshot(contacts);
  const funnel = snapshot.funnel;

  return (
    <main>
      <div className="detailBack"><Link href="/">← Retour au cockpit</Link></div>

      <header className="integrationHero">
        <p className="eyebrow">AUTONOMIA · LEARNING LOOP</p>
        <h1>Ce qui marche vraiment.</h1>
        <p className="lede">
          Autonomia mesure les résultats réels par offre, rôle et signal d'origine avant de proposer
          le moindre ajustement de priorisation.
        </p>
      </header>

      <section className="learningGate">
        <strong>{snapshot.learning_ready ? "DONNÉES EXPLOITABLES" : "COLLECTE EN COURS"}</strong>
        <span>{snapshot.learning_reason}</span>
      </section>

      <section className="learningFunnel">
        <article><strong>{funnel.contacts}</strong><span>Contacts</span></article>
        <article><strong>{funnel.verified}</strong><span>Vérifiés</span></article>
        <article><strong>{funnel.contacted}</strong><span>Travaillés</span></article>
        <article><strong>{funnel.replies}</strong><span>Réponses</span></article>
        <article><strong>{funnel.meetings}</strong><span>RDV</span></article>
        <article><strong>{funnel.proposals}</strong><span>Propositions</span></article>
        <article><strong>{funnel.won}</strong><span>Gagnés</span></article>
      </section>

      <GroupTable title="Par offre Autonomia" items={snapshot.by_offer} />
      <GroupTable title="Par rôle ciblé" items={snapshot.by_role} />
      <GroupTable title="Par source du signal" items={snapshot.by_trigger_source} />
    </main>
  );
}
