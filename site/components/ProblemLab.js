"use client";

import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/clientTracking";

function Shell({ demo, children, side }) {
  function trackClick(event) {
    const button=event.target.closest?.("button");
    if (!button) return;
    trackEvent("problem_lab_interaction",{
      problem_slug:demo.problemSlug,
      problem_cluster:demo.problemCluster,
      demo_name:demo.title,
      action:(button.textContent || "button").trim().replace(/\s+/g," ").slice(0,90)
    });
  }

  function trackChange(event) {
    const target=event.target;
    if (!target || (target.type !== "checkbox" && target.tagName !== "SELECT")) return;
    trackEvent("problem_lab_control_change",{
      problem_slug:demo.problemSlug,
      problem_cluster:demo.problemCluster,
      demo_name:demo.title,
      control:target.name || target.type || target.tagName
    });
  }

  return (
    <div className="problemWorkspace" onClickCapture={trackClick} onChangeCapture={trackChange}>
      <aside className="problemControls">
        <p className="problemLabel">À MANIPULER</p>
        <h4>{demo.title}</h4>
        <p>{demo.caption}</p>
        {side}
      </aside>
      <div className="problemApp">
        <div className="problemAppHeader"><span>SIMULATION</span><strong>{demo.metric}</strong></div>
        {children}
      </div>
    </div>
  );
}

function Meeting({ demo }) {
  const [run,setRun]=useState(false);
  const [view,setView]=useState("Actions");
  const [followup,setFollowup]=useState(false);
  return <Shell demo={demo} side={<>
    <div className="problemToggle">
      {["Actions","Direction"].map((item)=><button type="button" key={item} className={view===item?"active":""} onClick={()=>{setView(item);setFollowup(false);}}>{item}</button>)}
    </div>
    <button type="button" onClick={()=>{setRun(true);setFollowup(false);}}>Extraire décisions et actions</button>
  </>}>
    <div className="problemTranscript">
      <p><b>01</b><span>On valide le pilote pour l’équipe support.</span></p>
      <p><b>02</b><span>Camille reprend le cadrage avant jeudi.</span></p>
      <p><b>03</b><span>Le budget doit encore être confirmé.</span></p>
    </div>
    {run ? <>
      {view==="Actions" ? <div className="problemActionBoard">
        <article><span>DÉCISION</span><strong>Pilote support validé</strong><small>Preuve · ligne 01</small></article>
        <article><span>ACTION</span><strong>Reprendre le cadrage</strong><small>Camille · jeudi · ligne 02</small></article>
        <article className="warning"><span>À ARBITRER</span><strong>Budget non confirmé</strong><small>Validation requise · ligne 03</small></article>
      </div> : <div className="problemExecutiveBrief">
        <span>SYNTHÈSE DIRECTION</span>
        <h4>1 décision prise · 1 action assignée · 1 point encore ouvert</h4>
        <p>Le pilote support peut avancer. Le cadrage est repris par Camille avant jeudi. Le budget reste à confirmer avant lancement.</p>
      </div>}
      <div className="problemMeetingFooter">
        <button type="button" onClick={()=>setFollowup(true)}>Préparer le suivi</button>
        {followup&&<div><span>PRÊT À RELIRE</span><strong>E-mail + tâche projet + mise à jour CRM préparés</strong><small>Aucun envoi automatique dans cette démonstration.</small></div>}
      </div>
    </> : <div className="problemEmpty">Lancez l’extraction pour transformer le verbatim en éléments actionnables.</div>}
  </Shell>;
}

function Rag({ demo }) {
  const [query,setQuery]=useState("Quelle règle s’applique à ce cas ?");
  const [run,setRun]=useState(false);
  const [source,setSource]=useState(0);
  const sources=[
    {name:"Procédure interne",page:"p. 12",score:94,excerpt:"La validation du responsable est requise avant toute modification du dossier."},
    {name:"Guide métier",page:"p. 4",score:88,excerpt:"Les pièces manquantes doivent être signalées sans déduire une information absente."},
    {name:"FAQ équipe",page:"§ 8",score:71,excerpt:"En cas d’ambiguïté, le dossier est transmis à la file de contrôle humain."}
  ];
  const current=sources[source];
  return <Shell demo={demo} side={<><textarea rows="3" value={query} onChange={(e)=>{setQuery(e.target.value);setRun(false);}}/><button type="button" onClick={()=>{setRun(true);setSource(0);}}>Rechercher dans les sources</button></>}>
    {run ? <div className="problemRagWorkspace">
      <div className="problemAnswer">
        <span>RÉPONSE SOURCÉE</span>
        <h4>{query}</h4>
        <p>La règle applicable est retrouvée dans le corpus autorisé. La validation du responsable reste requise avant l’action sensible.</p>
        <div className="problemCoverage"><b>Couverture documentaire</b><span>89 %</span><div><i style={{width:"89%"}}/></div></div>
      </div>
      <div className="problemSourceRail">
        {sources.map((item,index)=><button type="button" className={source===index?"active":""} key={item.name} onClick={()=>setSource(index)}><span>[{index+1}] {item.name}</span><strong>{item.page}</strong><em>{item.score}%</em></button>)}
      </div>
      <article className="problemSourcePreview"><span>PASSAGE RETROUVÉ · {current.name} · {current.page}</span><p>{current.excerpt}</p><small>Source fictive pour démonstration · accès et habilitations configurables.</small></article>
    </div> : <div className="problemEmpty">Posez une question puis lancez la recherche dans le corpus fictif.</div>}
  </Shell>;
}

