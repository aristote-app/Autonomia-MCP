"use client";

import Link from "next/link";
import { useState } from "react";

const EXAMPLES = [
  "Automatiser les comptes rendus de réunion et envoyer les actions aux équipes",
  "Créer un assistant qui répond à partir de nos documents internes",
  "Qualifier automatiquement nos leads entrants",
  "Former nos managers à l'IA générative",
  "Déployer Microsoft Copilot dans plusieurs équipes"
];

function getAttribution() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key);

  return {
    landing_page_url: url.href,
    landing_page_topic: window.location.pathname,
    referrer_url: document.referrer || null,
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    campaign_id: get("campaign_id") || get("meta_campaign_id"),
    adset_id: get("adset_id"),
    ad_id: get("ad_id"),
    creative_id: get("creative_id"),
    gclid: get("gclid"),
    fbclid: get("fbclid")
  };
}

export default function AutonomiaSolutionFinder() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showLead, setShowLead] = useState(false);
  const [leadStatus, setLeadStatus] = useState("idle");
  const [leadError, setLeadError] = useState("");
  const [lead, setLead] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    marketingConsent: false
  });

  async function search(event) {
    event?.preventDefault();
    const need = query.trim();
    if (need.length < 12) {
      setError("Décrivez votre besoin en une phrase ou deux pour obtenir une orientation utile.");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);
    setShowLead(false);

    try {
      const response = await fetch("/api/solution-finder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: need })
      });

      if (!response.ok) throw new Error("solution_finder_failed");
      const payload = await response.json();
      setResult(payload);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("L’analyse n’a pas pu être générée. Merci de réessayer.");
    }
  }

  async function sendLead(event) {
    event.preventDefault();
    setLeadError("");

    if (!lead.firstName || !lead.company || !lead.email) {
      setLeadError("Merci de renseigner votre prénom, votre entreprise et votre e-mail.");
      return;
    }

    setLeadStatus("sending");

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_solution_finder",
      received_at: new Date().toISOString(),
      first_name: lead.firstName,
      last_name: lead.lastName || null,
      email: lead.email,
      phone: lead.phone || null,
      company_name: lead.company,
      requested_service: result?.route === "academy" ? "academy" : result?.route === "experts" ? "experts" : "hybrid",
      message: query.trim(),
      desired_timeline: null,
      company_size: null,
      form_id: "hero-solution-finder",
      solution_context: result
        ? {
            summary: result.summary,
            route: result.route,
            roles: result.roles?.map((item) => item.slug) || [],
            trainings: result.trainings?.map((item) => item.slug) || [],
            expert_ids: (result.experts || []).map((item) => item.id),
            engine: result.engine || null
          }
        : null,
      ...getAttribution(),
      marketing_consent: Boolean(lead.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: "hero-solution-finder"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("lead_failed");
      setLeadStatus("sent");
    } catch {
      setLeadStatus("error");
      setLeadError("La demande n’a pas pu être envoyée. Merci de réessayer.");
    }
  }

  const routeLabel =
    result?.route === "academy"
      ? "ACADEMY"
      : result?.route === "experts"
        ? "EXPERTS"
        : "EXPERTS + ACADEMY";

  return (
    <div className="solutionFinder" id="solution">
      <div className="solutionFinderTop">
        <div>
          <span className="scanLiveDot" />
          <strong>AUTONOMIA / AI MATCH</strong>
        </div>
        <span>LANGAGE NATUREL</span>
      </div>

      <div className="solutionFinderBody">
        <div className="solutionFinderIntro">
          <p>Décrivez ce que vous voulez résoudre.</p>
          <h2>L’IA vous propose le bon dispositif Autonomia.</h2>
        </div>

        <form className="solutionQueryForm" onSubmit={search}>
          <label htmlFor="solution-query">Votre besoin</label>
          <textarea
            id="solution-query"
            rows={5}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex. Nous voulons automatiser les comptes rendus de réunion, identifier les décisions et envoyer les actions dans Teams."
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Analyse en cours…" : "Trouver ma solution →"}
          </button>
        </form>

        <div className="solutionExamples" aria-label="Exemples de demandes">
          {EXAMPLES.map((example) => (
            <button key={example} type="button" onClick={() => setQuery(example)}>
              {example}
            </button>
          ))}
        </div>

        {error && <p className="solutionError" role="alert">{error}</p>}

        {result && (
          <div className="solutionResult">
            <div className="solutionResultHeader">
              <span>{routeLabel}</span>
              <h3>{result.summary}</h3>
              <p>{result.explanation}</p>
            </div>

            {result.roles?.length > 0 && (
              <section className="solutionBlock">
                <div className="solutionBlockTitle">
                  <span>01</span>
                  <strong>Métiers recommandés</strong>
                </div>
                <div className="solutionRoleGrid">
                  {result.roles.map((role) => (
                    <Link key={role.slug} href={role.href} className="solutionRoleCard">
                      <small>AUTONOMIA EXPERTS</small>
                      <h4>{role.name}</h4>
                      <p>{role.why}</p>
                      <span>Voir le métier →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {result.experts?.length > 0 && (
              <section className="solutionBlock">
                <div className="solutionBlockTitle">
                  <span>02</span>
                  <strong>Experts correspondant au besoin</strong>
                </div>
                <div className="solutionExpertGrid">
                  {result.experts.map((expert) => (
                    <article key={expert.id} className="solutionExpertCard">
                      <div className="solutionExpertHead">
                        <span>{expert.initials}</span>
                        <div>
                          <small>{expert.role_name || "EXPERT IA"}</small>
                          <h4>{expert.title}</h4>
                        </div>
                      </div>
                      <ul>
                        {(expert.cv_bullets || []).slice(0, 5).map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      <div className="solutionExpertMeta">
                        <span>{expert.availability?.label || "Disponibilité à confirmer"}</span>
                        {expert.tjm ? <strong>{expert.tjm} € / jour</strong> : <strong>TJM à confirmer</strong>}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {result.roles?.length > 0 && result.experts?.length === 0 && (
              <p className="solutionEmptyExpert">
                Les métiers ont été identifiés, mais aucun profil publiable correspondant n’est remonté du vivier en temps réel. Autonomia peut lancer une sélection ciblée.
              </p>
            )}

            {result.trainings?.length > 0 && (
              <section className="solutionBlock">
                <div className="solutionBlockTitle">
                  <span>{result.experts?.length > 0 ? "03" : "02"}</span>
                  <strong>Formations Autonomia Academy</strong>
                </div>
                <div className="solutionTrainingGrid">
                  {result.trainings.map((training) => (
                    <Link key={training.slug} href={training.href} className="solutionTrainingCard">
                      <small>AUTONOMIA ACADEMY</small>
                      <h4>{training.name}</h4>
                      <p>{training.why}</p>
                      <span>Voir la formation →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className="solutionHandoff">
              <div>
                <small>VOTRE BRIEF EST PRÊT</small>
                <strong>Envoyez cette demande à Autonomia sans tout ressaisir.</strong>
              </div>
              <button type="button" onClick={() => setShowLead((value) => !value)}>
                {showLead ? "Fermer" : "Envoyer ma demande →"}
              </button>
            </div>

            {showLead && leadStatus !== "sent" && (
              <form className="solutionLeadForm" onSubmit={sendLead}>
                <label>
                  <span>Prénom *</span>
                  <input value={lead.firstName} onChange={(e) => setLead((v) => ({ ...v, firstName: e.target.value }))} />
                </label>
                <label>
                  <span>Nom</span>
                  <input value={lead.lastName} onChange={(e) => setLead((v) => ({ ...v, lastName: e.target.value }))} />
                </label>
                <label>
                  <span>Entreprise *</span>
                  <input value={lead.company} onChange={(e) => setLead((v) => ({ ...v, company: e.target.value }))} />
                </label>
                <label>
                  <span>E-mail professionnel *</span>
                  <input type="email" value={lead.email} onChange={(e) => setLead((v) => ({ ...v, email: e.target.value }))} />
                </label>
                <label className="solutionLeadFull">
                  <span>Téléphone</span>
                  <input type="tel" value={lead.phone} onChange={(e) => setLead((v) => ({ ...v, phone: e.target.value }))} />
                </label>
                <label className="solutionConsent solutionLeadFull">
                  <input
                    type="checkbox"
                    checked={lead.marketingConsent}
                    onChange={(e) => setLead((v) => ({ ...v, marketingConsent: e.target.checked }))}
                  />
                  <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
                </label>
                {leadError && <p className="solutionError solutionLeadFull">{leadError}</p>}
                <button className="solutionLeadSubmit solutionLeadFull" type="submit" disabled={leadStatus === "sending"}>
                  {leadStatus === "sending" ? "Envoi…" : "Transmettre le brief à Autonomia →"}
                </button>
              </form>
            )}

            {leadStatus === "sent" && (
              <div className="solutionSuccess" role="status">
                <strong>Demande transmise.</strong>
                <span>Le brief et les recommandations sont attachés au lead entrant.</span>
              </div>
            )}

            <p className="solutionDisclaimer">
              Première orientation automatisée. Les profils affichés proviennent du vivier publiable Autonomia ; le cadrage final confirme la pertinence, la disponibilité et le dispositif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
