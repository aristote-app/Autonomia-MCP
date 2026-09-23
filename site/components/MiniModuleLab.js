"use client";

import { useMemo, useState } from "react";
import { getMiniDemoBlueprints } from "@/content/mini-demo-blueprints";

const contexts = {
  "ressources-humaines": {
    entities: ["M. D. · 6 ans", "A. R. · 4 ans", "S. L. · 8 ans"],
    sources: ["Politique RH 2026", "Guide onboarding", "Accord télétravail"],
    routes: ["Talent acquisition", "HRBP", "Formation"],
    channels: ["Manager", "Candidat", "Salarié", "Direction"]
  },
  "direction-management": {
    entities: ["Option A · rapide", "Option B · robuste", "Option C · hybride"],
    sources: ["Note CODIR", "Dashboard ventes", "Budget S2"],
    routes: ["Direction", "Finance", "Opérations"],
    channels: ["CODIR", "Managers", "Équipes", "Partenaires"]
  },
  "commercial-business-development": {
    entities: ["Compte A · signal fort", "Compte B · actif", "Compte C · dormant"],
    sources: ["CRM", "Site prospect", "Historique e-mails"],
    routes: ["AE", "Sales Ops", "Direction commerciale"],
    channels: ["E-mail", "LinkedIn", "CRM", "Téléphone"]
  },
  "marketing-communication": {
    entities: ["Campagne A · forte demande", "Sujet B · gap SEO", "Sujet C · veille"],
    sources: ["Search Console", "CRM", "Charte éditoriale"],
    routes: ["Content", "Growth", "Brand"],
    channels: ["LinkedIn", "Newsletter", "Landing page", "Short video"]
  },
  "finance-comptabilite": {
    entities: ["FAC-26091", "FAC-26092", "FAC-26093"],
    sources: ["ERP", "Banque", "Procédure clôture"],
    routes: ["Comptabilité", "Contrôle", "DAF"],
    channels: ["ERP", "Validation", "Reporting"]
  },
  "service-client-support": {
    entities: ["Ticket #8421", "Ticket #8427", "Ticket #8433"],
    sources: ["Base SAV", "Procédure retours", "Historique client"],
    routes: ["N1", "N2", "Facturation"],
    channels: ["E-mail", "Chat", "Téléphone"]
  },
  "industrie": {
    entities: ["Ligne 3 · vibration", "Presse 7 · température", "Robot 2 · arrêt"],
    sources: ["GMAO", "Procédure Q-14", "Historique incidents"],
    routes: ["Maintenance", "Qualité", "Production"],
    channels: ["Atelier", "GMAO", "Supervision"]
  },
  "retail-commerce": {
    entities: ["SKU 8842 · rupture", "SKU 1194 · surstock", "SKU 7812 · stable"],
    sources: ["ERP stock", "Ventes 30 j", "Catalogue produit"],
    routes: ["Magasin", "Appro", "E-commerce"],
    channels: ["Web", "Magasin", "CRM"]
  },
  "immobilier-construction": {
    entities: ["Lot 04 · façade", "Lot 08 · menuiserie", "Lot 11 · électricité"],
    sources: ["CR chantier", "CCTP", "Photos réserves"],
    routes: ["MOE", "Entreprise", "MOA"],
    channels: ["Chantier", "Plateforme", "E-mail"]
  },
  "taches-administratives": {
    entities: ["Dossier 2481", "Dossier 2482", "Dossier 2483"],
    sources: ["Boîte générique", "PDF reçu", "Tableau suivi"],
    routes: ["Accueil", "Back-office", "Responsable"],
    channels: ["E-mail", "Formulaire", "GED"]
  },
  "gestion-contenu-digital": {
    entities: ["Sujet A · requête forte", "Sujet B · à recycler", "Sujet C · lancement"],
    sources: ["Brief", "Charte de marque", "Données SEO"],
    routes: ["Content", "SEO", "Social"],
    channels: ["Article", "LinkedIn", "Newsletter", "Landing"]
  },
  "emails-demandes-entrantes": {
    entities: ["Demande #1042", "Demande #1043", "Demande #1044"],
    sources: ["Boîte partagée", "CRM", "FAQ interne"],
    routes: ["Support", "Commercial", "Administration"],
    channels: ["E-mail", "Formulaire", "CRM"]
  },
  "reporting-syntheses": {
    entities: ["BU Nord", "BU IDF", "BU Sud"],
    sources: ["ERP", "CRM", "Tableau financier"],
    routes: ["Direction", "Finance", "Opérations"],
    channels: ["COMEX", "Managers", "Équipe"]
  }
};

