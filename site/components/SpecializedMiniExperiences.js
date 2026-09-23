"use client";

import { useMemo, useState } from "react";

function Shell({ label, metric, children, side }) {
  return (
    <div className="wowWorkspace specialized">
      <div className="wowControlPane">{side}</div>
      <div className="wowAppPane">
        <div className="wowAppHeader"><span>{label}</span><strong>{metric}</strong></div>
        {children}
      </div>
    </div>
  );
}

function Account360({ context, module, blueprint }) {
  const [tab, setTab] = useState("Décideurs");
  const sections = {
    Décideurs: [["DG", "Sponsor potentiel"], ["DSI", "Influence forte"], ["Métier", "Utilisateur clé"]],
    Signaux: [["Recrutement IA", "Signal fort"], ["Refonte CRM", "Signal moyen"], ["Croissance", "À surveiller"]],
    Historique: [["J-21", "Premier contact"], ["J-8", "Réponse obtenue"], ["J-2", "Nouveau signal"]]
  };
  return <Shell label="BRIEF COMPTE 360°" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">VUE À EXPLORER</p><div className="wowToggleRow">{Object.keys(sections).map(x=><button type="button" key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div><div className="wowNote"><b>Aujourd’hui</b><span>{module[1]}</span></div></>}>
      <div className="wowAccountHero"><span>COMPTE CIBLE</span><strong>{context.entities[0]}</strong><small>Score opportunité · 84/100</small></div>
      <div className="wowAccountGrid">{sections[tab].map(([a,b])=><article key={a}><strong>{a}</strong><span>{b}</span></article>)}</div>
      <div className="wowInsight"><span>NEXT BEST ACTION</span><p>{module[2]}</p></div>
    </Shell>;
}

function SeoRadar({ module, blueprint }) {
  const [difficulty, setDifficulty] = useState(45);
  const rows = useMemo(()=>[
    ["automatisation ia entreprise", 92, 38],
    ["formation agents ia", 81, 29],
    ["assistant métier ia", 76, 42],
    ["rag entreprise", 69, 51]
  ].filter(([,score,diff])=>diff<=difficulty+20),[difficulty]);
  return <Shell label="SEO / GEO OPPORTUNITY MAP" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">FILTRE</p><label><span>Difficulté max <b>{difficulty}</b></span><input type="range" min="20" max="80" value={difficulty} onChange={e=>setDifficulty(Number(e.target.value))}/></label><div className="wowNote"><b>Objectif</b><span>{module[2]}</span></div></>}>
      <div className="wowHeatmap">
        {rows.map(([q,score,diff])=><article key={q}><div><strong>{q}</strong><small>Diff. {diff}</small></div><b>{score}</b><div className="wowBar"><i style={{width:score+"%"}} /></div></article>)}
      </div>
      <div className="wowInsight"><span>GAP DÉTECTÉ</span><p>2 sujets à forte demande n’ont pas encore de page suffisamment profonde.</p></div>
    </Shell>;
}

function CampaignLab({ context, module, blueprint }) {
  const [variant, setVariant] = useState(0);
  const variants = [
    ["Angle douleur", "Vous perdez encore du temps à…", 7.8],
    ["Angle preuve", "Voyez ce que l’IA peut automatiser…", 6.9],
    ["Angle résultat", "Réduisez le temps de traitement…", 8.4]
  ];
  const current = variants[variant];
  return <Shell label="CAMPAIGN LAB" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">VARIANTE</p><div className="wowToggleRow">{variants.map((v,i)=><button type="button" key={v[0]} className={variant===i?"active":""} onClick={()=>setVariant(i)}>{v[0]}</button>)}</div><p className="wowMiniCopy">{module[1]}</p></>}>
      <div className="wowCampaignMock">
        <span>{context.channels[0] || "Canal"}</span>
        <h4>{current[1]}</h4>
        <p>{module[2]}</p>
        <button type="button">Découvrir la démo</button>
      </div>
      <div className="wowControlScore"><div><span>SCORE MESSAGE</span><strong>{current[2]}/10</strong></div><div><span>CTA</span><strong>Clair</strong></div><div><span>RISQUE</span><strong>Faible</strong></div></div>
    </Shell>;
}

