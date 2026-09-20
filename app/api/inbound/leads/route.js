import { inboundLeadSchema, normalizeInboundLead } from "../../../../lib/inbound/contract.js";
import { persistInboundLead } from "../../../../lib/db/inbound.js";
import { requireInboundBearer } from "../../../../lib/security.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = requireInboundBearer(request);
  if (!auth.ok) return auth.response;

  let raw;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = inboundLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid inbound lead payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  try {
    const normalized = normalizeInboundLead(parsed.data);
    const result = await persistInboundLead(normalized, raw);

    return Response.json(
      {
        ok: true,
        lead_id: result.leadId,
        opportunity_id: result.opportunityId,
        company_org_id: result.companyOrgId,
        created: result.created,
        status: result.status
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    console.error("Inbound lead ingestion failed", error);
    return Response.json(
      { error: "Inbound lead ingestion failed" },
      { status: 500 }
    );
  }
}
