import { randomUUID } from 'node:crypto';
import { getAutonomiaServerClient } from '../db/supabase.js';
import { readMailSettings, mailReady, smtpTransport, smtpErrorCode } from './sender.js';
import { SENDER, WORKSPACE } from './model.js';
export function outgoingMessage(recipient) {
  const unsubscribe = 'https://cockpit.build-autonomia.com/email/unsubscribe/' + recipient.unsubscribe_token;
  return { from: { name: 'Déborah Dian · AUTONOMIA Academy', address: SENDER }, to: recipient.email,
    replyTo: SENDER, subject: recipient.subject, messageId: '<' + randomUUID() + '@majy.me>',
    text: recipient.body + '\n\n—\nDéborah Dian · AUTONOMIA Academy\n' + SENDER +
      (recipient.source ? '\nOrigine du contact : ' + recipient.source : '') + '\nNe plus recevoir nos messages : ' + unsubscribe,
    headers: { 'List-Unsubscribe': '<https://cockpit.build-autonomia.com/api/email-unsubscribe/' + recipient.unsubscribe_token + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    disableFileAccess: true, disableUrlAccess: true };
}
// At most one individually addressed message per invocation. No automatic retry.
export async function dispatchOne({ client = getAutonomiaServerClient(), settings = null, transport = null } = {}) {
  settings ||= await readMailSettings();
  if (!mailReady(settings)) return { state: 'not_connected' };
  const claim = await client.rpc('claim_email_recipient', { p_workspace: WORKSPACE });
  if (claim.error) throw new Error('queue_unavailable');
  const recipient = claim.data;
  if (!recipient) return { state: 'waiting' };
  // Pause/unsubscribe/disconnect are checked again after reserving the slot.
  const [campaign, suppress, fresh] = await Promise.all([
    client.from('email_campaigns').select('status').eq('workspace_id', WORKSPACE).eq('id', recipient.campaign_id).maybeSingle(),
    client.from('email_suppressions').select('email').eq('workspace_id', WORKSPACE).eq('email', recipient.email).maybeSingle(),
    transport ? Promise.resolve(settings) : readMailSettings()
  ]);
  if (campaign.error || suppress.error || !mailReady(fresh)) {
    await client.from('email_campaign_recipients').update({ status: 'unknown', error_code: 'send_preflight_failed' }).eq('id', recipient.id).eq('workspace_id', WORKSPACE);
    return { state: 'unknown' };
  }
  if (campaign.data?.status !== 'queued' || suppress.data) {
    const status = suppress.data ? 'suppressed' : 'queued';
    const update = await client.from('email_campaign_recipients').update({ status, attempted_at: null }).eq('id', recipient.id).eq('workspace_id', WORKSPACE);
    if (update.error) throw new Error('queue_unavailable');
    return { state: 'paused' };
  }
  transport ||= smtpTransport(fresh);
  const message = outgoingMessage(recipient); let status = 'unknown', errorCode = null;
  try {
    const info = await transport.sendMail(message);
    if (info.accepted?.map(String).some(email => email.toLowerCase() === recipient.email.toLowerCase())) status = 'sent';
    else { status = 'failed'; errorCode = 'mail_rejected'; }
  } catch (error) {
    errorCode = smtpErrorCode(error);
    // Explicit SMTP rejection is definitive. Timeouts/disconnects are uncertain.
    status = ['mail_auth_failed', 'mail_rejected', 'mail_temporarily_rejected'].includes(errorCode) ? 'failed' : 'unknown';
  } finally { transport.close?.(); }
  const update = await client.from('email_campaign_recipients').update({ status, message_id: message.messageId, error_code: errorCode,
    sent_at: status === 'sent' ? new Date().toISOString() : null }).eq('id', recipient.id).eq('workspace_id', WORKSPACE).eq('status', 'sending');
  if (update.error) throw new Error('send_result_not_persisted');
  if (status === 'failed') await client.from('email_campaigns').update({ status: 'paused' }).eq('id', recipient.campaign_id).eq('workspace_id', WORKSPACE);
  const remaining = await client.from('email_campaign_recipients').select('id', { count: 'exact', head: true }).eq('campaign_id', recipient.campaign_id).in('status', ['queued', 'sending']);
  if (!remaining.error && remaining.count === 0) await client.from('email_campaigns').update({ status: 'done' }).eq('id', recipient.campaign_id).eq('workspace_id', WORKSPACE).eq('status', 'queued');
  return { state: status };
}