function Reconciliation({ context, module, blueprint }) {
  const [threshold, setThreshold] = useState(80);
  const lines = [["Virement 2 480 €","FAC-26091",96],["Virement 930 €","FAC-26092",84],["Virement 1 240 €","FAC-26093",67]];
  return <Shell label="RAPPROCHEMENT ASSISTÉ" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">SEUIL D’AUTO-PROPOSITION</p><label><span>Confiance <b>{threshold}%</b></span><input type="range" min="50" max="98" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label><div className="wowNote"><b>Règle</b><span>En dessous du seuil, l’élément reste à vérifier.</span></div></>}>
      <div className="wowReconTable">{lines.map(([bank,invoice,score])=><article key={bank} className={score>=threshold?"matched":"review"}><span>{bank}</span><b>↔</b><strong>{invoice}</strong><em>{score}%</em><small>{score>=threshold?"proposé":"à vérifier"}</small></article>)}</div>
      <div className="wowInsight"><span>CONTRÔLE</span><p>{module[2]} Aucune écriture définitive n’est passée sans validation.</p></div>
    </Shell>;
}

function Timeline({ context, module, blueprint }) {
  const [expanded, setExpanded] = useState(1);
  const events = [["09:12","Demande reçue","Nouveau"],["09:18","Pièces analysées","Automatique"],["10:04","Réponse envoyée","Agent"],["J+2","Relance détectée","À faire"]];
  return <Shell label="TIMELINE 360°" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">DOSSIER</p><strong className="wowBigId">{context.entities[0]}</strong><div className="wowNote"><b>Aujourd’hui</b><span>{module[1]}</span></div></>}>
      <div className="wowTimeline">{events.map((e,i)=><button type="button" key={e[0]} className={expanded===i?"active":""} onClick={()=>setExpanded(i)}><b>{e[0]}</b><span><strong>{e[1]}</strong><small>{e[2]}</small></span>{expanded===i&&<em>{i===3?module[2]:"Étape consolidée automatiquement dans l’historique."}</em>}</button>)}</div>
    </Shell>;
}

function ClusterMap({ module, blueprint }) {
  const [active, setActive] = useState(0);
  const groups = [["Retards",34,"Délai"],["Documents",27,"Pièces"],["Prix",21,"Tarif"],["Accès",18,"Connexion"]];
  return <Shell label="CLUSTERING DES MOTIFS" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">TOP MOTIFS</p>{groups.map((g,i)=><button type="button" key={g[0]} className={"wowClusterBtn "+(active===i?"active":"")} onClick={()=>setActive(i)}><span>{g[0]}</span><b>{g[1]}%</b></button>)}</>}>
      <div className="wowBubbleArea">{groups.map((g,i)=><button type="button" key={g[0]} className={active===i?"active":""} style={{"--size":(90+g[1]*2)+"px"}} onClick={()=>setActive(i)}><strong>{g[0]}</strong><span>{g[1]}%</span></button>)}</div>
      <div className="wowInsight"><span>PISTE D’ACTION</span><p>{groups[active][0]} est actuellement le motif dominant. {module[2]}</p></div>
    </Shell>;
}

function Maintenance({ context, module, blueprint }) {
  const [signal, setSignal] = useState(68);
  const risk = signal>78?"Élevé":signal>60?"Moyen":"Faible";
  return <Shell label="MAINTENANCE COPILOT" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">SIGNAL CAPTEUR</p><label><span>Vibration simulée <b>{signal}%</b></span><input type="range" min="20" max="100" value={signal} onChange={e=>setSignal(Number(e.target.value))}/></label><div className="wowNote"><b>Équipement</b><span>{context.entities[0]}</span></div></>}>
      <div className="wowMaintenanceGauge"><span>RISQUE ESTIMÉ</span><strong>{risk}</strong><div className="wowBar"><i style={{width:signal+"%"}} /></div></div>
      <div className="wowCauseList"><article><b>01</b><strong>Usure mécanique</strong><span>{Math.min(94,signal+12)}%</span></article><article><b>02</b><strong>Désalignement</strong><span>{Math.max(34,signal-8)}%</span></article><article><b>03</b><strong>Capteur</strong><span>{Math.max(18,signal-24)}%</span></article></div>
      <div className="wowInsight"><span>ACTION</span><p>{module[2]}</p></div>
    </Shell>;
}

