"use client";
import {useMemo,useState} from "react";
import {trainerProposalDraft} from "../../lib/training/trainerBuyerIntelligence.js";
import {TRAINING_FAMILIES,BUYER_TYPES} from "../../lib/training/trainingLeadFilters.js";

const LABELS={date_a_revalider:"Dates à revalider",a_qualifier:"Besoin à qualifier",pourvu:"Mission annoncée pourvue",historique:"Référence historique",nouveau:"Annonce à vérifier"};
const THEMES={management:"Management / RH",petite_enfance:"Petite enfance",sante_securite:"Sécurité / SST",bureautique:"Bureautique",langues:"Langues",ia_digital:"IA / numérique"};
const GEO={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};
function shortlist(lead){return lead.state==="pourvu"||lead.state==="historique"?"Approche partenariat futur / veille des prochaines sessions":"Vérifier si la mission reste ouverte, avant tout devis";}
export default function BuyerWorkbench({leads=[]}){
 const [selected,setSelected]=useState(leads[0]?.id||"");
 const [pays,setPays]=useState("TOUS");
 const [topic,setTopic]=useState("TOUS");
 const [buyerFilter,setBuyerFilter]=useState("TOUS");
 const [statusFilter,setStatusFilter]=useState("TOUS");
 const [fields,setFields]=useState({});
 const [copied,setCopied]=useState(false);
 const filtered=useMemo(()=>leads.filter(l=>(pays==="TOUS"||l.country===pays)&&(topic==="TOUS"||l.theme===topic)&&(buyerFilter==="TOUS"||l.buyerType===buyerFilter)&&(statusFilter==="TOUS"||(statusFilter==="recent"&&["nouveau","a_qualifier","date_a_revalider"].includes(l.state))||(statusFilter==="archive"&&["pourvu","historique"].includes(l.state)))),[leads,pays,topic,buyerFilter,statusFilter]);
 const active=filtered.find(l=>l.id===selected)||filtered[0];
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
   "LinkedIn : "+(active.contactProfile||"Non trouvé"),
   "Téléphone entreprise : "+(active.businessPhone||"Non trouvé"),
   "Source téléphone : "+(active.businessPhoneSource||"Non publiée"),
   "Budget : "+(fields.tarif||"À confirmer"),
   "Prochaine action : "+shortlist(active),
   "Source : "+active.source
 ].join("\n"):"";
 async function copy(content){await navigator.clipboard.writeText(content);setCopied(true);}
 return <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,360px),1fr))",gap:18,marginTop:20}}>
  <div>
   <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
    <label>Pays<select aria-label="Filtrer par pays" value={pays} onChange={e=>setPays(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(GEO).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
    <label>Secteur<select aria-label="Filtrer par secteur" value={topic} onChange={e=>setTopic(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(TRAINING_FAMILIES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
   </div>
   <label style={{display:"block",marginBottom:12}}>Type d’acheteur <select aria-label="Type d’acheteur" value={buyerFilter} onChange={e=>{setBuyerFilter(e.target.value);setSelected("");setFields({})}} style={{padding:9,marginLeft:8}}><option value="TOUS">Tous les types</option>{Object.entries(BUYER_TYPES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
   <label style={{display:"block",marginBottom:12}}>État de l’annonce <select aria-label="État de l’annonce" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setSelected("");setFields({})}} style={{padding:9,marginLeft:8}}><option value="TOUS">Toutes les annonces</option><option value="recent">À vérifier en priorité</option><option value="archive">Anciennes ou pourvues</option></select></label>
   <p><button type="button" onClick={()=>{setTopic("ia");setBuyerFilter("TOUS");setSelected("");setFields({})}} style={{padding:"10px 14px",fontWeight:700,border:"1px solid #5068bf",borderRadius:10}}>Voir immédiatement les besoins IA</button></p>
   <p>{filtered.length} annonces sourcées · <strong>{filtered.filter(l=>l.theme==="ia").length} IA</strong> · {filtered.filter(l=>l.buyerType==="direct").length} acheteurs directs confirmés.</p>
   {filtered.length===0&&<p>Aucune annonce trouvée avec ces filtres. Essayez « Tous les types » ou une autre famille.</p>}
   <div style={{display:"grid",gap:10}}>
   {filtered.map(lead=><div key={lead.id}><button type="button" onClick={()=>{setSelected(lead.id);setFields({});setCopied(false)}} style={{textAlign:"left",padding:16,background:active?.id===lead.id?"#e9efff":"#fff",border:active?.id===lead.id?"2px solid #365cb9":"1px solid #d3dbe8",borderRadius:12,cursor:"pointer"}}>
    <small>{GEO[lead.country]||"Pays à vérifier"} · {TRAINING_FAMILIES[lead.theme]||"Formation"} · {BUYER_TYPES[lead.buyerType]||"Acheteur à vérifier"} · {LABELS[lead.state]||"À qualifier"}</small>
    <strong style={{display:"block",margin:"7px 0"}}>{lead.buyer||"Organisme à identifier"}</strong>
    <span>{lead.need||lead.title}</span>
    <span style={{display:"block",marginTop:8,fontSize:12,color:"#3d5077"}}>Annonce sourcée · {lead.dates||"Date à confirmer"}</span>
   </button><div style={{padding:"5px 12px 12px"}}><a href={lead.source} target="_blank" rel="noopener noreferrer">Voir l’annonce originale ↗</a></div></div>)}
   </div>
  </div>
  <aside style={{border:"1px solid #d3dbe8",borderRadius:14,padding:20,alignSelf:"start"}}>
   {active?<>
    <h2 style={{fontSize:21,margin:"0 0 8px"}}>Qualification et proposition</h2>
    <p><strong>Acheteur :</strong> {active.buyer}</p>
    <p><strong>Famille :</strong> {TRAINING_FAMILIES[active.theme]||"Autres"} · <strong>Statut :</strong> {LABELS[active.state]||"À vérifier"}</p>
    <p><strong>Type d’acheteur :</strong> {BUYER_TYPES[active.buyerType]||"Acheteur à vérifier"} (qualification fondée sur l’annonce)</p>
    <p><strong>Validation :</strong> {active.buyerStatus||"À confirmer"}</p>
    <p><strong>Interlocuteur :</strong> {active.contact||"À rechercher"} — {active.contactRole||"Rôle décisionnaire à vérifier"}</p>
    {active.secondaryContact&&<p><strong>Autre contact :</strong> {active.secondaryContact}</p>}
    {active.contactProfile&&<p><a href={active.contactProfile} target="_blank" rel="noopener noreferrer">Profil LinkedIn personnel documenté ↗</a></p>}
    {active.businessPhone&&<p><strong>Téléphone professionnel :</strong> <a href={"tel:"+active.businessPhone.replace(/[^+0-9]/g,"")}>{active.businessPhone}</a> · <a href={active.businessPhoneSource} target="_blank" rel="noopener noreferrer">Source ↗</a></p>}
    {!active.businessPhone&&<p>Téléphone professionnel : non trouvé</p>}
    {active.contactSource&&<p><a href={active.contactSource} target="_blank" rel="noopener noreferrer">Preuve de la fonction et de l’organisme ↗</a></p>}
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
