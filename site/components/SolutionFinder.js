"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/clientTracking";

const EXAMPLES = [
  "Automatiser nos comptes rendus de réunion et les actions qui en découlent",
  "Créer un assistant qui répond à partir de nos documents internes",
  "Former nos managers à ChatGPT et à l’IA générative",
  "Automatiser la qualification de nos leads et le reporting commercial"
];

function routeLabel(route) {
  if (route === "academy") return "AUTONOMIA ACADEMY";
  if (route === "experts") return "AUTONOMIA EXPERTS";
  return "EXPERTS + ACADEMY";
}

export default function SolutionFinder() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function search(event) {
    event?.preventDefault();
    const need = query.trim();
    if (need.length < 8) {
      setError("Décrivez votre besoin en quelques mots pour obtenir une orientation.");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);
    trackEvent("solution_finder_start", { query_length: need.length });

    try {
      const response = await fetch("/api/solution-finder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: need })
      });
      if (!response.ok) throw new Error("finder_failed");
      const data = await response.json();
      setResult(data);
      setStatus("done");
      trackEvent("solution_finder_complete", {
        route: data.route,
        roles: data.roles?.length || 0,
        trainings: data.trainings?.length || 0,
        engine: data.engine
      });
    } catch {
      setStatus("error");
      setError("L’orientation n’a pas pu être générée. Réessayez dans quelques instants.");
    }
  }

  function chooseExample(example) {
    setQuery(example);
    setError("");
  }

  function handoff() {
    if (!result) return;
    const context = {
      source: "solution_finder",
      original_query: query.trim(),
      summary: result.summary,
      route: result.route,
      roles: (result.roles || []).map((role) => ({
        id: role.id,
        label: role.label,
        slug: role.slug,
        role: role.role
      })),
      trainings: (result.trainings || []).map((training) => ({
        id: training.id,
        title: training.title,
        slug: training.slug
      })),
      created_at: new Date().toISOString()
    };

    try {
      window.sessionStorage.setItem("autonomia_solution_context", JSON.stringify(context));
    } catch {}

    window.dispatchEvent(new CustomEvent("autonomia-solution-complete", { detail: context }));
    trackEvent("solution_finder_handoff", {
      route: result.route,
      roles: result.roles?.length || 0,
      trainings: result.trainings?.length || 0
    });

    requestAnimationFrame(() => {
      document.querySelector("#fiche-besoin")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="solutionFinder" id="solution-finder">
      <div className="solutionFinderTopline">
        <div><span className="scanLiveDot" /><strong>DIAGNOSTIC IA AUTONOMIA</strong></div>
        <span>VOTRE BESOIN → EXPERTS / FORMATIONS</span>
      </div>

      <form className="solutionFinderForm" onSubmit={search}>
        <label htmlFor="autonomia-solution-query">Décrivez ce que vous voulez résoudre</label>
        <textarea
          id="autonomia-solution-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex. Nous perdons du temps à faire les comptes rendus de réunion, identifier les décisions et relancer les actions..."
          rows={5}
        />
        <div className="solutionFinderSubmit">
          <span>Experts · Academy · dispositif hybride</span>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Analyse en cours…" : "Trouver ma solution →"}
          </button>
        </div>
      </form>

      <div className="solutionExamples" aria-label="Exemples de demandes">
        {EXAMPLES.map((example) => (
          <button type="button" key={example} onClick={() => chooseExample(example)}>
            {example}
          </button>
        ))}
      </div>

      {error && <p className="solutionFinderError" role="alert">{error}</p>}

      {result && (
        <div className="solutionResult">
          <div className="solutionResultIntro">
            <span>{routeLabel(result.route)}</span>
            <h2>Voici comment Autonomia peut traiter votre besoin.</h2>
            <p>{result.summary}</p>
            {result.engine !== "openai" && (
              <small>Orientation automatique basée sur le catalogue Autonomia. Le cadrage final confirme la solution.</small>
            )}
          </div>

          {(result.roles || []).length > 0 && (
            <section className="solutionLane">
              <div className="solutionLaneHeading">
                <span>01</span>
                <div>
                  <small>EXPERTS</small>
                  <h3>Métiers recommandés</h3>
                </div>
              </div>

              <div className="solutionRoleGrid">
                {result.roles.map((role) => (
                  <article className="solutionRoleCard" key={role.id}>
                    <div className="solutionCardTop">
                      <span>{role.label}</span>
                      <Link href={`/metiers-ia/${role.slug}`}>Voir le métier ↗</Link>
                    </div>
                    <p>{role.why}</p>

                    <div className="solutionExpertList">
                      {(role.experts || []).length > 0 ? (
                        role.experts.map((expert, index) => (
                          <div className="solutionExpertCard" key={expert.id}>
                            <div>
                              <span>{expert.initials || String(index + 1).padStart(2, "0")}</span>
                              <strong>Expert {String(index + 1).padStart(2, "0")}</strong>
                            </div>
                            <ul>
                              {(expert.cv_bullets || []).slice(0, 4).map((bullet) => <li key={bullet}>{bullet}</li>)}
                            </ul>
                            <small>{expert.availability?.label || "Disponibilité à confirmer"}</small>
                          </div>
                        ))
                      ) : (
                        <div className="solutionNoExpert">
                          <strong>Métier identifié.</strong>
                          <span>Aucun profil publiable n’est actuellement remonté : Autonomia peut lancer une sélection ciblée.</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(result.trainings || []).length > 0 && (
            <section className="solutionLane academy">
              <div className="solutionLaneHeading">
                <span>02</span>
                <div>
                  <small>ACADEMY</small>
                  <h3>Formations recommandées</h3>
                </div>
              </div>

              <div className="solutionTrainingGrid">
                {result.trainings.map((training) => (
                  <Link href={`/formation-ia/${training.slug}`} className="solutionTrainingCard" key={training.id}>
                    <small>AUTONOMIA ACADEMY</small>
                    <strong>{training.title}</strong>
                    <p>{training.why}</p>
                    <span>Voir la formation →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="solutionHandoff">
            <div>
              <small>VOTRE DEMANDE EST PRÊTE</small>
              <strong>Transmettez cette demande à Autonomia sans tout ressaisir.</strong>
              <p>Le besoin initial, les métiers et les formations proposés seront joints au lead entrant.</p>
            </div>
            <button type="button" onClick={handoff}>Envoyer cette demande à Autonomia →</button>
          </div>
        </div>
      )}
    </div>
  );
}
