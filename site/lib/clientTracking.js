export function trackEvent(event, detail = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...detail });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, detail);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, detail);
  }
}

export function trackLeadConversion(detail = {}) {
  trackEvent("generate_lead", detail);

  if (typeof window === "undefined") return;

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
