"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./plan-action.module.css";
import { ROADMAP_VERSION } from "./roadmapData";

const STORAGE_KEY = "autonomia-cockpit-action-plan-" + ROADMAP_VERSION;
const OWNERS = ["IA", "Direction", "Partagé"];
const PRIORITIES = ["P0", "P1", "P2"];
const pad = (n) => String(n).padStart(2, "0");
function formatDate(value) {
  if (!value) return "Date à fixer";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? day + "/" + month + "/" + year : value;
}
function niceOwner(owner) {
  return owner === "IA" ? "À réaliser par ChatGPT" : owner === "Partagé" ? "IA + validation / accès" : "Décision de la direction";
}
function datePassed(value) {
  if (!value) return false;
  const d = new Date();
  const today = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  return value < today;
}

export default function ActionPlanBoard({ phases }) {
  const [overrides, setOverrides] = useState({});
  const [custom, setCustom] = useState([]);
  const [ready, setReady] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOwner, setFilterOwner] = useState("all");
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState(phases[0]?.id || "");
  const [newOwner, setNewOwner] = useState("IA");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && parsed.version === ROADMAP_VERSION) {
          if (parsed.overrides && typeof parsed.overrides === "object" && !Array.isArray(parsed.overrides)) {
            setOverrides(parsed.overrides);
          }
          if (Array.isArray(parsed.custom)) {
            setCustom(parsed.custom.filter((task) => task && typeof task.id === "string" && typeof task.title === "string" && phases.some((phase) => phase.id === task.phaseId)).slice(0, 200));
          }
          setSavedAt(parsed.updatedAt || "");
        }
      }
    } catch {
      setNotice("Impossible de lire la sauvegarde locale. Vous pouvez restaurer un export JSON.");
    }
    setReady(true);
  }, [phases]);

  useEffect(() => {
    if (!ready) return;
    try {
      const timestamp = new Date().toISOString();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: ROADMAP_VERSION, overrides, custom, updatedAt: timestamp
      }));
      setSavedAt(timestamp);
    } catch {
      setNotice("La sauvegarde du navigateur est indisponible. Utilisez Exporter JSON pour conserver votre suivi.");
    }
  }, [overrides, custom, ready]);

  const all = useMemo(() => phases.flatMap((phase) =>
    [
      ...phase.tasks.map((task) => ({ ...task, phaseId: phase.id, phaseName: phase.name, isCustom: false })),
      ...custom.filter((task) => task.phaseId === phase.id).map((task) => ({
        ...task, phaseName: phase.name, isCustom: true
      }))
    ]
  ), [phases, custom]);

  const resolved = useMemo(() => all.map((task) => ({
    ...task,
    done: typeof overrides[task.id]?.done === "boolean" ? overrides[task.id].done : Boolean(task.done),
    notes: typeof overrides[task.id]?.notes === "string" ? overrides[task.id].notes : "",
    due: typeof overrides[task.id]?.due === "string" ? overrides[task.id].due : (task.due || "")
  })), [all, overrides]);

  const total = resolved.length;
  const complete = resolved.filter((task) => task.done).length;
  const pending = total - complete;
  const overdue = resolved.filter((task) => !task.done && datePassed(task.due)).length;
  const progress = total ? Math.round(complete / total * 100) : 0;
  const nextTasks = useMemo(() =>
    resolved.filter((task) => !task.done && task.owner === "IA")
      .sort((a,b) => (a.priority || "P2").localeCompare(b.priority || "P2") || (a.due || "9999").localeCompare(b.due || "9999"))
      .slice(0, 3)
  , [resolved]);
  const normalizedSearch = search.trim().toLocaleLowerCase("fr");

  function updateTask(id, change) {
    setOverrides((old) => ({ ...old, [id]: { ...(old[id] || {}), ...change } }));
  }
  function addTask(event) {
    event.preventDefault();
    const title = newTitle.trim().slice(0, 180);
    if (!title) return;
    const id = "manual-" + Date.now() + "-" + Math.random().toString(36).slice(2,8);
    setCustom((old) => [...old, {
      id, title, detail: "Action ajoutée dans le cockpit.", phaseId: newPhase,
      priority: "P1", owner: newOwner, due: "", done: false
    }]);
    setNewTitle("");
    setNotice("Nouvelle action ajoutée à la feuille de route.");
  }
  function removeCustom(id) {
    if (!window.confirm("Supprimer cette action ajoutée manuellement ?")) return;
    setCustom((old) => old.filter((task) => task.id !== id));
    setOverrides((old) => { const next = { ...old }; delete next[id]; return next; });
  }
  function exportPlan() {
    const payload = JSON.stringify({
      version: ROADMAP_VERSION, exportedAt: new Date().toISOString(), overrides, custom
    }, null, 2);
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "autonomia-plan-action-90-jours.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Export JSON généré. Conservez-le pour retrouver vos coches sur un autre appareil.");
  }
  async function importPlan(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 500000) throw new Error("Fichier trop volumineux");
      const parsed = JSON.parse(await file.text());
      if (parsed?.version !== ROADMAP_VERSION ||
          !parsed.overrides || typeof parsed.overrides !== "object" || Array.isArray(parsed.overrides) ||
          !Array.isArray(parsed.custom)) throw new Error("Format de sauvegarde incompatible");
      if (!window.confirm("Remplacer le suivi local par celui du fichier importé ?")) return;
      const permitted = new Set([...phases.flatMap((phase) => phase.tasks.map((task) => task.id)), ...parsed.custom.map((task)=>task?.id)]);
      const safe = {};
      for (const [id,value] of Object.entries(parsed.overrides)) {
        if (permitted.has(id) && value && typeof value === "object") {
          safe[id] = {
            ...(typeof value.done === "boolean" ? {done:value.done} : {}),
            ...(typeof value.notes === "string" ? {notes:value.notes.slice(0,3000)} : {}),
            ...(typeof value.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.due) ? {due:value.due} : {})
          };
        }
      }
      setOverrides(safe);
      setCustom(parsed.custom.filter((task) => task && /^manual-[\w-]+$/.test(task.id || "") &&
        typeof task.title === "string" && task.title.length < 200 &&
        phases.some((phase) => phase.id === task.phaseId)).slice(0,200).map((task)=>({
        id:task.id, title:task.title, detail:String(task.detail || "").slice(0,400),
        phaseId:task.phaseId, owner:OWNERS.includes(task.owner) ? task.owner:"IA",
        priority:PRIORITIES.includes(task.priority) ? task.priority:"P1", due:"",
        done:false
      })));
      setNotice("Suivi restauré depuis votre export.");
    } catch {
      setNotice("Import impossible : vérifiez le fichier JSON exporté depuis ce cockpit.");
    } finally {
      event.target.value = "";
    }
  }
  function reset() {
    if (!window.confirm("Réinitialiser toutes les coches, notes et actions ajoutées dans ce navigateur ?")) return;
    setOverrides({});
    setCustom([]);
    setNotice("Suivi local réinitialisé.");
  }
  function matches(task) {
    if (filterPhase !== "all" && task.phaseId !== filterPhase) return false;
    if (filterStatus === "open" && task.done) return false;
    if (filterStatus === "done" && !task.done) return false;
    if (filterStatus === "overdue" && (task.done || !datePassed(task.due))) return false;
    if (filterOwner !== "all" && task.owner !== filterOwner) return false;
    if (normalizedSearch && ![task.title, task.detail, task.phaseName].join(" ").toLocaleLowerCase("fr").includes(normalizedSearch)) return false;
    return true;
  }

  return (
    <main className={styles.container}>
      <div className={styles.breadcrumb}><a href="/">← Retour au cockpit</a><span> / PILOTAGE · AUTONOMIA</span></div>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PLAN D'EXÉCUTION · 15 OCTOBRE 2026 — 13 JANVIER 2027</p>
          <h1>90 jours pour faire <em>avancer</em> AUTONOMIA.</h1>
          <p>Un vrai plan opérationnel : actions à cocher, échéances, responsables et suivi de progression. L'objectif : transformer nos offres et démonstrateurs en prospects, rendez-vous et contrats.</p>
          <div className={styles.heroLinks}><a href="https://github.com/aristote-app/Autonomia-MCP/issues/70" target="_blank" rel="noreferrer">Plan source GitHub ↗</a><a href="https://build-autonomia.com" target="_blank" rel="noreferrer">Site AUTONOMIA ↗</a></div>
        </div>
        <div className={styles.progressCard}>
          <span>AVANCEMENT GLOBAL</span>
          <strong>{ready ? progress : "—"}<small>%</small></strong>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Avancement global" className={styles.progressTrack}><i style={{width:progress+"%"}} /></div>
          <small>{complete} actions terminées sur {total}</small>
        </div>
      </section>

      <section className={styles.metrics} aria-label="Indicateurs de suivi">
        <article><span>À poursuivre</span><strong>{pending}</strong><small>actions restantes</small></article>
        <article><span>Réalisées</span><strong>{complete}</strong><small>dont les tâches de code déjà livrées</small></article>
        <article><span>Échéances passées</span><strong>{overdue}</strong><small>actions non cochées</small></article>
        <article><span>Chantiers</span><strong>{phases.length}</strong><small>jusqu'au 13 janvier</small></article>
      </section>

      <section className={styles.noticeArea}>
        <div><strong>Votre suivi personnel</strong><p>Les coches, notes et dates sont enregistrées automatiquement dans ce navigateur. Pour changer d'appareil, exportez puis importez le JSON. La synchronisation multi-appareils n'est pas encore activée.</p></div>
        <div className={styles.utilityButtons}>
          <button type="button" onClick={exportPlan}>↓ Exporter JSON</button>
          <label className={styles.importButton}>↑ Importer JSON<input type="file" accept=".json,application/json" onChange={importPlan} /></label>
          <button type="button" className={styles.resetButton} onClick={reset}>Réinitialiser</button>
        </div>
      </section>
      {notice && <div role="status" className={styles.flash}>{notice}<button type="button" onClick={()=>setNotice("")} aria-label="Fermer le message">×</button></div>}

      <section className={styles.next}>
        <div><p className={styles.eyebrow}>À TRAITER EN PRIORITÉ</p><h2>Les prochaines actions réalisables par l'IA</h2></div>
        <div className={styles.nextCards}>{nextTasks.map((task)=>(
          <button type="button" key={task.id} onClick={()=>{setFilterPhase(task.phaseId);setFilterStatus("open");setSearch(task.title);document.getElementById("roadmap")?.scrollIntoView({behavior:"smooth"});}}>
            <span>{task.priority} · {formatDate(task.due)}</span><strong>{task.title}</strong><small>Voir l'action →</small>
          </button>
        ))}</div>
      </section>

      <section className={styles.roadmap} id="roadmap">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>TABLEAU DE BORD</p><h2>Le plan, action par action.</h2></div><span>Les coches se sauvegardent automatiquement.</span></div>
        <div className={styles.filters}>
          <label>Chantier<select value={filterPhase} onChange={(e)=>{setFilterPhase(e.target.value);setSearch("");}}>
            <option value="all">Tous les chantiers</option>
            {phases.map((phase)=><option key={phase.id} value={phase.id}>{phase.name}</option>)}
          </select></label>
          <label>Statut<select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
            <option value="all">Toutes les actions</option><option value="open">À faire</option><option value="done">Terminées</option><option value="overdue">En retard</option>
          </select></label>
          <label>Responsable<select value={filterOwner} onChange={(e)=>setFilterOwner(e.target.value)}>
            <option value="all">Tout le monde</option><option value="IA">IA · réalisable par ChatGPT</option><option value="Direction">Direction</option><option value="Partagé">Partagé</option>
          </select></label>
          <label>Rechercher<input placeholder="Une action, un sujet…" value={search} onChange={(e)=>setSearch(e.target.value)} /></label>
          <button className={styles.clearFilters} type="button" onClick={()=>{setFilterPhase("all");setFilterStatus("all");setFilterOwner("all");setSearch("");}}>Effacer les filtres</button>
        </div>

        <div className={styles.phaseList}>
          {phases.map((phase,index)=>{
            const tasks = resolved.filter((task)=>task.phaseId===phase.id);
            const filtered = tasks.filter(matches);
            if (!filtered.length) return null;
            const countDone = tasks.filter((task)=>task.done).length;
            const pct = tasks.length ? Math.round(countDone/tasks.length*100):0;
            return <section className={styles.phase} key={phase.id}>
              <div className={styles.phaseHeader}>
                <span className={styles.phaseNumber}>{pad(index+1)}</span>
                <div className={styles.phaseName}><span>{formatDate(phase.start)} — {formatDate(phase.end)}</span><h3>{phase.name}</h3><p>{phase.hint}</p></div>
                <div className={styles.phaseStats}><strong>{countDone}/{tasks.length}</strong><div className={styles.phaseBar}><i style={{width:pct+"%"}} /></div><small>{pct}% réalisé</small></div>
              </div>
              <div className={styles.taskList}>{filtered.map((task)=>(
                <article className={styles.task + (task.done?" "+styles.taskDone:"")} key={task.id}>
                  <div className={styles.taskCore}>
                    <label className={styles.taskCheck}><input aria-label={"Marquer comme terminé : "+task.title} type="checkbox" checked={task.done} onChange={(e)=>updateTask(task.id,{done:e.target.checked})}/><span aria-hidden="true">{task.done?"✓":""}</span></label>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskTags}><span className={styles[task.priority?.toLowerCase()]||""}>{task.priority}</span><span>{niceOwner(task.owner)}</span>{task.isCustom&&<span>Ajout personnel</span>}{!task.done&&datePassed(task.due)&&<span className={styles.late}>Échéance dépassée</span>}</div>
                      <h4>{task.title}</h4><p>{task.detail}</p>
                      <div className={styles.taskBottom}>
                        <span>Échéance : <b>{formatDate(task.due)}</b></span>
                        {task.link&&<a href={task.link} target="_blank" rel="noreferrer">Ouvrir la ressource ↗</a>}
                        {task.done&&<strong className={styles.doneLabel}>Terminé ✓</strong>}
                      </div>
                      <details className={styles.taskDetail}><summary>Notes et suivi {task.notes?"· note enregistrée":""}</summary>
                        <div className={styles.taskEdit}>
                          <label>Échéance<input type="date" value={task.due} onChange={(e)=>updateTask(task.id,{due:e.target.value})} /></label>
                          <label className={styles.noteLabel}>Notes<textarea maxLength={3000} rows={3} value={task.notes} placeholder="Décisions, points bloquants, état d'avancement…" onChange={(e)=>updateTask(task.id,{notes:e.target.value})}/></label>
                          {task.isCustom&&<button type="button" className={styles.delete} onClick={()=>removeCustom(task.id)}>Supprimer cette action</button>}
                        </div>
                      </details>
                    </div>
                  </div>
                </article>
              ))}</div>
            </section>;
          })}
          {!resolved.some(matches)&&<p className={styles.empty}>Aucune action ne correspond à ces filtres. Essayez « Tous les chantiers ».</p>}
        </div>
      </section>

      <section className={styles.addSection}>
        <div><p className={styles.eyebrow}>VOTRE FEUILLE DE ROUTE ÉVOLUE</p><h2>Ajouter une action</h2><p>Ajoutez vos propres tâches à un chantier existant. Elles seront incluses dans les indicateurs et dans l'export JSON.</p></div>
        <form onSubmit={addTask}>
          <label>Action à réaliser<input maxLength={180} required placeholder="Ex. Valider le dossier Numérique360" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)}/></label>
          <div><label>Chantier<select value={newPhase} onChange={(e)=>setNewPhase(e.target.value)}>{phases.map((phase)=><option key={phase.id} value={phase.id}>{phase.name}</option>)}</select></label>
          <label>Responsable<select value={newOwner} onChange={(e)=>setNewOwner(e.target.value)}>{OWNERS.map((owner)=><option value={owner} key={owner}>{niceOwner(owner)}</option>)}</select></label></div>
          <button type="submit">+ Ajouter cette action</button>
        </form>
      </section>
      <footer className={styles.foot}>AUTONOMIA · Plan de développement commercial 90 jours · Source : feuille de route interne GitHub · Suivi local au navigateur {savedAt ? " · Dernière sauvegarde : "+new Date(savedAt).toLocaleString("fr-FR") : ""}</footer>
    </main>
  );
}
