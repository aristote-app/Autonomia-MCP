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
  return "EXPERT + FORMATION";
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

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "solution_finder_failed");
      }

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
      setError("L’orientation n’a pas pu être générée. Vous pouvez réessayer ou utiliser la fiche besoin.");
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

    const firstName = contact.firstName.trim();
    const company = contact.company.trim();
    const email = contact.email.trim();
    const lastName = contact.lastName.trim();
    const phone = contact.phone.trim();

    if (!firstName || !company || !email) {
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

    const leadId =
      globalThis.crypto?.randomUUID?.() ||
      `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const payload = {
      external_lead_id: leadId,
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: firstName,
      last_name: lastName || null,
      email,
      phone: phone || null,
      company_name: company,
      requested_service: `solution_${result.route || "hybrid"}`,
      message: originalQuery,
      desired_timeline: null,
      company_size: null,
      form_id: "home-solution-finder",
      solution_context: solutionContext,
      ...getClientAttribution(),
      marketing_consent: Boolean(contact.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-24-v1",
      consent_source: "home-solution-finder"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.error === "inbound_integration_not_configured") {
          throw new Error("configuration");
        }
        throw new Error("submission_failed");
      }

      setLeadStatus("sent");
      trackLeadConversion({
        form_id: "home-solution-finder",
        mode: result.route,
        requested_service: payload.requested_service
      });
    } catch (submissionError) {
      setLeadStatus("error");
      setLeadError(
        submissionError?.message === "configuration"
          ? "La liaison avec Autonomia est momentanément indisponible. Réessayez dans quelques instants."
          : "La demande n’a pas pu être envoyée. Merci de réessayer."
      );
    }
  }

  const recommendedRole = result?.roles?.[0] || null;
  const recommendedTraining = result?.trainings?.[0] || null;

  return (
    <div className="solutionFinder" id="solution-finder">
      <div className="solutionFinderTopline">
        <div>
          <span className="solutionFinderPulse" aria-hidden="true" />
          <strong>AUTONOMIA AI MATCH</strong>
        </div>
        <span>VOTRE BESOIN → LA BONNE RÉPONSE</span>
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
          <span>Un métier expert · une formation · un brief transmis</span>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Analyse en cours…" : "Trouver la bonne réponse →"}
          </button>
        </div>
      </form>

      {!result && (
        <div className="solutionExamples" aria-label="Exemples de demandes">
          {EXAMPLES.map((example) => (
            <button type="button" key={example} onClick={() => chooseExample(example)}>
              {example}
            </button>
          ))}
        </div>
      )}

      {error && <p className="solutionFinderError" role="alert">{error}</p>}

      {result && (
        <div className="solutionResult solutionResultSimple">
          <div className="solutionResultIntro">
            <span>{routeLabel(result.route)}</span>
            <h2>La réponse Autonomia à votre besoin.</h2>
            <p>{result.summary}</p>
          </div>

          <div className="solutionAnswerGrid">
            {recommendedRole && (
              <article className="solutionAnswerCard solutionAnswerExpert">
                <small>LE MÉTIER EXPERT</small>
                <h3>{recommendedRole.french_title || recommendedRole.label}</h3>
                {recommendedRole.french_title && recommendedRole.french_title !== recommendedRole.label && (
                  <span>{recommendedRole.label}</span>
                )}
                <p>{recommendedRole.why}</p>
                <Link href={"/metiers-ia/" + recommendedRole.slug}>
                  Voir le métier →
                </Link>
              </article>
            )}

            {recommendedTraining && (
              <article className="solutionAnswerCard solutionAnswerTraining">
                <small>LA FORMATION QUI VA BIEN</small>
                <h3>{recommendedTraining.title}</h3>
                <p>{recommendedTraining.why}</p>
                <Link href={"/formation-ia/" + recommendedTraining.slug}>
                  Voir la formation →
                </Link>
              </article>
            )}
          </div>

          <section className="solutionSend solutionSendSimple">
            {leadStatus === "sent" ? (
              <div className="solutionSendSuccess" role="status">
                <span>✓</span>
                <div>
                  <small>DEMANDE TRANSMISE</small>
                  <strong>Votre demande est bien arrivée chez Autonomia.</strong>
                  <p>Le besoin exprimé et les recommandations AI Match sont joints au lead.</p>
                </div>
              </div>
            ) : (
              <form className="solutionContactForm" onSubmit={submitLead}>
                <div className="solutionSendCopy">
                  <small>ENVOYER MA DEMANDE</small>
                  <h3>Transmettez votre besoin à Autonomia</h3>
                  <p>Nous recevons votre demande avec le métier expert et la formation recommandés.</p>
                </div>

                <div className="solutionContactFields">
                  <label>
                    <span>Prénom *</span>
                    <input
                      required
                      value={contact.firstName}
                      onChange={(e) => setContactField("firstName", e.target.value)}
                      autoComplete="given-name"
                    />
                  </label>
                  <label>
                    <span>Nom</span>
                    <input
                      value={contact.lastName}
                      onChange={(e) => setContactField("lastName", e.target.value)}
                      autoComplete="family-name"
                    />
                  </label>
                  <label>
                    <span>Entreprise *</span>
                    <input
                      required
                      value={contact.company}
                      onChange={(e) => setContactField("company", e.target.value)}
                      autoComplete="organization"
                    />
                  </label>
                  <label>
                    <span>E-mail professionnel *</span>
                    <input
                      required
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContactField("email", e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                  <label className="fullField">
                    <span>Téléphone</span>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContactField("phone", e.target.value)}
                      autoComplete="tel"
                    />
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

                {leadError && <p className="solutionFinderError" role="alert">{leadError}</p>}

                <div className="solutionSendActions">
                  <button type="submit" disabled={leadStatus === "sending"}>
                    {leadStatus === "sending" ? "Envoi…" : "Envoyer ma demande →"}
                  </button>
                  <a href="#fiche-besoin">J’ai besoin d’un cadrage plus détaillé</a>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