function Compare({ module, blueprint }) {
  const [weight, setWeight] = useState(50);
  const vendors = [["Offre A",82,68],["Offre B",74,91],["Offre C",89,62]];
  return <Shell label="COMPARATEUR MULTICRITÈRE" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">PONDÉRATION</p><label><span>Technique ↔ Prix <b>{weight}%</b></span><input type="range" min="0" max="100" value={weight} onChange={e=>setWeight(Number(e.target.value))}/></label><p className="wowMiniCopy">{module[1]}</p></>}>
      <div className="wowCompare">{vendors.map(([name,tech,price])=>{const score=Math.round(tech*(weight/100)+price*(1-weight/100));return <article key={name}><strong>{name}</strong><span>Technique {tech}</span><span>Prix {price}</span><b>{score}</b><div className="wowBar"><i style={{width:score+"%"}} /></div></article>})}</div>
      <div className="wowInsight"><span>LECTURE</span><p>{module[2]} Le classement évolue avec les critères.</p></div>
    </Shell>;
}

function Stock({ context, module, blueprint }) {
  const [days, setDays] = useState(7);
  const items = context.entities.map((name,i)=>({name, stock:[12,28,44][i], burn:[3,2,1][i]}));
  return <Shell label="STOCK PREDICTOR" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">HORIZON</p><label><span>Jours à projeter <b>{days}</b></span><input type="range" min="1" max="30" value={days} onChange={e=>setDays(Number(e.target.value))}/></label><p className="wowMiniCopy">{module[1]}</p></>}>
      <div className="wowStockGrid">{items.map(item=>{const left=item.stock-item.burn*days;const risk=left<=0?"Rupture":left<10?"Tendu":"OK";return <article key={item.name} className={risk==="Rupture"?"danger":risk==="Tendu"?"warning":""}><strong>{item.name}</strong><span>Stock projeté</span><b>{Math.max(0,left)}</b><small>{risk}</small></article>})}</div>
      <div className="wowInsight"><span>PROPOSITION</span><p>{module[2]}</p></div>
    </Shell>;
}

function SiteBoard({ context, module, blueprint }) {
  const [lot, setLot] = useState(0);
  const statuses = [["Critique","Photo reçue","Entreprise relancée"],["À lever","Contrôle prévu","Réponse attendue"],["Suivi","Document joint","À confirmer"]];
  return <Shell label="RÉSERVES CHANTIER" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">LOTS</p>{context.entities.map((x,i)=><button type="button" key={x} className={"wowLotBtn "+(lot===i?"active":"")} onClick={()=>setLot(i)}>{x}</button>)}</>}>
      <div className="wowReserveCard"><div className="wowPhotoPlaceholder"><span>PHOTO</span><b>Réserve #{804+lot}</b></div><div><span>STATUT</span><strong>{statuses[lot][0]}</strong><p>{statuses[lot][1]}</p><small>{statuses[lot][2]}</small></div></div>
      <div className="wowInsight"><span>ACTION</span><p>{module[2]}</p></div>
    </Shell>;
}

function Tender({ module, blueprint }) {
  const [tab, setTab] = useState("Exigences");
  const data = {
    Exigences:[["Délai","30 jours"],["Mémoire","Obligatoire"],["Références","3 minimum"]],
    Échéances:[["Questions","J-12"],["Dépôt","J-0"],["Audition","J+14"]],
    Vigilance:[["RC","Sous-traitance"],["CCTP","SLA"],["AE","Pénalités"]]
  };
  return <Shell label="LECTEUR D’APPEL D’OFFRES" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">VUE</p><div className="wowToggleRow">{Object.keys(data).map(x=><button type="button" key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div><div className="wowNote"><b>Aujourd’hui</b><span>{module[1]}</span></div></>}>
      <div className="wowTenderGrid">{data[tab].map(([a,b],i)=><article key={a}><span>0{i+1}</span><strong>{a}</strong><b>{b}</b></article>)}</div>
      <div className="wowInsight"><span>SYNTHÈSE</span><p>{module[2]}</p></div>
    </Shell>;
}

