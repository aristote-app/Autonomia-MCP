"use client";

import { useEffect, useMemo, useState } from "react";

const PAGE_TO_ROLE = {
  "ai-project-manager": { role: "ai-project-manager", label: "AI Project Manager" },
  "consultant-genai": { role: "genai-engineer", label: "GenAI Engineer" },
  "consultant-rag": { role: "rag-engineer", label: "RAG Engineer" },
  "consultant-agent-ia": { role: "ai-agent-engineer", label: "AI Agent Engineer" },
  "expert-ia": { role: "genai-engineer", label: "Experts IA" },
  "consultant-ia": { role: "ai-project-manager", label: "Consultants IA" },
  "freelance-ia": { role: "genai-engineer", label: "Freelances IA" }
};

export default function LiveExpertProfiles({ pageSlug }) {
  const config = useMemo(() => PAGE_TO_ROLE[pageSlug] || null, [pageSlug]);
  const [state, setState] = useState({ status: "idle", profiles: [] });

  useEffect(() => {
    if (!config) return;
    let cancelled = false;

    async function load() {
      setState({ status: "loading", profiles: [] });
      try {
        const response = await fetch(`/api/consultants?role=${encodeURIComponent(config.role)}&limit=6`, {
          cache: "no-store"
        });
        if (!response.ok) throw new Error("consultants_unavailable");
        const data = await response.json();
        if (!cancelled) setState({ status: "done", profiles: data.profiles || [] });
      } catch {
        if (!cancelled) setState({ status: "error", profiles: [] });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [config]);

  if (!config) return null;

  return (
    <section className="liveExpertSection">
      <div className="liveExpertIntro">
        <p className="sectionIndex">03 — EXPERTS DISPONIBLES</p>
        <div>
          <h2>Experts correspondant au métier {config.label}.</h2>
          <p>
            Les cartes ci-dessous proviennent du vivier consultants Autonomia. Une disponibilité n’est affichée
            comme confirmée que lorsqu’elle est réellement renseignée dans le cockpit.
          </p>
        </div>
      </div>

      {state.status === "loading" ? (
        <div className="liveExpertLoading">Recherche des profils correspondants…</div>
      ) : state.profiles.length > 0 ? (
        <div className="liveExpertGrid">
          {state.profiles.map((expert, index) => (
            <article className="liveExpertCard" key={expert.id}>
              <div className="liveExpertIdentity">
                <span>{expert.initials || String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>EXPERT {String(index + 1).padStart(2, "0")}</small>
                  <strong>{expert.title || config.label}</strong>
                </div>
              </div>
              <ul>
                {(expert.cv_bullets || []).slice(0, 5).map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
              <div className="liveExpertMeta">
                <span>{expert.availability?.label || "Disponibilité à confirmer"}</span>
                {expert.tjm ? <span>TJM Autonomia : {expert.tjm} {expert.currency || "EUR"}</span> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="liveExpertEmpty">
          <strong>Aucun profil publiable ne correspond actuellement à ce métier.</strong>
          <p>Le besoin peut tout de même être transmis : Autonomia lancera une sélection ciblée plutôt que d’afficher un profil inventé.</p>
        </div>
      )}
    </section>
  );
}
