"use client";
import {useMemo,useState} from "react";
import Link from "next/link";

const COLORS={a_qualifier:"#9A6700",intermediaire:"#6B7280",hors_france:"#9CA3AF"};
const LABELS={a_qualifier:"À qualifier en France",intermediaire:"Intermédiaire / client final à confirmer",hors_france:"Hors périmètre France"};
export default function HistoricalArchive({ archive }) {
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  const profiles=useMemo(()=>archive.people.filter(person=>{
    if(filter!=="all" && person.scope!==filter)return false;
    const needle=search.trim().toLocaleLowerCase("fr");
    return !needle || [person.name,person.company,person.role,...person.companies].join(" ").toLocaleLowerCase("fr").includes(needle);
  }),[archive.people,search,filter]);
  return <main style={{maxWidth:1140,margin:"0 auto",padding:"36px 22px 80px",fontFamily:"system-ui,sans-serif"}}>
    <p><Link href="/growth">← Growth Intelligence</Link></p>
    <p style={{color:"#777",fontSize:12,letterSpacing:2}}>AUTONOMIA · MÉMOIRE DE PROSPECTION</p>
    <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",marginBottom:8}}>Contacts historiques retrouvés</h1>
    <p style={{maxWidth:860,lineHeight:1.6}}>Fiches issues des recherches passées, sans suppression ni nouvelle prospection. Les anciennes annonces restent rattachées à leur source d’origine. Un profil historique n’est pas automatiquement un décideur actuel, ni un client final français.</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,margin:"24px 0"}}>
      {[[archive.records,"fiches sources"],[archive.opportunityLinks,"références d’annonces"],[archive.uniqueProfiles,"profils LinkedIn uniques"],[archive.missingLinkedin,"noms sans LinkedIn"]].map(([value,label])=><div key={label} style={{padding:16,border:"1px solid #d9d9d9",borderRadius:12,minWidth:150}}><strong style={{display:"block",fontSize:28}}>{value}</strong><span>{label}</span></div>)}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:12,margin:"22px 0"}}>
      <label style={{flex:"1 1 280px"}}>Rechercher un nom ou une entreprise
        <input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Nom, société, fonction…" style={{display:"block",width:"100%",padding:12,marginTop:5,border:"1px solid #ccc",borderRadius:8}}/>
      </label>
      <label>Afficher
        <select value={filter} onChange={event=>setFilter(event.target.value)} style={{display:"block",padding:12,marginTop:5,border:"1px solid #ccc",borderRadius:8}}>
          <option value="all">Toute la mémoire conservée</option>
          <option value="a_qualifier">À qualifier (France / client final)</option>
          <option value="intermediaire">Intermédiaires</option>
          <option value="hors_france">Hors périmètre France</option>
        </select>
      </label>
    </div>
    <p style={{color:"#555"}}>{profiles.length} fiche(s) distincte(s) affichée(s). Les références historiques restent consultables même hors périmètre commercial actif.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:12}}>
      {profiles.map((person,i)=><article key={person.linkedinUrl || person.company+person.name+i} style={{border:"1px solid #ddd",borderRadius:12,padding:18}}>
        <span style={{fontSize:12,color:COLORS[person.scope]}}>{LABELS[person.scope]}</span>
        <h2 style={{fontSize:18,margin:"8px 0 4px"}}>{person.name || "Personne non nommée"}</h2>
        <div style={{fontWeight:600}}>{person.company || "Entreprise non identifiée"}</div>
        <p style={{minHeight:22}}>{person.role || "Fonction à documenter"}</p>
        <small>Source : {person.origin==="annonce_historique"?"annonce rapprochée":"fiche entreprise"} · {person.opportunityIds.length} annonce(s) liée(s) · {person.reviewedAt || "date indisponible"}</small>
        {person.status && <p style={{fontSize:12,color:"#555"}}>{person.status}</p>}
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:12}}>
          {person.linkedinUrl && <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {person.evidenceUrl && <a href={person.evidenceUrl} target="_blank" rel="noopener noreferrer">Preuve ↗</a>}
          {person.originalUrl && person.originalUrl!==person.evidenceUrl && <a href={person.originalUrl} target="_blank" rel="noopener noreferrer">Annonce ↗</a>}
        </div>
      </article>)}
    </div>
  </main>;
}
