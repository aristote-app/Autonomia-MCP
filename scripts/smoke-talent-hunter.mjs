import assert from "node:assert/strict";
import {
  parseTalentSearchResult,
  discoverTalentCandidates
} from "../lib/collectors/talentHunter.js";
import { clearBraveCacheForTests } from "../lib/collectors/braveCache.js";

const malt = parseTalentSearchResult({
  title: "Jane Doe, AI Engineer LangGraph RAG - Malt",
  url: "https://www.malt.fr/profile/janedoe",
  description: "Disponible freelance Paris Python LangGraph RAG LLM 750 € / jour"
}, "AI Engineer LangGraph RAG Python");

assert.equal(malt.source_platform, "malt");
assert.equal(malt.display_name, "Jane Doe");
assert.equal(malt.tjm, 750);
assert.equal(malt.locations.includes("Paris"), true);
assert.equal(malt.skills.includes("LangGraph"), true);
assert.equal(malt.skills.includes("RAG"), true);
assert.ok(malt.relevance_score >= 55);

const linkedin = parseTalentSearchResult({
  title: "John Doe - Freelance AI Engineer | LinkedIn",
  url: "https://fr.linkedin.com/in/john-doe",
  description: "Freelance disponible. Python, LangChain, LangGraph, RAG. Paris / remote."
}, "AI Engineer LangGraph RAG Python");

assert.equal(linkedin.source_platform, "linkedin");
assert.equal(linkedin.display_name, "John Doe");
assert.equal(linkedin.tjm, null, "LinkedIn snippets must not be treated as reliable TJM evidence");
assert.equal(linkedin.remote, true);

const freelanceCom = parseTalentSearchResult({
  title: "Alex Smith - Consultant IA",
  url: "https://plateforme.freelance.com/freelance/alex-smith",
  description: "Consultant freelance Python RAG LangGraph"
}, "AI Engineer LangGraph RAG Python");

assert.equal(freelanceCom.source_platform, "freelance_com");
assert.equal(freelanceCom.display_name, "Alex Smith");

const collective = parseTalentSearchResult({
  title: "Alice Martin - Consultante IA | Collective.work",
  url: "https://www.collective.work/profile/alice-martin",
  description: "Freelance Paris automatisation IA Make n8n 650 € / jour"
}, "Automatisation IA n8n Make");

assert.equal(collective.source_platform, "collective_work");
assert.equal(collective.display_name, "Alice Martin");
assert.equal(collective.tjm, 650);
assert.equal(collective.skills.includes("n8n"), true);

assert.equal(
  parseTalentSearchResult({
    title: "Mission AI Engineer",
    url: "https://example.com/job",
    description: "LangGraph RAG freelance"
  }, "AI Engineer LangGraph RAG"),
  null,
  "Non-whitelisted platforms must be rejected"
);

const originalFetch = global.fetch;
const calls = [];
clearBraveCacheForTests();

global.fetch = async (url) => {
  calls.push(String(url));
  const q = new URL(String(url)).searchParams.get("q") || "";
  let results = [];

  if (q.includes("malt.fr/profile")) {
    results = [{
      title: "Jane Doe, AI Engineer LangGraph RAG - Malt",
      url: "https://www.malt.fr/profile/janedoe",
      description: "Disponible freelance Paris Python LangGraph RAG 750 € / jour"
    }];
  } else if (q.includes("plateforme.freelance.com")) {
    results = [{
      title: "Alex Smith - Consultant IA",
      url: "https://plateforme.freelance.com/freelance/alex-smith",
      description: "Consultant freelance Python RAG LangGraph"
    }];
  } else if (q.includes("linkedin.com/in")) {
    results = [{
      title: "John Doe - Freelance AI Engineer | LinkedIn",
      url: "https://fr.linkedin.com/in/john-doe",
      description: "Freelance Python LangGraph RAG Paris remote"
    }];
  } else if (q.includes("collective.work/profile")) {
    results = [{
      title: "Alice Martin - Consultante IA | Collective.work",
      url: "https://www.collective.work/profile/alice-martin",
      description: "Freelance Paris automatisation IA Make n8n 650 € / jour"
    }];
  }

  return new Response(JSON.stringify({
    query: { more_results_available: false },
    web: { results }
  }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

try {
  const first = await discoverTalentCandidates({
    query: "AI Engineer LangGraph RAG Python",
    apiKey: "test-key",
    countPerSource: 5
  });

  assert.equal(first.available, true);
  assert.equal(first.searches.length, 4);
  assert.equal(first.candidates.length, 4);
  assert.equal(calls.length, 4);

  const second = await discoverTalentCandidates({
    query: "AI Engineer LangGraph RAG Python",
    apiKey: "test-key",
    countPerSource: 5
  });

  assert.equal(second.candidates.length, 4);
  assert.equal(calls.length, 4, "Repeated identical Talent Hunter searches must use Brave cache");
  assert.equal(second.searches.every((search) => search.cache_hit === true), true);

  clearBraveCacheForTests();
  calls.length = 0;
  global.fetch = async (url) => {
    calls.push(String(url));
    const parsed = new URL(String(url));
    const offset = Number(parsed.searchParams.get("offset") || 0);
    const result = {
      title: offset === 0
        ? "Jane Doe, AI Engineer LangGraph RAG - Malt"
        : "Jane Smith, AI Engineer LangGraph RAG - Malt",
      url: offset === 0
        ? "https://www.malt.fr/profile/janedoe"
        : "https://www.malt.fr/profile/janesmith",
      description: "Freelance Paris Python LangGraph RAG"
    };
    return new Response(JSON.stringify({
      query: { more_results_available: offset === 0 },
      web: { results: [result] }
    }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  };

  const paginated = await discoverTalentCandidates({
    query: "AI Engineer LangGraph RAG Python",
    apiKey: "test-key",
    sources: ["malt"],
    countPerSource: 20,
    maxPages: 2
  });

  assert.equal(paginated.searches.length, 2);
  assert.equal(paginated.candidates.length, 2);
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[1]).searchParams.get("offset"), "1");
} finally {
  global.fetch = originalFetch;
  clearBraveCacheForTests();
}

console.log("talent hunter smoke ok");
