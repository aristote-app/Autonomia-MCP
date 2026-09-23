"use client";

import { useMemo, useState } from "react";

function DemoA({ title, today, transform, result }) {
  const [text, setText] = useState("Demande reçue ce matin avec plusieurs informations à trier.");
  const [done, setDone] = useState(false);
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>ENTRÉE</span>
        <textarea rows="5" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="button" onClick={() => setDone(true)}>Analyser</button>
      </div>
      <div className={done ? "miniDemoOutput ready" : "miniDemoOutput"}>
        <span>RÉSULTAT</span>
        {done ? (
          <>
            <strong>{title}</strong>
            <p>{transform}</p>
            <ul><li>Informations utiles structurées</li><li>Point d’attention détecté</li><li>Action proposée pour validation</li></ul>
            <small>{result}</small>
          </>
        ) : <p>Lancez l’analyse pour voir une sortie structurée.</p>}
      </div>
    </div>
  );
}

function DemoB({ title, transform, result }) {
  const [selected, setSelected] = useState(["Nouveau"]);
  const items = ["Urgent", "Nouveau", "À vérifier"];
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>CHOISISSEZ LES SIGNAUX</span>
        <div className="miniDemoChecks">
          {items.map((item) => (
            <button key={item} type="button" className={selected.includes(item) ? "active" : ""} onClick={() => setSelected((cur) => cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item])}>{item}</button>
          ))}
        </div>
        <p>Le module classe les éléments selon les règles choisies.</p>
      </div>
      <div className="miniDemoOutput ready">
        <span>PRIORISATION</span>
        <strong>{title}</strong>
        <div className="miniDemoRows">
          {selected.length ? selected.map((item, i) => <p key={item}><b>0{i+1}</b><span>{item}</span><small>{i === 0 ? "à traiter en premier" : "file préparée"}</small></p>) : <p><span>Aucun signal sélectionné</span></p>}
        </div>
        <small>{transform} · {result}</small>
      </div>
    </div>
  );
}

function DemoC({ title, transform, result }) {
  const [checks, setChecks] = useState([true, false, true]);
  const labels = ["Pièce principale présente", "Justificatif manquant", "Référence cohérente"];
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>CONTRÔLE FICTIF</span>
        <div className="miniControlList">
          {labels.map((label, i) => (
            <label key={label}><input type="checkbox" checked={checks[i]} onChange={() => setChecks((cur) => cur.map((v,j)=> j===i ? !v : v))} /><span>{label}</span></label>
          ))}
        </div>
      </div>
      <div className="miniDemoOutput ready">
        <span>CONTRÔLE PRÉPARÉ</span>
        <strong>{title}</strong>
        <p>{checks.filter(Boolean).length}/3 contrôles conformes.</p>
        <div className="miniDemoAlert">{checks.every(Boolean) ? "Prêt pour validation humaine" : "1 point nécessite une vérification"}</div>
        <small>{transform} · {result}</small>
      </div>
    </div>
  );
}

function DemoD({ title, transform, result }) {
  const [tone, setTone] = useState("Court");
  const [generated, setGenerated] = useState(false);
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>PARAMÈTRES</span>
        <div className="miniDemoChecks">
          {["Court","Détaillé","Très formel"].map((item)=><button key={item} type="button" className={tone===item?"active":""} onClick={()=>setTone(item)}>{item}</button>)}
        </div>
        <button type="button" onClick={()=>setGenerated(true)}>Préparer le brouillon</button>
      </div>
      <div className={generated ? "miniDemoOutput ready" : "miniDemoOutput"}>
        <span>BROUILLON</span>
        {generated ? (
          <>
            <strong>{title}</strong>
            <p>Version {tone.toLowerCase()} préparée à partir des informations validées. Les éléments sensibles restent à confirmer avant utilisation.</p>
            <small>{transform} · {result}</small>
          </>
        ) : <p>Choisissez un niveau de détail puis générez le brouillon.</p>}
      </div>
    </div>
  );
}

function DemoE({ title, transform, result }) {
  const [period, setPeriod] = useState("Cette semaine");
  const data = {
    "Aujourd’hui": ["3 éléments nouveaux", "1 anomalie", "2 actions ouvertes"],
    "Cette semaine": ["18 éléments traités", "4 anomalies", "7 actions terminées"],
    "Ce mois": ["76 éléments traités", "9 anomalies", "21 actions terminées"]
  };
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>PÉRIODE</span>
        <select value={period} onChange={(e)=>setPeriod(e.target.value)}>{Object.keys(data).map((k)=><option key={k}>{k}</option>)}</select>
        <p>Changez la période pour voir la synthèse se recalculer.</p>
      </div>
      <div className="miniDemoOutput ready">
        <span>SYNTHÈSE</span>
        <strong>{title}</strong>
        <div className="miniDemoRows">{data[period].map((x,i)=><p key={x}><b>0{i+1}</b><span>{x}</span></p>)}</div>
        <small>{transform} · {result}</small>
      </div>
    </div>
  );
}

function DemoF({ title, transform, result }) {
  const [states, setStates] = useState(["À faire","En cours","Validé"]);
  function advance(index) {
    setStates((cur) => cur.map((v,i)=> i===index ? (v==="À faire" ? "En cours" : v==="En cours" ? "Validé" : "Validé") : v));
  }
  return (
    <div className="miniDemoWorkspace">
      <div className="miniDemoInput">
        <span>FILE D’ACTIONS</span>
        <div className="miniWorkflow">
          {states.map((state,i)=><button type="button" key={i} onClick={()=>advance(i)}><b>Action {i+1}</b><span>{state}</span></button>)}
        </div>
      </div>
      <div className="miniDemoOutput ready">
        <span>SUIVI</span>
        <strong>{title}</strong>
        <p>{states.filter((x)=>x==="Validé").length} action(s) validée(s) sur 3.</p>
        <small>{transform} · {result}</small>
      </div>
    </div>
  );
}

const DEMOS = [DemoA, DemoB, DemoC, DemoD, DemoE, DemoF];

export default function MiniModuleLab({ topic }) {
  const [active, setActive] = useState(0);
  const module = topic.modules[active];
  const Demo = DEMOS[active % DEMOS.length];
  const [title, today, transform, result] = module;

  const numbers = useMemo(() => topic.modules.map((_, i) => String(i + 1).padStart(2, "0")), [topic.modules]);

  return (
    <section className="miniModuleLab" id="mini-modules">
      <div className="miniModuleIntro">
        <div>
          <p className="sectionIndex">01 — TESTEZ 6 MINI-MODULES</p>
          <h2>Pas une liste d’idées. Des mini-outils à manipuler.</h2>
        </div>
        <p>Les données sont fictives. L’objectif est de rendre visible le type d’interface, de logique et de contrôle que nous pouvons construire autour de « {topic.title} ».</p>
      </div>

      <div className="miniModuleShell">
        <div className="miniModuleNav">
          {topic.modules.map(([name], index) => (
            <button key={name} type="button" className={active === index ? "active" : ""} onClick={()=>setActive(index)}>
              <span>{numbers[index]}</span>
              <strong>{name}</strong>
            </button>
          ))}
        </div>

        <div className="miniModuleStage">
          <div className="miniModuleContext">
            <span>DÉMO FICTIVE</span>
            <h3>{title}</h3>
            <p><b>Aujourd’hui.</b> {today}</p>
          </div>
          <Demo title={title} today={today} transform={transform} result={result} />
        </div>
      </div>
    </section>
  );
}