function Score({ demo }) {
  const [fit,setFit]=useState(75);
  const [urgency,setUrgency]=useState(55);
  const [risk,setRisk]=useState(30);
  const labelsByCluster={
    Commercial:["Nova Industrie","Groupe Atlas","Maison Rive"],
    RH:["A.M. · 6 ans","N.K. · 4 ans","L.R. · 8 ans"],
    Marketing:["Sujet acquisition","Page offre","Signal concurrent"],
    Reporting:["BU Île-de-France","BU Nord","BU Sud"],
    Industrie:["SKU-8842","SKU-1194","SKU-7812"],
    Administratif:["Dossier 2481","Dossier 2482","Dossier 2483"]
  };
  const labels=labelsByCluster[demo.problemCluster] || ["Cas A","Cas B","Cas C"];
  const rows=useMemo(()=>[
    [labels[0],Math.round(55+fit*.28+urgency*.12-risk*.08),["forte adéquation","signal récent"]],
    [labels[1],Math.round(48+fit*.19+urgency*.2-risk*.04),["urgence élevée","preuve partielle"]],
    [labels[2],Math.round(42+fit*.15+urgency*.1+risk*.08),["potentiel à vérifier","risque plus élevé"]]
  ].map(([name,score,reasons])=>[name,Math.max(0,Math.min(99,score)),reasons]).sort((a,b)=>b[1]-a[1]),[fit,urgency,risk]);
  const leader=rows[0];
  return <Shell demo={demo} side={<>
    <label><span>Adéquation <b>{fit}%</b></span><input type="range" min="0" max="100" value={fit} onChange={(e)=>setFit(Number(e.target.value))}/></label>
    <label><span>Urgence <b>{urgency}%</b></span><input type="range" min="0" max="100" value={urgency} onChange={(e)=>setUrgency(Number(e.target.value))}/></label>
    <label><span>Risque <b>{risk}%</b></span><input type="range" min="0" max="100" value={risk} onChange={(e)=>setRisk(Number(e.target.value))}/></label>
    <div className="problemWeightNote"><span>RÈGLE</span><p>Le score reste explicable : changez un critère et observez le classement.</p></div>
  </>}>
    <div className="problemScoreList">{rows.map(([name,score,reasons],i)=><article key={name} className={i===0?"top":""}><b>0{i+1}</b><strong>{name}</strong><em>{score}</em><div><i style={{width:score+"%"}}/></div><small>{reasons.join(" · ")}</small></article>)}</div>
    <div className="problemScoreExplain"><span>POURQUOI #1 ?</span><strong>{leader[0]}</strong><p>{leader[2].join(" · ")}. Le classement est illustratif et doit rester relié à vos critères réels.</p></div>
  </Shell>;
}

function Router({ demo }) {
  const [selected,setSelected]=useState(0);
  const [prepared,setPrepared]=useState(false);
  const messages=[
    {priority:"URGENT",subject:"Client bloqué sur commande 4821",route:"Support N2",confidence:"96 %",fields:["Commande 4821","Blocage livraison"],action:"Créer ticket prioritaire"},
    {priority:"STANDARD",subject:"Demande de devis — 3 sites",route:"Commercial",confidence:"91 %",fields:["3 sites","Besoin devis"],action:"Créer opportunité"},
    {priority:"À CONTRÔLER",subject:"Pièce jointe sans référence",route:"Back-office",confidence:"72 %",fields:["PDF joint","Référence absente"],action:"Demander la référence"}
  ];
  const item=messages[selected];
  return <Shell demo={demo} side={<div className="problemQueue">{messages.map((m,i)=><button type="button" key={m.subject} className={selected===i?"active":""} onClick={()=>{setSelected(i);setPrepared(false);}}><span>{m.priority}</span><strong>{m.subject}</strong><small>{m.route} · confiance {m.confidence}</small></button>)}</div>}>
    <div className="problemRouteWorkspace">
      <div className="problemRouteCard"><span>DESTINATION PROPOSÉE</span><strong>{item.route}</strong><p>{item.subject}</p><div><b>Priorité</b><em>{item.priority}</em></div><div><b>Confiance</b><em>{item.confidence}</em></div></div>
      <div className="problemExtractedSignals"><span>ÉLÉMENTS DÉTECTÉS</span>{item.fields.map((field)=><b key={field}>{field}</b>)}</div>
      <button type="button" className="problemRouteAction" onClick={()=>setPrepared(true)}>Préparer le traitement</button>
      {prepared&&<div className="problemPreparedAction"><span>ACTION PRÉPARÉE</span><strong>{item.action}</strong><small>À valider avant écriture ou envoi dans l’outil métier.</small></div>}
    </div>
  </Shell>;
}

function Extract({ demo }) {
  const [run,setRun]=useState(false);
  const [field,setField]=useState("montant");
  const fields={
    reference:["RÉFÉRENCE","2026-0842","96 %"],
    date:["DATE","23/09/2026","98 %"],
    montant:["MONTANT","2 480 €","94 %"],
    client:["CLIENT","Société Exemple","91 %"]
  };
  return <Shell demo={demo} side={<><div className="problemDocument"><b>DOCUMENT_FICTIF.pdf</b><span>3 pages · 1,2 Mo</span></div><button type="button" onClick={()=>setRun(true)}>Extraire et structurer</button></>}>
    {run ? <div className="problemExtractWorkspace">
      <div className="problemDocCanvas">
        <div className="problemDocPaper"><b>FACTURE</b><i/><i className="short"/><i/><i/><mark className={"mark reference "+(field==="reference"?"active":"")}>REF 2026-0842</mark><mark className={"mark date "+(field==="date"?"active":"")}>23/09/2026</mark><mark className={"mark amount "+(field==="montant"?"active":"")}>2 480 €</mark><mark className={"mark client "+(field==="client"?"active":"")}>Société Exemple</mark></div>
        <span>PAGE 1 / 3 · ZONES DÉTECTÉES</span>
      </div>
      <div className="problemFieldList">
        {Object.entries(fields).map(([key,value])=><button type="button" key={key} className={field===key?"active":""} onClick={()=>setField(key)}><span>{value[0]}</span><strong>{value[1]}</strong><em>{value[2]}</em></button>)}
      </div>
    </div> : <div className="problemEmpty">Le document reste une pièce jointe tant que l’extraction n’est pas lancée.</div>}
  </Shell>;
}

