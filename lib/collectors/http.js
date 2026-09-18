export async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 15000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent": "Autonomia-Market-Intelligence/0.1",
        accept: "application/json",
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status} from ${url}: ${body.slice(0, 500)}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
