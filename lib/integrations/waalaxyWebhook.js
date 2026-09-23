function stringsDeep(value, out = [], depth = 0) {
  if (depth > 8 || out.length > 500) return out;

  if (typeof value === "string") {
    out.push(value);
    return out;
  }

  if (Array.isArray(value)) {
    for (const item of value) stringsDeep(item, out, depth + 1);
    return out;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) stringsDeep(item, out, depth + 1);
  }

  return out;
}

export function normalizeLinkedInProfileUrl(value) {
  const text = String(value || "").trim();
  const match = text.match(
    /https?:\/\/(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com\/in\/[^\s?#/"'<>]+/i
  );

  if (!match) return null;

  return match[0]
    .replace(/^http:/i, "https:")
    .replace(/\/$/, "")
    .replace(/https:\/\/[a-z]{2,3}\.linkedin\.com/i, "https://www.linkedin.com")
    .replace(/https:\/\/linkedin\.com/i, "https://www.linkedin.com");
}

export function extractWaalaxyReplyIdentifiers(payload) {
  const strings = stringsDeep(payload);

  const linkedinUrls = [...new Set(
    strings
      .map(normalizeLinkedInProfileUrl)
      .filter(Boolean)
  )];

  const emails = [...new Set(
    strings
      .map((value) => String(value).trim().toLowerCase())
      .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  )];

  const prospectIds = [...new Set(
    Object.entries(payload && typeof payload === "object" ? payload : {})
      .filter(([key, value]) =>
        /prospect.*id|prospectId|waalaxy.*id/i.test(key) &&
        typeof value === "string" &&
        value.trim()
      )
      .map(([, value]) => value.trim())
  )];

  return { linkedinUrls, emails, prospectIds };
}

export function safeReplyEvidence(payload) {
  const ids = extractWaalaxyReplyIdentifiers(payload);
  return {
    linkedin_urls: ids.linkedinUrls.slice(0, 5),
    emails: ids.emails.slice(0, 5),
    prospect_ids: ids.prospectIds.slice(0, 5)
  };
}
