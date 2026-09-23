"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "autonomia_consultant_selection_v1";

function money(value, currency = "EUR") {
  if (value == null) return "TJM à confirmer";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value)) + " / j";
}

function getStored() {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function attribution() {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key);
  let firstTouch = null;
  let history = [];

  try {
    firstTouch = JSON.parse(window.localStorage.getItem("autonomia_first_touch") || "null");
    history = JSON.parse(window.localStorage.getItem("autonomia_attribution_history") || "[]");
  } catch {}

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
    fbclid: get("fbclid"),
    first_touch: firstTouch,
    attribution_history: history
  };
}

export default function ConsultantSelectionDrawer() {
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    need: "",
    marketingConsent: false
  });

  useEffect(() => {
    setSelected(getStored());

    function add(event) {
      const profile = event.detail;
      if (!profile?.id) return;

      setSelected((current) => {
        const exists = current.some((item) => item.id === profile.id);
        const next = exists ? current : [...current, profile];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
      setOpen(true);
    }

    window.addEventListener("autonomia-consultant-add", add);
    return () => window.removeEventListener("autonomia-consultant-add", add);
  }, []);

  const roles = useMemo(() => {
    return [...new Set(selected.map((item) => item.role_title).filter(Boolean))];
  }, [selected]);

  useEffect(() => {
    if (!roles.length) return;
    setContact((current) => {
      if (current.need.trim()) return current;
      return {
        ...current,
        need: "Postes / compétences recherchés :\n- " + roles.join("\n- ")
      };
    });
  }, [roles]);

  function persist(next) {
    setSelected(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function remove(id) {
    persist(selected.filter((item) => item.id !== id));
  }

  function setField(key, value) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!selected.length) {
      setError("Ajoutez au moins un consultant.");
      return;
    }
    if (!contact.firstName || !contact.company || !contact.email) {
      setError("Merci de renseigner votre prénom, votre entreprise et votre e-mail professionnel.");
      return;
    }

    setStatus("sending");

    const selectionText = selected.map((item, index) => [
      "Consultant " + (index + 1) + " : " + item.initials,
      "Profil : " + item.title,
      "Métier consulté : " + (item.role_title || "IA"),
      "TJM Autonomia : " + money(item.tjm, item.currency),
      "Disponibilité : " + (item.availability || "À confirmer"),
      "Compétences : " + (item.skills || []).join(", "),
      "Identifiant cockpit : " + item.id
    ].join("\n")).join("\n\n");

    const message = [
      "LEAD AJOUT CONSULTANT",
      "",
      "BESOIN EXPRIMÉ",
      contact.need || "À préciser",
      "",
      "CONSULTANTS À RENCONTRER",
      selectionText
    ].join("\n");

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
      requested_service: "LEAD AJOUT CONSULTANT",
      message,
      form_id: "consultant-selection-drawer",
      selected_consultants: selected.map((item) => ({
        id: item.id,
        initials: item.initials,
        title: item.title,
        role_title: item.role_title,
        tjm_autonomia: item.tjm,
        currency: item.currency,
        skills: item.skills
      })),
      requested_roles: roles,
      ...attribution(),
      marketing_consent: Boolean(contact.marketingConsent),
      consent_timestamp: new Date().toISOString(),
      privacy_notice_version: "2026-09-23-v1",
      consent_source: "consultant-selection-drawer"
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("lead_rejected");
      setStatus("sent");
      persist([]);
    } catch {
      setStatus("error");
      setError("La demande n’a pas pu être transmise. Merci de réessayer.");
    }
  }

  if (!selected.length && status !== "sent") return null;

  if (status === "sent") {
    return (
      <aside className="consultantDrawer open" aria-live="polite">
        <button className="consultantDrawerClose" type="button" onClick={() => { setStatus("idle"); setOpen(false); }}>×</button>
        <div className="consultantDrawerSuccess">
          <span>✓</span>
          <h3>Votre sélection a été transmise.</h3>
          <p>Le lead a été envoyé au cockpit Autonomia sous le type <b>LEAD AJOUT CONSULTANT</b>.</p>
        </div>
      </aside>
    );
  }

  return (
    <>
      {!open && (
        <button className="consultantSelectionBubble" type="button" onClick={() => setOpen(true)}>
          <span>{selected.length}</span>
          consultant{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""}
        </button>
      )}

      <aside className={open ? "consultantDrawer open" : "consultantDrawer"} aria-label="Consultants à rencontrer">
        <div className="consultantDrawerHead">
          <div>
            <p>VOTRE SÉLECTION</p>
            <h2>{selected.length} consultant{selected.length > 1 ? "s" : ""} à rencontrer</h2>
          </div>
          <button className="consultantDrawerClose" type="button" onClick={() => setOpen(false)} aria-label="Fermer">×</button>
        </div>

        <div className="consultantDrawerHint">
          <strong>Continuez votre navigation.</strong>
          <p>
            Vous pouvez fermer cet encart, consulter d’autres métiers et ajouter autant de profils que vous le souhaitez.
            Votre sélection reste enregistrée.
          </p>
        </div>

        <div className="consultantDrawerList">
          {selected.map((item) => (
            <article key={item.id}>
              <div className="drawerInitials">{item.initials}</div>
              <div>
                <strong>{item.title}</strong>
                <span>{item.role_title}</span>
                <small>{money(item.tjm, item.currency)}</small>
              </div>
              <button type="button" onClick={() => remove(item.id)} aria-label="Retirer ce consultant">×</button>
            </article>
          ))}
        </div>

        <form className="consultantDrawerForm" onSubmit={submit}>
          <h3>Votre besoin</h3>
          <label>
            <span>Postes / compétences que vous recherchez actuellement</span>
            <textarea
              rows="5"
              value={contact.need}
              onChange={(e) => setField("need", e.target.value)}
              placeholder="Ex. 1 RAG Engineer pour un projet documentaire + 1 AI Project Manager..."
            />
          </label>

          <h3>Vos coordonnées</h3>
          <div className="drawerFieldGrid">
            <label><span>Prénom *</span><input value={contact.firstName} onChange={(e) => setField("firstName", e.target.value)} autoComplete="given-name" /></label>
            <label><span>Nom</span><input value={contact.lastName} onChange={(e) => setField("lastName", e.target.value)} autoComplete="family-name" /></label>
            <label><span>Entreprise *</span><input value={contact.company} onChange={(e) => setField("company", e.target.value)} autoComplete="organization" /></label>
            <label><span>E-mail professionnel *</span><input type="email" value={contact.email} onChange={(e) => setField("email", e.target.value)} autoComplete="email" /></label>
            <label className="drawerFull"><span>Téléphone</span><input type="tel" value={contact.phone} onChange={(e) => setField("phone", e.target.value)} autoComplete="tel" /></label>
          </div>

          <label className="consentLine drawerConsent">
            <input
              type="checkbox"
              checked={contact.marketingConsent}
              onChange={(e) => setField("marketingConsent", e.target.checked)}
            />
            <span>J’accepte de recevoir des informations commerciales d’Autonomia. Facultatif.</span>
          </label>

          {error && <p className="formError" role="alert">{error}</p>}

          <button className="consultantDrawerSubmit" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Envoi…" : "Envoyer ma demande de rencontre →"}
          </button>
          <p className="drawerPrivacy">
            Les coordonnées sont utilisées pour traiter votre demande de mise en relation. Les identités complètes
            des consultants ne sont pas publiées sur le site.
          </p>
        </form>
      </aside>
    </>
  );
}
