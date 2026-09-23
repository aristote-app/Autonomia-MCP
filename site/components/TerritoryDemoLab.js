"use client";

import { useMemo, useState } from "react";

const adsCases = [
  { name: "Piscine Rivière", type: "Déclaration préalable", urgency: "J-5", issue: "Photos manquantes", action: "Préparer une demande de pièces" },
  { name: "Maison Lambert", type: "Permis de construire", urgency: "J-9", issue: "Recul voie à contrôler", action: "Vérifier règle PLUi" },
  { name: "Maison Da Silva", type: "Permis de construire", urgency: "J-12", issue: "Hauteur +60 cm", action: "Signaler non-conformité potentielle" },
  { name: "Hangar agricole", type: "Permis de construire", urgency: "J-18", issue: "Zone agricole", action: "Contrôler destination et pièces" }
];

function ConservatoryDemo() {
  const [optimized, setOptimized] = useState(false);

  return (
    <div className="territoryDemoPanel">
      <div className="territoryDemoTopline">
        <div>
          <span>DÉMO FICTIVE · CONSERVATOIRE</span>
          <strong>66 demandes · 7 professeurs · 3 sites</strong>
        </div>
        <button type="button" onClick={() => setOptimized((value) => !value)}>
          {optimized ? "Voir au fil des appels" : "Lancer la répartition optimisée"}
        </button>
      </div>

      <div className="conservatoryMetrics">
        <article><span>Élèves placés</span><strong>{optimized ? "64" : "60"}</strong><small>{optimized ? "+4" : "base"}</small></article>
        <article><span>Liste d’attente</span><strong>{optimized ? "2" : "6"}</strong><small>{optimized ? "-4" : "base"}</small></article>
        <article><span>Trajets familles</span><strong>{optimized ? "-348 km" : "—"}</strong><small>exemple / semaine</small></article>
        <article><span>Cours commune enfant</span><strong>{optimized ? "+15" : "—"}</strong><small>exemple fictif</small></article>
      </div>

      <div className="territorySchedule">
        {["Lundi", "Mardi", "Mercredi", "Jeudi"].map((day, index) => (
          <article key={day}>
            <strong>{day}</strong>
            <span>{optimized ? ["Violon · Site A", "Piano · Site B", "Guitare · Site A", "Flûte · Site C"][index] : ["Violon · Site C", "Piano · Site A", "Guitare · Site C", "Flûte · Site A"][index]}</span>
            <small>{optimized ? "contraintes regroupées" : "premier créneau libre"}</small>
          </article>
        ))}
      </div>

      <p className="territoryDemoDisclaimer">
        Exemple d’applicatif Autonomia avec données entièrement fictives. Le calcul illustre une logique d’optimisation :
        l’équipe conserve la décision finale.
      </p>
    </div>
  );
}

function AdsDemo() {
  const [selected, setSelected] = useState(adsCases[0]);

  return (
    <div className="territoryDemoPanel">
      <div className="territoryDemoTopline">
        <div>
          <span>DÉMO FICTIVE · URBANISME ADS</span>
          <strong>File de pré-instruction classée par urgence</strong>
        </div>
      </div>

      <div className="adsDemoLayout">
        <div className="adsQueue">
          {adsCases.map((item) => (
            <button type="button" key={item.name} className={selected.name === item.name ? "active" : ""} onClick={() => setSelected(item)}>
              <b>{item.urgency}</b>
              <span><strong>{item.name}</strong><small>{item.type}</small></span>
            </button>
          ))}
        </div>
        <div className="adsDetail">
          <span>DOSSIER SÉLECTIONNÉ</span>
          <h3>{selected.name}</h3>
          <p><b>Point détecté :</b> {selected.issue}</p>
          <p><b>Action préparée :</b> {selected.action}</p>
          <div className="adsDecision">
            <strong>L’outil prépare.</strong>
            <span>L’instructeur relit, corrige et signe.</span>
          </div>
        </div>
      </div>

      <p className="territoryDemoDisclaimer">
        Démonstration avec dossiers et règles fictifs. En production, les références réglementaires, pièces et règles
        doivent être validées avec le service instructeur.
      </p>
    </div>
  );
}

