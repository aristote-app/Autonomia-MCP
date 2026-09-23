"use client";

import { useMemo, useState } from "react";

const adsCases = [
  { name: "Piscine Rivière", type: "Déclaration préalable", urgency: "J-5", issue: "Photos manquantes", action: "Préparer une demande de pièces", pieces: ["CERFA", "Plan masse", "Photos"], rule: "Article UA 7", confidence: 91 },
  { name: "Maison Lambert", type: "Permis de construire", urgency: "J-9", issue: "Recul voie à contrôler", action: "Vérifier règle PLUi", pieces: ["CERFA", "Plan masse", "Notice"], rule: "Article UB 6", confidence: 87 },
  { name: "Maison Da Silva", type: "Permis de construire", urgency: "J-12", issue: "Hauteur +60 cm", action: "Signaler non-conformité potentielle", pieces: ["CERFA", "Coupe", "Façades"], rule: "Article UC 10", confidence: 94 },
  { name: "Hangar agricole", type: "Permis de construire", urgency: "J-18", issue: "Zone agricole", action: "Contrôler destination et pièces", pieces: ["CERFA", "Plan", "Attestation"], rule: "Zone A", confidence: 83 }
];

function ConservatoryDemo() {
  const [optimized, setOptimized] = useState(false);
  const [proximity, setProximity] = useState(70);
  const [siblings, setSiblings] = useState(55);
  const [preferences, setPreferences] = useState(80);

  const score = Math.min(98, Math.round(58 + proximity * .16 + siblings * .09 + preferences * .13));
  const placed = optimized ? Math.min(66, 58 + Math.round(score / 18)) : 60;
  const waiting = 66 - placed;
  const distance = optimized ? Math.max(120, 520 - proximity * 4) : 468;

  return (
    <div className="territoryDemoPanel territoryDemoPanelWow">
      <div className="territoryDemoTopline">
        <div>
          <span>DÉMO FICTIVE · CONSERVATOIRE</span>
          <strong>66 demandes · 7 professeurs · 3 sites</strong>
        </div>
        <button type="button" onClick={() => setOptimized(true)}>Lancer l’optimisation</button>
      </div>

      <div className="territoryWowWorkspace">
        <aside className="territoryConstraintPanel">
          <p className="eyebrow">PONDÉREZ LES CONTRAINTES</p>
          <label><span>Proximité domicile / site <b>{proximity}%</b></span><input type="range" min="0" max="100" value={proximity} onChange={(e)=>{setProximity(Number(e.target.value));setOptimized(true);}} /></label>
          <label><span>Regroupement fratries <b>{siblings}%</b></span><input type="range" min="0" max="100" value={siblings} onChange={(e)=>{setSiblings(Number(e.target.value));setOptimized(true);}} /></label>
          <label><span>Préférences horaires <b>{preferences}%</b></span><input type="range" min="0" max="100" value={preferences} onChange={(e)=>{setPreferences(Number(e.target.value));setOptimized(true);}} /></label>
          <div className="territoryOptimizationScore"><span>SCORE DE RÉPARTITION</span><strong>{optimized ? score : 61}%</strong></div>
        </aside>

        <div>
          <div className="conservatoryMetrics">
            <article><span>Élèves placés</span><strong>{optimized ? placed : "60"}</strong><small>{optimized ? "+" + (placed - 60) : "base"}</small></article>
            <article><span>Liste d’attente</span><strong>{optimized ? waiting : "6"}</strong><small>{optimized ? "-" + (6 - waiting) : "base"}</small></article>
            <article><span>Trajets familles</span><strong>{optimized ? "-" + distance + " km" : "—"}</strong><small>simulation / semaine</small></article>
            <article><span>Contraintes respectées</span><strong>{optimized ? score + "%" : "61%"}</strong><small>score fictif</small></article>
          </div>

          <div className="territorySchedule">
            {["Lundi", "Mardi", "Mercredi", "Jeudi"].map((day, index) => (
              <article key={day}>
                <strong>{day}</strong>
                <span>{optimized ? ["Violon · Site A", "Piano · Site B", "Guitare · Site A", "Flûte · Site C"][index] : ["Violon · Site C", "Piano · Site A", "Guitare · Site C", "Flûte · Site A"][index]}</span>
                <small>{optimized ? ["fratrie regroupée","trajet réduit","créneau préféré","capacité respectée"][index] : "premier créneau libre"}</small>
              </article>
            ))}
          </div>
        </div>
      </div>

      <p className="territoryDemoDisclaimer">Simulation entièrement fictive. L’algorithme prépare une répartition explicable ; l’équipe conserve l’arbitrage final.</p>
    </div>
  );
}

