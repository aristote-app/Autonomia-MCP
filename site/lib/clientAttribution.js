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
    utm_source: get("utm_source") || firstTouch?.utm_source || null,
    utm_medium: get("utm_medium") || firstTouch?.utm_medium || null,
    utm_campaign: get("utm_campaign") || firstTouch?.utm_campaign || null,
    utm_content: get("utm_content") || firstTouch?.utm_content || null,
    utm_term: get("utm_term") || firstTouch?.utm_term || null,
    campaign_id: get("campaign_id") || get("meta_campaign_id") || firstTouch?.campaign_id || null,
    adset_id: get("adset_id") || firstTouch?.adset_id || null,
    ad_id: get("ad_id") || firstTouch?.ad_id || null,
    creative_id: get("creative_id") || firstTouch?.creative_id || null,
    gclid: get("gclid") || firstTouch?.gclid || null,
    fbclid: get("fbclid") || firstTouch?.fbclid || null,
    first_touch: firstTouch,
    attribution_history: history
  };
}