function Control({ demo }) {
  const [selected,setSelected]=useState(2);
  const [overrides,setOverrides]=useState({});
  const [prepared,setPrepared]=useState(false);
  const baseRules=[
    {id:"piece",label:"Pièce principale",status:"ok",confidence:98,source:"Dossier_2481.pdf · p. 1",evidence:"Formulaire principal détecté et lisible.",action:"Aucune action requise"},
    {id:"reference",label:"Référence cohérente",status:"ok",confidence:94,source:"Formulaire + justificatif",evidence:"Référence 2026-0842 retrouvée dans les deux pièces.",action:"Aucune action requise"},
    {id:"justificatif",label:"Justificatif attendu",status:"missing",confidence:99,source:"Référentiel dossier · règle 3.2",evidence:"Le justificatif de domicile attendu n’est pas présent dans les pièces reçues.",action:"Préparer une demande de pièce"},
    {id:"date",label:"Date valide",status:"conflict",confidence:82,source:"Formulaire · p. 2",evidence:"La date saisie diffère de celle figurant sur la pièce annexe.",action:"Soumettre la date à relecture"}
  ];
  const rules=baseRules.map((rule)=>({...rule,status:overrides[rule.id] || rule.status}));
  const current=rules[selected];
  const statusLabel={ok:"CONFORME",missing:"PIÈCE MANQUANTE",conflict:"À CONTRÔLER"};
  const ok=rules.filter((rule)=>rule.status==="ok").length;
  const exceptions=rules.length-ok;

  function markResolved() {
    setOverrides((state)=>({...state,[current.id]:"ok"}));
    setPrepared(false);
  }

  return <Shell demo={demo} side={<>
    <p className="problemHint">Sélectionnez une règle pour voir la preuve qui justifie le contrôle.</p>
    <div className="problemReviewRules">
      {rules.map((rule,i)=><button type="button" key={rule.id} className={(selected===i?"active ":"")+rule.status} onClick={()=>{setSelected(i);setPrepared(false);}}>
        <span>{statusLabel[rule.status]}</span>
        <strong>{rule.label}</strong>
        <small>{rule.confidence}% de confiance</small>
      </button>)}
    </div>
  </>}>
    <div className="problemReviewWorkspace">
      <div className="problemReviewSummary">
        <article><span>CONFORME</span><strong>{ok}/{rules.length}</strong></article>
        <article><span>EXCEPTIONS</span><strong>{exceptions}</strong></article>
        <article><span>STATUT</span><strong>{exceptions===0?"Prêt pour validation":"Relecture requise"}</strong></article>
      </div>

      <div className={"problemEvidenceCard "+current.status}>
        <div className="problemEvidenceHead"><span>{statusLabel[current.status]}</span><b>{current.confidence}%</b></div>
        <h4>{current.label}</h4>
        <p>{current.evidence}</p>
        <div><span>PREUVE / SOURCE</span><strong>{current.source}</strong></div>
        <div><span>ACTION PROPOSÉE</span><strong>{current.action}</strong></div>
      </div>

      {current.status!=="ok"&&<div className="problemReviewActions">
        <button type="button" onClick={()=>setPrepared(true)}>Préparer l’action</button>
        <button type="button" className="secondary" onClick={markResolved}>Marquer conforme après vérification</button>
      </div>}

      {prepared&&<div className="problemPreparedAction">
        <span>PRÊT À RELIRE</span>
        <strong>{current.action}</strong>
        <small>Aucune décision ni demande n’est envoyée automatiquement dans cette démonstration.</small>
      </div>}
    </div>
  </Shell>;
}

function Dashboard({ demo }) {
  const [period,setPeriod]=useState("Semaine");
  const [signal,setSignal]=useState(1);
  const values=period==="Jour"?[18,14,3]:period==="Semaine"?[96,81,11]:[382,326,37];
  const signals=[
    ["Volume entrant","+18 %","Hausse observée sur la période"],
    ["Exceptions","11","Au-dessus du niveau habituel"],
    ["Délai médian","-9 %","Amélioration observée"]
  ];
  return <Shell demo={demo} side={<>
    <div className="problemToggle">{["Jour","Semaine","Mois"].map((p)=><button type="button" key={p} className={period===p?"active":""} onClick={()=>setPeriod(p)}>{p}</button>)}</div>
    <div className="problemSourceStatus"><span>SOURCES</span><b><i/>CRM synchronisé</b><b><i/>ERP synchronisé</b><b><i className="warning"/>Tableur · 1 contrôle</b></div>
  </>}>
    <div className="problemKpis"><article><span>VOLUME</span><strong>{values[0]}</strong><small>entrées</small></article><article><span>TRAITÉ</span><strong>{values[1]}</strong><small>flux consolidés</small></article><article><span>À VOIR</span><strong>{values[2]}</strong><small>exceptions</small></article></div>
    <div className="problemBars">{[42,58,51,66,63,78,91].map((h,i)=><i key={i} className={i===6?"active":""} style={{height:h+"%"}}/>)}</div>
    <div className="problemSignalList">{signals.map(([name,value,detail],i)=><button type="button" key={name} className={signal===i?"active":""} onClick={()=>setSignal(i)}><span>{name}</span><strong>{value}</strong><small>{detail}</small></button>)}</div>
    <div className="problemNarrative"><span>COMMENTAIRE ASSISTÉ</span><p><b>Fait :</b> {signals[signal][2]}. <b>À investiguer :</b> la cause n’est pas déduite automatiquement sans preuve dans les sources.</p></div>
  </Shell>;
}

