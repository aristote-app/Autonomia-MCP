"use client";

import { useEffect, useMemo, useState } from "react";

function money(value, currency = "EUR") {
  if (value == null) return "TJM à confirmer";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value)) + " / jour";
}

function relativeTime(value) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 2) return "à l’instant";
  if (minutes < 60) return "il y a " + minutes + " min";
  const hours = Math.round(minutes / 60);
  if (hours < 24) return "il y a " + hours + " h";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(value));
}

export default function ConsultantLivePanel({ roleSlug, roleTitle }) {
  const [state, setState] = useState({ status: "loading", profiles: [], generatedAt: null });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/public/consultants?role=" + encodeURIComponent(roleSlug) + "&limit=6", {
      cache: "no-store",
      signal: controller.signal
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data?.ok) throw new Error(data?.error || "feed_unavailable");
        setState({
          status: "ready",
          profiles: Array.isArray(data.profiles) ? data.profiles : [],
          generatedAt: data.generated_at || null
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", profiles: [], generatedAt: null });
      });

    return () => controller.abort();
  }, [roleSlug]);

  const updated = useMemo(() => relativeTime(state.generatedAt), [state.generatedAt]);

  function addConsultant(profile) {
    const detail = {
      id: profile.id,
      initials: profile.initials,
      title: profile.title,
      tjm: profile.tjm,
      currency: profile.currency || "EUR",
      skills: profile.skills || [],
      availability: profile.availability?.label || "Disponibilité à confirmer",
      role_slug: roleSlug,
      role_title: roleTitle
    };

    window.dispatchEvent(new CustomEvent("autonomia-consultant-add", { detail }));
  }

  return (
    <section className="liveConsultants" aria-labelledby={"live-consultants-" + roleSlug}>
      <div className="liveConsultantsHeader">
        <div>
          <div className="livePulseLine">
            <span className="livePulse" aria-hidden="true" />
            <strong>CV CONSULTANTS — MISE À JOUR EN TEMPS RÉEL</strong>
            {updated && <small>{updated}</small>}
          </div>
          <h2 id={"live-consultants-" + roleSlug}>
            Des profils correspondant à {roleTitle}.
          </h2>
        </div>
        <p>
          Profils anonymisés issus du pool Autonomia. Les identités complètes et les sources ne sont jamais
          publiées. La disponibilité n’est annoncée comme confirmée que lorsqu’elle est renseignée dans le cockpit.
        </p>
      </div>

      {state.status === "loading" && (
        <div className="consultantFeedLoading">
          <span />
          <p>Recherche des profils les plus proches de ce métier…</p>
        </div>
      )}

      {state.status === "error" && (
        <div className="consultantFeedEmpty">
          Le flux consultants est momentanément indisponible. La fiche métier reste accessible normalement.
        </div>
      )}

      {state.status === "ready" && state.profiles.length === 0 && (
        <div className="consultantFeedEmpty">
          Aucun profil suffisamment proche n’est remonté pour le moment. Le pool est actualisé automatiquement.
        </div>
      )}

      {state.status === "ready" && state.profiles.length > 0 && (
        <>
          <div className="consultantLiveGrid">
            {state.profiles.map((profile) => (
              <article className="consultantLiveCard" key={profile.id}>
                <div className="consultantCardTop">
                  <div className="consultantInitials" aria-label={"Consultant " + profile.initials}>
                    {profile.initials}
                  </div>
                  <div className={"consultantAvailability " + (profile.availability?.status || "confirm")}>
                    <span />
                    {profile.availability?.label || "Disponibilité à confirmer"}
                  </div>
                </div>

                <h3>{profile.title}</h3>

                <ul className="consultantCvBullets">
                  {(profile.cv_bullets || []).slice(0, 5).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                {(profile.skills || []).length > 0 && (
                  <div className="consultantSkillBlock">
                    <span>COMPÉTENCES</span>
                    <div className="consultantSkillList">
                      {profile.skills.map((skill) => <b key={skill}>{skill}</b>)}
                    </div>
                  </div>
                )}

                <div className="consultantRate">
                  <span>TJM AUTONOMIA</span>
                  <strong>{money(profile.tjm, profile.currency)}</strong>
                </div>

                <button type="button" onClick={() => addConsultant(profile)}>
                  Je veux rencontrer ce consultant
                  <b aria-hidden="true">+</b>
                </button>
              </article>
            ))}
          </div>
          <p className="consultantPricingNote">
            Lorsque le TJM source est renseigné dans le cockpit, le TJM affiché au client intègre automatiquement
            la marge commerciale Autonomia de 20 %. Aucun TJM n’est inventé lorsqu’il manque.
          </p>
        </>
      )}
    </section>
  );
}
