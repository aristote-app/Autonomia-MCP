"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";
import { getClientAttribution } from "@/lib/clientAttribution";

const EXAMPLES = [
  "Automatiser nos comptes rendus de réunion et envoyer les actions aux équipes",
  "Créer un assistant qui répond à partir de nos documents internes",
  "Former nos managers à ChatGPT et à l’IA générative",
  "Automatiser la qualification de nos leads et notre reporting commercial"
];

function routeLabel(route) {
  if (route === "academy") return "AUTONOMIA ACADEMY";
  if (route === "experts") return "AUTONOMIA EXPERTS";
  return "EXPERTS + ACADEMY";
}

export default function SolutionFinder() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [leadStatus, setLeadStatus] = useState("idle");
  const [leadError, setLeadError] = useState("");
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    marketingConsent: false
  });

  const setContactField = (key, value) => {
    setContact((current) => ({ ...current, [key]: value }));
  };

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
    setLeadStatus("idle");
    setLeadError("");

    trackEvent("solution_finder_start", {
      form_id: "home-solution-finder",
      query_length: need.length
    });

    try {
      const response = await fetch("/api/solution-finder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: need })
      });

      const data = await response.json();
      if (!response.ok || !data?.ok) throw new Error(data?.error || "solution_finder_failed");

      setResult(data);
      setStatus("ready");

      trackEvent("solution_finder_complete", {
        form_id: "home-solution-finder",
        route: data.route,
        roles_count: data.roles?.length || 0,
        trainings_count: data.trainings?.length || 0,
        engine: data.engine
      });
    } catch {
      setStatus("error");
      setError("L’orientation n’a pas pu être générée. Vous pouvez réessayer ou utiliser le diagnostic détaillé.");
    }
  }

  function chooseExample(example) {
    setQuery(example);
    setError("");
    trackEvent("solution_finder_example", {
      form_id: "home-solution-finder",
      example
    });
  }

  async function submitLead(event) {
    event.preventDefault();
    setLeadError("");

    if (!result) return;
    if (!contact.firstName || !contact.company || !contact.email) {
      setLeadError("Merci de renseigner votre prénom, votre entreprise et votre e-mail professionnel.");
      return;
    }

    setLeadStatus("sending");

    const originalQuery = result.query || query.trim();

    const solutionContext = {
      source: "solution_finder",
      original_query: originalQuery,
      summary: result.summary,
      route: result.route,
      recommended_roles: (result.roles || []).map((role) => ({
        id: role.id,
        label: role.label,
        slug: role.slug
      })),
      recommended_training: (result.trainings || []).map((training) => ({
        id: training.id,
        title: training.title,
        slug: training.slug
      })),
      engine: result.engine,
      generated_at: result.generated_at || null
    };

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: contact.firstName,
      last_name: contact.lastName || null,
      email: contact.email,
      phone: contact.phone || null,
      company_name: contact.company,
      requested_service: `solution_${result.route || "hybrid"}`,
      message: originalQuery,
      desired_timeline: null,
      company_size: null,
      form_id: "home-solution-finder",
      solution_context: solutionContext,
      ...getClientAttribution(),
      marketing_consent: Boolean(contact.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: "home-solution-finder"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("submission_failed");

      setLeadStatus("sent");
      trackLeadConversion({
        form_id: "home-solution-finder",
        mode: result.route,
        requested_service: payload.requested_service
      });
    } catch {
      setLeadStatus("error");
      setLeadError("La demande n’a pas pu être envoyée. Merci de réessayer.");
    }
  }

  return (
    <div className="solutionFinder" id="solution-finder">
      <div className="solutionFinderTopline">
        <div>
          <span className="solutionFinderPulse" aria-hidden="true" />
          <strong>AUTONOMIA AI MATCH</strong>
        </div>
        <span>VOTRE BESOIN → LES BONS LEVIERS</span>
      </div>

      <form className="solutionFinderForm" onSubmit={search}>
        <label htmlFor="autonomia-solution-query">Décrivez ce que vous voulez résoudre</label>
        <textarea
          id="autonomia-solution-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex. Nous perdons du temps à faire les comptes rendus de réunion, identifier les décisions et relancer les actions…"
          rows={5}
        />
        <div className="solutionFinderSubmit">
          <span>Experts · formations · dispositif hybride</span>
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
              <small>
                Première orientation issue du catalogue Autonomia. Le cadrage humain confirme ensuite le besoin et les compétences.
              </small>
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
                      <div>
                        <small>{role.french_title || "MÉTIER IA"}</small>
                        <strong>{role.label}</strong>
                      </div>
                      <Link href={"/metiers-ia/" + role.slug}>Voir le métier ↗</Link>
                    </div>
                    <p>{role.why}</p>

                    <div className="solutionExpertList">
                      {(role.experts || []).length > 0 ? (
                        role.experts.map((expert, index) => (
                          <div className="solutionExpertCard" key={expert.id}>
                            <div className="solutionExpertIdentity">
                              <span>{expert.initials || String(index + 1).padStart(2, "0")}</span>
                              <div>
                                <small>EXPERT {String(index + 1).padStart(2, "0")}</small>
                                <strong>{expert.title || role.label}</strong>
                              </div>
                            </div>
                            <ul>
                              {(expert.cv_bullets || []).slice(0, 4).map((bullet, bulletIndex) => (
                                <li key={bulletIndex}>{bullet}</li>
                              ))}
                            </ul>
                            <div className="solutionExpertMeta">
                              <span>{expert.availability?.label || "Disponibilité à confirmer"}</span>
                              <Link href={"/metiers-ia/" + role.slug}>Voir les profils →</Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="solutionNoExpert">
                          <strong>Métier identifié.</strong>
                          <span>
                            Aucun profil publiable n’est remonté actuellement. Autonomia peut lancer une sélection ciblée.
                          </span>
                          <Link href={"/metiers-ia/" + role.slug}>Voir la fiche métier →</Link>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(result.trainings || []).length > 0 && (
            <section className="solutionLane solutionAcademyLane">
              <div className="solutionLaneHeading">
                <span>02</span>
                <div>
                  <small>ACADEMY</small>
                  <h3>Formations recommandées</h3>
                </div>
              </div>

              <div className="solutionTrainingGrid">
                {result.trainings.map((training) => (
                  <Link
                    href={"/formation-ia/" + training.slug}
                    className="solutionTrainingCard"
                    key={training.id}
                  >
                    <small>AUTONOMIA ACADEMY</small>
                    <strong>{training.title}</strong>
                    <p>{training.why}</p>
                    <div>
                      {training.standard_days ? <span>{training.standard_days} j standard</span> : <span>Parcours adaptable</span>}
                      <b>Voir la formation →</b>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="solutionSend">
            {leadStatus === "sent" ? (
              <div className="solutionSendSuccess" role="status">
                <span>✓</span>
                <div>
                  <small>DEMANDE TRANSMISE</small>
                  <strong>Votre besoin et les recommandations sont arrivés chez Autonomia.</strong>
                  <p>Vous n’avez rien à ressaisir : le brief original, les métiers et les formations proposés sont joints au lead.</p>
                </div>
              </div>
            ) : (
              <form className="solutionContactForm" onSubmit={submitLead}>
                <div className="solutionSendCopy">
                  <small>ENVOYER CE BRIEF</small>
                  <h3>Vous voulez qu’Autonomia reprenne cette demande ?</h3>
                  <p>Ajoutez vos coordonnées. Le texte saisi et cette orientation sont transmis ensemble.</p>
                </div>

                <div className="solutionContactFields">
                  <label>
                    <span>Prénom *</span>
                    <input value={contact.firstName} onChange={(e) => setContactField("firstName", e.target.value)} autoComplete="given-name" />
                  </label>
                  <label>
                    <span>Nom</span>
                    <input value={contact.lastName} onChange={(e) => setContactField("lastName", e.target.value)} autoComplete="family-name" />
                  </label>
                  <label>
                    <span>Entreprise *</span>
                    <input value={contact.company} onChange={(e) => setContactField("company", e.target.value)} autoComplete="organization" />
                  </label>
                  <label>
                    <span>E-mail professionnel *</span>
                    <input type="email" value={contact.email} onChange={(e) => setContactField("email", e.target.value)} autoComplete="email" />
                  </label>
                  <label className="fullField">
                    <span>Téléphone</span>
                    <input type="tel" value={contact.phone} onChange={(e) => setContactField("phone", e.target.value)} autoComplete="tel" />
                  </label>
                </div>

                <label className="solutionConsent">
                  <input
                    type="checkbox"
                    checked={contact.marketingConsent}
                    onChange={(e) => setContactField("marketingConsent", e.target.checked)}
                  />
                  <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
                </label>
                <p className="solutionPrivacy">
                  Les informations servent à analyser votre demande et à vous recontacter. Le consentement marketing est facultatif.
                </p>

                {leadError && <p className="solutionFinderError" role="alert">{leadError}</p>}

                <div className="solutionSendActions">
                  <button type="submit" disabled={leadStatus === "sending"}>
                    {leadStatus === "sending" ? "Envoi de la demande…" : "Envoyer ma demande à Autonomia →"}
                  </button>
                  <a href="#fiche-besoin">Ajouter plus de contexte avec la fiche besoin</a>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
