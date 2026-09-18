import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { SOURCES } from "../sources.js";
import { searchBoamp } from "../collectors/boamp.js";
import { searchTed } from "../collectors/ted.js";
import { getLatestDecpResource } from "../collectors/decp.js";
import { getFreelanceMentionResults } from "../collectors/freelancemention.js";
import { searchUpworkJobs } from "../collectors/upwork.js";
import { getMcfTrainingSources } from "../collectors/monCompteFormation.js";
import { searchAiPublicMarket } from "../engines/aiPublicMarket.js";
import { scoreAutonomiaFit, evaluatePublicTenderGoNoGo } from "../scoring/autonomia.js";
import { normalizeAuthorizedImport } from "../import/authorized.js";

function textResult(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }]
  };
}

function toolError(message, details = null) {
  return {
    isError: true,
    content: [{
      type: "text",
      text: JSON.stringify({ error: message, details }, null, 2)
    }]
  };
}

async function publicSearch({ query, sources, limit }) {
  const selected = sources?.length ? sources : ["boamp", "ted"];
  const tasks = [];

  if (selected.includes("boamp")) {
    tasks.push(searchBoamp({ query, limit }));
  }
  if (selected.includes("ted")) {
    tasks.push(searchTed({ query, limit, scope: "ACTIVE" }));
  }

  const settled = await Promise.allSettled(tasks);
  const results = [];
  const errors = [];

  for (const item of settled) {
    if (item.status === "fulfilled") results.push(item.value);
    else errors.push(item.reason instanceof Error ? item.reason.message : String(item.reason));
  }

  return {
    query,
    refreshedAt: new Date().toISOString(),
    persisted: false,
    results,
    errors
  };
}

