import { redirect } from 'next/navigation';
import { getAutonomiaServerClient } from '../../../../lib/db/supabase.js';
export const dynamic = 'force-dynamic';
export const metadata = { referrer: 'no-referrer', robots: { index: false, follow: false } };
const valid = token => /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(token || '');
async function unsubscribe(form) {
  'use server';
  const token = String(form.get('token') || '');
  if (!valid(token)) redirect('/email/unsubscribed');
  const { error } = await getAutonomiaServerClient().rpc('unsubscribe_email', { p_token: token });
  if (error) redirect('/email/unsubscribed?error=1');
  redirect('/email/unsubscribed');
}
export default async function Unsubscribe({ params }) {
  const { token } = await params;
  return <main style={{ maxWidth: 560, margin: '60px auto', padding: 24 }}><h1>Ne plus recevoir nos messages</h1><p>Confirme ton choix pour arrêter les emails de prospection AUTONOMIA à cette adresse.</p>{valid(token) && <form action={unsubscribe}><input type="hidden" name="token" value={token}/><button type="submit">Me désinscrire</button></form>}</main>;
}
