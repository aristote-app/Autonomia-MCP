import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { SOURCES } from "../sources.js";
import { searchBoamp } from "../collectors/boamp.js";
import { searchTed } from "../collectors/ted.js";
import { getLatestDecpResource } from "../collectors/decp.js";
import { getFreelanceMentionResults } from "../collectors/freelancemention.js";
import { searchUpworkJobs } from "../collectors/upwork.js";
import { searchFreeWork } from "../collectors/freework.js";
import { searchMarchesSecurises } from "../collectors/marchesSecurises.js";
import { getLeHibouMarketSignal } from "../collectors/lehibou.js";
import { getMcfTrainingSources } from "../collectors/monCompteFormation.js";
import { searchAiPublicMarket } from "../engines/aiPublicMarket.js";
import { refreshAutonomiaMarket } from "../engines/refreshMarket.js";
import { scoreAutonomiaFit, evaluatePublicTenderGoNoGo } from "../scoring/autonomia.js";
import { normalizeAuthorizedImport } from "../import/authorized.js";
import { rankConsultantsForOpportunity, rankOpportunitiesForConsultant } from "../staffing/matcher.js";
import { OPCOS, searchOpcoAiTrainingMarket } from "../training/opco.js";
import { PUBLIC_BUYER_PROFILES } from "../public/profiles.js";
import { AI_ROLE_CLUSTERS, classifyAiRole } from "../taxonomy/roles.js";
import { PRIVATE_SIGNAL_TYPES, normalizePrivateDemandSignals } from "../signals/private.js";
import { persistPrivateSignals, searchPrivateSignals } from "../db/signals.js";
import { hasAutonomiaDatabase } from "../db/supabase.js";
import { persistOpportunityItems, startCollectorRun, finishCollectorRun } from "../db/persist.js";
import {
  searchPersistedOpportunities,
  searchPublicAwards,
  getBuyerHistory,
  getSupplierHistory,
  getSourceEvidence,
  persistDecpAwards,
  getExpiringContracts,
  findPublicMarketPartners,
  comparePersistedFreelanceRoles
} from "../db/history.js";
import {
  searchRankedOpportunities,
  getBuyerMarketIntelligence
} from "../db/intelligence.js";
import {
  loadAccountIntelligence,
  loadAccountBySlug
} from "../db/accountIntelligence.js";
import { researchAccountPublicContext } from "../collectors/accountResearch.js";
import { discoverDecisionMakers } from "../collectors/decisionMakers.js";
import { resolveHiddenEndClient } from "../collectors/endClientResolver.js";
import { resolveFrenchCompanyRegistry } from "../collectors/companyRegistry.js";
import { buildRevenueActions } from "../intelligence/revenueOrchestrator.js";
import { buildAccountOpportunityGraph } from "../intelligence/accountGraph.js";
import { rankAccountsForConsultant } from "../intelligence/consultantAccounts.js";

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

  const collectorRunId = await startCollectorRun({
    sourceId: null,
    queryPayload: { query, sources: selected, limit },
    triggerMode: "on_demand"
  });

  const settled = await Promise.allSettled(tasks);
  const results = [];
  const errors = [];

  for (const item of settled) {
    if (item.status === "fulfilled") results.push(item.value);
    else errors.push(item.reason instanceof Error ? item.reason.message : String(item.reason));
  }

  const items = results.flatMap((entry) => entry.items || []);
  let persistence = {
    persisted: false,
    reason: "Dedicated Autonomia Supabase is not configured",
    count: 0
  };

  if (hasAutonomiaDatabase()) {
    try {
      persistence = await persistOpportunityItems(items, { collectorRunId });
    } catch (error) {
      errors.push(`Persistence failed: ${error instanceof Error ? error.message : String(error)}`);
      persistence = {
        persisted: false,
        reason: "Persistence attempt failed",
        count: 0
      };
    }
  }

  await finishCollectorRun(collectorRunId, {
    status: errors.length ? "partial" : "success",
    stats: {
      sources: selected,
      sourceResults: Object.fromEntries(results.map((entry) => [entry.source, entry.total])),
      itemsReturned: items.length,
      itemsPersisted: persistence.count
    },
    errorMessage: errors.length ? errors.join(" | ") : null
  });

  return {
    query,
    refreshedAt: new Date().toISOString(),
    persisted: persistence.persisted,
    persistence,
    results,
    errors
  };
}

