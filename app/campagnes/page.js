import Link from 'next/link';
import { redirect } from 'next/navigation';
import { campaignContext, writable } from '../../lib/campaigns/access.js';
import CampaignWorkbench from './CampaignWorkbench.js';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campagnes email · AUTONOMIA' };
export default async function Campaigns() {
  const c = await campaignContext();
  if (!c) redirect('/login?next=/campagnes');
  return <main><Link href="/missions-formateurs">← Missions et acheteurs</Link><CampaignWorkbench canManage={writable(c)}/></main>;
}
