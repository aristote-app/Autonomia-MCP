"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "autonomia_cookie_consent";

function applyGoogleConsent(granted) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
  window.gtag("consent", granted ? "update" : "default", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  });
}

export default function ConsentAnalytics() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      saved = null;
    }

    const granted = saved === "granted";
    applyGoogleConsent(granted);

    if (saved === "granted" || saved === "denied") {
      setConsent(saved);
    }
  }, []);

  function choose(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Consent state still applies for the current page if storage is unavailable.
    }
    setConsent(value);
    applyGoogleConsent(value === "granted");
  }

  const enabled = consent === "granted";
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleId = ga4 || ads;

  return (
    <>
      {enabled && googleId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`}
            strategy="afterInteractive"
          />
          <Script id="autonomia-google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){dataLayer.push(arguments);};
              gtag('js', new Date());
              ${ga4 ? `gtag('config', '${ga4}', { send_page_view: true });` : ""}
              ${ads ? `gtag('config', '${ads}');` : ""}
            `}
          </Script>
        </>
      )}

      {enabled && meta && (
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

      {consent === null && (
        <aside className="consentBanner" aria-label="Préférences de confidentialité">
          <div>
            <strong>Mesure d’audience et publicité</strong>
            <p>
              Autonomia peut utiliser des traceurs non essentiels pour mesurer l’acquisition
              et les campagnes. Ils restent désactivés tant que vous ne les acceptez pas.
            </p>
          </div>
          <div className="consentActions">
            <button type="button" onClick={() => choose("denied")}>Refuser</button>
            <button type="button" className="accept" onClick={() => choose("granted")}>Accepter</button>
          </div>
        </aside>
      )}
    </>
  );
}
