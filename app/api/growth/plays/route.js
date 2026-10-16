import { getCurrentWorkspaceMembership } from "../../../../lib/auth/access.js";
import { hasAutonomiaDatabase } from "../../../../lib/db/supabase.js";
import { loadAccountIntelligence } from "../../../../lib/db/accountIntelligence.js";
import { listWorkspaceSalesContacts } from "../../../../lib/db/salesContacts.js";
import { listInboundLeads } from "../../../../lib/db/inboundLeads.js";
import { buildGrowthPlays, growthStats, weeklyCapacity } from "../../../../lib/intelligence/growthEngine.js";
import { runtimeIntegrationStatus } from "../../../../lib/runtime/integrationSettings.js";

export const dynamic = "force-dynamic";

/**
 * Authenticated, read-only data contract for internal agents and approved UI.
 * Never starts an external outreach campaign. Browser session required.
 */
export async function GET(request) {
  if (!hasAutonomiaDatabase()) {
    return Response.json({ error:"Cockpit database unavailable" },{status:503,headers:{"Cache-Control":"no-store"}});
  }
  const context=await getCurrentWorkspaceMembership().catch(()=>null);
  if (!context?.claims?.sub||!context?.membership?.workspace_id) {
    return Response.json({error:"Unauthorized"},{status:401,headers:{"Cache-Control":"no-store"}});
  }
  const url=new URL(request.url);
  const offer=["BUILD","EXPERTS","ACADEMY"].includes(url.searchParams.get("offer"))
    ?url.searchParams.get("offer"):null;
  const limit=Math.min(100,Math.max(1,Number(url.searchParams.get("limit"))||30));
  const workspaceId=context.membership.workspace_id;
  try {
    const [intel,contacts,inbound]=await Promise.all([
      loadAccountIntelligence({limit:500}),
      listWorkspaceSalesContacts({workspaceId,limit:500}),
      listInboundLeads({workspaceId,limit:500})
    ]);
    const accounts=intel.accounts||[];
    const runtimeState=await runtimeIntegrationStatus().catch(()=>null);
    const plays=buildGrowthPlays({
      accounts,contacts,
      waalaxyReady:Boolean(process.env.WAALAXY_API_KEY||runtimeState?.configured?.WAALAXY_API_KEY),
      limit:500
    }).filter(item=>!offer||item.offer===offer);
    return Response.json({
      generatedAt:new Date().toISOString(),
      source:"autonomia-workspace",
      target:{qualifiedMeetingsPerWeek:40},
      totals:growthStats({accounts,contacts,inbound}),
      illustrativeCapacity:weeklyCapacity(),
      count:plays.length,
      plays:plays.slice(0,limit),
      automation:{outreachExecuted:false,requiresHumanValidation:true}
    },{headers:{"Cache-Control":"private, no-store, max-age=0"}});
  } catch {
    return Response.json({error:"Growth data temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});
  }
}
