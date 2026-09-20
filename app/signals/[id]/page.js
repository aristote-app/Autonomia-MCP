import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobSignalDetail } from "../../../lib/db/jobSignals.js";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export default async function SignalPage({ params }) {
  const { id } = await params;
  const signal = await getJobSignalDetail(id);

  if (!signal) notFound();

  const freelance = /freelance|ind[eé]pendant/i.test(signal.contract_type || "") ||
    (signal.signal_keys || []).includes("freelance");

  const description =
    signal.raw_payload?.search_description ||
    signal.raw_payload?.description ||
    "Le détail complet doit être vérifié dans la source originale.";

  return (
    <main>
      <div className="detailBack">
        <Link href="/">← Retour au cockpit</Link>
      </div>

      <header className="detailHero">
        <div>
          <p className="eyebrow">{freelance ? "MISSION FREELANCE" : "SIGNAL ENTREPRISE"}</p>
          <h1 className="detailTitle">{signal.title}</h1>
          <p className="lede">{signal.company_name || "Entreprise non identifiée"}</p>
        </div>
      </header>

      <section className="detailGrid">
        <article className="detailPanel">
          <p className="eyebrow">BESOIN DÉTECTÉ</p>
          <h2>Ce que la source révèle</h2>
          <p className="detailDescription">{description}</p>

          <dl className="detailFacts">
            <div><dt>Source</dt><dd>{signal.source_id}</dd></div>
            <div><dt>Entreprise</dt><dd>{signal.company_name || "—"}</dd></div>
            <div><dt>Localisation</dt><dd>{signal.location || "—"}</dd></div>
            <div><dt>Contrat</dt><dd>{signal.contract_type || "—"}</dd></div>
            <div><dt>Publication</dt><dd>{formatDate(signal.published_at)}</dd></div>
            <div><dt>Dernière détection</dt><dd>{formatDate(signal.last_seen_at)}</dd></div>
          </dl>
        </article>

        <article className="detailPanel">
          <p className="eyebrow">LECTURE AUTONOMIA</p>
          <h2>Compétences et angles commerciaux</h2>

          <div className="chips detailChips">
            {[...(signal.skills || []), ...(signal.roles || [])]
              .filter((value, index, array) => array.indexOf(value) === index)
              .map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="detailBlock">
            <span>Outils détectés</span>
            <strong>{signal.tools?.length ? signal.tools.join(" · ") : "Non déterminé"}</strong>
          </div>

          <div className="detailBlock">
            <span>Cas d’usage détectés</span>
            <strong>{signal.use_cases?.length ? signal.use_cases.join(" · ") : "Non déterminé"}</strong>
          </div>

          <div className="detailBlock">
            <span>Prochaine action</span>
            <strong>
              {freelance
                ? "Qualifier la mission puis chercher immédiatement un consultant correspondant."
                : "Identifier le décideur et transformer ce recrutement en hypothèse de besoin commercial à vérifier."}
            </strong>
          </div>
        </article>
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
          <div className="emptyState">URL source indisponible.</div>
        )}
      </section>
    </main>
  );
}
