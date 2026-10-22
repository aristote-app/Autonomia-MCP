'use client';
import { useEffect, useRef, useState } from 'react';
import { STATUSES, safeUrl } from '../../lib/collectivites/contract.js';
import styles from './collectivites.module.css';
const number = n => new Intl.NumberFormat('fr-FR').format(n || 0);
const split = value => String(value || '').split(';').map(s => s.trim()).filter(Boolean);
const president = row => [row.president_civilite, row.president_prenom, row.president_nom].filter(Boolean).join(' ') || '—';
function Contacts({ row }) {
  return <div className={styles.contacts}>{split(row.telephone).map(t => <a key={t} href={`tel:${t.replace(/[^+\d]/g, '')}`}>{t}</a>)}{split(row.email).map(e => <a key={e} href={`mailto:${e}`}>{e}</a>)}</div>;
}
export default function CollectivitesDashboard() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const dialog = useRef(null);
  const detailRequest = useRef(null);
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([k,v]) => (Array.isArray(v) ? v : [v]).forEach(x => { if (x) query.append(k,x); }));
  const filterQuery = query.toString();
  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError('');
    fetch(`/api/collectivites?${filterQuery}&page=${page}&summary=true`, { signal: abort.signal })
      .then(async r => { const body = await r.json(); if (!r.ok) throw new Error(body.error); return body; })
      .then(body => { setData(body); setSummary(body.summary); })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [filterQuery, page, revision]);
  useEffect(() => { if (detail && dialog.current && !dialog.current.open) dialog.current.showModal(); }, [detail]);
  useEffect(() => () => detailRequest.current?.abort(), []);
  function change(name,value) { setFilters(f => ({ ...f, [name]: value })); setPage(1); }
  async function openDetail(siren) {
    detailRequest.current?.abort();
    const controller = new AbortController(); detailRequest.current = controller;
    setNotice('Chargement de la fiche…');
    try {
      const r = await fetch(`/api/collectivites/${siren}`, { signal: controller.signal }); const body = await r.json();
      if (!r.ok) throw new Error(body.error);
      setDetail(body); setNotes(body.notes || ''); setNotice('');
    } catch(e) { if (e.name !== 'AbortError') setNotice(e.message); }
  }
  async function update(siren, patch) {
    setBusy(true); setNotice('');
    try {
      const r = await fetch(`/api/collectivites/${siren}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify(patch) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error);
      setDetail(d => d?.siren === siren ? { ...d, ...body } : d);
      setRevision(v => v + 1); setNotice('Modifications enregistrées.');
    } catch(e) { setNotice(e.message); } finally { setBusy(false); }
  }
  const pages = Math.max(1, Math.ceil((data?.total || 0) / 50));
  const statuses = [...new Set([...STATUSES, ...(summary?.statuts || [])])];
  return <div className={styles.module}>
    <p className={styles.source}>Source déclarée dans le fichier : BANATIC / DGCL, export du 22 octobre 2026. Ces coordonnées identifient les structures et leurs présidents. Les contacts opérationnels restent à qualifier.</p>
    {summary && <section className="territoryMetrics" aria-label="Statistiques de la base complète"><article><strong>{number(summary.total)}</strong><span>structures</span></article>{summary.categories.map(c => <article key={c.categorie}><strong>{number(c.nb)}</strong><span>{c.categorie}</span></article>)}<article><strong>{summary.total ? (100*summary.telephone/summary.total).toFixed(1) : 0} %</strong><span>avec téléphone</span></article><article><strong>{summary.total ? (100*summary.email/summary.total).toFixed(1) : 0} %</strong><span>avec email</span></article></section>}
    <form className={styles.filters} onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); change('q', String(f.get('q') || '').trim()); }}>
      <label>Nom ou SIREN<input name="q" placeholder="Rechercher une structure" /></label>
      <label>Catégorie<select value={filters.categorie || ''} onChange={e => change('categorie',e.target.value)}><option value="">Toutes</option>{(summary?.categories || []).map(c => <option key={c.categorie}>{c.categorie}</option>)}</select></label>
      <label>Type<select value={filters.code_type || ''} onChange={e => change('code_type',e.target.value)}><option value="">Tous</option>{(summary?.types || []).map(t => <option key={t.code_type} value={t.code_type}>{t.code_type} · {t.type}</option>)}</select></label>
      <label>Département<select value={filters.code_departement || ''} onChange={e => change('code_departement',e.target.value)}><option value="">Tous</option>{(summary?.departements || []).map(d => <option key={d.code_departement} value={d.code_departement}>{d.code_departement} · {d.departement}</option>)}</select></label>
      <label>Statut<select value={filters.statut_prospection || ''} onChange={e => change('statut_prospection',e.target.value)}><option value="">Tous</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Tri<select value={filters.tri || 'nom'} onChange={e => change('tri',e.target.value)}>{[['nom','Nom'],['code_type','Type'],['code_departement','Département'],['population','Population'],['statut_prospection','Statut']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      <label>Ordre<select value={filters.ordre || 'asc'} onChange={e => change('ordre',e.target.value)}><option value="asc">Croissant</option><option value="desc">Décroissant</option></select></label>
      <label className={styles.check}><input type="checkbox" checked={filters.email === 'true'} onChange={e => change('email',e.target.checked ? 'true' : '')} />Avec email</label>
      <label className={styles.check}><input type="checkbox" checked={filters.telephone === 'true'} onChange={e => change('telephone',e.target.checked ? 'true' : '')} />Avec téléphone</label>
      <button type="submit">Rechercher</button><button type="reset" onClick={() => { setFilters({}); setPage(1); }}>Réinitialiser</button>
      <fieldset className={styles.domains}><legend>Domaines · au moins un des domaines cochés</legend>{(summary?.domaines || []).map(d => <label className={styles.check} key={d.domaine}><input type="checkbox" checked={(filters.domaine || []).includes(d.domaine)} onChange={e => change('domaine', e.target.checked ? [...(filters.domaine || []), d.domaine] : filters.domaine.filter(x => x !== d.domaine))} />{d.domaine}</label>)}</fieldset>
    </form>
    <p role="status" aria-live="polite">{loading ? 'Chargement…' : error || notice || `${number(data?.total)} structures correspondant aux filtres`}</p>
    {error && <button onClick={() => setRevision(v => v+1)}>Réessayer</button>}
    {data && !error && <>
      <div className={styles.toolbar}><strong>{number(data.total)} résultats</strong><a href={`/api/collectivites?${filterQuery}&format=csv`}>Exporter tous les résultats filtrés (CSV)</a></div>
      <p className={styles.source}>Export annuaire avec SIREN et coordonnées. Les URL des profils LinkedIn individuels restent à enrichir pour les campagnes Waalaxy / Kaspr.</p>
      <div className={styles.tableWrap} aria-busy={loading}><table className={styles.table}><thead><tr>{['Nom','Type','Département','Domaines','Président','Coordonnées','Statut'].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{data.items.map(row => <tr key={row.siren}>
        <td><button className={styles.open} onClick={() => openDetail(row.siren)}>{row.nom}</button><small>{row.siren}</small></td><td>{row.code_type}</td><td>{row.code_departement} · {row.departement}</td><td>{split(row.domaines).map(d => <span className={styles.badge} key={d}>{d}</span>)}</td><td>{president(row)}</td><td><Contacts row={row} /></td><td><select aria-label={`Statut de ${row.nom}`} disabled={busy || loading} value={row.statut_prospection || 'à contacter'} onChange={e => update(row.siren,{ statut_prospection:e.target.value })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></td>
      </tr>)}</tbody></table></div>
      {!data.items.length && <p>Aucune structure ne correspond à ces filtres.</p>}
      <nav className="territoryPagination" aria-label="Pagination"><button disabled={page<=1 || loading} onClick={() => setPage(p => p-1)}>← Précédente</button><strong>Page {page} / {pages} · 50 par page</strong><button disabled={page>=pages || loading} onClick={() => setPage(p => p+1)}>Suivante →</button></nav>
    </>}
    {summary && <section className={styles.chart}><h2>Structures par domaine</h2><p>Base complète · une structure peut exercer plusieurs domaines.</p>{summary.domaines.map(d => <div className={styles.bar} key={d.domaine}><span>{d.domaine}</span><meter min="0" max={Math.max(1,...summary.domaines.map(x => x.nb))} value={d.nb} aria-label={d.domaine} /><strong>{number(d.nb)}</strong></div>)}</section>}
    <dialog ref={dialog} aria-labelledby="collectivite-title" className={styles.dialog} onClose={() => setDetail(null)}>
      {detail && <><button autoFocus onClick={() => dialog.current.close()}>Fermer la fiche ×</button><h2 id="collectivite-title">{detail.nom}</h2><p>{president(detail)}</p><Contacts row={detail} />{safeUrl(detail.fiche_banatic) && <p><a target="_blank" rel="noreferrer" href={safeUrl(detail.fiche_banatic)}>Fiche BANATIC ↗</a></p>}{safeUrl(detail.site_web) && <p><a target="_blank" rel="noreferrer" href={safeUrl(detail.site_web)}>Site de la structure ↗</a></p>}
      <details><summary>Toutes les données de la structure</summary><dl className={styles.fields}>{Object.entries(detail).filter(([k]) => k !== 'collectivites_competences').map(([k,v]) => <div key={k}><dt>{k.replaceAll('_',' ')}</dt><dd>{String(v ?? '—')}</dd></div>)}</dl></details>
      <h3>Compétences exercées</h3><ul>{(detail.collectivites_competences || []).map((c,i) => <li key={`${c.domaine}-${i}`}><strong>{c.domaine}</strong> · {c.competence}</li>)}</ul>
      <label>Notes commerciales<textarea value={notes} maxLength={20000} onChange={e => setNotes(e.target.value)} rows={6} /></label><button disabled={busy} onClick={() => update(detail.siren,{ notes })}>{busy ? 'Enregistrement…' : 'Enregistrer les notes'}</button><p role="status">{notice}</p><p className={styles.source}>Contact opérationnel : prévu pour une prochaine étape. Vous pouvez consigner les informations qualifiées dans les notes.</p></>}
    </dialog>
  </div>;
}
