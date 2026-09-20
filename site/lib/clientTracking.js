const CONSENT_KEY = "autonomia_cookie_consent";

function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function trackEvent(event, detail = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...detail });

  if (!hasAnalyticsConsent()) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, detail);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, detail);
  }
}

export function trackLeadConversion(detail = {}) {
  trackEvent("generate_lead", detail);

  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;

  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const googleAdsLeadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

  if (
    typeof window.gtag === "function" &&
    googleAdsId &&
    googleAdsLeadLabel
  ) {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsLeadLabel}`
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: detail.requested_service || detail.form_id || "autonomia_lead"
    });
  }
}