function AdsDemo() {
  const [selected, setSelected] = useState(adsCases[0]);
  const [checked, setChecked] = useState(false);

  return (
    <div className="territoryDemoPanel territoryDemoPanelWow">
      <div className="territoryDemoTopline">
        <div>
          <span>DÉMO FICTIVE · URBANISME ADS</span>
          <strong>File de pré-instruction classée par délai et risque</strong>
        </div>
      </div>

      <div className="adsDemoLayout">
        <div className="adsQueue">
          {adsCases.map((item) => (
            <button type="button" key={item.name} className={selected.name === item.name ? "active" : ""} onClick={() => {setSelected(item);setChecked(false);}}>
              <b>{item.urgency}</b>
              <span><strong>{item.name}</strong><small>{item.type}</small></span>
            </button>
          ))}
        </div>

        <div className="adsDetail adsDetailWow">
          <div className="adsDossierHead"><span>DOSSIER SÉLECTIONNÉ</span><b>{selected.urgency}</b></div>
          <h3>{selected.name}</h3>
          <div className="adsPieceGrid">{selected.pieces.map((piece,index)=><span key={piece} className={index===2 && selected.name==="Piscine Rivière"?"missing":""}>{index===2 && selected.name==="Piscine Rivière"?"!":"✓"} {piece}</span>)}</div>
          <div className="adsRule"><span>RÈGLE À CONTRÔLER</span><strong>{selected.rule}</strong></div>
          <button type="button" className="wowAction" onClick={()=>setChecked(true)}>Lancer le pré-contrôle</button>

          {checked && (
            <div className="adsPrecheck">
              <div><span>Complétude</span><strong>{selected.name==="Piscine Rivière"?"67%":"100%"}</strong></div>
              <div><span>Confiance lecture</span><strong>{selected.confidence}%</strong></div>
              <div><span>Point détecté</span><strong>{selected.issue}</strong></div>
              <div><span>Action préparée</span><strong>{selected.action}</strong></div>
            </div>
          )}

          <div className="adsDecision"><strong>L’outil prépare.</strong><span>L’instructeur relit, corrige et signe.</span></div>
        </div>
      </div>

      <p className="territoryDemoDisclaimer">Dossiers, règles et résultats fictifs. En production, les sources réglementaires et règles métier sont validées avec le service instructeur.</p>
    </div>
  );
}

function GeneratedDemo({ service, need, goal }) {
  const mode = useMemo(() => {
    const value = (service + " " + need + " " + goal).toLowerCase();
    if (/planning|conservatoire|piscine|créneau|creneau|agenda|affect/.test(value)) return "planning";
    if (/dossier|permis|pièce|piece|facture|complet|contrôle|controle|qualité/.test(value)) return "control";
    return "queue";
  }, [service, need, goal]);

  const titles = {
    planning: ["Planning sous contraintes", "87% de contraintes respectées", "3 arbitrages humains"],
    control: ["File de contrôle", "82% pré-contrôlé", "2 exceptions visibles"],
    queue: ["File de demandes", "14 demandes qualifiées", "3 priorités fortes"]
  };

  const [title, metric, exception] = titles[mode];

  return (
    <div className="generatedDemo generatedDemoWow">
      <div className="generatedDemoHead"><span>PROTO FICTIF · {mode.toUpperCase()}</span><b>{metric}</b></div>
      <h3>{title}</h3>
      <div className="generatedDashboard">
        <article><span>À traiter</span><strong>{mode==="planning"?"8":"14"}</strong></article>
        <article><span>Automatisable</span><strong>{mode==="control"?"82%":"74%"}</strong></article>
        <article><span>À arbitrer</span><strong>{mode==="planning"?"3":"2"}</strong></article>
      </div>
      <div className="generatedRows">
        <p><b>01</b><span>{mode==="planning"?"Créneau recommandé":mode==="control"?"Dossier prêt pour validation":"Demande urgente"}</span><small>action proposée</small></p>
        <p><b>02</b><span>{mode==="planning"?"Alternative compatible":mode==="control"?"Pièce à vérifier":"Routage proposé"}</span><small>contrôle humain</small></p>
        <p><b>03</b><span>{exception}</span><small>exception visible</small></p>
      </div>
      <div className="generatedGuardrail">Le prototype prépare la décision ; il ne la prend pas.</div>
    </div>
  );
}

