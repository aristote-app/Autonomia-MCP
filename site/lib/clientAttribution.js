export function getClientAttribution() {
  if (typeof window === "undefined") return {};

  const url = new URL(window.location.href);
  const get = (key) => url.searchParams.get(key);
  let firstTouch = null;
  let history = [];

  try {
    firstTouch = JSON.parse(window.localStorage.getItem("autonomia_first_touch") || "null");
    history = JSON.parse(window.localStorage.getItem("autonomia_attribution_history") || "[]");
  } catch {
    firstTouch = null;
    history = [];
  }

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
