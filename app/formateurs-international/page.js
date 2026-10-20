import Link from "next/link";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import { searchJobSignals } from "../../lib/db/jobSignals.js";

export const dynamic="force-dynamic";
export const metadata={title:"Missions formateurs francophones · AUTONOMIA",robots:{index:false,follow:false}};

const COUNTRIES=[["CH","Suisse"],["BE","Belgique"],["CA","Canada"]];
function clean(s,n=180){return String(s||"").replace(/\\s+/g," ").trim().slice(0,n)}
function sourceLink(v){try{const u=new URL(v);return u.protocol==="https:"&&!u.username&&!u.password&&/(^|\\.)linkedin\\.com$|(^|\\.)indeed\\.com$/.test(u.hostname)?u.href:null}catch{return null}}
function countryOf(item){
 const raw=String(item?.raw_payload?.target_country||"").toUpperCase();
 if(COUNTRIES.some(([code])=>code===raw))return raw;
 return null;
}
function modality(item) {
 const raw=item?.raw_payload?.training_delivery;
 return raw==="distanciel_mentionne"?"Distanciel mentionné":raw==="presentiel_mentionne"?"Présentiel mentionné":"À confirmer auprès du client";
}
export default async function TrainersInternationalPage({searchParams}) {
 const params=await searchParams;
 const target=COUNTRIES.some(([code])=>code===params?.pays)?params.pays:"TOUS";
 const requestedMode=["tous","distanciel","presentiel","confirmer"].includes(params?.modalite)?params.modalite:"tous";
 const result=hasAutonomiaDatabase()?await searchJobSignals({sources:["linkedin","indeed"],signalKey:"international_francophone_trainer_demand",franceOnly:false,limit:250}).catch(()=>null):null;
 const items=(result?.items||[]).filter(item=>countryOf(item)&&sourceLink(item.source_url));
 const list=items.filter(item=>(target==="TOUS"||countryOf(item)===target)&&(requestedMode==="tous"||requestedMode==="distanciel"&&modality(item)==="Distanciel mentionné"||requestedMode==="presentiel"&&modality(item)==="Présentiel mentionné"||requestedMode==="confirmer"&&modality(item).startsWith("À confirmer")));
 return <main style={{maxWidth:1120,margin:"0 auto",padding:"34px 22px 90px",fontFamily:"system-ui,sans-serif"}}>
 <p><Link href="/growth">← Growth Intelligence</Link></p>
 <p style={{fontSize:12,letterSpacing:2,color:"#57647b"}}>AUTONOMIA · ACADEMY INTERNATIONAL</p>
 <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:6}}>Demandes de formateurs francophones</h1>
 <p style={{maxWidth:860,lineHeight:1.6}}>Suisse, Belgique et Canada : demandes liées aux formations IA, numériques et bureautiques. Deux pistes de réalisation : formation en distanciel si elle est acceptée, ou présentiel assuré par un formateur mandaté localement. La modalité et la langue doivent être confirmées avec le donneur d’ordre.</p>
 <div style={{display:"flex",flexWrap:"wrap",gap:12,margin:"22px 0"}}>
 {COUNTRIES.map(([code,name])=><div key={code} style={{background:"#f3f5fb",padding:16,borderRadius:12,minWidth:160}}><strong>{name}</strong><p style={{margin:"6px 0 0"}}>{items.filter(item=>countryOf(item)===code).length} signal(s) retrouvé(s)</p></div>)}
 </div>
 <form action="/formateurs-international" style={{display:"flex",flexWrap:"wrap",gap:12,margin:"24px 0"}}>
 <label>Pays<select name="pays" defaultValue={target} style={{display:"block",padding:10,marginTop:6}}><option value="TOUS">Les 3 pays</option>{COUNTRIES.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></label>
 <label>Modalité mentionnée<select name="modalite" defaultValue={requestedMode} style={{display:"block",padding:10,marginTop:6}}><option value="tous">Toutes les modalités</option><option value="distanciel">Distanciel</option><option value="presentiel">Présentiel</option><option value="confirmer">À confirmer</option></select></label>
 <button type="submit" style={{alignSelf:"end",padding:"12px 18px",background:"#1c2855",color:"white",border:0,borderRadius:8}}>Filtrer les missions</button>
 </form>
 <p style={{color:"#526079"}}>{list.length} signal(s) correspondant aux filtres. Sources publiques indexées : annonces et publications. Les résultats ne constituent pas des commandes acquises.</p>
 {!result&&<p>Base de signaux temporairement indisponible. Les recherches programmées restent configurées.</p>}
 {list.length===0&&<section style={{padding:22,border:"1px solid #d8dfed",borderRadius:14}}><strong>Aucune annonce correspondant aux critères pour le moment.</strong><p>Les requêtes sont intégrées à la recherche automatique. Une demande doit être publiée et détectée par la source pour apparaître ici.</p></section>}
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:15}}>
 {list.map(item=><article key={item.id||item.source_url} style={{border:"1px solid #d7deea",borderRadius:14,padding:20}}>
 <p style={{fontSize:12,color:"#556"}}>{COUNTRIES.find(([code])=>code===countryOf(item))?.[1]} · {modality(item)}</p>
 <h2 style={{fontSize:19}}>{clean(item.title)}</h2>
 <p>{clean(item.company_name)||"Donneur d’ordre à identifier"}</p>
 <p style={{fontSize:13,color:"#526079"}}>Source : {item.source_id==="indeed"?"Indeed":"LinkedIn"} · Dernière détection : {item.last_seen_at?new Date(item.last_seen_at).toLocaleDateString("fr-FR"):"non disponible"}</p>
 <a href={sourceLink(item.source_url)} target="_blank" rel="noopener noreferrer">Voir la source et vérifier le besoin ↗</a>
 </article>)}
 </div>
 <p style={{marginTop:30,fontSize:13,color:"#526079"}}>Qualification commerciale : vérifier le besoin, la langue française, le client final, les horaires et les contraintes contractuelles locales avant de proposer un formateur. Aucune prospection automatique n’est déclenchée.</p>
 </main>;
}
