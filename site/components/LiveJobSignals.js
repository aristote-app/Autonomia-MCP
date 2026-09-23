function formatDate(value) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(value));
  } catch {
    return null;
  }
}

async function loadSignals(tags = []) {
  const endpoint = process.env.AUTONOMIA_CONTENT_SIGNALS_URL;
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
    if (tags.length) url.searchParams.set("tags", tags.join(","));
    url.searchParams.set("days", "90");

    const response = await fetch(url, {
      next: { revalidate: 21600 }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.ok ? data : null;
  } catch {
    return null;
  }
}

function SignalList({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <div className="jobSignalColumn">
      <small>{title}</small>
      <div>
        {items.slice(0, 5).map((item) => (
          <span key={item.key}>
            <strong>{item.label}</strong>
            <em>{item.count}</em>
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function LiveJobSignals({ tags = [] }) {
  const data = await loadSignals(tags);
  if (!data || !data.observedOffers) return null;

  return (
    <section className="liveJobSignals" aria-labelledby="job-market-signals-title">
      <div className="liveSignalHeader">
        <div>
          <p className="sectionIndex">SIGNAL MARCHÉ — EMPLOI</p>
          <h2 id="job-market-signals-title">Ce que les entreprises demandent en ce moment.</h2>
        </div>
        <div className="liveSignalMetric">
          <strong>{data.observedOffers}</strong>
          <span>offres observées dans l’échantillon lié à ce sujet</span>
        </div>
      </div>

      <div className="jobSignalGrid">
        <SignalList title="Rôles" items={data.roles} />
        <SignalList title="Outils" items={data.tools} />
        <SignalList title="Compétences" items={data.skills} />
        <SignalList title="Cas d’usage" items={data.useCases} />
      </div>

      {data.recentExamples?.length > 0 && (
        <div className="recentJobs">
          <small>EXEMPLES RÉCENTS DÉTECTÉS</small>
          {data.recentExamples.slice(0, 3).map((job) => (
            <div key={`${job.source}-${job.title}-${job.publishedAt}`}>
              <strong>{job.title}</strong>
              <span>
                {[job.company, job.location, formatDate(job.publishedAt)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="jobSignalNote">
        Données agrégées depuis des offres d’emploi collectées par Autonomia. Les nombres
        décrivent l’échantillon observé sur {data.periodDays} jours ; ils ne représentent
        pas le volume total du marché.
      </p>
    </section>
  );
}
