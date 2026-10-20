import Link from "next/link";
import HistoricalArchive from "./HistoricalArchive.js";
import {buildHistoricalGrowthArchive} from "../../../lib/intelligence/historicalGrowthArchive.js";
import {getCurrentWorkspaceMembership} from "../../../lib/auth/access.js";
import {listWorkspaceSalesContacts} from "../../../lib/db/salesContacts.js";
import {reconcileHistoricalWithCrm} from "../../../lib/intelligence/reconcileHistoricalContacts.js";

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
  const crm=await listWorkspaceSalesContacts({workspaceId:context.membership.workspace_id,limit:500}).catch(()=>null);
  const archive=buildHistoricalGrowthArchive();
  const merged=crm ? reconcileHistoricalWithCrm(archive,crm) : archive;
  return <><section style={{padding:"16px 24px",maxWidth:1140,margin:"0 auto"}}><h2>Rapprochement avec le CRM</h2>{merged.reconciliation ? <p>{merged.reconciliation.matched} profils déjà enregistrés dans le CRM, {merged.reconciliation.unlinked} profils historiques absents, {merged.reconciliation.unknown} identités à vérifier. Aucun import automatique.</p> : <p>Comparaison CRM indisponible.</p>}</section><HistoricalArchive archive={merged}/></>;
}
