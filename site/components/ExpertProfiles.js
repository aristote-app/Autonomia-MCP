"use client";

import { useEffect, useState } from "react";

const ROLE_BY_PAGE = {
  "consultant-genai": "genai-engineer",
  "consultant-rag": "rag-engineer",
  "consultant-agent-ia": "ai-agent-engineer",
  "ai-project-manager": "ai-project-manager",
  "expert-ia": "genai-engineer"
};

export default function ExpertProfiles({ pageSlug }) {
  const role = ROLE_BY_PAGE[pageSlug];
  const [state, setState] = useState({ status: role ? "loading" : "hidden", profiles: [] });

  useEffect(() => {
    if (!role) return;
    let cancelled = false;

    fetch(`/api/expert-profiles?role=${encodeURIComponent(role)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("feed_unavailable");
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        setState({ status: "done", profiles: payload.profiles || [] });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", profiles: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [role]);

  if (!role) return null;

  return (
    <section className="expertProfilesSection" id="experts-disponibles">
      <div className="expertProfilesIntro">
        <p className="sectionIndex">03 — PROFILS</p>
        <div>
          <h2>Experts correspondant à ce métier.</h2>
          <p>
            Les profils affichés proviennent du vivier Autonomia publiable. La disponibilité et le cadrage de mission sont confirmés avant présentation.
          </p>
        </div>
      </div>

      {state.status === "loading" && (
        <div className="expertProfilesStatus">Recherche des profils correspondants…</div>
      )}

      {state.status === "done" && state.profiles.length > 0 && (
        <div className="expertProfilesGrid">
          {state.profiles.map((profile) => (
            <article key={profile.id} className="expertProfileCard">
              <div className="expertProfileTop">
                <span className="expertInitials">{profile.initials}</span>
                <div>
                  <small>EXPERT AUTONOMIA</small>
                  <h3>{profile.title || "Consultant IA"}</h3>
                </div>
              </div>

              <ul>
                {(profile.cv_bullets || []).slice(0, 5).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              <div className="expertProfileFooter">
                <span>{profile.availability?.label || "Disponibilité à confirmer"}</span>
                {profile.tjm ? <strong>{profile.tjm} € / jour</strong> : <strong>TJM à confirmer</strong>}
              </div>
            </article>
          ))}
        </div>
      )}

      {state.status === "done" && state.profiles.length === 0 && (
        <div className="expertProfilesStatus">
          Aucun profil publiable n’est remonté en temps réel pour ce métier. Autonomia peut lancer une sélection ciblée à partir de votre besoin.
        </div>
      )}

      {state.status === "error" && (
        <div className="expertProfilesStatus">
          Le vivier temps réel est momentanément indisponible. Vous pouvez tout de même transmettre votre besoin pour lancer une sélection ciblée.
        </div>
      )}
    </section>
  );
}