function Sequence({ demo }) {
  const presets={
    "relances-commerciales-ia":[
      ["J0","Relance préparée","Dernier échange relu"],
      ["J+3","Relance contextuelle","Si aucun signal entrant"],
      ["J+8","Escalade ou pause","Selon stade du deal"]
    ],
    "onboarding-salarie-ia":[
      ["J-7","Accès & documents","RH + IT à confirmer"],
      ["J0","Accueil manager","Agenda et contacts clés"],
      ["J+7","Point d’intégration","Questions et blocages"],
      ["J+30","Bilan onboarding","Validation manager/RH"]
    ],
    "reserves-chantier-ia":[
      ["J0","Réserve affectée","Lot + entreprise"],
      ["J+3","Relance entreprise","Si aucune preuve"],
      ["J+7","Escalade chantier","Réserve toujours ouverte"],
      ["LEVÉE","Contrôle avant clôture","Décision MOE / personne habilitée"]
    ],
    "planning-editorial-automatise":[
      ["S1","Priorités validées","Backlog + capacité"],
      ["S2","Production","Briefs affectés"],
      ["S3","Contrôle","Claims + qualité"],
      ["S4","Publication","Après validation"]
    ],
    "controler-dossiers-automatiquement":[
      ["J0","Anomalie détectée","Pièce ou cohérence"],
      ["J+2","Relance préparée","Demande de pièce"],
      ["J+5","Relecture humaine","Si dossier toujours incomplet"]
    ],
    "automatiser-comptes-rendus-reunion":[
      ["T+0","Décisions extraites","À confirmer"],
      ["T+15","Actions assignées","Responsables + échéances"],
      ["J+2","Suivi préparé","Actions sans mise à jour"]
    ],
    default:[
      ["J0","Première action","Préparée"],
      ["J+3","Relance contextuelle","Selon contexte"],
      ["J+8","Escalade ou pause","Si aucune réponse"]
    ]
  };
  const stages=presets[demo.problemSlug] || presets.default;
  const [step,setStep]=useState(Math.min(1,stages.length-1));
  const current=stages[step];
  return <Shell demo={demo} side={<p className="problemHint">Cliquez sur une étape : la logique de suivi est adaptée au processus, pas à une séquence générique.</p>}>
    <div className="problemSequence">{stages.map(([day,label,detail],i)=><button type="button" key={day+"-"+label} className={step===i?"active":step>i?"done":""} onClick={()=>setStep(i)}><b>{day}</b><span><strong>{label}</strong><small>{detail}</small></span><em>{step>i?"✓":step===i?"●":"○"}</em></button>)}</div>
    <div className="problemSequenceDetail"><span>ÉTAPE ACTIVE</span><strong>{current[1]}</strong><p>{current[2]}. Toute notification, écriture ou clôture sensible peut rester soumise à validation.</p></div>
  </Shell>;
}