function ctx(topic) {
  return contexts[topic.slug] || {
    entities: ["Élément A", "Élément B", "Élément C"],
    sources: ["Source 1", "Source 2", "Source 3"],
    routes: ["Équipe A", "Équipe B", "Équipe C"],
    channels: ["Canal 1", "Canal 2", "Canal 3"]
  };
}

function ValueStrip({ blueprint }) {
  return (
    <div className="wowValueStrip">
      <div><span>CE QUE LA DÉMO MONTRE</span><strong>{blueprint.metric}</strong></div>
      <div><span>VALEUR VISÉE</span><strong>{blueprint.gain}</strong></div>
      <div><span>GARDE-FOU</span><strong>Validation humaine conservée</strong></div>
    </div>
  );
}

function RankingExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [speed, setSpeed] = useState(60);
  const [fit, setFit] = useState(75);
  const [risk, setRisk] = useState(25);

  const scores = c.entities.map((name, index) => {
    const base = [84, 72, 64][index] || 60;
    const score = Math.max(0, Math.min(99, Math.round(base + (fit - 70) * (index === 0 ? .35 : .18) + (speed - 50) * .1 - risk * (index === 2 ? .16 : .08))));
    return { name, score };
  }).sort((a,b) => b.score - a.score);

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">CRITÈRES À PONDÉRER</p>
        <label><span>Adéquation métier <b>{fit}%</b></span><input type="range" min="0" max="100" value={fit} onChange={(e)=>setFit(Number(e.target.value))} /></label>
        <label><span>Vitesse / urgence <b>{speed}%</b></span><input type="range" min="0" max="100" value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} /></label>
        <label><span>Risque toléré <b>{risk}%</b></span><input type="range" min="0" max="100" value={risk} onChange={(e)=>setRisk(Number(e.target.value))} /></label>
        <div className="wowNote"><b>Aujourd’hui</b><span>{module[1]}</span></div>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>CLASSEMENT DYNAMIQUE</span><strong>{blueprint.metric}</strong></div>
        <div className="wowRanking">
          {scores.map((item,index)=>(
            <article key={item.name}>
              <b>0{index+1}</b>
              <div><strong>{item.name}</strong><span>{index === 0 ? "prioritaire" : index === 1 ? "à examiner" : "secondaire"}</span></div>
              <em>{item.score}</em>
              <div className="wowBar"><i style={{width:item.score+"%"}} /></div>
            </article>
          ))}
        </div>
        <div className="wowInsight"><span>INSIGHT</span><p>{module[2]} La hiérarchie change en temps réel lorsque vous modifiez les critères.</p></div>
      </div>
    </div>
  );
}

function QueueExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [selected, setSelected] = useState(0);
  const [processed, setProcessed] = useState(false);
  const priorities = ["Urgent", "À traiter", "Standard"];

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">FILE ENTRANTE</p>
        <div className="wowQueue">
          {c.entities.map((item,index)=>(
            <button type="button" key={item} className={selected===index?"active":""} onClick={()=>{setSelected(index);setProcessed(false);}}>
              <span>{priorities[index] || "Standard"}</span><strong>{item}</strong><small>{index===0?"Nouveau · 09:12":index===1?"En attente · 08:44":"Reçu hier"}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>COPILOTE DE TRAITEMENT</span><strong>{blueprint.metric}</strong></div>
        <div className="wowTicket">
          <div className="wowTicketMeta"><span>ÉLÉMENT</span><strong>{c.entities[selected]}</strong></div>
          <p>{module[1]}</p>
          <button type="button" className="wowAction" onClick={()=>setProcessed(true)}>Analyser et préparer l’action</button>
          {processed && (
            <div className="wowResultCard">
              <div><span>PRIORITÉ</span><strong>{priorities[selected]}</strong></div>
              <div><span>ROUTAGE</span><strong>{c.routes[selected] || c.routes[0]}</strong></div>
              <div><span>ACTION</span><strong>{module[2]}</strong></div>
              <small>À confirmer avant exécution.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KnowledgeExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [query, setQuery] = useState("Quelle est la bonne procédure dans ce cas ?");
  const [searched, setSearched] = useState(false);

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">QUESTION MÉTIER</p>
        <textarea rows="5" value={query} onChange={(e)=>{setQuery(e.target.value);setSearched(false);}} />
        <div className="wowSources">{c.sources.map((source)=><span key={source}>✓ {source}</span>)}</div>
        <button type="button" className="wowAction" onClick={()=>setSearched(true)}>Chercher dans les sources</button>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>ASSISTANT SOURCÉ</span><strong>{blueprint.metric}</strong></div>
        {!searched ? <div className="wowEmpty">Posez la question puis lancez la recherche.</div> : (
          <div className="wowAnswer">
            <span>RÉPONSE PRÉPARÉE</span>
            <h4>{module[0]}</h4>
            <p>{module[2]} Dans cette simulation, la réponse est limitée aux documents autorisés et affiche les sources utilisées.</p>
            <div className="wowCitationList">
              {c.sources.map((source,index)=><button type="button" key={source}><b>[{index+1}]</b>{source}<small>{96-index*7}% de pertinence</small></button>)}
            </div>
            <div className="wowConfidence"><span>Confiance documentaire</span><strong>92%</strong></div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [channel, setChannel] = useState(c.channels[0]);
  const [tone, setTone] = useState("Direct");
  const [generated, setGenerated] = useState(false);

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">STUDIO</p>
        <label><span>Canal</span><select value={channel} onChange={(e)=>{setChannel(e.target.value);setGenerated(false);}}>{c.channels.map((x)=><option key={x}>{x}</option>)}</select></label>
        <div className="wowToggleRow">{["Direct","Pédagogique","Premium"].map((x)=><button type="button" key={x} className={tone===x?"active":""} onClick={()=>{setTone(x);setGenerated(false);}}>{x}</button>)}</div>
        <button type="button" className="wowAction" onClick={()=>setGenerated(true)}>Générer et contrôler</button>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>STUDIO DE PRODUCTION</span><strong>{blueprint.metric}</strong></div>
        {!generated ? <div className="wowEmpty">Choisissez un canal et un ton pour fabriquer la sortie.</div> : (
          <>
            <div className="wowCanvas">
              <div className="wowCanvasTop"><span>{channel.toUpperCase()}</span><small>Ton : {tone}</small></div>
              <h4>{module[0]} — version préparée</h4>
              <p>{module[2]} Cette version simule un contenu adapté au canal sélectionné, produit depuis des sources et règles de marque.</p>
            </div>
            <div className="wowChecks">
              <span>✓ Ton conforme</span><span>✓ Claim sensible signalé</span><span>✓ Source manquante détectée</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DataExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [processed, setProcessed] = useState(false);
  const sample = topic.slug === "finance-comptabilite"
    ? "FACTURE ACME SAS · 2 480,00 € HT · échéance 15/10/2026 · PO-4482"
    : topic.slug === "emails-demandes-entrantes"
      ? "Objet : dossier 8427 — merci de confirmer réception avant vendredi. Réf. CL-20918."
      : "Document reçu · Référence 2026-0842 · Date 23/09/2026 · Statut à vérifier";

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">DOCUMENT / TEXTE SOURCE</p>
        <div className="wowRawDoc"><span>FICHIER FICTIF</span><p>{sample}</p><small>+ 2 pages annexes</small></div>
        <button type="button" className="wowAction" onClick={()=>setProcessed(true)}>Extraire et contrôler</button>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>DONNÉES STRUCTURÉES</span><strong>{blueprint.metric}</strong></div>
        {!processed ? <div className="wowEmpty">Lancez l’extraction pour transformer le document en données vérifiables.</div> : (
          <div className="wowDataGrid">
            {[
              ["Référence", c.entities[0]],
              ["Catégorie", blueprint.accent],
              ["Statut", "À valider"],
              ["Confiance", "94 %"],
              ["Anomalie", "1 point à vérifier"],
              ["Action", c.routes[0]]
            ].map(([k,v])=><div key={k}><span>{k}</span><strong>{v}</strong></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function MeetingExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [run, setRun] = useState(false);
  const transcript = [
    "Il faut finaliser le point avant jeudi.",
    "Julie reprend la validation avec l’équipe.",
    "Le budget reste à confirmer côté finance."
  ];

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">VERBATIM FICTIF</p>
        <div className="wowTranscript">{transcript.map((line,index)=><p key={line}><b>0{index+1}</b><span>{line}</span></p>)}</div>
        <button type="button" className="wowAction" onClick={()=>setRun(true)}>Extraire décisions et actions</button>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>COPILOTE DE RÉUNION</span><strong>{blueprint.metric}</strong></div>
        {!run ? <div className="wowEmpty">Lancez l’analyse pour transformer le verbatim en éléments pilotables.</div> : (
          <div className="wowDecisionBoard">
            <article><span>DÉCISION</span><strong>Finaliser le point avant jeudi</strong><small>Source : verbatim 01</small></article>
            <article><span>RESPONSABLE</span><strong>Julie · {c.routes[0]}</strong><small>Source : verbatim 02</small></article>
            <article><span>BLOCAGE</span><strong>Budget à confirmer</strong><small>À arbitrer avec {c.routes[1] || "Finance"}</small></article>
          </div>
        )}
      </div>
    </div>
  );
}

function PlannerExperience({ topic, module, blueprint }) {
  const [proximity, setProximity] = useState(true);
  const [capacity, setCapacity] = useState(true);
  const [priority, setPriority] = useState(false);
  const score = 71 + (proximity?9:0) + (capacity?8:0) + (priority?5:0);

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">CONTRAINTES</p>
        {[
          ["Proximité / regroupement", proximity, setProximity],
          ["Capacité disponible", capacity, setCapacity],
          ["Priorité forte", priority, setPriority]
        ].map(([label,value,setter])=><label className="wowSwitch" key={label}><input type="checkbox" checked={value} onChange={()=>setter(!value)} /><span>{label}</span></label>)}
        <p className="wowMiniCopy">{module[1]}</p>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>PLANIFICATEUR SOUS CONTRAINTES</span><strong>{blueprint.metric}</strong></div>
        <div className="wowPlannerScore"><span>SCORE DE SOLUTION</span><strong>{Math.min(98,score)}%</strong><div className="wowBar"><i style={{width:Math.min(98,score)+"%"}} /></div></div>
        <div className="wowPlan">
          <p><b>09:00</b><span>Créneau A · recommandé</span><small>{proximity?"proximité optimisée":"standard"}</small></p>
          <p><b>11:30</b><span>Créneau B · disponible</span><small>{capacity?"capacité vérifiée":"à vérifier"}</small></p>
          <p><b>15:00</b><span>Cas à arbitrer</span><small>{priority?"priorité prise en compte":"sans priorité"}</small></p>
        </div>
      </div>
    </div>
  );
}

function ControlExperience({ topic, module, blueprint }) {
  const c = ctx(topic);
  const [checks, setChecks] = useState([true,true,false,true]);
  const labels = ["Pièce principale", "Référence cohérente", "Justificatif attendu", "Date valide"];

  return (
    <div className="wowWorkspace">
      <div className="wowControlPane">
        <p className="wowPaneLabel">RÈGLES DE CONTRÔLE</p>
        <div className="wowRuleList">{labels.map((label,index)=><label key={label}><input type="checkbox" checked={checks[index]} onChange={()=>setChecks((cur)=>cur.map((v,i)=>i===index?!v:v))}/><span>{label}</span></label>)}</div>
      </div>

      <div className="wowAppPane">
        <div className="wowAppHeader"><span>CENTRE DE CONTRÔLE</span><strong>{blueprint.metric}</strong></div>
        <div className="wowControlScore">
          <div><span>CONFORME</span><strong>{checks.filter(Boolean).length}/4</strong></div>
          <div><span>EXCEPTION</span><strong>{checks.every(Boolean)?"0":"1"}</strong></div>
          <div><span>ROUTAGE</span><strong>{c.routes[0]}</strong></div>
        </div>
        <div className={checks.every(Boolean)?"wowStatus ok":"wowStatus warning"}>
          <b>{checks.every(Boolean)?"Prêt pour validation humaine":"Vérification requise"}</b>
          <span>{module[2]}</span>
        </div>
      </div>
    </div>
  );
}

const rankingTypes = new Set(["candidate","radar","decision","pipeline","seo","campaign","variance","quality","compare","stock"]);
const queueTypes = new Set(["workflow","tickets","routing","sequence","collect"]);
const knowledgeTypes = new Set(["knowledge","account","maintenance","tender"]);
const contentTypes = new Set(["content","document","brief","brand"]);
const dataTypes = new Set(["invoice","reconcile","extract","table","catalog"]);
const meetingTypes = new Set(["meeting","timeline","executive","report"]);
const plannerTypes = new Set(["learning","calendar","site"]);
const controlTypes = new Set(["control","classify","cluster"]);

function Experience({ type, ...props }) {
  if (rankingTypes.has(type)) return <RankingExperience {...props} />;
  if (queueTypes.has(type)) return <QueueExperience {...props} />;
  if (knowledgeTypes.has(type)) return <KnowledgeExperience {...props} />;
  if (contentTypes.has(type)) return <ContentExperience {...props} />;
  if (dataTypes.has(type)) return <DataExperience {...props} />;
  if (meetingTypes.has(type)) return <MeetingExperience {...props} />;
  if (plannerTypes.has(type)) return <PlannerExperience {...props} />;
  if (controlTypes.has(type)) return <ControlExperience {...props} />;
  return <QueueExperience {...props} />;
}

export default function MiniModuleLab({ topic }) {
  const [active, setActive] = useState(0);
  const blueprints = useMemo(() => getMiniDemoBlueprints(topic.slug, topic.modules), [topic]);
  const module = topic.modules[active];
  const blueprint = blueprints[active];

  return (
    <section className="miniModuleLab wowLab" id="mini-modules">
      <div className="miniModuleIntro wowIntro">
        <div>
          <p className="sectionIndex">01 — TESTEZ 6 MICRO-APPS</p>
          <h2>Entrez dans l’outil. Pas dans une présentation.</h2>
        </div>
        <p>
          Chaque expérience simule une brique métier différente avec des données fictives.
          Manipulez les critères, lancez les analyses et observez la sortie évoluer.
        </p>
      </div>

      <div className="wowModuleTabs">
        {topic.modules.map(([name],index)=>(
          <button type="button" key={name} className={active===index?"active":""} onClick={()=>setActive(index)}>
            <span>{String(index+1).padStart(2,"0")}</span>
            <strong>{name}</strong>
            <small>{blueprints[index]?.metric}</small>
          </button>
        ))}
      </div>

      <div className="wowProductFrame">
        <div className="wowProductTopbar">
          <div><i /><i /><i /></div>
          <span>AUTONOMIA LAB · {topic.title}</span>
          <b>DÉMO FICTIVE</b>
        </div>

        <div className="wowProductBody">
          <div className="wowScenario">
            <p className="eyebrow">{blueprint.accent.toUpperCase()}</p>
            <h3>{module[0]}</h3>
            <p>{module[1]}</p>
          </div>

          <Experience type={blueprint.type} topic={topic} module={module} blueprint={blueprint} />
          <ValueStrip blueprint={blueprint} />
        </div>
      </div>
    </section>
  );
}
