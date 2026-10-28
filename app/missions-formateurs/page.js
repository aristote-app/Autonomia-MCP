import {loadTrainingLeads} from "../../lib/training/loadTrainingLeads.js";
import Link from "next/link";
import BuyerWorkbench from "./BuyerWorkbench.js";

export const dynamic="force-dynamic";
export const metadata={title:"Acheteurs et missions formateurs · AUTONOMIA Academy",robots:{index:false,follow:false}};

const COUNTRIES={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};

export default async function Page() {
 const {leads,incomingCount,reviewedCount,discoveryError}=await loadTrainingLeads();
 return <main style={{maxWidth:1220,margin:"0 auto",padding:"32px 22px 90px",fontFamily:"system-ui,sans-serif"}}>
  <p><Link href="/growth">← Retour à Growth Intelligence</Link></p>
  <p style={{letterSpacing:2,color:"#61708c",fontSize:12}}>AUTONOMIA · ACADEMY · DÉVELOPPEMENT COMMERCIAL</p>
  <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",margin:"8px 0"}}>Organismes acheteurs et missions de formateurs</h1>
  <p><Link href="/campagnes" style={{display:"inline-block",padding:"12px 20px",borderRadius:10,background:"#147d76",color:"white",fontWeight:700,textDecoration:"none"}}>Campagnes email · envoyer à plusieurs contacts →</Link></p>
  <p style={{maxWidth:920,lineHeight:1.7}}>France, Suisse, Belgique et Canada francophone. Le réseau de formateurs est déjà constitué : ce tableau sert à retrouver les demandes, identifier les acheteurs, qualifier leurs besoins et préparer des propositions commerciales à valider avant tout envoi.</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:12,margin:"24px 0"}}>
   {[
    [incomingCount,"demandes découvertes automatiquement"],
    [reviewedCount,"annonces documentées à requalifier"],
    [Object.keys(COUNTRIES).length,"pays couverts"]
   ].map(([v,label])=><div key={label} style={{padding:18,background:"#f0f4fa",borderRadius:12,minWidth:180}}><strong style={{display:"block",fontSize:25}}>{v}</strong><span>{label}</span></div>)}
  </div>
  <p style={{fontSize:13,color:"#526179"}}>Les exemples issus de publications publiques peuvent être passés ou pourvus. Une entreprise citée ou un auteur de publication n’est pas automatiquement le décideur contractuel.</p>
  {discoveryError&&<p role="alert">Collecteur : lecture des annonces indisponible. Seules les annonces documentées ci-dessous sont affichées.</p>}
  <BuyerWorkbench leads={leads}/>
 </main>;
}
