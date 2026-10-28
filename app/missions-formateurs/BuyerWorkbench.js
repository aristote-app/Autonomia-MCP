"use client";
import {useEffect,useMemo,useState} from "react";
import {trainerProposalDraft} from "../../lib/training/trainerBuyerIntelligence.js";
import {TRAINING_STAGES,workflowMatch,trainingWaalaxyCsv,gmailComposeLink} from "../../lib/training/prospectWorkflow.js";
import {trainingSourceKey} from "../../lib/training/sourceKey.js";
import {TRAINING_FAMILIES,BUYER_TYPES} from "../../lib/training/trainingLeadFilters.js";

const LABELS={date_a_revalider:"Dates à revalider",a_qualifier:"Besoin à qualifier",pourvu:"Mission annoncée pourvue",historique:"Référence historique",nouveau:"Annonce à vérifier"};
const STAGES=TRAINING_STAGES;
const THEMES={management:"Management / RH",petite_enfance:"Petite enfance",sante_securite:"Sécurité / SST",bureautique:"Bureautique",langues:"Langues",ia_digital:"IA / numérique"};
const GEO={FR:"France",CH:"Suisse",BE:"Belgique",CA:"Canada"};
function shortlist(lead){return lead.state==="pourvu"||lead.state==="historique"?"Approche partenariat futur / veille des prochaines sessions":"Vérifier si la mission reste ouverte, avant tout devis";}
export default function BuyerWorkbench({leads:detectedLeads=[]}){
 const [cloud,setCloud]=useState({state:'loading',records:{},events:[],canWrite:false});
 const leads=useMemo(()=>{const map=new Map(detectedLeads.map(l=>[trainingSourceKey(l.source),l]));for(const row of Object.values(cloud.records)){if(row.snapshot?.id&&row.snapshot?.source&&!map.has(row.source_key))map.set(row.source_key,row.snapshot);}return [...map.values()];},[detectedLeads,cloud.records]);
 const [saving,setSaving]=useState(false);
 const [notice,setNotice]=useState('');
 const [workflow,setWorkflow]=useState('all');
 const [dirty,setDirty]=useState({});
 async function loadCloud(){
  try{const r=await fetch('/api/training-prospects',{cache:'no-store'});const body=await r.json();if(r.status===401){setDrafts({});setCloud({state:'login',records:{},events:[],canWrite:false});return;}if(!r.ok||!body.ok)throw new Error();
  const records=Object.fromEntries(body.records.map(row=>[row.source_key,row]));
  setCloud({state:'ready',workspaceId:body.workspaceId,waalaxyReady:body.waalaxyReady,records,events:body.events,canWrite:body.canWrite});
  setDrafts(prev=>{const next={...prev};for(const lead of [...leads,...body.records.map(r=>r.snapshot).filter(l=>l?.id&&l?.source)]){const row=records[trainingSourceKey(lead.source)];if(row)next[lead.id]={...row.draft,updatedAt:row.updated_at};}return next;});setDirty({});
  }catch{setCloud(prev=>({...prev,state:'error'}));}
 }
 useEffect(()=>{loadCloud();},[]);
 const [selected,setSelected]=useState(leads[0]?.id||"");
 const [pays,setPays]=useState("TOUS");
 const [topic,setTopic]=useState("TOUS");
 const [buyerFilter,setBuyerFilter]=useState("TOUS");
 const [statusFilter,setStatusFilter]=useState("TOUS");
 const [drafts,setDrafts]=useState({});
 const [ready,setReady]=useState(false);
 const [storageError,setStorageError]=useState("");
 const [keyword,setKeyword]=useState("");
 useEffect(()=>{if(!['ready','login'].includes(cloud.state))return;try{const key=cloud.state==='ready'?'autonomia-academy-workspace-'+cloud.workspaceId:'autonomia-academy-drafts-v1';const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))setDrafts(previous=>({...saved,...previous}));}catch{setStorageError('Lecture des brouillons indisponible.');}setReady(true);},[cloud.state,cloud.workspaceId]);
 useEffect(()=>{if(!ready||!['ready','login'].includes(cloud.state))return;try{const key=cloud.state==='ready'?'autonomia-academy-workspace-'+cloud.workspaceId:'autonomia-academy-drafts-v1';localStorage.setItem(key,JSON.stringify(drafts));}catch{setStorageError('Enregistrement local indisponible. Copiez la fiche avant de quitter.');}},[drafts,ready,cloud.state,cloud.workspaceId]);
 const [copied,setCopied]=useState(false);
 const filtered=useMemo(()=>leads.filter(l=>workflowMatch(cloud.state==='ready'?(cloud.records[trainingSourceKey(l.source)]?.draft||{}):drafts[l.id],workflow)&&(!keyword.trim()||[l.buyer,l.need,l.contact,l.location].join(" ").toLocaleLowerCase("fr").includes(keyword.trim().toLocaleLowerCase("fr")))&&(pays==="TOUS"||l.country===pays)&&(topic==="TOUS"||l.theme===topic)&&(buyerFilter==="TOUS"||l.buyerType===buyerFilter)&&(statusFilter==="TOUS"||(statusFilter==="recent"&&["nouveau","a_qualifier","date_a_revalider"].includes(l.state))||(statusFilter==="archive"&&["pourvu","historique"].includes(l.state)))),[leads,pays,topic,buyerFilter,statusFilter,keyword,drafts,workflow,cloud.state,cloud.records]);
 const active=filtered.find(l=>l.id===selected)||filtered[0];
 const fields=drafts[active?.id]||{};
 function updateField(key,value){if(!active||saving||cloud.state==='loading')return;setDirty(prev=>({...prev,[active.id]:true}));setNotice("");setCopied(false);setDrafts(previous=>({...previous,[active.id]:{...previous[active.id],[key]:value,updatedAt:new Date().toISOString()}}));}
 const saved=active?cloud.records[trainingSourceKey(active.source)]:null;
 const history=cloud.events.filter(e=>e.record_id===saved?.id).slice(0,12);
 async function importWaalaxy(){
  if(!saved||dirty[active.id]||saving)return;setSaving(true);setNotice('');
  try{const r=await fetch('/api/training-prospects/waalaxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recordId:saved.id})});const body=await r.json();
   const errors={waalaxy_not_configured:'Configure la clé API et la liste dans les intégrations.',contact_not_ready:'Vérifie le contact et ses coordonnées, puis enregistre la fiche.',already_imported_or_pending:'Ce profil a déjà été transféré ou son import est en cours de vérification.',import_result_unknown:'Le résultat de l’import doit être vérifié dans Waalaxy avant tout nouvel essai.'};
   setNotice(r.ok&&body.ok?'Contact transféré dans la liste Waalaxy. Aucune campagne lancée.':errors[body.error]||'Import indisponible. Tu peux utiliser le CSV.');
   const fresh=await fetch('/api/training-prospects',{cache:'no-store'}).then(r=>r.json());if(fresh.ok)setCloud(prev=>({...prev,events:fresh.events}));
  }catch{setNotice('Réponse interrompue : vérifie la liste Waalaxy avant de réessayer.');}finally{setSaving(false);}
 }
 async function saveShared(){
  if(!active||saving)return;setSaving(true);setNotice('');
  try{const r=await fetch('/api/training-prospects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({leadId:active.id,draft:fields,revision:saved?.revision||0,recordId:saved?.id||null})});const body=await r.json();
   if(r.status===409){setNotice('Une autre session a modifié cette fiche. Votre brouillon est conservé. Copiez-le avant de recharger le suivi partagé.');return;}
   if(!r.ok||!body.ok)throw new Error(body.error||'storage_unavailable');
   setCloud(prev=>({...prev,records:{...prev.records,[trainingSourceKey(active.source)]:body.record}}));setDrafts(prev=>({...prev,[active.id]:{...body.record.draft,updatedAt:body.record.updated_at}}));setDirty(prev=>({...prev,[active.id]:false}));setNotice('Fiche enregistrée dans le CRM partagé.');
   const fresh=await fetch('/api/training-prospects',{cache:'no-store'}).then(r=>r.json());if(fresh.ok)setCloud(prev=>({...prev,events:fresh.events}));
  }catch(error){setNotice(error.message==='not_authenticated'?'Connexion requise pour enregistrer la fiche.':'Enregistrement impossible. Votre brouillon local est conservé. Vérifiez les champs email, LinkedIn et date.');}finally{setSaving(false);}
 }
 function exportCsv(){const csv=trainingWaalaxyCsv(filtered,drafts);if(!csv.count){setNotice('Aucun profil LinkedIn personnel disponible dans cette sélection.');return;}const url=URL.createObjectURL(new Blob([csv.text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='autonomia-prospects-waalaxy.csv';a.click();URL.revokeObjectURL(url);setNotice(csv.count+' contacts exportés. L’export ne lance aucune campagne.');}
 const proposal=fields.message|| (active?trainerProposalDraft(active,{contact:fields.contact||"",organisation:fields.organisation||"",dates:fields.dates||"",modalite:fields.modalite||"",tarif:fields.tarif||""}):"");
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
   "LinkedIn : "+(fields.linkedin||active.contactProfile||"Non trouvé"),
   "Téléphone entreprise : "+(fields.phone||active.businessPhone||"Non trouvé"),
   "Source téléphone : "+(active.businessPhoneSource||"Non publiée"),
   "Budget : "+(fields.tarif||"À confirmer"),
   "Étape commerciale : "+(STAGES[fields.stage]||STAGES.detectee),
   "Notes : "+(fields.notes||""),
   "Prochaine relance : "+(fields.nextFollowup||"À planifier"),
   "Dernière modification : "+(fields.updatedAt||"Aucune"),
   "Prochaine action : "+shortlist(active),
   "Source : "+active.source
 ].join("\n"):"";
 async function copy(content){try{await navigator.clipboard.writeText(content);setCopied(true);}catch{setStorageError("Copie indisponible : sélectionnez le texte du message pour le copier.");}}
 return <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,360px),1fr))",gap:18,marginTop:20}}>
  <div>
   <div style={{padding:14,background:'#f0f4fa',borderRadius:10,marginBottom:14}}>
    <strong>Mon suivi commercial</strong>
    <p>{cloud.state==='ready'?'CRM partagé connecté — '+Object.keys(cloud.records).length+' fiches enregistrées':cloud.state==='loading'?'Connexion au suivi partagé…':cloud.state==='login'?'Connecte-toi pour retrouver ton suivi sur tous tes appareils.':'Suivi partagé indisponible. Les brouillons restent conservés sur ce navigateur.'}</p>
    {cloud.state==='login'&&<a href="/login?next=/missions-formateurs">Se connecter au CRM partagé ↗</a>}
    <label>Vue commerciale<select aria-label="Vue commerciale" value={workflow} onChange={e=>setWorkflow(e.target.value)} style={{display:'block',padding:9}}>{[['all','Toutes'],['todo','À contacter'],['due','À relancer'],['reponse','Réponses reçues'],['rdv','Rendez-vous'],['proposition','Propositions'],['gagne','Gagnés'],['perdu','Perdus']].map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
    <button type="button" onClick={exportCsv} style={{padding:10,marginTop:10}}>Exporter la sélection pour Waalaxy</button>
   </div>
   <label>Rechercher un besoin, un acheteur ou un contact<input aria-label="Rechercher les annonces" value={keyword} onChange={e=>setKeyword(e.target.value)} style={{display:"block",padding:10,width:"100%",boxSizing:"border-box",marginBottom:14}}/></label>
   <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
    <label>Pays<select aria-label="Filtrer par pays" value={pays} onChange={e=>setPays(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(GEO).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
    <label>Secteur<select aria-label="Filtrer par secteur" value={topic} onChange={e=>setTopic(e.target.value)} style={{display:"block",padding:9}}><option value="TOUS">Tous</option>{Object.entries(TRAINING_FAMILIES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
   </div>
   <label style={{display:"block",marginBottom:12}}>Type d’acheteur <select aria-label="Type d’acheteur" value={buyerFilter} onChange={e=>{setBuyerFilter(e.target.value);setSelected("");setCopied(false)}} style={{padding:9,marginLeft:8}}><option value="TOUS">Tous les types</option>{Object.entries(BUYER_TYPES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select></label>
   <label style={{display:"block",marginBottom:12}}>État de l’annonce <select aria-label="État de l’annonce" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setSelected("");setCopied(false)}} style={{padding:9,marginLeft:8}}><option value="TOUS">Toutes les annonces</option><option value="recent">À vérifier en priorité</option><option value="archive">Anciennes ou pourvues</option></select></label>
   <p><button type="button" onClick={()=>{setTopic("ia");setBuyerFilter("TOUS");setSelected("");setCopied(false)}} style={{padding:"10px 14px",fontWeight:700,border:"1px solid #5068bf",borderRadius:10}}>Voir immédiatement les besoins IA</button></p>
   <p>{filtered.length} annonces sourcées · <strong>{filtered.filter(l=>l.theme==="ia").length} IA</strong> · {filtered.filter(l=>l.buyerType==="direct").length} acheteurs directs confirmés.</p>
   {filtered.length===0&&<p>Aucune annonce trouvée avec ces filtres. Essayez « Tous les types » ou une autre famille.</p>}
   <div style={{display:"grid",gap:10}}>
   {filtered.map(lead=><div key={lead.id}><button type="button" disabled={saving} onClick={()=>{setSelected(lead.id);setCopied(false)}} style={{textAlign:"left",padding:16,background:active?.id===lead.id?"#e9efff":"#fff",border:active?.id===lead.id?"2px solid #365cb9":"1px solid #d3dbe8",borderRadius:12,cursor:"pointer"}}>
    <small>{GEO[lead.country]||"Pays à vérifier"} · {TRAINING_FAMILIES[lead.theme]||"Formation"} · {BUYER_TYPES[lead.buyerType]||"Acheteur à vérifier"} · {LABELS[lead.state]||"À qualifier"}</small>
    <strong style={{display:"block",margin:"7px 0"}}>{lead.buyer||"Organisme à identifier"}</strong>
    <span>{lead.need||lead.title}</span><small style={{display:"block",marginTop:6}}>Suivi : {STAGES[drafts[lead.id]?.stage]||STAGES.detectee}{drafts[lead.id]?.nextFollowup?" · Relance : "+drafts[lead.id].nextFollowup:""}{dirty[lead.id]?" · Modifications locales":""}</small>
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
    {active.contactProfile&&/^https:\/\/(?:fr\.|www\.)?linkedin\.com\/in\//i.test(active.contactProfile)&&<p><a href={active.contactProfile} target="_blank" rel="noopener noreferrer">Profil LinkedIn personnel documenté ↗</a></p>}
    {active.businessPhone&&<p><strong>Téléphone professionnel :</strong> <a href={"tel:"+active.businessPhone.replace(/[^+0-9]/g,"")}>{active.businessPhone}</a> · <a href={active.businessPhoneSource} target="_blank" rel="noopener noreferrer">Source ↗</a></p>}
    {active.businessPhoneType&&<p><small>{active.businessPhoneType}</small></p>}
    {active.businessEmail&&<p><strong>E-mail professionnel publié :</strong> <a href={"mailto:"+active.businessEmail}>{active.businessEmail}</a></p>}
    {!active.businessPhone&&<p>Téléphone professionnel : non trouvé</p>}
    {active.contactSource&&<p><a href={active.contactSource} target="_blank" rel="noopener noreferrer">Preuve de la fonction et de l’organisme ↗</a></p>}
    <p><strong>Besoin :</strong> {active.need||active.title}</p>
    <p><strong>Date :</strong> {active.dates||"À vérifier"} · <strong>Format :</strong> {active.mode||"À confirmer"}</p>
    <p><strong>Action conseillée :</strong> {shortlist(active)}</p>
    <p><a href={active.source} target="_blank" rel="noopener noreferrer">Vérifier la publication d’origine ↗</a></p>
    {active.estimatedBudget&&<p><strong>Budget publié :</strong> {active.estimatedBudget}</p>}
    <h3>Suivi commercial</h3>
    <p><small>{saved?'Fiche partagée · version '+saved.revision:'Brouillon local — clique sur « Enregistrer dans le CRM » pour le partager.'}</small></p>
    <button type="button" disabled={cloud.state!=='ready'||!cloud.canWrite||saving} onClick={saveShared} style={{padding:12,fontWeight:700}}>{saving?'Enregistrement…':'Enregistrer dans le CRM'}</button>
    {notice&&<p role="status">{notice}</p>}
    {cloud.state==='ready'&&<button type="button" disabled={saving} onClick={()=>{if(window.confirm('Recharger les fiches partagées et remplacer les modifications locales affichées ?'))loadCloud();}}>Recharger le suivi partagé</button>}
    <label>Étape commerciale<select aria-label="Étape commerciale" disabled={!ready||cloud.state==='loading'} value={fields.stage||"detectee"} onChange={e=>updateField("stage",e.target.value)} style={{display:"block",padding:9}}>{Object.entries(STAGES).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
    <label>Notes<textarea aria-label="Notes commerciales" disabled={!ready||cloud.state==='loading'} value={fields.notes||""} onChange={e=>updateField("notes",e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box"}}/></label>
    <label>Prochaine relance<input aria-label="Prochaine relance" type="date" disabled={!ready||cloud.state==='loading'} value={fields.nextFollowup||""} onChange={e=>updateField("nextFollowup",e.target.value)}/></label>
    {fields.updatedAt&&<p><small>Dernière modification : {new Date(fields.updatedAt).toLocaleString("fr-FR")}</small></p>}
    {storageError&&<p role="alert">{storageError}</p>}
    <label style={{display:'block',marginTop:12}}><input type="checkbox" checked={!!fields.doNotContact} onChange={e=>updateField('doNotContact',e.target.checked)}/> Ne plus contacter ce prospect</label>
    <h3>Coordonnées qualifiées</h3>
    {[["email","Email professionnel"],["linkedin","LinkedIn personnel"],["phone","Téléphone professionnel"],["role","Fonction confirmée"]].map(([key,label])=><label key={key} style={{display:'block',marginBottom:8}}>{label}<input aria-label={label} value={fields[key]||''} placeholder={key==='email'?active.businessEmail||'':key==='linkedin'?active.contactProfile||'':key==='phone'?active.businessPhone||'':''} onChange={e=>updateField(key,e.target.value)} style={{display:'block',width:'100%',padding:9,boxSizing:'border-box'}}/></label>)}
    <label><input type="checkbox" checked={!!fields.contactVerified} onChange={e=>updateField('contactVerified',e.target.checked)}/> Identité, fonction et coordonnées vérifiées par mes soins</label>
    <h3>Compléter la proposition</h3>
    {[
      ["contact","Prénom ou nom du contact"],
      ["organisation","Organisme contractant confirmé"],
      ["dates","Dates confirmées"],
      ["modalite","Distanciel ou présentiel confirmé"],
      ["tarif","Prix à proposer, si validé"]
    ].map(([key,label])=><label key={key} style={{display:"block",marginBottom:9}}>{label}<input disabled={!ready||cloud.state==='loading'} value={fields[key]||""} onChange={e=>updateField(key,e.target.value)} style={{display:"block",width:"100%",boxSizing:"border-box",padding:10,marginTop:4,border:"1px solid #bec9d9",borderRadius:7}}/></label>)}
    <h3>Projet de message commercial</h3>
    <textarea aria-label="Message commercial" value={proposal} onChange={e=>updateField("message",e.target.value)} rows={14} style={{width:"100%",boxSizing:"border-box",padding:12,fontFamily:"inherit",border:"1px solid #cbd5e1",borderRadius:10}}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
      <button type="button" onClick={()=>copy(proposal)} style={{padding:11}}>Copier le message</button>
      <button type="button" onClick={()=>copy(brief)} style={{padding:11}}>Copier la fiche acheteur</button>
      {!fields.doNotContact&&gmailComposeLink(fields.email||active.businessEmail,proposal)&&<a href={gmailComposeLink(fields.email||active.businessEmail,proposal)} target="_blank" rel="noopener noreferrer" style={{padding:11}}>Préparer dans Gmail ↗</a>}
    </div>
    {copied&&<p role="status">Texte copié. Vérifie le besoin et les disponibilités avant envoi.</p>}
    <small>« Préparer dans Gmail » ouvre un message à relire. Enregistre la fiche après chaque action pour partager son statut et sa prochaine relance.</small>
    <h3>Transfert vers Waalaxy</h3>
    {cloud.waalaxyReady?<button type="button" onClick={importWaalaxy} disabled={!saved||dirty[active.id]||saving||!fields.contactVerified||fields.doNotContact} style={{padding:11}}>Transférer le contact dans ma liste Waalaxy</button>:<p>Connexion Waalaxy à configurer : <a href="/integrations">ouvrir les intégrations ↗</a>. L’export CSV est disponible dans « Mon suivi commercial ».</p>}
    <small>Enregistre la fiche et confirme les coordonnées avant le transfert. Le transfert ajoute le contact à la liste et ne lance pas de campagne.</small>
    <h3>Historique partagé</h3>
    {history.length?<ul>{history.map(event=><li key={event.id}>{new Date(event.created_at).toLocaleString('fr-FR',{timeZone:'Europe/Paris'})} · {event.event_type==='created'?'Fiche créée':event.event_type==='waalaxy_imported'?'Transfert Waalaxy':'Fiche mise à jour'} · {STAGES[event.payload?.to_stage]||'Qualification enregistrée'}</li>)}</ul>:<p>Aucune action partagée pour cette annonce.</p>}
   </>:<p>Sélectionne une fiche.</p>}
  </aside>
 </section>;
}