function Compare({ demo }) {
  const presets={
    "controle-factures-ia":{
      criteria:{Correspondance:[96,68,41],"Référence":[100,74,22],"Montant":[98,83,55]},
      items:[
        ["PO-4482","Montant et référence cohérents"],
        ["PO-4479","Montant proche · référence différente"],
        ["Sans commande","Aucune preuve de rapprochement"]
      ],
      label:"MATCH PROPOSÉ"
    },
    "rapprochement-factures-paiements-ia":{
      criteria:{Montant:[99,82,61],Date:[94,88,72],Libellé:[91,66,54]},
      items:[
        ["Virement · 2 480 €","Candidat principal"],
        ["Virement · 2 472 €","Écart de montant"],
        ["Carte · 2 480 €","Canal incohérent"]
      ],
      label:"CORRESPONDANCE"
    },
    "analyser-comparer-cv-ia":{
      criteria:{Compétences:[93,84,72],"Séniorité":[88,70,96],Disponibilité:[74,98,62]},
      items:[
        ["A.M. · 6 ans","RAG · Python · Azure"],
        ["N.K. · 4 ans","Python · FastAPI · GCP"],
        ["L.R. · 8 ans","RAG · MLOps · AWS"]
      ],
      label:"PROFIL À EXAMINER"
    },
    "reponse-appel-offres-ia":{
      criteria:{Couverture:[92,78,54],Preuves:[86,91,47],Vigilance:[82,63,95]},
      items:[
        ["Méthodologie","Contenu validé disponible"],
        ["Références","3 preuves requises"],
        ["Sous-traitance","Clause sensible détectée"]
      ],
      label:"MATRICE DE CONFORMITÉ"
    },
    "gestion-stocks-ia":{
      criteria:{Couverture:[91,78,64],"Coût maîtrisé":[72,88,95],"Risque rupture":[94,79,52]},
      items:[
        ["Commande 120 u.","Couverture forte"],
        ["Commande 80 u.","Compromis coût / couverture"],
        ["Commande 40 u.","Risque de rupture élevé"]
      ],
      label:"SCÉNARIO D’APPRO"
    },
    "veille-concurrentielle-ia":{
      criteria:{Impact:[92,74,61],Nouveauté:[86,95,69],Confiance:[94,78,83]},
      items:[
        ["Nouvelle offre","Page tarifaire modifiée"],
        ["Recrutement IA","3 offres publiées"],
        ["Prise de parole","Annonce dirigeant"]
      ],
      label:"SIGNAL À ANALYSER"
    },
    default:{
      criteria:{Couverture:[88,74,61],"Maîtrise du risque":[72,91,80],Effort:[64,78,92]},
      items:[["Option A","Couverture élevée"],["Option B","Compromis équilibré"],["Option C","Effort plus faible"]],
      label:"COMPARAISON"
    }
  };
  const preset=presets[demo.problemSlug] || presets.default;
  const criteria=Object.keys(preset.criteria);
  const [criterion,setCriterion]=useState(criteria[0]);
  const values=preset.criteria[criterion];
  const bestIndex=values.indexOf(Math.max(...values));
  return <Shell demo={demo} side={<>
    <p className="problemHint">Changez le critère : le résultat et le point de vigilance évoluent.</p>
    <div className="problemToggle">{criteria.map((x)=><button type="button" key={x} className={criterion===x?"active":""} onClick={()=>setCriterion(x)}>{x}</button>)}</div>
  </>}>
    <div className="problemCompareHeader"><span>{preset.label}</span><strong>{criterion}</strong></div>
    <div className="problemCompare">{preset.items.map(([name,note],i)=><article key={name} className={bestIndex===i?"top":""}><strong>{name}</strong><span>{note}</span><b>{values[i]}</b><div><i style={{width:values[i]+"%"}}/></div>{bestIndex===i&&<small>Prioritaire sur ce critère</small>}</article>)}</div>
    <div className="problemCompareExplain"><span>LECTURE</span><p><b>{preset.items[bestIndex][0]}</b> ressort sur « {criterion} ». Ce classement est illustratif : les poids et règles doivent être définis avec le métier.</p></div>
  </Shell>;
}

