import { DEFAULT_UA } from "./http.js";

function parseRules(text) {
  const groups = [];
  let current = null;

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line || !line.includes(":")) continue;

    const idx = line.indexOf(":");
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (key === "user-agent") {
      if (!current || current.hasRules) {
        current = { agents: [], rules: [], hasRules: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }

    if (!current) continue;

    if (key === "allow" || key === "disallow") {
      current.hasRules = true;
      current.rules.push({ type: key, path: value });
    }
  }

  return groups;
}

function matchingRules(groups, agent) {
  const lower = agent.toLowerCase();
  const exact = groups.filter((group) =>
    group.agents.some((candidate) =>
      candidate !== "*" && lower.includes(candidate)
    )
  );
  if (exact.length) return exact.flatMap((group) => group.rules);

  return groups
    .filter((group) => group.agents.includes("*"))
    .flatMap((group) => group.rules);
}

function pathMatches(rulePath, path) {
  if (!rulePath) return false;
  const escaped = rulePath
    .replace(/[.+?^$(){}|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  const anchored = escaped.endsWith("\\$") ? escaped : escaped;
  try {
    return new RegExp("^" + anchored.replace(/\\\$$/, "$")).test(path);
  } catch {
    return path.startsWith(rulePath);
  }
}

export function evaluateRobots(text, path, userAgent = "Autonomia-Market-Intelligence") {
  const rules = matchingRules(parseRules(text), userAgent)
    .filter((rule) => pathMatches(rule.path, path))
    .sort((a, b) => b.path.length - a.path.length);

  if (!rules.length) return { allowed: true, matchedRule: null };
  return {
    allowed: rules[0].type === "allow",
    matchedRule: rules[0]
  };
}

export async function assertRobotsAllowed(url) {
  const target = new URL(url);
  const robotsUrl = new URL("/robots.txt", target.origin);

  let response;
  try {
    response = await fetch(robotsUrl, {
      headers: {
        "user-agent": DEFAULT_UA,
        accept: "text/plain,*/*;q=0.8"
      },
      redirect: "follow"
    });
  } catch (error) {
    throw new Error(
      `Unable to verify robots.txt for ${target.origin}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (response.status === 404) {
    return { allowed: true, robotsUrl: robotsUrl.toString(), matchedRule: null };
  }

  if (!response.ok) {
    throw new Error(
      `Unable to verify robots.txt for ${target.origin}: HTTP ${response.status}`
    );
  }

  const text = await response.text();
  const verdict = evaluateRobots(
    text,
    target.pathname + target.search,
    "Autonomia-Market-Intelligence"
  );

  if (!verdict.allowed) {
    throw new Error(
      `robots.txt disallows collection of ${target.pathname}`
    );
  }

  return {
    ...verdict,
    robotsUrl: robotsUrl.toString()
  };
}
