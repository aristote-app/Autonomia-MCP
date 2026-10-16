"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "productivite", label: "Productivité et réunions", tools: [
      { name: "Shadow.do", url: "https://shadow.do", price: "13 €", description: "Transcrit tes appels et réunions pour exploiter les notes dans Obsidian." },
      { name: "Wispr Flow", url: "https://wisprflow.ai", price: "15 €", description: "Transforme ta voix en texte pour rédiger et travailler sans taper." }
    ]
  },
  {
    id: "creation", label: "Production de contenu et design", tools: [
      { name: "HeyGen", url: "https://www.heygen.com", price: "À vérifier", description: "Crée des vidéos avec avatars et voix générés par IA." },
      { name: "Synthesia", url: "https://www.synthesia.io", price: "À vérifier", description: "Produit des vidéos professionnelles présentées par des avatars IA." },
      { name: "Higgsfield", url: "https://higgsfield.ai", price: "—", description: "Génère des vidéos, des visuels et des effets créatifs avec l'IA." },
      { name: "Manychat", url: "https://manychat.com", price: "34 €", description: "Automatise les échanges et les réponses sur les canaux compatibles." },
      { name: "Figma", url: "https://www.figma.com", price: "—", description: "Conçoit des maquettes, interfaces et parcours utilisateurs collaboratifs." },
      { name: "Canva", url: "https://www.canva.com", price: "—", description: "Crée des supports commerciaux, visuels LinkedIn et présentations." }
    ]
  },
  {
    id: "prospection", label: "Prospection et communication commerciale", tools: [
      { name: "Eficia", url: "https://www.linkedin.com/company/get-eficia/", price: "30 €", description: "Recherche des numéros de téléphone professionnels pour la prospection." },
      { name: "Icypeas", url: "https://www.icypeas.com", price: "50 €", description: "Recherche et vérifie des adresses e-mail professionnelles." },
      { name: "Resend", url: "https://resend.com", price: "—", description: "Envoie des e-mails transactionnels et applicatifs via API." },
      { name: "Unipile", url: "https://www.unipile.com", price: "—", description: "Connecte les messageries et réseaux compatibles à tes automatisations." }
    ]
  },
  {
    id: "cerveau", label: "IA, organisation et gestion", tools: [
      { name: "Anthropic / Claude", url: "https://claude.ai", price: "200 €", description: "Assistant IA pour analyser, développer, rédiger et piloter tes projets." },
      { name: "OpenAI / ChatGPT", url: "https://chatgpt.com", price: "100 €", description: "Assistant IA pour le raisonnement, la recherche et l'exécution de projets." },
      { name: "Google Workspace", url: "https://workspace.google.com", price: "—", description: "Gmail, Drive, Docs et Agenda pour le travail quotidien." },
      { name: "Qonto", url: "https://qonto.com", price: "—", description: "Gestion du compte professionnel, des paiements et des dépenses." },
      { name: "Notion", url: "https://www.notion.so", price: "—", description: "Documentation, notes, tâches et organisation des projets." }
    ]
  }
];

