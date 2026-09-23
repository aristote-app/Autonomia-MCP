"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function ObservatoryExplorer({ groups, topics }) {
  const [group, setGroup] = useState(groups[0]?.id || "metiers");
  const [activeSlug, setActiveSlug] = useState(topics[0]?.slug || null);

  const visible = useMemo(() => topics.filter((topic) => topic.group === group), [topics, group]);
  const active = topics.find((topic) => topic.slug === activeSlug) || visible[0] || topics[0];

  function selectTopic(slug) {
    setActiveSlug(slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("besoin", slug);
      window.history.replaceState({}, "", url.pathname + "?" + url.searchParams.toString());
    }
  }

  return (
    <section className="obsExplorer">
      <div className="obsTabs" role="tablist" aria-label="Explorer par catégorie">
        {groups.map((item) => (
          <button
            key={item.id}
            type="button"
            className={group === item.id ? "active" : ""}
            onClick={() => {
              setGroup(item.id);
              const first = topics.find((topic) => topic.group === item.id);
              if (first) setActiveSlug(first.slug);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="obsExplorerLayout">
        <div className="obsTopicList">
          {visible.map((topic) => (
            <button
              type="button"
              key={topic.slug}
              className={active?.slug === topic.slug ? "active" : ""}
              onClick={() => selectTopic(topic.slug)}
            >
              <strong>{topic.title}</strong>
              <span>{topic.short}</span>
            </button>
          ))}
        </div>

        {active && (
          <div className="obsTopicPreview">
            <p className="eyebrow">APERÇU DU BESOIN</p>
            <h2>{active.headline}</h2>
            <p>{active.intro}</p>

            <div className="obsMiniModules">
              {active.modules.slice(0, 6).map(([title, today, transform, result], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p><b>Aujourd’hui.</b> {today}</p>
                  <p><b>Avec Autonomia.</b> {transform}</p>
                  <small>{result}</small>
                </article>
              ))}
            </div>

            <div className="obsPreviewActions">
              <Link className="primaryButton" href={active.href || ("/observatoire-ia/" + active.slug)}>
                Ouvrir la page complète
              </Link>
              <Link className="secondaryButton" href="/#diagnostic-ia">Décrire mon besoin</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
