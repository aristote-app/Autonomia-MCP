import { campaignContext, writable, sameOrigin, readBody, json } from '../../../../lib/campaigns/access.js';
import { mailStatus, readMailSettings, writeMailSettings, verifyPassword, sendSelfTest, fingerprint, smtpErrorCode } from '../../../../lib/campaigns/sender.js';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';
export async function GET() {
  try { const c = await campaignContext(); if (!c) return json({ error: 'not_authenticated' }, 401);
    return json({ ok: true, canManage: writable(c), ...await mailStatus() });
  } catch { return json({ error: 'connection_unavailable' }, 503); }
}
export async function POST(request) {
  try {
    const c = await campaignContext(); if (!writable(c)) return json({ error: 'admin_required' }, 403);
    if (!sameOrigin(request)) return json({ error: 'invalid_origin' }, 403);
    const body = await readBody(request, 4000);
    if (body.action === 'save') {
      const settings = await verifyPassword(body.password);
      await writeMailSettings(settings);
    } else if (body.action === 'test') {
      const settings = await readMailSettings();
      if (settings.testAt && Date.now() - Date.parse(settings.testAt) < 60000) return json({ error: 'test_rate_limit' }, 429);
      await sendSelfTest(settings);
      await writeMailSettings({ ...settings, tested: fingerprint(settings.password), testAt: new Date().toISOString(), verified: null });
    } else if (body.action === 'confirm') {
      const settings = await readMailSettings();
      if (!settings.password || settings.tested !== fingerprint(settings.password)) return json({ error: 'test_required' }, 409);
      await writeMailSettings({ ...settings, verified: fingerprint(settings.password) });
    } else if (body.action === 'disconnect') {
      await writeMailSettings({});
    } else return json({ error: 'invalid_action' }, 400);
    return json({ ok: true, ...await mailStatus() });
  } catch (error) {
    const known = ['mail_auth_failed', 'mail_rejected', 'mail_temporarily_rejected', 'mail_delivery_unknown', 'mail_not_connected', 'app_password_required'];
    return json({ error: known.includes(error.message) ? error.message : smtpErrorCode(error) }, 400);
  }
}
