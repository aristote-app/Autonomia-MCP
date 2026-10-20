import Link from "next/link";
import HistoricalArchive from "./HistoricalArchive.js";
import {buildHistoricalGrowthArchive} from "../../../lib/intelligence/historicalGrowthArchive.js";
import {getCurrentWorkspaceMembership} from "../../../lib/auth/access.js";

export const dynamic="force-dynamic";
export const metadata={title:"Historique des contacts · AUTONOMIA Growth",robots:{index:false,follow:false}};

export default async function HistoricalArchivePage(){
  // Names, research pairings and historical commercial intelligence belong to
  // the authenticated workspace, not to the anonymous Growth radar.
  const context=await getCurrentWorkspaceMembership().catch(()=>null);
  if(!context?.claims?.sub || !context?.membership?.workspace_id) {
    return <main style={{maxWidth:800,margin:"60px auto",padding:24,fontFamily:"system-ui,sans-serif"}}>
      <h1>Archives commerciales privées</h1>
      <p>Les recherches historiques sont conservées. Connecte-toi à ton espace AUTONOMIA pour consulter les fiches, profils LinkedIn et sources détaillées.</p>
      <Link href="/login?next=/growth/historique">Accéder à mon espace privé ↗</Link>
    </main>;
  }
  return <HistoricalArchive archive={buildHistoricalGrowthArchive()}/>;
}