function Builder({ demo }) {
  const presets={
    "reponse-appel-offres-ia":{
      channels:["Mémoire","Matrice","E-mail"],
      title:"Trame préparée depuis les exigences détectées",
      body:"La structure reprend les exigences couvertes et laisse visibles les preuves manquantes. Aucune référence client ni capacité absente de la base validée n’est ajoutée.",
      blocks:[["EXIGENCE","Méthodologie d’exécution"],["PREUVE","Contenu validé retrouvé"],["À COMPLÉTER","Référence projet requise"]]
    },
    "generer-decliner-contenus-marketing-ia":{
      channels:["LinkedIn","E-mail","Landing"],
      title:"Déclinaison prête pour contrôle de marque",
      body:"Le message est adapté au format choisi tout en conservant la promesse source. Les claims sensibles restent signalés avant publication.",
      blocks:[["SOURCE","Brief campagne"],["TON","Premium B2B"],["CONTRÔLE","1 claim à relire"]]
    },
    "synthese-comex-ia":{
      channels:["Note COMEX","E-mail","Slide"],
      title:"Synthèse exécutive prête à arbitrer",
      body:"Les faits observés, décisions attendues et questions ouvertes sont séparés. Aucune causalité non démontrée n’est présentée comme un fait.",
      blocks:[["FAIT","Écart KPI détecté"],["DÉCISION","Arbitrage attendu"],["QUESTION","Cause à investiguer"]]
    },
    "assistant-service-client-ia":{
      channels:["E-mail","Ticket","CRM"],
      title:"Réponse préparée depuis la procédure applicable",
      body:"Le brouillon reprend le contexte client et la source documentaire autorisée. Le cas reste soumis à l’agent avant envoi.",
      blocks:[["MOTIF","Demande qualifiée"],["SOURCE","Procédure SAV"],["ESCALADE","Non requise"]]
    },
    default:{
      channels:["E-mail","CRM","Note"],
      title:"Sortie préparée à partir des éléments validés",
      body:"Le contenu est contextualisé, les informations sensibles restent à relire et aucune information absente des sources n’est inventée.",
      blocks:[["SOURCE","Éléments validés"],["STATUT","Prêt à relire"],["GARDE-FOU","Validation humaine"]]
    }
  };
  const preset=presets[demo.problemSlug] || (demo.problemCluster==="Marketing"?presets["generer-decliner-contenus-marketing-ia"]:demo.problemCluster==="Support"?presets["assistant-service-client-ia"]:presets.default);
  const [channel,setChannel]=useState(preset.channels[0]);
  const [generated,setGenerated]=useState(false);
  const [checked,setChecked]=useState(false);

  return <Shell demo={demo} side={<>
    <p className="problemHint">Choisissez la destination : la structure et les contrôles suivent le canal.</p>
    <div className="problemToggle">{preset.channels.map((x)=><button type="button" key={x} className={channel===x?"active":""} onClick={()=>{setChannel(x);setGenerated(false);setChecked(false);}}>{x}</button>)}</div>
    <button type="button" onClick={()=>{setGenerated(true);setChecked(false);}}>Préparer la sortie</button>
  </>}>
    {generated ? <div className="problemOutputWorkspace">
      <div className="problemOutputToolbar"><span>{channel.toUpperCase()} · BROUILLON</span><b>{checked?"CONTRÔLÉ":"À RELIRE"}</b></div>
      <div className="problemDraft">
        <h4>{preset.title}</h4>
        <p>{preset.body}</p>
      </div>
      <div className="problemOutputBlocks">{preset.blocks.map(([label,value])=><article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
      <div className="problemOutputChecks">
        <span>✓ données fictives</span>
        <span>✓ sources conservées</span>
        <span>✓ aucune action automatique</span>
      </div>
      <button type="button" className={checked?"problemOutputReady active":"problemOutputReady"} onClick={()=>setChecked(true)}>{checked?"Prêt pour validation humaine":"Lancer le contrôle avant validation"}</button>
      {checked&&<small className="problemOutputFoot">La démonstration s’arrête ici : l’écriture, l’envoi ou la publication restent à valider par une personne.</small>}
    </div> : <div className="problemEmpty">Choisissez une destination puis préparez une sortie de démonstration.</div>}
  </Shell>;
}

function Quality({ demo }) {
  const [dimension,setDimension]=useState("Conformité");
  const [selected,setSelected]=useState(1);
  const cases={
    Conformité:[
      {id:"#8421",score:96,label:"Réponse alignée",reason:"Procédure citée et mentions présentes"},
      {id:"#8427",score:72,label:"À relire",reason:"Engagement non relié à une source"},
      {id:"#8433",score:88,label:"Bon niveau",reason:"Réponse complète, formulation à simplifier"}
    ],
    Clarté:[
      {id:"#8421",score:83,label:"Lisible",reason:"Réponse structurée, une phrase trop dense"},
      {id:"#8427",score:91,label:"Très clair",reason:"Action et prochaine étape explicites"},
      {id:"#8433",score:76,label:"À simplifier",reason:"Trop de contexte avant la réponse"}
    ],
    Résolution:[
      {id:"#8421",score:94,label:"Résolu",reason:"Demande traitée avec prochaine étape"},
      {id:"#8427",score:61,label:"Risque",reason:"Question principale partiellement couverte"},
      {id:"#8433",score:86,label:"Résolu",reason:"Réponse exploitable sans relance"}
    ]
  };
  const rows=cases[dimension];
  const current=rows[selected] || rows[0];
  return <Shell demo={demo} side={<>
    <div className="problemToggle">{Object.keys(cases).map((x)=><button type="button" key={x} className={dimension===x?"active":""} onClick={()=>{setDimension(x);setSelected(1);}}>{x}</button>)}</div>
    <p className="problemHint">Sélectionnez un cas pour voir pourquoi il remonte en relecture.</p>
  </>}>
    <div className="problemQualityConsole">
      <div className="problemQuality">{rows.map((item,i)=><button type="button" key={item.id} className={(item.score<75?"warning ":"")+(selected===i?"active":"")} onClick={()=>setSelected(i)}><strong>Cas {item.id}</strong><span>{item.label}</span><b>{item.score}</b><div><i style={{width:item.score+"%"}}/></div></button>)}</div>
      <article className="problemReviewCard">
        <span>REVUE PRIORITAIRE · {dimension.toUpperCase()}</span>
        <strong>Cas {current.id} · {current.score}/100</strong>
        <p>{current.reason}</p>
        <div><b>Contrôle humain</b><em>{current.score<75?"Relecture requise":"Échantillon de contrôle"}</em></div>
        <div><b>Action</b><em>{current.score<75?"Vérifier avant clôture":"Conserver comme référence"}</em></div>
      </article>
    </div>
  </Shell>;
}

function Tender({ demo }) {
  const [tab,setTab]=useState("Exigences");
  const [selected,setSelected]=useState(0);
  const data={
    Exigences:[
      {name:"Mémoire technique",value:"Obligatoire",source:"RC · art. 5.2",status:"Couvert à 68 %",action:"Compléter méthode projet"},
      {name:"Références",value:"3 minimum",source:"RC · art. 4.1",status:"2 preuves prêtes",action:"Ajouter une référence autorisée"},
      {name:"SLA",value:"À chiffrer",source:"CCTP · p. 18",status:"À produire",action:"Faire valider l’engagement"}
    ],
    Échéances:[
      {name:"Questions",value:"J-12",source:"RC · art. 2.4",status:"Fenêtre ouverte",action:"Regrouper les questions"},
      {name:"Dépôt",value:"J-0",source:"RC · art. 7",status:"Pièces à contrôler",action:"Préparer checklist finale"},
      {name:"Audition",value:"J+14",source:"RC · annexe",status:"Prévisionnel",action:"Préparer trame d’audition"}
    ],
    Vigilance:[
      {name:"Sous-traitance",value:"Déclaration requise",source:"RC · art. 6.3",status:"À confirmer",action:"Vérifier formulaire dédié"},
      {name:"Pénalités",value:"Plafond contractuel",source:"CCAP · p. 11",status:"Signalé",action:"Faire relire au juridique"},
      {name:"Délais",value:"Démarrage sous 15 j",source:"AE · p. 3",status:"À valider",action:"Confirmer capacité planning"}
    ]
  };
  const rows=data[tab];
  const current=rows[selected] || rows[0];
  return <Shell demo={demo} side={<>
    <div className="problemToggle">{Object.keys(data).map((x)=><button type="button" key={x} className={tab===x?"active":""} onClick={()=>{setTab(x);setSelected(0);}}>{x}</button>)}</div>
    <div className="problemDocument"><b>DCE_FICTIF.zip</b><span>RC · CCTP · CCAP · AE · annexes</span></div>
  </>}>
    <div className="problemTenderWorkspace">
      <div className="problemTender">{rows.map((item,i)=><button type="button" key={item.name} className={selected===i?"active":""} onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{item.name}</strong><b>{item.value}</b><small>{item.status}</small></button>)}</div>
      <article className="problemTenderDetail">
        <span>EXIGENCE RETROUVÉE</span>
        <strong>{current.name}</strong>
        <p>{current.source}</p>
        <div><b>État</b><em>{current.status}</em></div>
        <div><b>Prochaine action</b><em>{current.action}</em></div>
        <small>Source fictive · aucune référence ou capacité absente n’est inventée.</small>
      </article>
    </div>
  </Shell>;
}

function Seo({ demo }) {
  const [url,setUrl]=useState("https://exemple.fr");
  const [run,setRun]=useState(false);
  const [focus,setFocus]=useState("Priorité");
  const backlog=[
    {area:"Schema",issue:"FAQ et Service non reliés",impact:"Fort",effort:"Faible",score:92},
    {area:"Contenu",issue:"Intention métier insuffisamment couverte",impact:"Fort",effort:"Moyen",score:86},
    {area:"GEO",issue:"Entités et preuves peu explicites",impact:"Moyen",effort:"Faible",score:79},
    {area:"Technique",issue:"Maillage interne trop faible",impact:"Moyen",effort:"Moyen",score:71}
  ];
  const rows=focus==="Priorité"?backlog:[...backlog].sort((a,b)=>a.area.localeCompare(b.area));
  return <Shell demo={demo} side={<>
    <input value={url} onChange={(e)=>{setUrl(e.target.value);setRun(false);}}/>
    <button type="button" onClick={()=>setRun(true)}>Lancer le scan fictif</button>
    {run&&<div className="problemToggle">{["Priorité","Pilier"].map((x)=><button type="button" key={x} className={focus===x?"active":""} onClick={()=>setFocus(x)}>{x}</button>)}</div>}
  </>}>
    {run ? <div className="problemSeoWorkspace">
      <div className="problemSeo"><article><span>TECHNIQUE</span><strong>78</strong></article><article><span>CONTENU</span><strong>64</strong></article><article><span>SCHEMA</span><strong>52</strong></article><article><span>GEO</span><strong>61</strong></article></div>
      <div className="problemSeoBacklog">{rows.map((item,i)=><article key={item.area}><span>0{i+1} · {item.area}</span><strong>{item.issue}</strong><div><b>Impact {item.impact}</b><b>Effort {item.effort}</b><em>{item.score}</em></div></article>)}</div>
      <p className="problemInsight">Le score sert ici à prioriser le backlog fictif. Il ne représente pas une note Google ni une garantie de visibilité.</p>
    </div> : <div className="problemEmpty">Saisissez une URL puis lancez la simulation.</div>}
  </Shell>;
}

function Site({ demo }) {
  const [lot,setLot]=useState(0);
  const [proof,setProof]=useState(false);
  const lots=[
    {name:"Façade",status:"Critique",place:"Bât. B · niveau 2",owner:"Lot façade",due:"J+2"},
    {name:"Menuiserie",status:"À lever",place:"Hall A · porte 03",owner:"Lot menuiserie",due:"J+5"},
    {name:"Électricité",status:"Suivi",place:"Palier 4 · zone Est",owner:"Lot électricité",due:"J+7"}
  ];
  const item=lots[lot];
  return <Shell demo={demo} side={<div className="problemQueue">{lots.map((x,i)=><button type="button" key={x.name} className={lot===i?"active":""} onClick={()=>{setLot(i);setProof(false);}}><span>LOT {String(i+1).padStart(2,"0")}</span><strong>{x.name}</strong><small>{x.status}</small></button>)}</div>}>
    <div className="problemSiteWorkspace">
      <div className="problemSitePhoto"><span>PHOTO FICTIVE · AVANT</span><strong>Réserve #{804+lot}</strong><i/><i/><b>{item.place}</b></div>
      <article className="problemSiteCard">
        <span>STATUT</span><strong>{item.status}</strong>
        <div><b>Affectation</b><em>{item.owner}</em></div>
        <div><b>Échéance</b><em>{item.due}</em></div>
        <div><b>Preuve attendue</b><em>Photo après + commentaire</em></div>
        <button type="button" onClick={()=>setProof(true)}>{proof?"Preuve reçue · à valider":"Simuler la réception d’une preuve"}</button>
        {proof&&<small>La levée reste une décision humaine. La preuve est seulement rattachée à la réserve.</small>}
      </article>
    </div>
  </Shell>;
}

function Stock({ demo }) {
  const [days,setDays]=useState(14);
  const [safety,setSafety]=useState(8);
  const items=[["SKU-8842",48,4,7],["SKU-1194",64,2,5],["SKU-7812",33,1,9]];
  return <Shell demo={demo} side={<>
    <label><span>Horizon <b>{days} jours</b></span><input type="range" min="7" max="30" value={days} onChange={(e)=>setDays(Number(e.target.value))}/></label>
    <label><span>Stock de sécurité <b>{safety}</b></span><input type="range" min="0" max="25" value={safety} onChange={(e)=>setSafety(Number(e.target.value))}/></label>
  </>}>
    <div className="problemStockConsole">
      <div className="problemStock">{items.map(([name,stock,burn,lead])=>{const left=stock-burn*days;const reorder=Math.max(0,burn*(days+lead)+safety-stock);const state=left<=0?"Rupture":left<safety?"Sous seuil":"Stable";return <article key={name} className={state==="Rupture"?"danger":state==="Sous seuil"?"warning":""}><div><strong>{name}</strong><span>Délai {lead} j</span></div><b>{Math.max(0,left)}</b><small>{state}</small><div className="problemStockMeter"><i style={{width:Math.max(6,Math.min(100,(Math.max(0,left)/(stock||1))*100))+"%"}}/></div><p>{reorder>0?`Proposition fictive : commander ${reorder} u.`:"Aucune commande proposée."}</p></article>})}</div>
      <p className="problemInsight">La proposition évolue avec l’horizon, la consommation, le délai et le stock de sécurité. Toute commande reste à valider.</p>
    </div>
  </Shell>;
}

function Maintenance({ demo }) {
  const [vibration,setVibration]=useState(62);
  const [temperature,setTemperature]=useState(71);
  const [tab,setTab]=useState("Diagnostic");
  const risk=Math.min(99,Math.round((vibration*.55)+(temperature*.45)));
  const causes=[
    ["Roulement / usure",Math.min(96,Math.round(risk*.92))],
    ["Désalignement",Math.max(18,Math.round(risk*.68))],
    ["Capteur / mesure",Math.max(12,Math.round(risk*.41))]
  ];
  return <Shell demo={demo} side={<>
    <label><span>Vibration <b>{vibration}</b></span><input type="range" min="20" max="100" value={vibration} onChange={(e)=>setVibration(Number(e.target.value))}/></label>
    <label><span>Température <b>{temperature}</b></span><input type="range" min="20" max="100" value={temperature} onChange={(e)=>setTemperature(Number(e.target.value))}/></label>
    <div className="problemToggle">{["Diagnostic","Procédure"].map((x)=><button type="button" key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div>
  </>}>
    <div className="problemMaintenanceConsole">
      <div className="problemMaintenance"><span>INDICE DE DÉRIVE FICTIF</span><strong>{risk}%</strong><div><i style={{width:risk+"%"}}/></div><p>{risk>75?"Contrôle prioritaire proposé":"Surveillance renforcée"} · le diagnostic reste au technicien.</p></div>
      {tab==="Diagnostic"?<div className="problemCauseList">{causes.map(([name,score],i)=><article key={name}><span>0{i+1}</span><strong>{name}</strong><b>{score}%</b><div><i style={{width:score+"%"}}/></div></article>)}</div>:<article className="problemProcedureCard"><span>PROCÉDURE RETROUVÉE · GMAO FICTIVE</span><strong>Contrôle vibration anormale · Q-14</strong><ol><li>Vérifier le capteur et le serrage.</li><li>Comparer au dernier relevé stable.</li><li>Contrôler roulement et alignement si la dérive persiste.</li></ol><small>Le système propose les contrôles ; le technicien réalise le diagnostic.</small></article>}
    </div>
  </Shell>;
}

const engines={meeting:Meeting,rag:Rag,score:Score,router:Router,extract:Extract,control:Control,dashboard:Dashboard,sequence:Sequence,compare:Compare,builder:Builder,quality:Quality,tender:Tender,seo:Seo,site:Site,stock:Stock,maintenance:Maintenance,timeline:Dashboard};

export default function ProblemLab({ problem }) {
  const [active,setActive]=useState(0);
  const demo=problem.demos[active];
  const Engine=engines[demo[0]] || Dashboard;
  const normalized={type:demo[0],title:demo[1],metric:demo[2],caption:demo[3],problemSlug:problem.slug,problemCluster:problem.cluster};

  function open(index) {
    setActive(index);
    const item=problem.demos[index];
    trackEvent("problem_lab_demo_open",{problem_slug:problem.slug,problem_cluster:problem.cluster,demo_name:item[1],demo_index:index+1});
  }

  return (
    <section className="problemLab" id="demo">
      <div className="problemSectionIntro">
        <p className="sectionIndex">01 — MANIPULEZ LE PROBLÈME</p>
        <h2>Voyez le flux avant de parler technologie.</h2>
        <p>Chaque module utilise des données fictives. Changez un critère, lancez une analyse ou ouvrez un cas : le but est de rendre la transformation concrète.</p>
      </div>
      <div className="problemDemoTabs">{problem.demos.map((item,index)=><button type="button" key={item[1]} className={active===index?"active":""} onClick={()=>open(index)}><span>{String(index+1).padStart(2,"0")}</span><strong>{item[1]}</strong><small>{item[2]}</small></button>)}</div>
      <div className="problemProduct">
        <div className="problemProductTop"><div><i/><i/><i/></div><span>AUTONOMIA LAB · {problem.title}</span><b>DÉMO FICTIVE</b></div>
        <div className="problemProductBody">
          <Engine demo={normalized}/>
          <div className="problemLabBridge">
            <div>
              <span>VOTRE FLUX RÉEL</span>
              <strong>Vous reconnaissez ce processus ?</strong>
              <p>On repart de vos outils, de vos règles et de vos points de validation pour construire le prototype.</p>
            </div>
            <a href="#diagnostic" onClick={()=>{
              window.dispatchEvent(new CustomEvent("autonomia:prefill-problem-lead",{detail:{need:`Je veux adapter le module « ${demo[1]} » à notre flux réel. Nos outils et règles sont à préciser.`,demoName:demo[1],demoIndex:active+1}}));
              trackEvent("problem_cta_click",{problem_slug:problem.slug,problem_cluster:problem.cluster,source_surface:"problem_lab",demo_name:demo[1],demo_index:active+1});
            }}>Adapter ce flux à mon entreprise →</a>
          </div>
          <p className="problemDisclosure">Données fictives · résultats illustratifs · aucune performance n’est garantie · les décisions sensibles restent humaines.</p>
        </div>
      </div>
    </section>
  );
}
