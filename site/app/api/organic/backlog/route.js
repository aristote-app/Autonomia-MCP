import {
  executionBacklog,
  trainingBacklog
} from "../../../../content/editorial-backlog.js";
import { requireOrganicAuth } from "../../../../lib/organic/auth.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = requireOrganicAuth(request);
  if (!auth.ok) return auth.response;

  return Response.json({
    ok: true,
    backlog: executionBacklog.length + trainingBacklog.length,
    execution: executionBacklog.length,
    training: trainingBacklog.length,
    items: [...executionBacklog, ...trainingBacklog].map((item) => ({
      slug: item.slug,
      title: item.title,
      cluster: item.cluster,
      pillar: item.pillar,
      family: item.family
    })),
    generated_at: new Date().toISOString()
  });
}
