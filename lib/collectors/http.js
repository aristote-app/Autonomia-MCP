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

export async function fetchJson(url, options = {}) {
  const response = await request(url, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status} from ${url}: ${body.slice(0, 500)}`);
  }
  return await response.json();
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