function GeneratedDemo({ service, need }) {
  const mode = useMemo(() => {
    const value = (service + " " + need).toLowerCase();
    if (/planning|conservatoire|piscine|créneau|creneau|agenda/.test(value)) return "planning";
    if (/dossier|permis|pièce|piece|facture|complet|contrôle|controle/.test(value)) return "control";
    return "queue";
  }, [service, need]);

  if (mode === "planning") {
    return (
      <div className="generatedDemo">
        <span>GABARIT · PLANNING SOUS CONTRAINTES</span>
        <h3>Une première représentation de votre besoin</h3>
        <div className="generatedRows">
          <p><b>08:30</b><span>Créneau recommandé · Site A</span><small>disponibilité + proximité</small></p>
          <p><b>10:00</b><span>Créneau alternatif · Site B</span><small>capacité disponible</small></p>
          <p><b>14:30</b><span>À arbitrer</span><small>contrainte contradictoire</small></p>
        </div>
      </div>
    );
  }

  if (mode === "control") {
    return (
      <div className="generatedDemo">
        <span>GABARIT · FILE DE CONTRÔLE</span>
        <h3>Une première représentation de votre besoin</h3>
        <div className="generatedRows">
          <p><b>Priorité 1</b><span>Dossier incomplet</span><small>2 pièces manquantes détectées</small></p>
          <p><b>Priorité 2</b><span>Dossier à vérifier</span><small>1 incohérence à confirmer</small></p>
          <p><b>OK</b><span>Dossier prêt pour validation</span><small>contrôle humain final</small></p>
        </div>
      </div>
    );
  }

  return (
    <div className="generatedDemo">
      <span>GABARIT · FILE DE DEMANDES</span>
      <h3>Une première représentation de votre besoin</h3>
      <div className="generatedRows">
        <p><b>Urgent</b><span>Demande à traiter</span><small>affectation proposée au service</small></p>
        <p><b>Nouveau</b><span>Demande qualifiée</span><small>réponse préparée</small></p>
        <p><b>Attente</b><span>Relance à prévoir</span><small>échéance détectée</small></p>
      </div>
    </div>
  );
}

export default function TerritoryDemoLab() {
  const [tab, setTab] = useState("conservatoire");
  const [collectivity, setCollectivity] = useState("Communauté de communes");
  const [size, setSize] = useState("50 à 150 agents");
  const [service, setService] = useState("Courrier / accueil");
  const [need, setNeed] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <section className="territoryDemoLab" id="demos">
      <div className="territoryDemoIntro">
        <p className="sectionIndex">02 — VOIR AVANT DE CROIRE</p>
        <div>
          <h2>Des démos qui montrent le travail transformé.</h2>
          <p>
            Pas une animation décorative : une file de dossiers, un planning ou un tableau de contrôle manipulable,
            avec des données fictives et une règle constante — l’outil prépare, l’agent décide.
          </p>
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
        <div className="territoryConfigurator">
          <div className="territoryConfigForm">
            <p className="eyebrow">VOTRE DÉMO EN 1 MINUTE</p>
            <h3>Décrivez la tâche qui use votre équipe.</h3>

            <label><span>Votre collectivité</span>
              <select value={collectivity} onChange={(e) => setCollectivity(e.target.value)}>
                <option>Communauté de communes</option>
                <option>Communauté d’agglomération</option>
                <option>Commune</option>
                <option>Syndicat / établissement public</option>
              </select>
            </label>
            <label><span>Nombre d’agents</span>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option>Moins de 50 agents</option>
                <option>50 à 150 agents</option>
                <option>150 à 500 agents</option>
                <option>500+ agents</option>
              </select>
            </label>
            <label><span>Service concerné</span>
              <select value={service} onChange={(e) => setService(e.target.value)}>
                <option>Courrier / accueil</option>
                <option>Urbanisme / ADS</option>
                <option>Culture / sport</option>
                <option>Déchets</option>
                <option>Finances / RH</option>
                <option>Développement économique</option>
              </select>
            </label>
            <label><span>La tâche qui vous fait perdre le plus de temps</span>
              <textarea rows="4" value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Ex. On ressaisit à la main les demandes de badges de déchetterie…" />
            </label>
            <button type="button" onClick={() => setGenerated(true)} disabled={!need.trim()}>Fabriquer ma démo</button>
            <small>Ne saisissez ni nom réel ni donnée personnelle : cette simulation utilise uniquement ce que vous décrivez.</small>
          </div>

          <div className="territoryConfigOutput">
            {!generated ? (
              <div className="configEmpty">
                <span>APERÇU</span>
                <strong>Votre mini-outil apparaîtra ici.</strong>
                <p>Nous choisissons un gabarit de file, planning ou contrôle selon le besoin décrit.</p>
              </div>
            ) : (
              <>
                <div className="configContext"><span>{collectivity}</span><span>{size}</span><span>{service}</span></div>
                <GeneratedDemo service={service} need={need} />
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
