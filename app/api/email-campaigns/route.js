import { campaignContext, writable, sameOrigin, readBody, json } from '../../../lib/campaigns/access.js';
import { mailStatus } from '../../../lib/campaigns/sender.js';
import { normalizeContacts, validateMessage, renderMessage, WORKSPACE } from '../../../lib/campaigns/model.js';
import { getAutonomiaServerClient } from '../../../lib/db/supabase.js';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export async function GET(request) {
  try {
    const c = await campaignContext(); if (!c) return json({ error: 'not_authenticated' }, 401);
    const client = getAutonomiaServerClient(); const id = new URL(request.url).searchParams.get('id');
    if (id) {
      if (!UUID.test(id)) return json({ error: 'invalid_id' }, 400);
      const rows = await client.from('email_campaign_recipients').select('id,email,first_name,company,status,sent_at,attempted_at,error_code').eq('workspace_id', WORKSPACE).eq('campaign_id', id).limit(1000);
      if (rows.error) throw rows.error;
      return json({ ok: true, recipients: rows.data });
    }
    const summary = await client.rpc('email_campaign_summary', { p_workspace: WORKSPACE });
    if (summary.error) throw summary.error;
    return json({ ok: true, canManage: writable(c), connection: await mailStatus(), ...summary.data });
  } catch { return json({ error: 'storage_unavailable' }, 503); }
}
export async function POST(request) {
  try {
    const c = await campaignContext(); if (!writable(c)) return json({ error: 'admin_required' }, 403);
    if (!sameOrigin(request)) return json({ error: 'invalid_origin' }, 403);
    const body = await readBody(request); const client = getAutonomiaServerClient();
    if (body.action === 'status') {
      if (!UUID.test(body.id || '') || !['queued', 'paused', 'cancelled'].includes(body.status)) return json({ error: 'invalid_action' }, 400);
      if (body.status === 'queued' && !(await mailStatus()).ready) return json({ error: 'mail_not_ready' }, 409);
      const result = await client.rpc('set_email_campaign_status', { p_workspace: WORKSPACE, p_actor: c.claims.sub, p_id: body.id, p_status: body.status });
      if (result.error?.message?.includes('campaign_closed')) return json({ error: 'campaign_closed' }, 409);
      if (result.error) throw result.error;
      return json({ ok: true });
    }
    if (body.action === 'suppress') {
      if (!UUID.test(body.id || '') || !['replied', 'bounced', 'suppressed'].includes(body.status)) return json({ error: 'invalid_action' }, 400);
      const r = await client.from('email_campaign_recipients').select('unsubscribe_token').eq('id', body.id).eq('workspace_id', WORKSPACE).maybeSingle();
      if (r.error) throw r.error; if (!r.data) return json({ error: 'not_found' }, 404);
      const suppressed = await client.rpc('unsubscribe_email', { p_token: r.data.unsubscribe_token }); if (suppressed.error) throw suppressed.error;
      const update = await client.from('email_campaign_recipients').update({ status: body.status }).eq('id', body.id).eq('workspace_id', WORKSPACE);
      if (update.error) throw update.error;
      return json({ ok: true });
    }
    if (body.action !== 'launch' || body.confirmed !== true || !UUID.test(body.id || '')) return json({ error: 'approval_required' }, 400);
    if (!(await mailStatus()).ready) return json({ error: 'mail_not_ready' }, 409);
    let contacts, message;
    try { contacts = normalizeContacts(body.contacts); message = validateMessage(body.subject, body.body); } catch (error) { return json({ error: error.message }, 400); }
    const payload = contacts.map(contact => ({ ...contact, subject: renderMessage(message.subject, contact), body: renderMessage(message.body, contact) }));
    const result = await client.rpc('enqueue_email_campaign', { p_workspace: WORKSPACE, p_actor: c.claims.sub, p_id: body.id,
      p_name: String(body.name || 'Campagne formation').trim().slice(0, 100), p_subject: message.subject, p_body: message.body, p_recipients: payload });
    if (result.error) throw result.error;
    return json({ ok: true, ...result.data });
  } catch { return json({ error: 'storage_unavailable' }, 503); }
}
