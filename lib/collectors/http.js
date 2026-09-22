const DEFAULT_UA =
  "Autonomia-Market-Intelligence/0.5 (+https://github.com/aristote-app/Autonomia-MCP)";

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 15000);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": DEFAULT_UA,
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}

function retryDelayMs(response, attempt) {
  const retryAfter = response?.headers?.get?.("retry-after");
  const seconds = Number(retryAfter);

  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 5000);
  }

  return Math.min(750 * 2 ** attempt, 4000);
}

function retryableStatus(status) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

export async function fetchJson(url, options = {}) {
  const maxRetries = Math.max(0, Math.min(Number(options.retries ?? 2), 4));
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const response = await request(url, {
      ...options,
      headers: {
        accept: "application/json",
        ...(options.headers || {})
      }
    });

    if (response.ok) {
      return await response.json();
    }

    const body = await response.text();
    const error = new Error(
      `HTTP ${response.status} from ${url}: ${body.slice(0, 500)}`
    );
    error.status = response.status;
    lastError = error;

    if (!retryableStatus(response.status) || attempt >= maxRetries) {
      throw error;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, retryDelayMs(response, attempt))
    );
  }

  throw lastError || new Error(`Request failed for ${url}`);
}

export async function fetchText(url, options = {}) {
  const response = await request(url, {
    ...options,
    headers: {
      accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    const error = new Error(
      `HTTP ${response.status} from ${url}: ${body.slice(0, 300)}`
    );
    error.status = response.status;
    throw error;
  }
  return {
    text: await response.text(),
    finalUrl: response.url,
    status: response.status,
    contentType: response.headers.get("content-type")
  };
}

export { DEFAULT_UA };