export function createAutonomiaMcpServer() {
  const server = new McpServer(
    { name: "autonomia-market-intelligence", version: "0.2.0" },
    {
      instructions:
        "Autonomia Market Intelligence exposes sourced market data. Treat collected fields as source facts. Do not invent missing budgets, TJMs, buyers, deadlines or awardees. Distinguish source facts from later AI analysis. Live tools can refresh sources but do not persist until the dedicated Autonomia Supabase project is connected."
    }
  );

  server.registerTool(
    "list_sources",
    {
      description: "List Autonomia market-intelligence sources, priorities, access modes and connector status.",
      inputSchema: z.object({
        group: z.enum(["freelance", "public", "training"]).optional()
      })
    },
    async ({ group }) => {
      const items = group ? SOURCES.filter((source) => source.group === group) : SOURCES;
      return textResult({ count: items.length, sources: items });
    }
  );

  server.registerTool(
    "search_ai_public_market",
    {
      description: "Search the public AI market with an expanded taxonomy so opportunities can be found even when the notice does not literally contain 'intelligence artificielle'.",
      inputSchema: z.object({
        topic: z.enum(["all","genai","agents","rag","governance","ai_act","data_ml","automation","training"]).default("all"),
        query: z.string().min(2).optional(),
        sources: z.array(z.enum(["boamp","ted"])).default(["boamp","ted"]),
        limitPerQuery: z.number().int().min(1).max(20).default(5)
      })
    },
    async (args) => textResult(await searchAiPublicMarket(args))
  );

  server.registerTool(
    "search_public_tenders",
    {
      description: "Run a live search across BOAMP and/or TED for public procurement opportunities. Results are source-grounded and not yet persisted.",
      inputSchema: z.object({
        query: z.string().min(2),
        sources: z.array(z.enum(["boamp", "ted"])).default(["boamp", "ted"]),
        limit: z.number().int().min(1).max(50).default(10)
      })
    },
    async (args) => textResult(await publicSearch(args))
  );

  server.registerTool(
    "refresh_market",
    {
      description: "Refresh public-market sources on demand for a query. This is live collection, not a cached answer.",
      inputSchema: z.object({
        query: z.string().min(2),
        sources: z.array(z.enum(["boamp", "ted"])).default(["boamp", "ted"]),
        limit: z.number().int().min(1).max(50).default(10)
      })
    },
    async (args) => textResult(await publicSearch(args))
  );

  server.registerTool(
    "market_stats",
    {
      description: "Return live source counts for a public-procurement query from BOAMP and TED.",
      inputSchema: z.object({
        query: z.string().min(2)
      })
    },
    async ({ query }) => {
      const live = await publicSearch({ query, sources: ["boamp", "ted"], limit: 1 });
      const stats = Object.fromEntries(
        live.results.map((entry) => [entry.source, { total: entry.total }])
      );
      return textResult({
        query,
        refreshedAt: live.refreshedAt,
        stats,
        errors: live.errors,
        note: "Counts are source-native live search counts, not deduplicated cross-source market totals."
      });
    }
  );

  server.registerTool(
    "get_decp_status",
    {
      description: "Resolve the latest official national DECP resource metadata. This checks the award-history source without downloading the full dataset.",
      inputSchema: z.object({
        format: z.enum(["json", "csv"]).default("json")
      })
    },
    async ({ format }) => {
      try {
        return textResult(await getLatestDecpResource({ format }));
      } catch (error) {
        return toolError(
          "DECP resource resolution failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "get_training_market_status",
    {
      description: "Resolve the latest Mon Compte Formation open-data resources for offer, engaged training and training flows.",
      inputSchema: z.object({
        format: z.enum(["json", "csv"]).default("json")
      })
    },
    async ({ format }) => {
      try {
        return textResult(await getMcfTrainingSources({ format }));
      } catch (error) {
        return toolError(
          "Mon Compte Formation resource resolution failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "search_upwork_jobs",
    {
      description: "Search Upwork marketplace jobs through the official GraphQL API. Requires UPWORK_ACCESS_TOKEN with marketplace job-posting permissions.",
      inputSchema: z.object({
        query: z.string().min(2),
        first: z.number().int().min(1).max(50).default(20),
        after: z.string().default("0")
      })
    },
    async (args) => {
      try {
        return textResult(await searchUpworkJobs(args));
      } catch (error) {
        return toolError(
          "Upwork collection failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "search_freelance_missions",
    {
      description: "Read live FreelanceMention results for an existing FreelanceMention saved search. Requires FREELANCEMENTION_API_KEY.",
      inputSchema: z.object({
        searchId: z.string().min(1),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
        since: z.string().datetime().optional()
      })
    },
    async (args) => {
      try {
        return textResult(await getFreelanceMentionResults(args));
      } catch (error) {
        return toolError(
          "FreelanceMention collection failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "normalize_authorized_import",
    {
      description: "Normalize mission records from an authorized LinkedIn/Data Sales, Indeed, Malt or manual export into the Autonomia canonical mission shape. Records are not persisted until Supabase is connected.",
      inputSchema: z.object({
        source: z.enum(["linkedin", "datasales", "indeed", "malt", "manual"]),
        records: z.array(z.record(z.string(), z.any())).max(1000)
      })
    },
    async (args) => {
      try {
        return textResult(normalizeAuthorizedImport(args));
      } catch (error) {
        return toolError(
          "Authorized import normalization failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "score_autonomia_fit",
    {
      description: "Score how well an opportunity fits Autonomia using explicit criteria and return score coverage and missing evidence. This is not a win probability.",
      inputSchema: z.object({
        capabilityFit: z.any().optional(),
        economicValue: z.any().optional(),
        staffingReadiness: z.any().optional(),
        recurrencePotential: z.any().optional(),
        commercialAccess: z.any().optional(),
        buyerKnowledge: z.any().optional(),
        competitionPosition: z.any().optional(),
        deadlineReadiness: z.any().optional(),
        strategicValue: z.any().optional()
      })
    },
    async (args) => textResult(scoreAutonomiaFit(args))
  );

  server.registerTool(
    "go_no_go_public_tender",
    {
      description: "Apply explainable public-tender Go/No-Go rules. Hard blockers and failed mandatory requirements override fit score. Output is decision support, not a forecast.",
      inputSchema: z.object({
        fit: z.record(z.string(), z.any()).default({}),
        blockers: z.array(
          z.union([
            z.string(),
            z.object({
              code: z.string(),
              note: z.string().nullable().optional()
            })
          ])
        ).default([]),
        mandatory: z.record(z.string(), z.any()).default({}),
        notes: z.array(z.string()).default([])
      })
    },
    async (args) => textResult(evaluatePublicTenderGoNoGo(args))
  );

  server.registerTool(
    "explain_data",
    {
      description: "Explain what Autonomia currently treats as fact versus analysis and how a result should be traced back to its source.",
      inputSchema: z.object({
        source: z.string().optional(),
        sourceId: z.string().optional()
      })
    },
    async ({ source, sourceId }) => textResult({
      source: source || null,
      sourceId: sourceId || null,
      factPolicy: [
        "sourceId, sourceUrl, publication dates, buyer/company, title, budget/TJM and deadlines are facts only when present in source payloads",
        "missing values remain null",
        "AI classification, fit, scoring, inferred skills and recommendations are separate analysis records",
        "raw source payloads are retained for audit once Supabase persistence is enabled"
      ],
      persistence: "pending dedicated Autonomia Supabase project"
    })
  );

  return server;
}
