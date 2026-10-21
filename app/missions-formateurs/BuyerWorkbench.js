"use client";
import {useMemo,useState} from "react";
import {trainerProposalDraft} from "../../lib/training/trainerBuyerIntelligence.js";

const LABELS={date_a_revalider:"Dates à revalider",a_qualifier:"Besoin à qualifier",pourvu:"Mission annoncée pourvue",historique:"Référence historique",nouveau:"Annonce à vérifier"};
const THEMES={management:"Management / RH",petite_enfance:"Petite enfance",sante_securite:"Sécurité / SST",bureautique:"Bureautique",langues:"Langues",ia_digital:"IA / numérique"};
const GEO={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};
function shortlist(lead){return lead.state==="pourvu"||lead.state==="historique"?"Approche partenariat futur / veille des prochaines sessions":"Vérifier si la mission reste ouverte, avant tout devis";}
export default function BuyerWorkbench({leads=[]}){
 const [selected,setSelected]=useState(leads[0]?.id||"");
 const [pays,setPays]=useState("TOUS");
 const [topic,setTopic]=useState("TOUS");
 const [fields,setFields]=useState({});
 const [copied,setCopied]=useState(false);
 const filtered=useMemo(()=>leads.filter(l=>(pays==="TOUS"||l.country===pays)&&(topic==="TOUS"||l.theme===topic)),[leads,pays,topic]);
 const active=leads.find(l=>l.id===selected)||filtered[0];
 const proposal=active?trainerProposalDraft(active,{contact:fields.contact||"",organisation:fields.organisation||"",dates:fields.dates||"",modalite:fields.modalite||"",tarif:fields.tarif||""}):"";
 const brief=active?[
   "AUTONOMIA Academy — fiche de qualification",
   "Acheteur pressenti : "+active.buyer,
   "Statut acheteur : "+(active.buyerStatus||"À identifier"),
   "Besoin documenté : "+(active.need||active.title||"À confirmer"),
   "Pays : "+(GEO[active.country]||active.country),
   "Lieu : "+(active.location||"À confirmer"),
   "Dates : "+(fields.dates||active.dates||"À confirmer"),
   "Modalité : "+(fields.modalite||active.mode||"À confirmer"),
   "Interlocuteur : "+(fields.contact||active.contact||"À identifier"),
   "Mandat du contact : "+(active.contactRole||"À vérifier"),
   "Budget : "+(fields.tarif||"À confirmer"),
   "Prochaine action : "+shortlist(active),
   "Source : "+active.source
 ].join("\n"):"";
 async function copy(content){await navigator.clipboard.writeText(content);setCopied(true);}
 return <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,360px),1fr))",gap:18,marginTop:20}}>
  <div>
   <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
    <label>Pays<select aria-label="Filtrer par pays" value={pays} onChange={e=>setPays(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(GEO).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
    <label>Secteur<select aria-label="Filtrer par secteur" value={topic} onChange={e=>setTopic(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(THEMES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
   </div>
   <p>{filtered.length} fiches de recherche ou de veille · informations à revalider.</p>
   <div style={{display:"grid",gap:10}}>
   {filtered.map(lead=><button type="button" key={lead.id} onClick={()=>{setSelected(lead.id);setFields({});setCopied(false)}} style={{textAlign:"left",padding:16,background:active?.id===lead.id?"#e9efff":"#fff",border:active?.id===lead.id?"2px solid #365cb9":"1px solid #d3dbe8",borderRadius:12,cursor:"pointer"}}>
    <small>{GEO[lead.country]||"Pays à vérifier"} · {THEMES[lead.theme]||"Formation"} · {LABELS[lead.state]||"À qualifier"}</small>
    <strong style={{display:"block",margin:"7px 0"}}>{lead.buyer||"Organisme à identifier"}</strong>
    <span>{lead.need||lead.title}</span>
   </button>)}
   </div>
  </div>
  <aside style={{border:"1px solid #d3dbe8",borderRadius:14,padding:20,alignSelf:"start"}}>
   {active?<>
    <h2 style={{fontSize:21,margin:"0 0 8px"}}>Qualification et proposition</h2>
    <p><strong>Acheteur :</strong> {active.buyer}</p>
    <p><strong>Validation :</strong> {active.buyerStatus||"À confirmer"}</p>
    <p><strong>Interlocuteur :</strong> {active.contact||"À rechercher"} — {active.contactRole||"Rôle décisionnaire à vérifier"}</p>
    <p><strong>Besoin :</strong> {active.need||active.title}</p>
    <p><strong>Date :</strong> {active.dates||"À vérifier"} · <strong>Format :</strong> {active.mode||"À confirmer"}</p>
    <p><strong>Action conseillée :</strong> {shortlist(active)}</p>
    <p><a href={active.source} target="_blank" rel="noopener noreferrer">Vérifier la publication d’origine ↗</a></p>
    <h3>Compléter la proposition</h3>
    {[
      ["contact","Prénom ou nom du contact"],
      ["organisation","Organisme contractant confirmé"],
      ["dates","Dates confirmées"],
      ["modalite","Distanciel ou présentiel confirmé"],
      ["tarif","Prix à proposer, si validé"]
    ].map(([key,label])=><label key={key} style={{display:"block",marginBottom:9}}>{label}<input value={fields[key]||""} onChange={e=>setFields({...fields,[key]:e.target.value})} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:4,border:"1px solid #bec9d9",borderRadius:7}}/></label>)}
    <h3>Projet de message commercial</h3>
    <textarea readOnly value={proposal} rows={14} style={{width:"100%",boxSizing:"border-box",padding:12,fontFamily:"inherit",border:"1px solid #cbd5e1",borderRadius:10}}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
      <button type="button" onClick={()=>copy(proposal)} style={{padding:11}}>Copier le message</button>
      <button type="button" onClick={()=>copy(brief)} style={{padding:11}}>Copier la fiche acheteur</button>
    </div>
    {copied&&<p role="status">Texte copié. Vérifie le besoin et les disponibilités avant envoi.</p>}
    <small>Aucun message n’est envoyé depuis le cockpit. Les modifications ici servent à préparer le document, sans être enregistrées dans le CRM.</small>
   </>:<p>Sélectionne une fiche.</p>}
  </aside>
 </section>;
}
