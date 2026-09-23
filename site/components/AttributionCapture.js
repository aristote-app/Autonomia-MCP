"use client";

import { useEffect } from "react";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function AttributionCapture() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const get = (key) => url.searchParams.get(key);
    const touch = {
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
      captured_at: new Date().toISOString()
    };

    try {
      const firstKey = "autonomia_first_touch";
      const historyKey = "autonomia_attribution_history";

      if (!window.localStorage.getItem(firstKey)) {
        window.localStorage.setItem(firstKey, JSON.stringify(touch));
      }

      const history = safeParse(window.localStorage.getItem(historyKey), []);
      const previous = history[history.length - 1];
      const fingerprint = [
        touch.landing_page_topic,
        touch.utm_source,
        touch.utm_campaign,
        touch.utm_content,
        touch.utm_term,
        touch.campaign_id,
        touch.adset_id,
        touch.ad_id
      ].join("|");
      const previousFingerprint = previous
        ? [
            previous.landing_page_topic,
            previous.utm_source,
            previous.utm_campaign,
            previous.utm_content,
            previous.utm_term,
            previous.campaign_id,
            previous.adset_id,
            previous.ad_id
          ].join("|")
        : null;

      if (fingerprint !== previousFingerprint) {
        window.localStorage.setItem(
          historyKey,
          JSON.stringify([...history, touch].slice(-20))
        );
      }
    } catch {
      // Attribution storage must never block the page.
    }
  }, []);

  return null;
}
