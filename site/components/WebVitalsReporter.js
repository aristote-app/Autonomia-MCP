"use client";

import { useReportWebVitals } from "next/web-vitals";

const CONSENT_KEY = "autonomia_cookie_consent";
const ALLOWED = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

function canReport() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

function reportMetric(metric) {
  if (!ALLOWED.has(metric.name) || !canReport()) return;

  const body = JSON.stringify({
    name: metric.name,
    id: metric.id,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating || null,
    navigation_type: metric.navigationType || null,
    pathname: window.location.pathname,
    viewport_width: window.innerWidth,
    connection_type: navigator.connection?.effectiveType || null
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/organic/vitals", body);
    return;
  }

  fetch("/api/organic/vitals", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

export default function WebVitalsReporter() {
  useReportWebVitals(reportMetric);
  return null;
}
