"use client";

import { useState } from "react";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";
import { getClientAttribution } from "@/lib/clientAttribution";
import PrivacyNotice from "@/components/PrivacyNotice";

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export default function QuickContactForm({
  mode = "contact",
  formId = "quick-contact",
  requestedService = "contact-autonomia",
  subjectLabel = ""
}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    marketingConsent: false
  });

  const set = (key, value) => setData((current) => ({ ...current, [key]: value }));

  async function submit(event) {
    event.preventDefault();
    setError("");

    const phone = data.phone.replace(/\D/g, "");

    if (!data.firstName || !data.lastName || !data.company || !data.email || !phone || !data.message.trim()) {
      setError("Merci de renseigner tous les champs.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Le numéro de téléphone doit comporter exactement 10 chiffres.");
      return;
    }

    setStatus("sending");
    trackEvent("form_submit_attempt", { form_id: formId, mode });

    const pageTitle = typeof document !== "undefined" ? document.title : "";
    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: new Date().toISOString(),
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone,
      company_name: data.company,
      requested_service: requestedService,
      message: [subjectLabel ? `Sujet : ${subjectLabel}` : null, data.message.trim()].filter(Boolean).join(" · "),
      desired_timeline: null,
      company_size: null,
      ...getClientAttribution(),
      form_id: formId,
      landing_page_topic: pageTitle || subjectLabel || requestedService,
      marketing_consent: Boolean(data.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-20-v1",
      consent_source: formId
    };

    try {
      const response = await fetchWithTimeout("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("submission_failed");

      setStatus("sent");
      trackLeadConversion({
        form_id: formId,
        mode,
        requested_service: requestedService
      });
    } catch {
      setStatus("error");
      setError("Le formulaire n’a pas pu être envoyé. Merci de réessayer.");
    }
  }

  if (status === "sent") {
    return (
      <div className="quickContactSuccess" role="status">
        <span>✓</span>
        <div>
          <strong>Demande reçue.</strong>
          <p>Votre message a bien été transmis à Autonomia.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="quickContactForm" onSubmit={submit}>
      {subjectLabel && (
        <div className="quickContactSubject">
          <span>VOTRE DEMANDE</span>
          <strong>{subjectLabel}</strong>
        </div>
      )}

      <div className="quickContactGrid">
        <label>
          <span>Prénom *</span>
          <input required value={data.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
        </label>
        <label>
          <span>Nom *</span>
          <input required value={data.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
        </label>
        <label>
          <span>Entreprise *</span>
          <input required value={data.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
        </label>
        <label>
          <span>E-mail professionnel *</span>
          <input required type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </label>
        <label className="quickContactFull">
          <span>Téléphone *</span>
          <input
            required
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            minLength={10}
            maxLength={10}
            value={data.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            autoComplete="tel"
            placeholder="0612345678"
          />
        </label>
        <label className="quickContactFull">
          <span>Votre demande *</span>
          <textarea
            required
            rows={5}
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Décrivez votre besoin, votre contexte ou la formation qui vous intéresse."
          />
        </label>
      </div>

      <label className="quickContactConsent">
        <input
          type="checkbox"
          checked={data.marketingConsent}
          onChange={(e) => set("marketingConsent", e.target.checked)}
        />
        <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
      </label>

      <PrivacyNotice />

      {error && <p className="quickContactError" role="alert">{error}</p>}

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Envoi…" : "Envoyer ma demande →"}
      </button>
    </form>
  );
}
