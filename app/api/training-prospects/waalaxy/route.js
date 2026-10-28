import {getCurrentWorkspaceMembership} from '../../../../lib/auth/access.js';
import {getAutonomiaServerClient} from '../../../../lib/db/supabase.js';
import {getRuntimeIntegrationValue} from '../../../../lib/runtime/integrationSettings.js';
import {importWaalaxyProspects,assertSuccessfulWaalaxyImport} from '../../../../lib/integrations/waalaxy.js';
import {personalLinkedInProfileUrl} from '../../../../lib/intelligence/commercialLeadPolicy.js';
export const runtime='nodejs';export const dynamic='force-dynamic';
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request){
 let jobId=null;let client;
 try{
  const c=await getCurrentWorkspaceMembership();if(!c.membership||!c.claims?.sub)return reply({ok:false,error:'not_authenticated'},401);
  if(c.membership.role==='viewer')return reply({ok:false,error:'write_denied'},403);
  if(request.headers.get('origin')!==new URL(request.url).origin)return reply({ok:false,error:'invalid_origin'},403);
  const raw=await request.text();if(raw.length>2000)return reply({ok:false,error:'invalid_request'},400);
  let body;try{body=JSON.parse(raw);}catch{return reply({ok:false,error:'invalid_request'},400);}
  if(!/^[a-f0-9-]{36}$/i.test(body.recordId||''))return reply({ok:false,error:'invalid_request'},400);
  const [key,list]=await Promise.all([getRuntimeIntegrationValue('WAALAXY_API_KEY'),getRuntimeIntegrationValue('WAALAXY_DEFAULT_LIST_ID')]);
  if(!key||!list)return reply({ok:false,error:'waalaxy_not_configured'},409);
  client=getAutonomiaServerClient();
  const {data:record,error}=await client.from('training_prospect_records').select('*').eq('id',body.recordId).eq('workspace_id',c.membership.workspace_id).maybeSingle();
  if(error)throw error;if(!record)return reply({ok:false,error:'not_found'},404);
  const d=record.draft||{},l=record.snapshot||{};const profile=personalLinkedInProfileUrl(d.linkedin||l.contactProfile);
  if(!d.contactVerified||d.doNotContact||['gagne','perdu'].includes(d.stage)||!profile)return reply({ok:false,error:'contact_not_ready'},400);
  const {data:job,error:jobError}=await client.from('training_outreach_jobs').insert({workspace_id:c.membership.workspace_id,record_id:record.id,channel:'waalaxy',profile_url:profile,status:'running',created_by:c.claims.sub}).select('id').single();
  if(jobError?.code==='23505')return reply({ok:false,error:'already_imported_or_pending'},409);if(jobError)throw jobError;jobId=job.id;
  const name=(d.contact||l.contact||'').trim().split(/\s+/);
  const result=await importWaalaxyProspects({prospects:[{linkedin_url:profile,firstName:name.shift()||undefined,lastName:name.join(' ')||undefined,email:d.email||l.businessEmail||undefined,company:d.organisation||l.buyer,matchedRole:d.role||l.contactRole,trigger:l.need}],prospectListId:list,apiKey:key});
  assertSuccessfulWaalaxyImport(result,{});
  const {error:doneError}=await client.from('training_outreach_jobs').update({status:'done',updated_at:new Date().toISOString()}).eq('id',jobId);if(doneError)throw doneError;
  await client.from('training_prospect_events').insert({record_id:record.id,workspace_id:c.membership.workspace_id,actor_user_id:c.claims.sub,event_type:'waalaxy_imported',payload:{list_id:list,campaign_started:false}});
  return reply({ok:true,campaignStarted:false});
 }catch{
  if(jobId&&client)await client.from('training_outreach_jobs').update({status:'unknown',updated_at:new Date().toISOString()}).eq('id',jobId);
  return reply({ok:false,error:jobId?'import_result_unknown':'import_failed'},502);
 }
}
