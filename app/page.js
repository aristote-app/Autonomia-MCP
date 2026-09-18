import { SOURCES, SOURCE_GROUPS } from "../lib/sources.js";

export default function Home() {
  const counts = SOURCES.reduce((acc, source) => {
    acc[source.status] = (acc[source.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AUTONOMIA</p>
          <h1>Market Intelligence</h1>
          <p className="lede">
            Missions freelance IA, prestations privées, marchés publics et formation IA
            réunis dans une base traçable et interrogeable par MCP.
          </p>
        </div>
        <div className="status">
          <strong>V0.1</strong>
          <span>Fondation technique</span>
        </div>
      </header>

      <section className="metrics">
        <article><strong>{SOURCES.length}</strong><span>sources référencées</span></article>
        <article><strong>{counts.active || 0}</strong><span>connecteurs P0 actifs</span></article>
        <article><strong>{counts.planned || 0}</strong><span>connecteurs planifiés</span></article>
        <article><strong>3</strong><span>marchés principaux</span></article>
      </section>

      <section>
        <div className="sectionTitle">
          <div>
            <p className="eyebrow">COUVERTURE</p>
            <h2>Sources prioritaires</h2>
          </div>
          <p>La priorité va aux API et open data officiels lorsqu'ils existent.</p>
        </div>

        <div className="grid">
          {SOURCE_GROUPS.map((group) => (
            <article className="card" key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.description}</p>
              <ul>
                {SOURCES.filter((source) => source.group === group.id).map((source) => (
                  <li key={source.id}>
                    <span>{source.name}</span>
                    <small className={source.status}>{source.priority} · {source.status}</small>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="pipeline">
        <p className="eyebrow">PIPELINE</p>
        <h2>Une donnée vérifiable avant toute analyse IA</h2>
        <div className="pipelineRow">
          {["Collecte", "Raw evidence", "Normalisation", "Déduplication", "Enrichissement", "Supabase", "MCP"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