export default function OutilsIAPage() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("autonomia-outils-ia-favoris") || "[]");
      if (Array.isArray(saved)) setFavorites(saved.filter((value) => typeof value === "string"));
    } catch { /* Preferences are optional. */ }
  }, []);
  const toggleFavorite = (name) => {
    setFavorites((current) => {
      const next = current.includes(name) ? current.filter((item) => item !== name) : [...current, name];
      try { window.localStorage.setItem("autonomia-outils-ia-favoris", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const sections = useMemo(() => CATEGORIES.map((category) => ({
    ...category,
    tools: category.tools.filter((tool) =>
      (!favoritesOnly || favorites.includes(tool.name)) &&
      `${tool.name} ${tool.description} ${category.label}`.toLocaleLowerCase("fr").includes(search.trim().toLocaleLowerCase("fr"))
    ).sort((a, b) => Number(favorites.includes(b.name)) - Number(favorites.includes(a.name)))
  })).filter((category) => category.tools.length), [search, favorites, favoritesOnly]);
  const count = CATEGORIES.reduce((n, section) => n + section.tools.length, 0);
  return (
    <main className="aiToolsPage">
      <div className="aiToolsBack"><Link href="/">← Retour au cockpit</Link></div>
      <div className="aiToolsHero">
        <div><p className="aiToolsEyebrow">AUTONOMIA · BOÎTE À OUTILS</p><h1>OUTILS IA</h1><p>Les applications à portée de clic pour produire, prospecter, automatiser et piloter tes projets.</p></div>
        <div className="aiToolsCount"><strong>{count}</strong><span>outils référencés</span></div>
      </div>
      <div className="aiToolsToolbar">
        <label htmlFor="ai-tools-search">Rechercher un outil</label>
        <input id="ai-tools-search" type="search" placeholder="Nom, usage, catégorie…" value={search} onChange={(event) => setSearch(event.target.value)} />
        <button type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(!favoritesOnly)}>{favoritesOnly ? "★ Mes favoris" : "☆ Afficher mes favoris"}</button>
      </div>
      {sections.length === 0 && <p className="aiToolsEmpty">Aucun outil trouvé. Essaie une autre recherche ou désactive le filtre favoris.</p>}
      {sections.map((category) => <section className="aiToolsSection" key={category.id} aria-labelledby={category.id}>
        <h2 id={category.id}>{category.label} <span>{category.tools.length}</span></h2>
        <div className="aiToolsGrid">{category.tools.map((tool) => <article className="aiToolsCard" key={tool.name}>
          <div className="aiToolsCardTop"><span className="aiToolsInitial">{tool.name.slice(0, 1)}</span><button type="button" className="aiToolsStar" onClick={() => toggleFavorite(tool.name)} aria-label={favorites.includes(tool.name) ? `Retirer ${tool.name} des favoris` : `Ajouter ${tool.name} aux favoris`} aria-pressed={favorites.includes(tool.name)}>{favorites.includes(tool.name) ? "★" : "☆"}</button></div>
          <h3>{tool.name}</h3><p>{tool.description}</p>
          <div className="aiToolsCardFoot"><span>{tool.price === "—" ? "Tarif non renseigné" : tool.price === "À vérifier" ? "Tarif à vérifier" : `Tarif indiqué : ${tool.price}`}</span><a href={tool.url} target="_blank" rel="noopener noreferrer">Ouvrir ↗</a></div>
        </article>)}</div>
      </section>)}
      <p className="aiToolsDisclaimer">Tarifs indicatifs communiqués lors de la sélection des outils, sans périodicité confirmée. Vérifie les tarifs et les conditions sur les sites des éditeurs. Les favoris sont conservés uniquement dans ce navigateur.</p>
      <style jsx>{`
        .aiToolsPage{max-width:1220px}.aiToolsBack{margin-bottom:24px}.aiToolsBack a{color:#314656;text-decoration:none;font-size:13px;font-weight:750}.aiToolsHero{display:flex;justify-content:space-between;gap:30px;align-items:end;padding:20px 0 34px;border-bottom:1px solid #dbe5ec}.aiToolsEyebrow{font-size:11px!important;letter-spacing:.16em;font-weight:800;color:#087b91!important}.aiToolsHero h1{font-size:clamp(44px,7vw,78px);margin:10px 0 14px}.aiToolsHero p{color:#596976;line-height:1.55;max-width:660px;margin:0}.aiToolsCount{padding:20px 28px;background:#071c2e;color:#fff;display:grid;min-width:170px;text-align:center;border-radius:16px}.aiToolsCount strong{font-size:44px}.aiToolsCount span{font-size:12px;color:#b9d1dd}.aiToolsToolbar{display:flex;align-items:center;gap:12px;margin:30px 0 42px;flex-wrap:wrap}.aiToolsToolbar label{font-size:13px;font-weight:800}.aiToolsToolbar input{flex:1;min-width:210px;border:1px solid #cbd9e1;border-radius:12px;padding:13px 15px;background:white;font:inherit}.aiToolsToolbar button{border:1px solid #cbd9e1;background:#fff;border-radius:12px;padding:13px 16px;font-weight:700;cursor:pointer}.aiToolsToolbar button[aria-pressed=true]{background:#071c2e;color:#fff}.aiToolsSection{margin:0 0 44px}.aiToolsSection h2{font-size:23px;margin:0 0 16px;display:flex;gap:10px;align-items:center}.aiToolsSection h2 span{font-size:12px;color:#587080;border:1px solid #cbd9e1;border-radius:99px;padding:4px 9px}.aiToolsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.aiToolsCard{display:flex;flex-direction:column;min-height:220px;background:white;border:1px solid #deebf0;border-radius:18px;padding:20px;box-shadow:0 5px 24px rgba(7,17,31,.035)}.aiToolsCardTop{display:flex;justify-content:space-between;align-items:center}.aiToolsInitial{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:11px;background:#e8f7f8;color:#076a80;font-size:18px;font-weight:800}.aiToolsStar{border:0;background:transparent;cursor:pointer;font-size:25px;color:#b28722;padding:2px 8px}.aiToolsCard h3{font-size:19px;margin:13px 0 8px}.aiToolsCard p{font-size:13px;line-height:1.6;color:#647484;margin:0 0 20px;flex:1}.aiToolsCardFoot{border-top:1px solid #e4ebf0;padding-top:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}.aiToolsCardFoot span{font-size:11px;color:#687886}.aiToolsCardFoot a{background:#091d2e;border-radius:9px;color:#fff;text-decoration:none;font-weight:750;font-size:12px;padding:10px 13px;white-space:nowrap}.aiToolsDisclaimer{font-size:12px;line-height:1.65;color:#6d7c88;border-top:1px solid #dae4ea;padding-top:20px}.aiToolsEmpty{padding:25px;background:white;border:1px dashed #b7c9d4;border-radius:12px}@media(max-width:900px){.aiToolsGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.aiToolsHero{display:block}.aiToolsCount{margin-top:25px;max-width:180px}.aiToolsGrid{grid-template-columns:1fr}.aiToolsToolbar{align-items:stretch;flex-direction:column}}
      `}</style>
    </main>
  );
}
