import assert from "node:assert/strict";
import { normalizeWebDemandResult } from "../lib/collectors/webDemandDiscovery.js";
import {
  buildSeoGeoSignals,
  summarizeSeoGeoSignals
} from "../lib/seo-geo/demandSignals.js";

const supportSpec = {
  sourceId: "francenum_programs",
  kind: "territory_program",
  query: 'site:francenum.gouv.fr/aides-financieres "intelligence artificielle" région TPE PME',
  urlPattern: /francenum\.gouv\.fr\/aides-financieres\//i
};

const support = normalizeWebDemandResult(supportSpec, {
  url: "https://www.francenum.gouv.fr/aides-financieres/programme-impulse-intelligence-artificielle",
  title: "Programme Impulse Intelligence Artificielle",
  description:
    "Accompagner les TPE PME de la région dans l'adoption de l'IA générative avec diagnostic, formations et mise en pratique."
});

assert.ok(support);
assert.equal(support.marketSignalType, "territory_support_program");
assert.equal(support.rawPayload.search_kind, "territory_program");

const call = normalizeWebDemandResult(
  {
    sourceId: "aides_territoires",
    kind: "territory_program",
    query: 'site:aides-territoires.beta.gouv.fr "intelligence artificielle" collectivités',
    urlPattern: /aides-territoires\.beta\.gouv\.fr\/(?:aides|programmes)\//i
  },
  {
    url: "https://aides-territoires.beta.gouv.fr/aides/exemple-ia/",
    title: "Appel à projets intelligence artificielle pour les collectivités",
    description:
      "AAP pour accompagner les collectivités et intercommunalités dans des projets d'intelligence artificielle."
  }
);
assert.ok(call);
assert.equal(call.marketSignalType, "territory_call_for_projects");

const funding = normalizeWebDemandResult(
  {
    sourceId: "banque_territoires_programs",
    kind: "territory_program",
    query: 'site:banquedesterritoires.fr "intelligence artificielle" collectivités programme',
    urlPattern: /banquedesterritoires\.fr\//i
  },
  {
    url: "https://www.banquedesterritoires.fr/territoires-ia",
    title: "Territoires d'IA",
    description:
      "Programme pour les collectivités avec guichet de cofinancement, appui en ingénierie et cas d'usage IA."
  }
);
assert.ok(funding);
assert.equal(funding.marketSignalType, "territory_funding_program");

const createdAt = new Date().toISOString();
const seoSignals = buildSeoGeoSignals({
  territoryPrograms: [
    {
      signal_type: support.marketSignalType,
      title: support.title,
      description: support.rawPayload.search_description,
      source_url: support.sourceUrl,
      created_at: createdAt,
      signal_payload: {
        source: support.sourceId,
        query: support.rawPayload.query,
        search_description: support.rawPayload.search_description
      }
    }
  ]
});

assert.equal(seoSignals.length, 1);
assert.equal(seoSignals[0].family, "territory-use-case");
assert.ok(seoSignals[0].territory_program_mentions > 0);
assert.equal(seoSignals[0].job_mentions, 0);
assert.equal(seoSignals[0].public_procurement_mentions, 0);

const summary = summarizeSeoGeoSignals(seoSignals);
assert.equal(summary.territoryPrograms, 1);
assert.equal(summary.territory, 1);
assert.equal(summary.jobs, 0);

console.log(JSON.stringify({
  ok: true,
  support: support.marketSignalType,
  call: call.marketSignalType,
  funding: funding.marketSignalType,
  seoTerritoryProgramMentions: seoSignals[0].territory_program_mentions
}, null, 2));