export default function TerritoryDemoLab({ initialTab = "conservatoire" }) {
  const [tab, setTab] = useState(initialTab);
  const [collectivity, setCollectivity] = useState("Communauté de communes");
  const [size, setSize] = useState("50 à 150 agents");
  const [service, setService] = useState("Courrier / accueil");
  const [goal, setGoal] = useState("Gagner du temps");
  const [need, setNeed] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <section className="territoryDemoLab" id="demos">
      <div className="territoryDemoIntro">
        <p className="sectionIndex">01 — TESTEZ</p>
        <div>
          <h2>Trois micro-apps. Une logique : rendre le travail visible.</h2>
          <p>Manipulez les contraintes, lancez un pré-contrôle ou fabriquez un prototype à partir de votre propre irritant.</p>
        </div>
      </div>

      <div className="territoryDemoTabs">
        <button type="button" className={tab === "conservatoire" ? "active" : ""} onClick={() => setTab("conservatoire")}>Conservatoire</button>
        <button type="button" className={tab === "ads" ? "active" : ""} onClick={() => setTab("ads")}>Pré-instruction ADS</button>
        <button type="button" className={tab === "custom" ? "active" : ""} onClick={() => setTab("custom")}>Fabriquer ma démo</button>
      </div>

      {tab === "conservatoire" && <ConservatoryDemo />}
      {tab === "ads" && <AdsDemo />}

      {tab === "custom" && (
        <div className="territoryConfigurator territoryConfiguratorWow">
          <div className="territoryConfigForm">
            <p className="eyebrow">VOTRE PROTO EN 1 MINUTE</p>
            <h3>Décrivez la tâche qui use votre équipe.</h3>

            <label><span>Votre collectivité</span><select value={collectivity} onChange={(e) => setCollectivity(e.target.value)}><option>Communauté de communes</option><option>Communauté d’agglomération</option><option>Commune</option><option>Syndicat / établissement public</option></select></label>
            <label><span>Nombre d’agents</span><select value={size} onChange={(e) => setSize(e.target.value)}><option>Moins de 50 agents</option><option>50 à 150 agents</option><option>150 à 500 agents</option><option>500+ agents</option></select></label>
            <label><span>Service concerné</span><select value={service} onChange={(e) => setService(e.target.value)}><option>Courrier / accueil</option><option>Urbanisme / ADS</option><option>Culture / sport</option><option>Déchets</option><option>Finances / RH</option><option>Développement économique</option></select></label>
            <label><span>Objectif principal</span><select value={goal} onChange={(e)=>setGoal(e.target.value)}><option>Gagner du temps</option><option>Réduire les erreurs</option><option>Mieux prioriser</option><option>Fluidifier les usagers</option></select></label>
            <label><span>La tâche qui vous fait perdre le plus de temps</span><textarea rows="4" value={need} onChange={(e) => {setNeed(e.target.value);setGenerated(false);}} placeholder="Ex. On ressaisit à la main les demandes de badges de déchetterie…" /></label>
            <button type="button" onClick={() => setGenerated(true)} disabled={!need.trim()}>Fabriquer mon prototype</button>
            <small>Simulation uniquement. Ne saisissez ni nom réel ni donnée personnelle.</small>
          </div>

          <div className="territoryConfigOutput">
            {!generated ? (
              <div className="configEmpty"><span>APERÇU</span><strong>Votre micro-app apparaîtra ici.</strong><p>Nous choisissons automatiquement un gabarit file, planning ou contrôle à partir du besoin décrit.</p></div>
            ) : (
              <>
                <div className="configContext"><span>{collectivity}</span><span>{size}</span><span>{service}</span><span>{goal}</span></div>
                <GeneratedDemo service={service} need={need} goal={goal} />
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
