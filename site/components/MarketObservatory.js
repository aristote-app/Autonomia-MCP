function formatDate(value) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value));
  } catch {
    return null;
  }
}

async function loadMarketSignals() {
  const endpoint = process.env.AUTONOMIA_CONTENT_SIGNALS_URL;
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
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

function Ranking({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <article className="observatoryRanking">
      <small>{title}</small>
      <ol>
        {items.slice(0, 10).map((item) => (
          <li key={item.key}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default async function MarketObservatory() {
  const data = await loadMarketSignals();
  if (!data || !data.observedOffers) return null;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autonomia.fr";
  const modified = data.generatedAt || data.updatedAt || data.observedAt || null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Observatoire Autonomia — signaux de demande IA",
    description:
      "Agrégation de signaux issus d’un échantillon d’offres d’emploi collectées par Autonomia afin d’observer les rôles, outils, compétences et cas d’usage IA mentionnés.",
    url: `${base}/observatoire-ia`,
    creator: {
      "@type": "Organization",
      "@id": `${base}#organization`,
      name: "Autonomia",
      url: base
    },
    isAccessibleForFree: true,
    ...(modified ? { dateModified: modified } : {}),
    variableMeasured: [
      "Rôles IA observés",
      "Outils IA observés",
      "Compétences IA observées",
      "Cas d’usage IA observés"
    ]
  };

  return (
    <section className="marketObservatoryData">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="observatoryMetric">
        <strong>{data.observedOffers}</strong>
        <span>offres observées dans l’échantillon sur {data.periodDays} jours</span>
      </div>

      <div className="observatoryGrid">
        <Ranking title="RÔLES OBSERVÉS" items={data.roles} />
        <Ranking title="OUTILS OBSERVÉS" items={data.tools} />
        <Ranking title="COMPÉTENCES OBSERVÉES" items={data.skills} />
        <Ranking title="CAS D’USAGE OBSERVÉS" items={data.useCases} />
      </div>

      {data.recentExamples?.length > 0 && (
        <div className="observatoryExamples">
          <small>EXEMPLES RÉCENTS DANS L’ÉCHANTILLON</small>
          {data.recentExamples.slice(0, 6).map((job) => (
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
        Ces données décrivent uniquement l’échantillon collecté par Autonomia sur la période indiquée.
        Elles ne constituent ni une mesure exhaustive du marché du travail, ni un volume de recherche Google,
        ni une prévision de demande future.
      </p>
    </section>
  );
}