export function createAutonomiaMcpServer() {
  const server = new McpServer(
    { name: "autonomia-market-intelligence", version: "1.0.0" },
    {
      instructions:
        "Autonomia Market Intelligence exposes sourced market data. Treat collected fields as source facts. Do not invent missing budgets, TJMs, buyers, deadlines or awardees. Distinguish source facts from later AI analysis. Live tools can refresh sources and persist automatically when the dedicated Autonomia Supabase project is configured."
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
    "list_public_buyer_profiles",
    {
      description: "List tracked public buyer profiles and their verified automation status. Registry entries do not imply that a live collector exists.",
      inputSchema: z.object({
        priority: z.enum(["P0","P1","P2"]).optional()
      })
    },
    async ({ priority }) => {
      const items = priority
        ? PUBLIC_BUYER_PROFILES.filter((profile) => profile.priority === priority)
        : PUBLIC_BUYER_PROFILES;
      return textResult({
        count: items.length,
        profiles: items
      });
    }
  );

  server.registerTool(
    "search_marches_securises",
    {
      description: "Search the public Marchés-Sécurisés consultation portal after a robots.txt policy check. No login or technical protection bypass is attempted.",
      inputSchema: z.object({
        query: z.string().min(2).default("intelligence artificielle"),
        page: z.number().int().min(1).max(200).default(1),
        limit: z.number().int().min(1).max(100).default(50)
      })
    },
    async (args) => {
      try {
        const result = await searchMarchesSecurises(args);

        let persistence = {
          persisted: false,
          reason: "Dedicated Autonomia Supabase is not configured",
          count: 0
        };

        if (hasAutonomiaDatabase() && result.items?.length) {
          const runId = await startCollectorRun({
            sourceId: "marches_securises",
            queryPayload: args,
            triggerMode: "on_demand"
          });

          try {
            persistence = await persistOpportunityItems(result.items, { collectorRunId: runId });
            await finishCollectorRun(runId, {
              status: "success",
              stats: {
                itemsReturned: result.items.length,
                itemsPersisted: persistence.count
              }
            });
          } catch (error) {
            await finishCollectorRun(runId, {
              status: "failed",
              errorMessage: error instanceof Error ? error.message : String(error)
            });
            persistence = {
              persisted: false,
              reason: error instanceof Error ? error.message : String(error),
              count: 0
            };
          }
        }

        return textResult({ ...result, persistence });
      } catch (error) {
        return toolError(
          "Marchés-Sécurisés collection failed",
          error instanceof Error ? error.message : String(error)
        );
      }
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
      description: "Refresh Autonomia market intelligence on demand across public procurement, OPCO training and freelance sources. The response explicitly reports live, credential-required, skipped and authorized-import-only coverage.",
      inputSchema: z.object({
        query: z.string().min(2).default("intelligence artificielle"),
        scopes: z.array(z.enum(["public","training","freelance"])).default(["public","training","freelance"]),
        publicTopic: z.enum(["all","genai","agents","rag","governance","ai_act","data_ml","automation","training"]).default("all"),
        limitPerQuery: z.number().int().min(1).max(20).default(5),
        freeWorkCategory: z.enum(["ia","ia-generative","machine-learning","data-science","copilot"]).default("ia"),
        freeWorkLimit: z.number().int().min(1).max(100).default(50),
        freelanceMentionSearchId: z.string().optional(),
        freelanceMentionSince: z.string().datetime().optional(),
        includeUpwork: z.boolean().default(true),
        upworkFirst: z.number().int().min(1).max(50).default(20)
      })
    },
    async (args) => {
      try {
        const result = await refreshAutonomiaMarket(args);

        let persistence = {
          persisted: false,
          reason: "Dedicated Autonomia Supabase is not configured",
          count: 0
        };

        if (hasAutonomiaDatabase() && result.opportunities?.length) {
          const runId = await startCollectorRun({
            sourceId: null,
            queryPayload: {
              mode: "unified_refresh",
              query: result.query,
              scopes: result.scopes
            },
            triggerMode: "on_demand"
          });

          try {
            persistence = await persistOpportunityItems(result.opportunities, {
              collectorRunId: runId
            });
            await finishCollectorRun(runId, {
              status: "success",
              stats: {
                rawOpportunityRows: result.rawOpportunityRows,
                uniqueOpportunityRows: result.uniqueOpportunityRows,
                persisted: persistence.count,
                sourceErrors: result.errors.length
              }
            });
          } catch (error) {
            await finishCollectorRun(runId, {
              status: "failed",
              errorMessage: error instanceof Error ? error.message : String(error)
            });
            persistence = {
              persisted: false,
              reason: error instanceof Error ? error.message : String(error),
              count: 0
            };
          }
        }

        return textResult({
          ...result,
          persistence
        });
      } catch (error) {
        return toolError(
          "Unified market refresh failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
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
    "list_opco_sources",
    {
      description: "List the 11 French OPCOs tracked by Autonomia, including verified official call-for-tender pages where available.",
      inputSchema: z.object({
        verifiedOnly: z.boolean().default(false)
      })
    },
    async ({ verifiedOnly }) => {
      const items = verifiedOnly
        ? OPCOS.filter((opco) => opco.directPageVerified)
        : OPCOS;
      return textResult({
        count: items.length,
        opcos: items,
        note: "For OPCOs without a verified direct calls page, Autonomia uses buyer-name filtering over BOAMP/TED as the primary public-procurement route."
      });
    }
  );

  server.registerTool(
    "search_training_opportunities",
    {
      description: "Search live AI-training public procurement opportunities linked to one or more of the 11 French OPCOs, using BOAMP/TED plus the Autonomia AI-training taxonomy.",
      inputSchema: z.object({
        query: z.string().min(2).optional(),
        opcos: z.array(z.enum([
          "atlas","akto","opco2i","opcommerce","ocapiat","afdas",
          "opco_sante","constructys","uniformation","opco_ep","opco_mobilites"
        ])).default([]),
        sources: z.array(z.enum(["boamp","ted"])).default(["boamp","ted"]),
        limitPerQuery: z.number().int().min(1).max(20).default(10)
      })
    },
    async (args) => {
      try {
        const result = await searchOpcoAiTrainingMarket(args);

        let persistence = {
          persisted: false,
          reason: "Dedicated Autonomia Supabase is not configured",
          count: 0
        };

        if (hasAutonomiaDatabase() && result.items?.length) {
          const runId = await startCollectorRun({
            sourceId: null,
            queryPayload: {
              mode: "opco_training_search",
              query: args.query || null,
              opcos: args.opcos || [],
              sources: args.sources || ["boamp","ted"],
              limitPerQuery: args.limitPerQuery
            },
            triggerMode: "on_demand"
          });

          try {
            persistence = await persistOpportunityItems(result.items, {
              collectorRunId: runId
            });

            await finishCollectorRun(runId, {
              status: "success",
              stats: {
                rawAiTrainingMatches: result.rawAiTrainingMatches,
                opcoMatches: result.opcoMatches,
                itemsPersisted: persistence.count
              }
            });
          } catch (error) {
            await finishCollectorRun(runId, {
              status: "failed",
              errorMessage: error instanceof Error ? error.message : String(error)
            });
            persistence = {
              persisted: false,
              reason: error instanceof Error ? error.message : String(error),
              count: 0
            };
          }
        }

        return textResult({
          ...result,
          persistence
        });
      } catch (error) {
        return toolError(
          "OPCO training-opportunity search failed",
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
    "get_lehibou_market_signal",
    {
      description: "Read public Data & IA market figures stated by LeHibou after a robots.txt policy check. Values are returned as publisher claims, not independent market totals.",
      inputSchema: z.object({})
    },
    async () => {
      try {
        return textResult(await getLeHibouMarketSignal());
      } catch (error) {
        return toolError(
          "LeHibou market signal collection failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "search_freework_missions",
    {
      description: "Collect public Free-Work AI mission listings after a robots.txt policy check. No login, CAPTCHA or anti-bot bypass is attempted.",
      inputSchema: z.object({
        category: z.enum(["ia","ia-generative","machine-learning","data-science","copilot"]).default("ia"),
        page: z.number().int().min(1).max(100).default(1),
        limit: z.number().int().min(1).max(100).default(50)
      })
    },
    async (args) => {
      try {
        const result = await searchFreeWork(args);

        let persistence = {
          persisted: false,
          reason: "Dedicated Autonomia Supabase is not configured",
          count: 0
        };

        if (hasAutonomiaDatabase() && result.items?.length) {
          const runId = await startCollectorRun({
            sourceId: "freework",
            queryPayload: args,
            triggerMode: "on_demand"
          });

          try {
            persistence = await persistOpportunityItems(result.items, { collectorRunId: runId });
            await finishCollectorRun(runId, {
              status: "success",
              stats: {
                itemsReturned: result.items.length,
                itemsPersisted: persistence.count
              }
            });
          } catch (error) {
            await finishCollectorRun(runId, {
              status: "failed",
              errorMessage: error instanceof Error ? error.message : String(error)
            });
            persistence = {
              persisted: false,
              reason: error instanceof Error ? error.message : String(error),
              count: 0
            };
          }
        }

        return textResult({ ...result, persistence });
      } catch (error) {
        return toolError(
          "Free-Work collection failed",
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
    "normalize_private_signals",
    {
      description: "Normalize authorized private-market records into source facts plus explainable inferred AI-demand signal categories. This tool does not persist.",
      inputSchema: z.object({
        source: z.enum([
          "linkedin","datasales","indeed","malt","manual",
          "company_careers","company_news"
        ]).default("manual"),
        records: z.array(z.record(z.string(), z.any())).min(1).max(1000)
      })
    },
    async (args) => textResult({
      availableSignalTypes: Object.fromEntries(
        Object.entries(PRIVATE_SIGNAL_TYPES).map(([id, value]) => [id, value.label])
      ),
      signals: normalizePrivateDemandSignals(args)
    })
  );

  server.registerTool(
    "import_private_signals",
    {
      description: "Persist authorized private-market source records and their clearly labeled AI-demand signal classifications. Inferred categories remain evidence_kind=inferred.",
      inputSchema: z.object({
        source: z.enum([
          "linkedin","datasales","indeed","malt","manual",
          "company_careers","company_news"
        ]).default("manual"),
        records: z.array(z.record(z.string(), z.any())).min(1).max(500)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      const runId = await startCollectorRun({
        sourceId: args.source,
        queryPayload: {
          mode: "private_signal_import",
          records: args.records.length
        },
        triggerMode: "on_demand"
      });

      try {
        const result = await persistPrivateSignals({
          ...args,
          collectorRunId: runId
        });

        await finishCollectorRun(runId, {
          status: "success",
          stats: {
            sourceRecords: result.sourceRecords,
            signalRows: result.signalRows
          }
        });

        return textResult(result);
      } catch (error) {
        await finishCollectorRun(runId, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : String(error)
        });
        return toolError(
          "Private-signal import failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "search_private_signals",
    {
      description: "Search persisted private AI-demand signals by text, organization, signal type, evidence kind and date window.",
      inputSchema: z.object({
        query: z.string().optional(),
        organization: z.string().optional(),
        signalTypes: z.array(z.enum([
          "hiring_ai",
          "ai_transformation",
          "ai_training_intent",
          "ai_governance_compliance",
          "ai_product_launch",
          "ai_partnership",
          "expansion_investment",
          "unclassified_ai_signal"
        ])).default([]),
        from: z.string().datetime().optional(),
        to: z.string().datetime().optional(),
        evidenceKind: z.enum(["source_fact","inferred"]).optional(),
        limit: z.number().int().min(1).max(500).default(100),
        offset: z.number().int().min(0).default(0)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await searchPrivateSignals(args));
      } catch (error) {
        return toolError(
          "Private-signal search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "classify_ai_role",
    {
      description: "Classify a mission into explainable AI role clusters. Multiple clusters may match the same mission.",
      inputSchema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        skills: z.array(z.string()).default([])
      })
    },
    async (args) => textResult({
      availableClusters: Object.fromEntries(
        Object.entries(AI_ROLE_CLUSTERS).map(([id, value]) => [id, value.label])
      ),
      classification: classifyAiRole(args)
    })
  );

  server.registerTool(
    "compare_freelance_roles",
    {
      description: "Compare persisted freelance AI role clusters over a requested historical window using mission counts, known TJMs, remote share and source counts. Requires the Autonomia database.",
      inputSchema: z.object({
        days: z.number().int().min(1).max(730).default(90),
        clusters: z.array(z.enum([
          "ai_product",
          "ai_program_project",
          "forward_deployment",
          "agentic_llm",
          "data_ml",
          "governance_ai_act",
          "ai_training_change"
        ])).default([]),
        limit: z.number().int().min(1).max(10000).default(5000)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await comparePersistedFreelanceRoles(args));
      } catch (error) {
        return toolError(
          "Freelance role comparison failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "find_staffing",
    {
      description: "Rank available consultants for an opportunity using required/preferred skills, availability, rate and location. Returns explainable gaps and coverage.",
      inputSchema: z.object({
        opportunity: z.record(z.string(), z.any()),
        consultants: z.array(z.record(z.string(), z.any())).max(500),
        limit: z.number().int().min(1).max(100).default(20)
      })
    },
    async (args) => textResult(rankConsultantsForOpportunity(args))
  );

  server.registerTool(
    "find_opportunities_for_consultant",
    {
      description: "Inverse staffing: rank opportunities for one available consultant using the same explainable matching rules.",
      inputSchema: z.object({
        consultant: z.record(z.string(), z.any()),
        opportunities: z.array(z.record(z.string(), z.any())).max(500),
        limit: z.number().int().min(1).max(100).default(20)
      })
    },
    async (args) => textResult(rankOpportunitiesForConsultant(args))
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
    "search_opportunities",
    {
      description: "Search opportunities already persisted in the dedicated Autonomia database. Supports text, type and date filters.",
      inputSchema: z.object({
        query: z.string().optional(),
        opportunityType: z.enum(["freelance_ai","public_ai","training_ai","private_ai"]).optional(),
        deadlineAfter: z.string().datetime().optional(),
        publishedAfter: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(200).default(50),
        offset: z.number().int().min(0).default(0)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await searchPersistedOpportunities(args));
      } catch (error) {
        return toolError(
          "Persisted opportunity search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );


  server.registerTool(
    "search_ranked_opportunities",
    {
      description: "Search persisted opportunities through the V2 intelligence layer with explainable AI tags, actionability, Autonomia fit coverage and inferred staffing roles. Fit is not a win probability.",
      inputSchema: z.object({
        query: z.string().optional(),
        opportunityType: z.enum(["freelance_ai","public_ai","training_ai","private_ai"]).optional(),
        tags: z.array(z.enum(["agents","rag","genai","governance","ai_act","data_ml","automation","training"])).default([]),
        actionability: z.enum(["open","closed","unknown","all"]).default("open"),
        aiRelatedOnly: z.boolean().default(true),
        minFitScore: z.number().min(0).max(100).default(0),
        limit: z.number().int().min(1).max(200).default(50),
        offset: z.number().int().min(0).default(0)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await searchRankedOpportunities(args));
      } catch (error) {
        return toolError(
          "Ranked opportunity search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "buyer_market_intelligence",
    {
      description: "Return factual buyer-level public-award aggregates observed in the persisted DECP/public-award history, including supplier count and AI-related award rows.",
      inputSchema: z.object({
        buyer: z.string().optional(),
        minAiAwardRows: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(200).default(50),
        offset: z.number().int().min(0).default(0)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await getBuyerMarketIntelligence(args));
      } catch (error) {
        return toolError(
          "Buyer market intelligence lookup failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "public_awards",
    {
      description: "Search persisted public-procurement award history imported from DECP. Useful for contracts, amounts, CPV, buyers and suppliers.",
      inputSchema: z.object({
        query: z.string().optional(),
        buyer: z.string().optional(),
        supplier: z.string().optional(),
        from: z.string().date().optional(),
        to: z.string().date().optional(),
        limit: z.number().int().min(1).max(500).default(100),
        offset: z.number().int().min(0).default(0)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await searchPublicAwards(args));
      } catch (error) {
        return toolError(
          "Public-award search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "buyer_history",
    {
      description: "Return a public buyer's persisted award history, suppliers and observed contract amounts from DECP-derived facts.",
      inputSchema: z.object({
        buyer: z.string().min(2),
        limit: z.number().int().min(1).max(500).default(200)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await getBuyerHistory(args));
      } catch (error) {
        return toolError(
          "Buyer history lookup failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "supplier_history",
    {
      description: "Return a supplier's persisted public-award history and observed buyers from DECP-derived facts.",
      inputSchema: z.object({
        supplier: z.string().min(2),
        limit: z.number().int().min(1).max(500).default(200)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await getSupplierHistory(args));
      } catch (error) {
        return toolError(
          "Supplier history lookup failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "expiring_contracts",
    {
      description: "Find persisted public contracts whose explicit or duration-derived end date falls in a requested window. Estimated dates are clearly labeled.",
      inputSchema: z.object({
        from: z.string().date(),
        to: z.string().date(),
        query: z.string().optional(),
        buyer: z.string().optional(),
        limit: z.number().int().min(1).max(500).default(200)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await getExpiringContracts(args));
      } catch (error) {
        return toolError(
          "Expiring-contract search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "find_public_market_partners",
    {
      description: "Find suppliers factually observed on similar persisted public awards. Results are ordered by matching award-row count and are not recommendations or win predictions.",
      inputSchema: z.object({
        query: z.string().optional(),
        cpvCode: z.string().optional(),
        from: z.string().date().optional(),
        limit: z.number().int().min(1).max(200).default(50)
      })
    },
    async (args) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        return textResult(await findPublicMarketPartners(args));
      } catch (error) {
        return toolError(
          "Partner-history search failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "import_decp_awards",
    {
      description: "Persist authorized DECP JSON records as source evidence, organizations and public-award rows. Internal write operation; the MCP endpoint itself is token-protected.",
      inputSchema: z.object({
        records: z.array(z.record(z.string(), z.any())).min(1).max(500)
      })
    },
    async ({ records }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      const runId = await startCollectorRun({
        sourceId: "decp",
        queryPayload: { mode: "mcp_import", records: records.length },
        triggerMode: "on_demand"
      });

      try {
        const result = await persistDecpAwards(records, { collectorRunId: runId });
        await finishCollectorRun(runId, {
          status: "success",
          stats: {
            inputRecords: result.inputRecords,
            awardRows: result.awardRows
          }
        });
        return textResult(result);
      } catch (error) {
        await finishCollectorRun(runId, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : String(error)
        });
        return toolError(
          "DECP award import failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "list_accounts",
    {
      description: "List source-grounded Account Intelligence records ranked by current commercial heat. Intermediary-risk marketplaces can be excluded. This is prioritization support, not a sales probability.",
      inputSchema: z.object({
        minHeat: z.number().min(0).max(100).default(0),
        includeIntermediaries: z.boolean().default(false),
        limit: z.number().int().min(1).max(200).default(50)
      })
    },
    async ({ minHeat, includeIntermediaries, limit }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      try {
        const result = await loadAccountIntelligence({ limit: 500 });
        const accounts = (result.accounts || [])
          .filter((account) => includeIntermediaries || !account.intermediary_risk)
          .filter((account) => Number(account.heat_score || 0) >= minHeat)
          .slice(0, limit)
          .map((account) => ({
            slug: account.slug,
            name: account.name,
            account_type: account.account_type,
            heat_score: account.heat_score,
            heat_label: account.heat_label,
            signal_count: account.signal_count,
            source_count: account.source_count,
            recent_7d: account.recent_7d,
            offers: account.offers,
            recommended_offer: account.recommended_offer,
            primary_decision_role: account.primary_decision_role,
            why_now: account.why_now,
            next_action: account.next_action,
            playbook: account.playbook
          }));

        return textResult({
          generated_at: result.generated_at,
          count: accounts.length,
          accounts,
          note: "Heat is an internal deterministic prioritization score, not a probability of conversion."
        });
      } catch (error) {
        return toolError(
          "Account Intelligence lookup failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "get_account_360",
    {
      description: "Return one Account 360 record with source-linked timeline, why-now reasons, offer tracks, target roles and current next action.",
      inputSchema: z.object({
        slug: z.string().min(1)
      })
    },
    async ({ slug }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        return textResult(account);
      } catch (error) {
        return toolError(
          "Account 360 lookup failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "resolve_account_legal_identity",
    {
      description: "Resolve a French Account 360 company name against the open DINUM company-search API. Returns ranked legal-entity candidates with SIREN, NAF and public firmographic fields; low-confidence results are never auto-merged.",
      inputSchema: z.object({
        slug: z.string().min(1)
      })
    },
    async ({ slug }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        if (account.intermediary_risk) {
          return toolError("Legal identity resolution is skipped for intermediary-risk accounts");
        }
        return textResult(await resolveFrenchCompanyRegistry(account.name, { perPage: 5 }));
      } catch (error) {
        return toolError(
          "Company registry resolution failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "get_account_opportunity_graph",
    {
      description: "Return an explainable signal-to-need-to-decision-role-to-offer graph for one Account 360 record. Nodes are derived from stored evidence and deterministic rules; people are role targets, not invented identities.",
      inputSchema: z.object({
        slug: z.string().min(1)
      })
    },
    async ({ slug }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        return textResult(buildAccountOpportunityGraph(account));
      } catch (error) {
        return toolError(
          "Account opportunity graph failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "get_account_next_actions",
    {
      description: "Return the highest-priority account-level next actions from current Account Intelligence. Contact-level private actions remain in the authenticated cockpit.",
      inputSchema: z.object({
        minHeat: z.number().min(0).max(100).default(55),
        limit: z.number().int().min(1).max(50).default(12)
      })
    },
    async ({ minHeat, limit }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      try {
        const result = await loadAccountIntelligence({ limit: 500 });
        const accounts = (result.accounts || []).filter(
          (account) => !account.intermediary_risk && Number(account.heat_score || 0) >= minHeat
        );
        const actions = buildRevenueActions({
          accounts,
          contacts: [],
          kasprReady: Boolean(process.env.KASPR_API_KEY),
          waalaxyReady: Boolean(process.env.WAALAXY_API_KEY),
          limit
        });
        return textResult({
          generated_at: result.generated_at,
          count: actions.length,
          actions
        });
      } catch (error) {
        return toolError(
          "Account next-action orchestration failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "find_accounts_for_consultant",
    {
      description: "Rank hot Account Intelligence records for one consultant using declared skills, account heat and source-linked recency. This is a deterministic prospecting aid, not a mission-award or conversion prediction.",
      inputSchema: z.object({
        consultant: z.object({
          id: z.string().optional(),
          name: z.string().optional(),
          display_name: z.string().optional(),
          skills: z.array(z.string()).default([])
        }),
        minHeat: z.number().min(0).max(100).default(45),
        limit: z.number().int().min(1).max(50).default(10)
      })
    },
    async ({ consultant, minHeat, limit }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }

      try {
        const result = await loadAccountIntelligence({ limit: 500 });
        const accounts = (result.accounts || []).filter(
          (account) =>
            !account.intermediary_risk &&
            Number(account.heat_score || 0) >= minHeat
        );

        return textResult({
          generated_at: result.generated_at,
          ...rankAccountsForConsultant({
            consultant,
            accounts,
            limit
          })
        });
      } catch (error) {
        return toolError(
          "Consultant-to-account matching failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "resolve_hidden_end_client",
    {
      description: "For an intermediary-risk Account 360 record, search public web-index traces of the same need outside known marketplaces. Returns candidates to verify; it never asserts a hidden client identity.",
      inputSchema: z.object({
        slug: z.string().min(1),
        maxSignals: z.number().int().min(1).max(3).default(2),
        countPerQuery: z.number().int().min(1).max(10).default(8)
      })
    },
    async ({ slug, maxSignals, countPerQuery }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      if (
        process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED !== "true" ||
        !process.env.BRAVE_SEARCH_API_KEY
      ) {
        return toolError("Hidden client resolver is disabled or Brave Search is not configured");
      }

      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        if (!account.intermediary_risk) {
          return toolError("Hidden client resolver is only intended for intermediary-risk accounts");
        }
        return textResult(await resolveHiddenEndClient({
          account,
          maxSignals,
          countPerQuery
        }));
      } catch (error) {
        return toolError(
          "Hidden client resolution failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "research_account_public_context",
    {
      description: "Run the guarded on-demand public Account Researcher for one Account 360 company. Uses at most two Brave web searches and returns source links; results do not change ranking until separately validated.",
      inputSchema: z.object({
        slug: z.string().min(1),
        countPerQuery: z.number().int().min(1).max(10).default(6)
      })
    },
    async ({ slug, countPerQuery }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      if (
        process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED !== "true" ||
        !process.env.BRAVE_SEARCH_API_KEY
      ) {
        return toolError("Account Researcher is disabled or Brave Search is not configured");
      }

      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        if (account.intermediary_risk) {
          return toolError("Account Researcher is blocked for intermediary-risk accounts", {
            slug,
            account: account.name
          });
        }

        return textResult(await researchAccountPublicContext({
          company: account.name,
          countPerQuery
        }));
      } catch (error) {
        return toolError(
          "Account public research failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
  );

  server.registerTool(
    "discover_account_decision_makers",
    {
      description: "Run guarded on-demand public discovery for likely decision-maker candidates on one Account 360 record. Candidates are not verified contacts and must be checked before enrichment or outreach.",
      inputSchema: z.object({
        slug: z.string().min(1),
        maxRoles: z.number().int().min(1).max(5).default(3),
        countPerRole: z.number().int().min(1).max(10).default(5)
      })
    },
    async ({ slug, maxRoles, countPerRole }) => {
      if (!hasAutonomiaDatabase()) {
        return toolError("Dedicated Autonomia Supabase is not configured");
      }
      if (
        process.env.AUTONOMIA_DECISION_DISCOVERY_ENABLED !== "true" ||
        !process.env.BRAVE_SEARCH_API_KEY
      ) {
        return toolError("Decision-maker discovery is disabled or Brave Search is not configured");
      }

      try {
        const account = await loadAccountBySlug(slug);
        if (!account) return toolError("Account not found", { slug });
        if (account.intermediary_risk) {
          return toolError("Decision-maker discovery is blocked for intermediary-risk accounts", {
            slug,
            account: account.name
          });
        }

        return textResult(await discoverDecisionMakers({
          company: account.name,
          roles: account.decision_roles,
          maxRoles,
          countPerRole
        }));
      } catch (error) {
        return toolError(
          "Decision-maker discovery failed",
          error instanceof Error ? error.message : String(error)
        );
      }
    }
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
    async ({ source, sourceId }) => {
      let evidence = null;
      if (hasAutonomiaDatabase() && (source || sourceId)) {
        try {
          evidence = await getSourceEvidence({ source, sourceId, limit: 25 });
        } catch (error) {
          evidence = {
            error: error instanceof Error ? error.message : String(error)
          };
        }
      }

      return textResult({
        source: source || null,
        sourceId: sourceId || null,
        factPolicy: [
          "sourceId, sourceUrl, publication dates, buyer/company, title, budget/TJM and deadlines are facts only when present in source payloads",
          "missing values remain null",
          "AI classification, fit, scoring, inferred skills and recommendations are separate analysis records",
          "raw source payloads are retained for audit when Supabase persistence is enabled"
        ],
        persistence: hasAutonomiaDatabase() ? "configured" : "not_configured",
        evidence
      });
    }
  );

  return server;
}
