'use client';
import { useEffect, useRef, useState } from 'react';
import { STATUSES, safeUrl } from '../../lib/collectivites/contract.js';
import { splitContact, presidentName, filtersToParams, prepareMessage, nextAction } from '../../lib/collectivites/usability.js';
import styles from './collectivites.module.css';
const number = value => new Intl.NumberFormat('fr-FR').format(value || 0);
const PIPELINE = [['','Toutes les fiches'],['à contacter','À contacter'],['à relancer','À relancer'],['rendez-vous','Rendez-vous'],['proposition envoyée','Propositions']];

function ContactLinks({ row, compact = false }) {
  const phones = splitContact(row.telephone), emails = splitContact(row.email);
  return <div className={styles.contacts}>
    {(compact ? phones.slice(0,1) : phones).map(t => <a key={t} href={`tel:${t.replace(/[^+\d]/g,'')}`}>{t}</a>)}
    {(compact ? emails.slice(0,1) : emails).map(e => <a key={e} href={`mailto:${e}`}>{e}</a>)}
    {!phones.length && !emails.length && <span className={styles.muted}>Coordonnées à rechercher</span>}
    {compact && phones.length + emails.length > 2 && <small>Autres coordonnées dans la fiche</small>}
  </div>;
}

export default function CollectivitesDashboard({ initialFilters = {} }) {
  const [filters, setFilters] = useState(initialFilters);
  const [queryDraft, setQueryDraft] = useState(initialFilters.q || '');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null), [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [notice, setNotice] = useState(''), [revision, setRevision] = useState(0);
  const [selected, setSelected] = useState({});
  const [detail, setDetail] = useState(null), [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false), [detailLoading, setDetailLoading] = useState(false);
  const [offer, setOffer] = useState('formation'), [message, setMessage] = useState('');
  const [domainQuery, setDomainQuery] = useState('');
  const dialog = useRef(null), detailRequest = useRef(null), summaryLoaded = useRef(false), messageInput = useRef(null);
  const filterQuery = filtersToParams(filters).toString();
  const dirtyNotes = Boolean(detail && notes !== (detail.notes || ''));

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true); setError('');
    fetch(`/api/collectivites?${filterQuery}&page=${page}&summary=${!summaryLoaded.current}`, { signal:abort.signal })
      .then(async r => { const body = await r.json(); if (!r.ok) throw new Error(body.error); return body; })
      .then(body => {
        setData(body);
        if (body.summary) { setSummary(body.summary); summaryLoaded.current = true; }
      })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [filterQuery, page, revision]);
  useEffect(() => {
    window.history.replaceState(null,'',`/collectivites${filterQuery ? `?${filterQuery}` : ''}`);
  }, [filterQuery]);
  useEffect(() => { if (detail && dialog.current && !dialog.current.open) dialog.current.showModal(); }, [detail]);
  useEffect(() => () => detailRequest.current?.abort(), []);
  useEffect(() => {
    if (!dirtyNotes) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload',warn);
    return () => window.removeEventListener('beforeunload',warn);
  }, [dirtyNotes]);

  function apply(patch, reset = false) {
    setFilters(f => reset ? patch : { ...f, ...patch });
    setPage(1); setSelected({}); setNotice('');
    if (reset) setQueryDraft(patch.q || '');
  }
  function selectRows(rows, checked) {
    setSelected(previous => {
      const next = { ...previous };
      rows.forEach(row => { if (checked && Object.keys(next).length < 200) next[row.siren] = row; else if (!checked) delete next[row.siren]; });
      return next;
    });
  }
  async function openDetail(siren) {
    if (busy) return;
    if (dirtyNotes && !window.confirm('Quitter cette fiche sans enregistrer les notes ?')) return;
    detailRequest.current?.abort();
    const controller = new AbortController(); detailRequest.current = controller;
    setDetailLoading(true); setNotice('');
    try {
      const r = await fetch(`/api/collectivites/${siren}`,{ signal:controller.signal });
      const body = await r.json(); if (!r.ok) throw new Error(body.error);
      setDetail(body); setNotes(body.notes || ''); setMessage(prepareMessage(body,offer));
    } catch(e) { if (e.name !== 'AbortError') setNotice(e.message); }
    finally { if (!controller.signal.aborted) setDetailLoading(false); }
  }
  function closeDetail() {
    if (busy) return;
    if (dirtyNotes && !window.confirm('Quitter cette fiche sans enregistrer les notes ?')) return;
    detailRequest.current?.abort(); setDetailLoading(false); dialog.current?.close();
  }
  async function update(siren, patch) {
    setBusy(true); setNotice('');
    try {
      const r = await fetch(`/api/collectivites/${siren}`,{ method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch) });
      const body = await r.json(); if (!r.ok) throw new Error(body.error);
      setDetail(d => d?.siren === siren ? { ...d,...body } : d);
      if ('notes' in patch) setNotes(body.notes || '');
      if ('statut_prospection' in patch) setSelected(s => { const next = { ...s }; delete next[siren]; return next; });
      setRevision(v => v+1); setNotice('Enregistré.');
    } catch(e) { setNotice(e.message); } finally { setBusy(false); }
  }
  async function copy(text, success = 'Copié.') {
    try { await navigator.clipboard.writeText(text); setNotice(success); }
    catch { messageInput.current?.focus(); messageInput.current?.select(); setNotice('Copie indisponible : sélectionnez et copiez le texte.'); }
  }
  function exportHref(mode, selection = false) {
    const params = filtersToParams(filters); params.set('format','csv');
    if (mode === 'contacts') params.set('mode','contacts');
    if (selection) params.set('sirens',Object.keys(selected).join(','));
    return `/api/collectivites?${params}`;
  }

  const pages = Math.max(1, Math.ceil((data?.total || 0)/50));
  const statuses = [...new Set([...STATUSES,...(summary?.statuts || [])])];
  const selectedCount = Object.keys(selected).length;
  const allPageSelected = Boolean(data?.items.length && data.items.every(row => selected[row.siren]));
  const activeCount = Object.entries(filters).filter(([k,v]) => !['tri','ordre'].includes(k) && (Array.isArray(v) ? v.length : v)).length;
  const detailIndex = data?.items.findIndex(row => row.siren === detail?.siren) ?? -1;
  const firstDetailEmail = splitContact(detail?.email)[0];
  const emailHref = firstDetailEmail ? `mailto:${firstDetailEmail}?subject=${encodeURIComponent(offer === 'formation' ? 'Formation pratique IA pour vos équipes' : 'Automatisation IA de vos tâches administratives')}&body=${encodeURIComponent(message)}` : null;

  return <div className={styles.module}>
    <section className={styles.start} aria-label="Démarrer la prospection">
      <div><p className={styles.kicker}>VOTRE BASE DE PROSPECTION</p><h2>Une liste à cibler. Une fiche à traiter.</h2><p>1. Choisissez vos structures. 2. Contactez le bon interlocuteur. 3. Notez la prochaine étape.</p></div>
      <button className={styles.primary} onClick={() => apply({ statut_prospection:'à contacter',email:'true' })}>Afficher les fiches à contacter avec email →</button>
    </section>
    {summary && <div className={styles.metrics} aria-label="Base complète"><span><strong>{number(summary.total)}</strong> structures</span><span><strong>{number(summary.telephone)}</strong> téléphones</span><span><strong>{number(summary.email)}</strong> emails</span><small>Contacts institutionnels · besoins IA à qualifier</small></div>}
    <nav className={styles.pipeline} aria-label="Étapes de prospection">{PIPELINE.map(([value,label]) => <button key={value} aria-pressed={(filters.statut_prospection || '') === value} onClick={() => apply({statut_prospection:value})}>{label}</button>)}</nav>
    <section className={styles.filterPanel} aria-label="Cibler les collectivités">
      <form className={styles.search} onSubmit={e => { e.preventDefault(); apply({q:queryDraft.trim()}); }}>
        <label htmlFor="collectivites-query" className={styles.srOnly}>Nom de la structure ou SIREN</label><input id="collectivites-query" type="search" value={queryDraft} onChange={e => setQueryDraft(e.target.value)} placeholder="Nom de la structure ou SIREN…" /><button type="submit">Rechercher</button>
      </form>
      <div className={styles.basicFilters}>
        <div><label htmlFor="collectivites-category">Catégorie</label><select id="collectivites-category" value={filters.categorie || ''} onChange={e => apply({categorie:e.target.value,code_type:''})}><option value="">Toutes les structures</option>{(summary?.categories || []).map(c => <option key={c.categorie} value={c.categorie}>{c.categorie} · {number(c.nb)}</option>)}</select></div>
        <div><label htmlFor="collectivites-department">Département</label><select id="collectivites-department" value={filters.code_departement || ''} onChange={e => apply({code_departement:e.target.value})}><option value="">Toute la France</option>{(summary?.departements || []).map(d => <option key={d.code_departement} value={d.code_departement}>{d.code_departement} · {d.departement}</option>)}</select></div>
        <label className={styles.check}><input type="checkbox" checked={filters.email === 'true'} onChange={e => apply({email:e.target.checked ? 'true' : ''})} />Avec email</label>
        <label className={styles.check}><input type="checkbox" checked={filters.telephone === 'true'} onChange={e => apply({telephone:e.target.checked ? 'true' : ''})} />Avec téléphone</label>
      </div>
      <details className={styles.advanced}><summary>Domaines, type, statut et tri <span>{activeCount ? `· ${activeCount} filtre${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}` : '· affiner votre cible'}</span></summary>
        <div className={styles.advancedGrid}>
          <div><label htmlFor="collectivites-type">Type de structure</label><select id="collectivites-type" value={filters.code_type || ''} onChange={e => apply({code_type:e.target.value})}><option value="">Tous les types</option>{(summary?.types || []).map(t => <option key={t.code_type} value={t.code_type}>{t.code_type} · {t.type}</option>)}</select></div>
          <div><label htmlFor="collectivites-status">Statut commercial</label><select id="collectivites-status" value={filters.statut_prospection || ''} onChange={e => apply({statut_prospection:e.target.value})}><option value="">Tous les statuts</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label htmlFor="collectivites-sort">Trier par</label><select id="collectivites-sort" value={filters.tri || 'nom'} onChange={e => apply({tri:e.target.value})}>{[['nom','Nom'],['code_departement','Département'],['population','Population'],['code_type','Type'],['statut_prospection','Statut']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div><label htmlFor="collectivites-order">Ordre</label><select id="collectivites-order" value={filters.ordre || 'asc'} onChange={e => apply({ordre:e.target.value})}><option value="asc">Croissant</option><option value="desc">Décroissant</option></select></div>
        </div>
        <fieldset className={styles.domainFieldset}><legend>Domaines de compétences</legend><p>Une fiche est retenue si elle exerce au moins un domaine coché. Un domaine ne constitue pas un besoin de formation confirmé.</p><label htmlFor="domain-query" className={styles.srOnly}>Rechercher un domaine</label><input id="domain-query" placeholder="Rechercher un domaine…" value={domainQuery} onChange={e => setDomainQuery(e.target.value)} />
          <div className={styles.domains}>{(summary?.domaines || []).filter(d => d.domaine.toLocaleLowerCase('fr').includes(domainQuery.toLocaleLowerCase('fr'))).map(d => <label className={styles.check} key={d.domaine}><input type="checkbox" checked={(filters.domaine || []).includes(d.domaine)} onChange={e => apply({domaine:e.target.checked ? [...(filters.domaine || []),d.domaine] : filters.domaine.filter(x => x !== d.domaine)})} />{d.domaine}</label>)}</div>
        </fieldset>
      </details>
      <div className={styles.filterFooter}><span>Les filtres sont conservés dans le lien de cette page.</span><button className={styles.textButton} onClick={() => { apply({},true); setDomainQuery(''); }}>Tout réinitialiser</button><button className={styles.textButton} onClick={() => copy(window.location.href,'Lien de cette recherche copié.')}>Copier le lien de ma recherche</button></div>
    </section>
    <p className={styles.notice} role="status" aria-live="polite">{error || (loading ? 'Chargement des fiches…' : `${number(data?.total)} structures correspondant à votre recherche`)}{detailLoading ? ' · Ouverture de la fiche…' : ''}</p>
    {notice && <p className={styles.feedback} role="status">{notice}</p>}
    {error && <button onClick={() => setRevision(v => v+1)}>Réessayer</button>}
    {data && !error && <>
      <header className={styles.resultsHeader}><div><h2>{number(data.total)} structures</h2><small>50 par page · cochez les fiches à exporter, jusqu’à 200.</small></div><details className={styles.exportMenu} aria-disabled={loading}><summary>Exporter les résultats filtrés ↓</summary><div><a href={exportHref('full')}>Annuaire complet · {number(data.total)} fiches</a><a href={exportHref('contacts')}>Contacts institutionnels · CSV</a><small>Les noms correspondent aux présidents. Les coordonnées peuvent être celles du siège ; les profils LinkedIn restent à enrichir.</small></div></details></header>
      <div className={styles.tableWrap} aria-busy={loading}><table className={styles.table}><thead><tr><th scope="col"><input type="checkbox" checked={allPageSelected} disabled={loading} onChange={e => selectRows(data.items,e.target.checked)} aria-label="Sélectionner les fiches de cette page" /></th><th scope="col">Structure et territoire</th><th scope="col">Domaines</th><th scope="col">Contact direct</th><th scope="col">Suivi</th><th scope="col">Action</th></tr></thead><tbody>{data.items.map(row => {
        const domains = splitContact(row.domaines);
        return <tr key={row.siren} className={selected[row.siren] ? styles.selectedRow : ''}>
          <td className={styles.selectCell}><input type="checkbox" checked={Boolean(selected[row.siren])} disabled={loading || (!selected[row.siren] && selectedCount >= 200)} aria-label={`Sélectionner ${row.nom}`} onChange={e => selectRows([row],e.target.checked)} /></td>
          <td className={styles.identityCell}><button className={styles.open} onClick={() => openDetail(row.siren)}>{row.nom}</button><p><span className={styles.type}>{row.code_type}</span> {row.code_departement} · {row.departement}</p>{presidentName(row) && <small>Présidence : {presidentName(row)}</small>}</td>
          <td className={styles.domainCell}>{domains.slice(0,2).map(d => <span className={styles.badge} key={d}>{d}</span>)}{domains.length > 2 && <button className={styles.more} onClick={() => openDetail(row.siren)}>+ {domains.length-2} domaines</button>}</td>
          <td className={styles.contactCell}><ContactLinks row={row} compact /></td>
          <td className={styles.statusCell}><label className={styles.srOnly} htmlFor={`status-${row.siren}`}>Statut de {row.nom}</label><select id={`status-${row.siren}`} disabled={busy || loading} value={row.statut_prospection || 'à contacter'} onChange={e => update(row.siren,{statut_prospection:e.target.value})}>{statuses.map(s => <option key={s}>{s}</option>)}</select>{row.notes && <small>Notes enregistrées</small>}</td>
          <td className={styles.actionCell}><button onClick={() => openDetail(row.siren)} disabled={detailLoading}>Ouvrir la fiche →</button></td>
        </tr>;
      })}</tbody></table></div>
      {!data.items.length && <div className={styles.empty}><h3>Aucune fiche dans cette recherche</h3><p>Élargissez un domaine, un département ou le statut pour retrouver des structures.</p><button onClick={() => apply({},true)}>Afficher toute la base</button></div>}
      <nav className={styles.pagination} aria-label="Pagination"><button disabled={page<=1 || loading} onClick={() => setPage(p => p-1)}>← Précédente</button><strong>Page {page} / {pages}</strong><button disabled={page>=pages || loading} onClick={() => setPage(p => p+1)}>Suivante →</button></nav>
    </>}
    {selectedCount > 0 && <aside className={styles.selection} aria-label="Fiches sélectionnées"><strong>{selectedCount} fiche{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}</strong><a href={exportHref('full',true)}>Exporter la sélection</a><a href={exportHref('contacts',true)}>Exporter les contacts</a><button onClick={() => setSelected({})}>Vider la sélection</button></aside>}
    {summary && <details className={styles.sourcePanel}><summary>Répartition par domaine et informations sur la base</summary><p>Source déclarée : BANATIC / DGCL, export du 22 octobre 2026. Cette base couvre les syndicats et intercommunalités. Les compétences et les présidents proviennent de l’export ; les besoins IA et les décideurs opérationnels restent à qualifier.</p><h3>Structures par domaine · base complète</h3><p>Une structure peut exercer plusieurs domaines.</p>{summary.domaines.map(d => <div className={styles.bar} key={d.domaine}><span>{d.domaine}</span><meter min="0" max={Math.max(1,...summary.domaines.map(x => x.nb))} value={d.nb} aria-label={d.domaine} /><strong>{number(d.nb)}</strong></div>)}</details>}
    <dialog ref={dialog} aria-labelledby="collectivite-title" className={styles.dialog} onCancel={e => {e.preventDefault();closeDetail();}} onClose={() => {setDetail(null);setNotice('');}}>
      {detail && <><header className={styles.detailHeader}><div><span className={styles.kicker}>FICHE DE PROSPECTION · {detail.siren}</span><h2 id="collectivite-title">{detail.nom}</h2><p>{detail.code_type} · {detail.code_departement} {detail.departement}</p></div><button onClick={closeDetail} disabled={busy} aria-label="Fermer la fiche">Fermer ×</button></header>
        <div className={styles.detailNav}><span>{detailIndex >= 0 ? `Fiche ${detailIndex+1} de cette page` : 'Fiche détaillée'}</span><button disabled={busy || detailLoading || detailIndex<=0} onClick={() => openDetail(data.items[detailIndex-1].siren)}>← Précédente</button><button disabled={busy || detailLoading || detailIndex<0 || detailIndex>=data.items.length-1} onClick={() => openDetail(data.items[detailIndex+1].siren)}>Fiche suivante →</button></div>
        <div className={styles.detailGrid}><section><h3>Contacter la structure</h3><ContactLinks row={detail} /><div className={styles.detailLinks}>{safeUrl(detail.site_web) && <a target="_blank" rel="noreferrer" href={safeUrl(detail.site_web)}>Site de la structure ↗</a>}{safeUrl(detail.fiche_banatic) && <a target="_blank" rel="noreferrer" href={safeUrl(detail.fiche_banatic)}>Fiche BANATIC ↗</a>}</div><p>Présidence : {presidentName(detail) || 'à qualifier'}</p><div className={styles.tip}><strong>Identifier le contact opérationnel</strong><p>« Qui pilote la formation des agents ou les projets numériques dans votre structure ? »</p><small>Notez le nom, la fonction et les coordonnées dans les notes. L’email du siège n’identifie pas nécessairement le président.</small></div></section>
        <section><label htmlFor="detail-status">Statut commercial</label><select id="detail-status" disabled={busy || detailLoading} value={detail.statut_prospection || 'à contacter'} onChange={e => update(detail.siren,{statut_prospection:e.target.value})}>{statuses.map(s => <option key={s}>{s}</option>)}</select><div className={styles.tip}><strong>Prochaine action suggérée</strong><p>{nextAction(detail.statut_prospection)}</p></div><label htmlFor="commercial-notes">Notes et prochaine étape</label><textarea id="commercial-notes" value={notes} disabled={busy || detailLoading} maxLength={20000} onChange={e => setNotes(e.target.value)} placeholder="Interlocuteur / besoin exprimé / dernier échange / date de relance…" rows={6} /><div className={styles.notesFooter}><small>{dirtyNotes ? 'Notes non enregistrées' : 'Notes enregistrées'} · {notes.length}/20 000</small><button className={styles.primary} disabled={busy || detailLoading || !dirtyNotes} onClick={() => update(detail.siren,{notes})}>{busy ? 'Enregistrement…' : 'Enregistrer les notes'}</button></div></section></div>
        <section className={styles.message}><div><h3>Préparer un premier message</h3><p>Une base à personnaliser, sans présumer d’un besoin déjà identifié.</p></div><label htmlFor="message-offer">Sujet de la prise de contact</label><select id="message-offer" value={offer} onChange={e => {setOffer(e.target.value);setMessage(prepareMessage(detail,e.target.value));}}><option value="formation">Formation pratique à l’IA</option><option value="automatisation">Automatisation administrative</option></select><label className={styles.srOnly} htmlFor="prospecting-message">Message à personnaliser</label><textarea id="prospecting-message" ref={messageInput} rows={10} value={message} onChange={e => setMessage(e.target.value)} /><div className={styles.detailLinks}><button onClick={() => copy(message,'Message copié. Vous pouvez le coller dans votre messagerie.')}>Copier le message</button>{emailHref && <a className={styles.emailAction} href={emailHref}>Préparer l’e-mail dans ma messagerie ↗</a>}<small>Vous relisez et envoyez vous-même le message.</small></div></section>
        <details className={styles.detailRaw}><summary>Compétences exercées · {(detail.collectivites_competences || []).length}</summary><ul>{(detail.collectivites_competences || []).map((c,i) => <li key={`${c.domaine}-${i}`}><strong>{c.domaine}</strong> · {c.competence}</li>)}</ul></details>
        <details className={styles.detailRaw}><summary>Toutes les données BANATIC</summary><dl className={styles.fields}>{Object.entries(detail).filter(([k]) => k !== 'collectivites_competences').map(([k,v]) => <div key={k}><dt>{k.replaceAll('_',' ')}</dt><dd>{String(v ?? '—')}</dd></div>)}</dl></details>
        {notice && <p className={styles.feedback} role="status">{notice}</p>}
      </>}
    </dialog>
  </div>;
}
