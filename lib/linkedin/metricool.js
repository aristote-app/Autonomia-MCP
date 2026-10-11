function metricoolConfig() {
  return {
    token: process.env.METRICOOL_API_TOKEN || "",
    userId: process.env.METRICOOL_USER_ID || "",
    blogId: process.env.METRICOOL_BLOG_ID || "",
    timezone: process.env.METRICOOL_TIMEZONE || "Europe/Paris"
  };
}

export function hasMetricoolApi() {
  const config = metricoolConfig();
  return Boolean(config.token && config.userId && config.blogId);
}

async function metricoolFetch(path, params = {}) {
  const config = metricoolConfig();
  if (!config.token || !config.userId || !config.blogId) return null;

  const url = new URL("https://app.metricool.com/api" + path);
  const query = {
    userId: config.userId,
    blogId: config.blogId,
    timezone: config.timezone,
    ...params
  };

  for (const [key, value] of Object.entries(query)) {
    if (value == null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { "X-Mc-Auth": config.token, accept: "application/json" },
    cache: "no-store"
  });

  if (!response.ok) throw new Error("Metricool API " + response.status);

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json();
}

function numericFromPayload(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }

  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index -= 1) {
      const found = numericFromPayload(value[index]);
      if (found != null) return found;
    }
  }

  if (value && typeof value === "object") {
    for (const key of ["value", "total", "count", "metric", "data"]) {
      if (!(key in value)) continue;
      const found = numericFromPayload(value[key]);
      if (found != null) return found;
    }
  }

  return null;
}

export async function loadMetricoolLinkedinAccount({ from, to } = {}) {
  if (!hasMetricoolApi()) return null;

  const metrics = [
    ["followers", "account"],
    ["deltaFollowers", "account"],
    ["impression", "posts"],
    ["reaction", "posts"],
    ["comment", "posts"],
    ["reshare", "posts"],
    ["count", "posts"]
  ];

  try {
    const results = await Promise.all(
      metrics.map(async ([metric, subject]) => {
        const payload = await metricoolFetch("/v2/analytics/timelines", {
          network: "linkedin",
          metric,
          subject,
          from,
          to
        });
        return [metric, numericFromPayload(payload)];
      })
    );

    const values = Object.fromEntries(results);
    return {
      followers: values.followers,
      followerDelta: values.deltaFollowers,
      impressions: values.impression,
      reactions: values.reaction,
      comments: values.comment,
      shares: values.reshare,
      posts: values.count,
      source: "Metricool API"
    };
  } catch (error) {
    console.error("LinkedIn Metricool live analytics failed", error);
    return null;
  }
}
