import { getAutonomiaServerClient } from '../../../../lib/db/supabase.js';
export const runtime = 'nodejs';
export async function POST(request, { params }) {
  const { token } = await params;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(token || '')) return new Response(null, { status: 204 });
  const { error } = await getAutonomiaServerClient().rpc('unsubscribe_email', { p_token: token });
  return new Response(null, { status: error ? 503 : 204, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
}