function Learning({ module, blueprint }) {
  const [level, setLevel] = useState("Débutant");
  const [role, setRole] = useState("Manager");
  const hours = level==="Débutant"?7:level==="Intermédiaire"?14:21;
  return <Shell label="PARCOURS ADAPTATIF" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">PROFIL</p><label><span>Niveau</span><select value={level} onChange={e=>setLevel(e.target.value)}><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></label><label><span>Public</span><select value={role} onChange={e=>setRole(e.target.value)}><option>Manager</option><option>Équipe métier</option><option>Référent IA</option></select></label></>}>
      <div className="wowLearningPath"><article><span>01</span><strong>Comprendre</strong><small>{role} · fondamentaux</small></article><article><span>02</span><strong>Pratiquer</strong><small>cas d’usage métier</small></article><article><span>03</span><strong>Automatiser</strong><small>{level==="Avancé"?"agents et workflows":"méthodes guidées"}</small></article></div>
      <div className="wowControlScore"><div><span>DURÉE</span><strong>{hours} h</strong></div><div><span>ATELIERS</span><strong>{level==="Débutant"?2:4}</strong></div><div><span>LIVRABLE</span><strong>Kit réutilisable</strong></div></div>
      <div className="wowInsight"><span>OBJECTIF</span><p>{module[2]}</p></div>
    </Shell>;
}

function Calendar({ module, blueprint }) {
  const [week, setWeek] = useState(1);
  const cards = [["Article expert","SEO","Lun"],["Post cas client","LinkedIn","Mar"],["Newsletter","Email","Jeu"],["Landing","Paid","Ven"]];
  return <Shell label="CALENDRIER ÉDITORIAL" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">SEMAINE</p><div className="wowToggleRow">{[1,2,3,4].map(x=><button type="button" key={x} className={week===x?"active":""} onClick={()=>setWeek(x)}>S{x}</button>)}</div><p className="wowMiniCopy">{module[1]}</p></>}>
      <div className="wowCalendarGrid">{cards.map(([title,channel,day],i)=><article key={title} style={{transform:`translateY(${(week-1)*i*2}px)`}}><span>{day}</span><strong>{title}</strong><small>{channel}</small><b>{i<2?"Prêt":"À produire"}</b></article>)}</div>
      <div className="wowInsight"><span>CAPACITÉ</span><p>{module[2]}</p></div>
    </Shell>;
}

function BrandGuard({ module, blueprint }) {
  const [strict, setStrict] = useState(true);
  const checks = [["Ton de marque",true],["Claim chiffré",!strict],["Mot interdit",true],["Source",!strict]];
  return <Shell label="BRAND GUARD" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">RÈGLES</p><label className="wowSwitch"><input type="checkbox" checked={strict} onChange={()=>setStrict(!strict)}/><span>Contrôle strict</span></label><div className="wowNote"><b>Usage</b><span>{module[1]}</span></div></>}>
      <div className="wowBrandPreview"><span>CONTENU À PUBLIER</span><p>“Notre solution permet de gagner 40 % de temps sur toutes les tâches.”</p></div>
      <div className="wowBrandChecks">{checks.map(([x,ok])=><article key={x} className={ok?"ok":"warning"}><b>{ok?"✓":"!"}</b><span>{x}</span><small>{ok?"Conforme":"À corriger"}</small></article>)}</div>
      <div className="wowInsight"><span>RECOMMANDATION</span><p>{module[2]}</p></div>
    </Shell>;
}

function Dashboard({ context, module, blueprint, type }) {
  const [period, setPeriod] = useState("Semaine");
  const values = period==="Jour"?[12,8,3]:period==="Semaine"?[84,67,11]:[352,284,29];
  return <Shell label={type==="executive"?"EXECUTIVE VIEW":"PILOTAGE MULTI-SOURCES"} metric={blueprint.metric}
    side={<><p className="wowPaneLabel">PÉRIODE</p><div className="wowToggleRow">{["Jour","Semaine","Mois"].map(x=><button type="button" key={x} className={period===x?"active":""} onClick={()=>setPeriod(x)}>{x}</button>)}</div><div className="wowSources">{context.sources.map(x=><span key={x}>✓ {x}</span>)}</div></>}>
      <div className="wowKpiGrid"><article><span>VOLUME</span><strong>{values[0]}</strong><small>+12%</small></article><article><span>TRAITÉ</span><strong>{values[1]}</strong><small>81%</small></article><article><span>À VOIR</span><strong>{values[2]}</strong><small>3 prioritaires</small></article></div>
      <div className="wowSparkline">{[36,49,43,62,58,71,84].map((x,i)=><i key={i} style={{height:x+"%"}} />)}</div>
      <div className="wowInsight"><span>COMMENTAIRE AUTO</span><p>{module[2]}</p></div>
    </Shell>;
}

