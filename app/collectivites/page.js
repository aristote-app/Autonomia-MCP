import Link from 'next/link';
import CollectivitesDashboard from './CollectivitesDashboard.js';
export const dynamic = 'force-dynamic';
export default async function CollectivitesPage() {
  return <main>
    <section className="territoryHero"><div><p className="eyebrow">AUTONOMIA / PROSPECTION PUBLIQUE</p><h1>Territoires et Collectivités</h1><p>Formations et automatisation IA · Annuaire des syndicats et intercommunalités</p></div><Link className="territoryBack" href="/">← Cockpit</Link></section>
    <nav className="territoryFilters" aria-label="Vues territoires"><Link href="/territoires">Priorités et signaux des territoires</Link><Link href="/collectivites" className="active" aria-current="page">Toutes les collectivités · BANATIC</Link></nav>
    <CollectivitesDashboard />
  </main>;
}
