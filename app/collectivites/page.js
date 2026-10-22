import Link from 'next/link';
import { initialFilters } from '../../lib/collectivites/usability.js';
import CollectivitesDashboard from './CollectivitesDashboard.js';
export const dynamic = 'force-dynamic';
export default async function CollectivitesPage({ searchParams }) {
  const params = await searchParams;
  return <main>
    <section className="territoryHero"><div><p className="eyebrow">AUTONOMIA / PROSPECTION PUBLIQUE</p><h1>Territoires et Collectivités</h1><p>Formations et automatisation IA · Annuaire des syndicats et intercommunalités</p></div><Link className="territoryBack" href="/">← Cockpit</Link></section>
    <nav className="territoryFilters" aria-label="Vues territoires"><Link href="/territoires">Priorités et signaux des territoires</Link><Link href="/collectivites" className="active" aria-current="page">Toutes les collectivités · BANATIC</Link></nav>
    <CollectivitesDashboard initialFilters={initialFilters(params)} />
  </main>;
}