function Sequence({ context, module, blueprint }) {
  const [step, setStep] = useState(0);
  const stages = [["J0","Premier message"],["J+3","Relance contextuelle"],["J+8","Dernier rappel"]];
  return <Shell label="SÉQUENCE ORCHESTRÉE" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">CIBLE</p><strong className="wowBigId">{context.entities[0]}</strong><div className="wowNote"><b>Aujourd’hui</b><span>{module[1]}</span></div></>}>
      <div className="wowSequence">{stages.map(([day,title],i)=><button type="button" key={day} className={step===i?"active":step>i?"done":""} onClick={()=>setStep(i)}><b>{day}</b><span><strong>{title}</strong><small>{i===0?context.channels[0]:i===1?context.channels[1]||"E-mail":"CRM"}</small></span><em>{step>i?"✓":step===i?"●":"○"}</em></button>)}</div>
      <div className="wowInsight"><span>MESSAGE PROPOSÉ</span><p>{module[2]}</p></div>
    </Shell>;
}

function DocumentAI({ context, module, blueprint, type }) {
  const [run, setRun] = useState(false);
  const doc = type==="invoice"?"Facture_26091.pdf":type==="brief"?"Brief_Campagne.docx":"Dossier_0842.pdf";
  return <Shell label="DOCUMENT AI" metric={blueprint.metric}
    side={<><p className="wowPaneLabel">FICHIER FICTIF</p><div className="wowDropzone"><strong>{doc}</strong><span>1,4 Mo · 3 pages</span></div><button type="button" className="wowAction" onClick={()=>setRun(true)}>Analyser le document</button></>}>
      {!run?<div className="wowEmpty">Lancez l’analyse pour voir le document devenir une donnée exploitable.</div>:
      <><div className="wowDataGrid">{[["Référence",context.entities[0]],["Type",blueprint.accent],["Confiance","96 %"],["Statut","À valider"],["Anomalie","1"],["Routage",context.routes[0]]].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}</div><div className="wowInsight"><span>ACTION</span><p>{module[2]}</p></div></>}
    </Shell>;
}

const SPECIAL = new Set(["account","seo","campaign","reconcile","timeline","cluster","maintenance","compare","stock","site","tender","learning","calendar","brand","collect","executive","table","report","variance","sequence","routing","workflow","invoice","extract","classify","brief","catalog"]);

export function SpecializedExperience({ type, context, topic, module, blueprint }) {
  if (!SPECIAL.has(type)) return null;
  if (type==="account") return <Account360 context={context} module={module} blueprint={blueprint} />;
  if (type==="seo") return <SeoRadar module={module} blueprint={blueprint} />;
  if (type==="campaign") return <CampaignLab context={context} module={module} blueprint={blueprint} />;
  if (type==="reconcile") return <Reconciliation context={context} module={module} blueprint={blueprint} />;
  if (type==="timeline") return <Timeline context={context} module={module} blueprint={blueprint} />;
  if (type==="cluster") return <ClusterMap module={module} blueprint={blueprint} />;
  if (type==="maintenance") return <Maintenance context={context} module={module} blueprint={blueprint} />;
  if (type==="compare") return <Compare module={module} blueprint={blueprint} />;
  if (type==="stock") return <Stock context={context} module={module} blueprint={blueprint} />;
  if (type==="site") return <SiteBoard context={context} module={module} blueprint={blueprint} />;
  if (type==="tender") return <Tender module={module} blueprint={blueprint} />;
  if (type==="learning") return <Learning module={module} blueprint={blueprint} />;
  if (type==="calendar") return <Calendar module={module} blueprint={blueprint} />;
  if (type==="brand") return <BrandGuard module={module} blueprint={blueprint} />;
  if (["collect","executive","table","report","variance"].includes(type)) return <Dashboard context={context} module={module} blueprint={blueprint} type={type} />;
  if (["sequence","routing","workflow"].includes(type)) return <Sequence context={context} module={module} blueprint={blueprint} />;
  return <DocumentAI context={context} module={module} blueprint={blueprint} type={type} />;
}
