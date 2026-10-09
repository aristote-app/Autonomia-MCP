"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "autonomia_cookie_consent";
const OPEN_PREFERENCES_EVENT = "autonomia:cookie-preferences";

function valuesFor(mode) {
  return {
    analytics: mode === "granted" || mode === "analytics",
    marketing: mode === "granted" || mode === "marketing"
  };
}

function applyGoogleConsent(mode) {
  const { analytics, marketing } = valuesFor(mode);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  });
}

export default function ConsentAnalytics() {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const [marketingChoice, setMarketingChoice] = useState(false);

  useEffect(() => {
    let saved = null;
    try { saved = window.localStorage.getItem(CONSENT_KEY); } catch {}
    const mode = ["granted", "denied", "analytics", "marketing"].includes(saved) ? saved : null;
    applyGoogleConsent(mode);
    setConsent(mode);
    setAnalyticsChoice(valuesFor(mode).analytics);
    setMarketingChoice(valuesFor(mode).marketing);
    setReady(true);

    function reopen() {
      let stored = null;
      try { stored = window.localStorage.getItem(CONSENT_KEY); } catch {}
      const current = ["granted", "denied", "analytics", "marketing"].includes(stored) ? stored : null;
      setAnalyticsChoice(valuesFor(current).analytics);
      setMarketingChoice(valuesFor(current).marketing);
      setPreferencesOpen(true);
    }
    window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
  }, []);

  function choose(mode) {
    try { window.localStorage.setItem(CONSENT_KEY, mode); } catch {}
    setConsent(mode);
    setPreferencesOpen(false);
    applyGoogleConsent(mode);
    // Revocation of already-loaded tracking scripts takes effect cleanly on a new page load.
    if (consent && (valuesFor(consent).analytics && !valuesFor(mode).analytics ||
      valuesFor(consent).marketing && !valuesFor(mode).marketing)) {
      window.location.reload();
    }
  }

  const { analytics, marketing } = valuesFor(consent);
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleId = ga4 || ads;

  return (
    <>
      {ready && (analytics || marketing) && googleId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`} strategy="afterInteractive" />
          <Script id="autonomia-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){dataLayer.push(arguments);};
              gtag('js', new Date());
              ${analytics && ga4 ? `gtag('config', '${ga4}', { send_page_view: true });` : ""}
              ${marketing && ads ? `gtag('config', '${ads}');` : ""}
            `}
          </Script>
        </>
      )}
      {ready && marketing && meta && (
        <Script id="autonomia-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${meta}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {ready && (consent === null || preferencesOpen) && (
        <aside className="consentBannerV2" aria-label="Gestion des cookies" role="region">
          <div className="consentBannerV2Content">
            <span className="consentBannerV2Icon" aria-hidden="true">✳</span>
            <div className="consentBannerV2Text">
              <strong>Votre confidentialité compte.</strong>
              <p>Nous utilisons des cookies facultatifs pour les statistiques et la publicité. À vous de choisir. <Link href="/politique-de-confidentialite">En savoir plus</Link></p>
            </div>
          </div>
          {preferencesOpen ? (
            <div className="consentBannerV2Preferences">
              <label><input type="checkbox" checked={analyticsChoice} onChange={e => setAnalyticsChoice(e.target.checked)} /> Statistiques</label>
              <label><input type="checkbox" checked={marketingChoice} onChange={e => setMarketingChoice(e.target.checked)} /> Publicité</label>
              <button type="button" className="consentPrimaryV2" onClick={() => choose(marketingChoice && analyticsChoice ? "granted" : marketingChoice ? "marketing" : analyticsChoice ? "analytics" : "denied")}>Enregistrer</button>
            </div>
          ) : (
            <div className="consentBannerV2Actions">
              <button type="button" onClick={() => choose("denied")}>Tout refuser</button>
              <button type="button" onClick={() => setPreferencesOpen(true)}>Personnaliser</button>
              <button type="button" className="consentPrimaryV2" onClick={() => choose("granted")}>Tout accepter</button>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
