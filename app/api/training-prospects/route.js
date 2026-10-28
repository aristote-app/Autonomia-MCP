import {getRuntimeIntegrationValue} from "../../../lib/runtime/integrationSettings.js";
import {getCurrentWorkspaceMembership} from '../../../lib/auth/access.js';
import {getAutonomiaServerClient} from '../../../lib/db/supabase.js';
import {loadTrainingLeads,trainingSourceKey} from '../../../lib/training/loadTrainingLeads.js';
import {normalizeTrainingDraft} from '../../../lib/training/prospectWorkflow.js';
export const runtime='nodejs';export const dynamic='force-dynamic';
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
async function context(){const c=await getCurrentWorkspaceMembership();return c?.membership?.active!==false&&c.membership&&c.claims?.sub?c:null;}
export async function GET(){
 try{
 const c=await context();if(!c)return reply({ok:false,error:'not_authenticated'},401);
 const client=getAutonomiaServerClient();
 const [records,events]=await Promise.all([
 client.from('training_prospect_records').select('*').eq('workspace_id',c.membership.workspace_id).order('updated_at',{ascending:false}).limit(1000),
 client.from('training_prospect_events').select('id,record_id,event_type,payload,created_at').eq('workspace_id',c.membership.workspace_id).order('created_at',{ascending:false}).limit(1000)]);
 if(records.error||events.error)throw records.error||events.error;
 const waalaxyReady=Boolean(await getRuntimeIntegrationValue('WAALAXY_API_KEY'))&&Boolean(await getRuntimeIntegrationValue('WAALAXY_DEFAULT_LIST_ID'));
 return reply({ok:true,waalaxyReady,workspaceId:c.membership.workspace_id,canWrite:c.membership.role!=='viewer',records:records.data,events:events.data});
 }catch{return reply({ok:false,error:'storage_unavailable'},503);}
}
export async function POST(request){
 try{
 const c=await context();if(!c)return reply({ok:false,error:'not_authenticated'},401);
 if(c.membership.role==='viewer')return reply({ok:false,error:'write_denied'},403);
 const origin=request.headers.get('origin');if(!origin||origin!==new URL(request.url).origin)return reply({ok:false,error:'invalid_origin'},403);
 if(Number(request.headers.get('content-length')||0)>40000)return reply({ok:false,error:'request_too_large'},413);
 const raw=await request.text();if(raw.length>40000)return reply({ok:false,error:'request_too_large'},413);
 let body,draft;try{body=JSON.parse(raw);draft=normalizeTrainingDraft(body.draft);}catch{return reply({ok:false,error:'invalid_draft'},400);}
 if(!Number.isInteger(body.revision)||body.revision<0)return reply({ok:false,error:'invalid_revision'},400);
 const client=getAutonomiaServerClient();
 const {leads}=await loadTrainingLeads();let lead=leads.find(l=>l.id===body.leadId);
 if(!lead&&/^[a-f0-9-]{36}$/i.test(body.recordId||'')){const previous=await client.from('training_prospect_records').select('snapshot').eq('id',body.recordId).eq('workspace_id',c.membership.workspace_id).maybeSingle();if(previous.error)throw previous.error;lead=previous.data?.snapshot;}
 if(!lead)return reply({ok:false,error:'announcement_not_found'},404);
 const {data,error}=await client.rpc('save_training_prospect',{p_workspace_id:c.membership.workspace_id,p_actor_user_id:c.claims.sub,p_source_key:trainingSourceKey(lead.source),p_source_url:lead.source,p_snapshot:lead,p_draft:draft,p_expected_revision:body.revision});
 if(error){if(error.message?.includes('revision_conflict'))return reply({ok:false,error:'revision_conflict'},409);throw error;}
 return reply({ok:true,record:data});
 }catch{return reply({ok:false,error:'storage_unavailable'},503);}
}
