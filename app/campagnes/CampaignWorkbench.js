'use client';
import { useEffect, useState } from 'react';
import { MAILBOX, SENDER, parseContacts, renderMessage } from '../../lib/campaigns/model.js';
import styles from './campaigns.module.css';
const errors = {
  not_authenticated: 'Ta session a expiré. Reconnecte-toi au cockpit.', admin_required: 'Seuls les administrateurs peuvent lancer une campagne.',
  storage_unavailable: 'Le suivi est indisponible. Aucun nouveau lot n’a été confirmé.', mail_not_ready: 'Connecte l’expéditeur et valide le test avant de lancer le lot.',
  mail_auth_failed: 'Google a refusé la connexion. Vérifie le compte et le mot de passe d’application.', app_password_required: 'Saisis le mot de passe d’application Google de 16 lettres, pas le mot de passe habituel.',
  mail_delivery_unknown: 'Le serveur n’a pas confirmé le résultat. Vérifie ta boîte avant de réessayer.', mail_not_connected: 'Connecte d’abord le compte d’envoi.',
  mail_rejected: 'Le serveur a refusé le message. Vérifie la configuration.', mail_temporarily_rejected: 'Le serveur a temporairement refusé le message. Le lot est mis en pause.',
  invalid_contacts: 'Ajoute au moins un email valide.', invalid_email: 'Un email est invalide.', invalid_message: 'Ajoute un objet sans retour à la ligne et un message d’au moins 20 caractères.',
  unknown_variable: 'Utilise uniquement {{prenom}} et {{entreprise}} pour personnaliser le message.', test_required: 'Envoie d’abord le message de test.',
  test_rate_limit: 'Attends une minute avant un nouveau test.', campaign_closed: 'Cette campagne est terminée ou annulée.',
  invalid_csv: 'Un guillemet n’est pas fermé dans le fichier.', too_many_contacts: 'Limite cet import à 1 000 contacts.', import_too_large: 'Le fichier est trop volumineux.'
};
const labels = { queued: 'En attente', sending: 'Envoi en cours · à vérifier si prolongé', sent: 'Accepté par le serveur', failed: 'Refusé', unknown: 'Résultat à vérifier', suppressed: 'Exclu', replied: 'Réponse reçue', bounced: 'Adresse invalide', paused: 'En pause', done: 'Terminé', cancelled: 'Annulé' };
const defaultMessage = `Bonjour {{prenom}},

Je vous contacte pour AUTONOMIA Academy. Nous disposons d’un réseau de formateurs en intelligence artificielle et outils numériques.

Est-ce que {{entreprise}} recherche actuellement des intervenants pour ses formations ? Je peux vous présenter les profils et disponibilités correspondant à vos besoins.

Seriez-vous disponible pour un court échange ?

Bien cordialement,`;
async function api(path, body) {
  const response = await fetch(path, { cache: 'no-store', ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  let data; try { data = await response.json(); } catch { throw new Error('storage_unavailable'); }
  if (!response.ok || !data.ok) throw new Error(data.error || 'storage_unavailable');
  return data;
}
export default function CampaignWorkbench({ canManage }) {
  const [state, setState] = useState(null), [notice, setNotice] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [contacts, setContacts] = useState([]), [raw, setRaw] = useState(''), [importNote, setImportNote] = useState('');
  const [subject, setSubject] = useState('Vos besoins en formateurs IA — {{entreprise}}'), [body, setBody] = useState(defaultMessage), [name, setName] = useState('Organismes de formation · IA');
  const [step, setStep] = useState(1), [approved, setApproved] = useState(false), [preview, setPreview] = useState(0), [password, setPassword] = useState('');
  const [batchId, setBatchId] = useState(null), [detailId, setDetailId] = useState(null), [recipients, setRecipients] = useState([]);
  useEffect(() => { api('/api/email-campaigns').then(setState).catch(e => setError(errors[e.message] || 'Chargement impossible.')); }, []);
  const refresh = async () => { setState(await api('/api/email-campaigns')); };
  async function run(action) { setBusy(true); setError(''); setNotice(''); try { await action(); } catch (e) { setError(errors[e.message] || 'Action non confirmée. Actualise le suivi avant de réessayer.'); } finally { setBusy(false); } }
  async function connection(action) {
    await run(async () => {
      await api('/api/email-campaigns/connection', { action, ...(action === 'save' ? { password } : {}) });
      setPassword(''); await refresh();
      setNotice(action === 'save' ? 'Connexion au serveur vérifiée. Envoie maintenant le test.' : action === 'test' ? 'Test envoyé à ' + MAILBOX + '. Vérifie son expéditeur dans Gmail.' : action === 'confirm' ? 'Expéditeur prêt. Tu peux maintenant valider un lot.' : 'Expédition déconnectée. Les prochains envois sont bloqués.');
    });
  }
  function parse(text) {
    try { const parsed = parseContacts(text); setContacts(parsed.contacts.map(c => ({ ...c, selected: true }))); setImportNote(`${parsed.contacts.length} contacts · ${parsed.duplicates} doublons retirés · ${parsed.invalid} lignes invalides écartées`); setError(''); setApproved(false); setBatchId(null); }
    catch (e) { setError(errors[e.message] || 'Import impossible.'); }
  }
  async function crm() {
    await run(async () => {
      const data = await api('/api/training-prospects');
      const rows = data.records.filter(r => r.draft?.email && r.draft?.contactVerified && !r.draft.doNotContact && !['gagne', 'perdu', 'reponse', 'rdv'].includes(r.draft.stage));
      const parsed = parseContacts('email;prenom;entreprise;source\n' + rows.map(r => [r.draft.email, r.draft.contact || '', r.draft.organisation || r.snapshot?.buyer || '', r.source_url].map(v => '"' + String(v).replaceAll('"', '""') + '"').join(';')).join('\n'));
      setContacts(parsed.contacts.map(c => ({ ...c, selected: true }))); setBatchId(null); setApproved(false);
      setImportNote(parsed.contacts.length ? `${parsed.contacts.length} contacts vérifiés chargés depuis le CRM.` : 'Aucun contact avec email vérifié dans le CRM. Tu peux coller ta propre liste ci-dessous.');
    });
  }
  const selected = contacts.filter(c => c.selected), contact = selected[Math.min(preview, Math.max(0, selected.length - 1))] || { firstName: 'Prénom', company: 'Entreprise' };
  function edit(setter, value) { setter(value); setApproved(false); setBatchId(null); }
  async function launch() {
    const id = batchId || crypto.randomUUID(); setBatchId(id);
    await run(async () => {
      const result = await api('/api/email-campaigns', { action: 'launch', id, name, subject, body, contacts: selected, confirmed: approved });
      await refresh(); setApproved(false); setStep(1); setContacts([]); setRaw(''); setBatchId(null);
      setNotice(`${result.accepted} contacts mis en file. ${result.excluded || 0} contacts exclus (désinscrits, déjà sollicités ou déjà en attente). Les envois se poursuivent même si tu fermes cette page.`);
    });
  }
  async function changeStatus(id, status) { await run(async () => { await api('/api/email-campaigns', { action: 'status', id, status }); await refresh(); setNotice(status === 'paused' ? 'Lot en pause. Un message déjà transmis au serveur peut encore arriver.' : status === 'cancelled' ? 'Lot annulé. Aucun nouvel envoi de ce lot.' : 'Lot remis en file.'); }); }
  async function details(id) { await run(async () => { const data = await api('/api/email-campaigns?id=' + id); setDetailId(id); setRecipients(data.recipients); }); }
  async function suppress(id, status) { await run(async () => { await api('/api/email-campaigns', { action: 'suppress', id, status }); const data = await api('/api/email-campaigns?id=' + detailId); setRecipients(data.recipients); await refresh(); setNotice('Contact exclu des prochains envois.'); }); }
  return <div className={styles.shell}>
    <header className={styles.hero}><div><p className={styles.eyebrow}>AUTONOMIA · PROSPECTION</p><h1>Des contacts. Un message. Un lot.</h1><p>Prépare tes emails ici, puis valide l’envoi à plusieurs contacts en une seule fois.</p></div><div className={styles.sender}><strong>{SENDER}</strong><span>{state?.connection?.ready ? '● Expéditeur prêt' : '○ Connexion à terminer'}</span><small>{state?.usage || 0} / 100 tentatives sur les dernières 24 h</small></div></header>
    {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.success}>{notice}</p>}
    {!canManage && <p className={styles.error}>Consultation uniquement. Un administrateur doit connecter l’expéditeur et lancer les lots.</p>}
    <details className={styles.connection} open={state && !state.connection?.ready ? true : undefined}>
      <summary>{state?.connection?.ready ? 'Expéditeur connecté · gérer la connexion' : 'À faire une fois : connecter l’envoi'}</summary>
      <p>Compte d’envoi : <strong>{MAILBOX}</strong> · adresse visible : <strong>{SENDER}</strong>.</p>
      <p>La connexion Gmail de ChatGPT ne peut pas être réutilisée automatiquement par ce site. Pour ce cockpit, utilise un mot de passe d’application Google dédié, à saisir uniquement ci-dessous.</p>
      <a href="https://support.google.com/mail/answer/185833?hl=fr" target="_blank" rel="noreferrer">Comment créer ce mot de passe dans Google ↗</a>
      <form className={styles.row} onSubmit={e => { e.preventDefault(); connection('save'); }}><label>Mot de passe d’application Google<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="16 lettres · jamais le mot de passe habituel" required disabled={!canManage}/></label><button disabled={busy || !canManage} type="submit">Connecter et vérifier</button></form>
      {state?.connection?.configured && <div className={styles.row}><button disabled={busy || !canManage} onClick={() => connection('test')}>M’envoyer un test</button>{state.connection.tested && !state.connection.ready && <button disabled={busy || !canManage} onClick={() => connection('confirm')}>J’ai reçu le test avec {SENDER} comme expéditeur</button>}<button className={styles.secondary} disabled={busy || !canManage} onClick={() => connection('disconnect')}>Déconnecter l’envoi</button></div>}
      <small>Les secrets ne sont pas affichés ni inclus dans le suivi des campagnes. La vérification SMTP ne confirme pas la réception : contrôle le test dans Gmail avant de valider.</small>
    </details>
    <nav className={styles.steps} aria-label="Étapes de la campagne">{['Contacts', 'Message', 'Vérifier et lancer'].map((text, i) => <button key={text} aria-current={step === i + 1 ? 'step' : undefined} className={step === i + 1 ? styles.active : styles.secondary} disabled={busy || (i > 0 && !selected.length)} onClick={() => setStep(i + 1)}><span>{i + 1}</span>{text}</button>)}</nav>
    <section className={styles.panel}>
      {step === 1 && <><div className={styles.sectionHead}><div><h2>À qui écris-tu ?</h2><p>Colle tes contacts ou récupère les emails déjà vérifiés dans ton CRM.</p></div><button className={styles.secondary} onClick={crm} disabled={busy}>Prendre les contacts du CRM</button></div>
        <label>Liste de contacts<textarea value={raw} onChange={e => setRaw(e.target.value)} rows={5} placeholder={'email;prenom;entreprise;source\ncontact@exemple.fr;Marie;Organisme Exemple;Site professionnel'}/></label>
        <div className={styles.row}><button onClick={() => parse(raw)} disabled={busy || !raw.trim()}>Charger la liste</button><label className={styles.file}>ou importer un CSV<input type="file" accept=".csv,.txt,.tsv" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 200000) { setError('Fichier trop volumineux.'); return; } const text = await file.text(); setRaw(text); parse(text); }}/></label></div>
        {importNote && <p role="status">{importNote}</p>}
        {contacts.length > 0 && <><p><strong>{selected.length}</strong> contacts sélectionnés. Les adresses absentes ou invalides ne sont pas importées.</p><div className={styles.tableWrap}><table><thead><tr><th><input type="checkbox" aria-label="Sélectionner tous les contacts" checked={contacts.every(c => c.selected)} onChange={e => { setContacts(contacts.map(c => ({ ...c, selected: e.target.checked }))); setApproved(false); setBatchId(null); }}/></th><th>Email</th><th>Prénom</th><th>Organisme</th></tr></thead><tbody>{contacts.map((c, index) => <tr key={c.email}><td><input type="checkbox" aria-label={'Sélectionner ' + c.email} checked={c.selected} onChange={e => { setContacts(contacts.map((row, i) => i === index ? { ...row, selected: e.target.checked } : row)); setApproved(false); setBatchId(null); }}/></td><td>{c.email}</td><td>{c.firstName || '—'}</td><td>{c.company || '—'}</td></tr>)}</tbody></table></div><button className={styles.next} disabled={!selected.length} onClick={() => setStep(2)}>Continuer · préparer le message →</button></>}
      </>}
      {step === 2 && <><h2>Quel message envoies-tu ?</h2><p>Écris une seule fois. <code>{'{{prenom}}'}</code> et <code>{'{{entreprise}}'}</code> seront remplacés pour chaque contact.</p><label>Nom du lot<input value={name} maxLength={100} onChange={e => edit(setName, e.target.value)}/></label><label>Objet<input value={subject} maxLength={180} onChange={e => edit(setSubject, e.target.value)}/></label><label>Message<textarea rows={12} value={body} maxLength={12000} onChange={e => edit(setBody, e.target.value)}/></label><p className={styles.hint}>La signature Déborah Dian · AUTONOMIA Academy, l’adresse de réponse et le lien de désinscription sont ajoutés automatiquement.</p><button className={styles.next} disabled={!subject.trim() || body.trim().length < 20} onClick={() => setStep(3)}>Vérifier le lot →</button></>}
      {step === 3 && <><h2>Relis, puis lance le lot.</h2><div className={styles.reviewGrid}><article className={styles.preview}><label>Aperçu pour<select value={Math.min(preview, selected.length - 1)} onChange={e => setPreview(Number(e.target.value))}>{selected.map((c, i) => <option key={c.email} value={i}>{c.email}</option>)}</select></label><p><small>De : {SENDER}</small></p><h3>{renderMessage(subject, contact)}</h3><p className={styles.message}>{renderMessage(body, contact)}</p><hr/><small>Déborah Dian · AUTONOMIA Academy<br/>{SENDER}<br/>{contact.source && <>Origine du contact : {contact.source}<br/></>}Ne plus recevoir nos messages : lien individuel ajouté à l’envoi</small></article><aside className={styles.review}><strong>{selected.length} destinataires</strong><p>Un email individuel par personne, sans copie collective.</p><p>Au maximum 100 tentatives sur 24 h, avec au moins 5 minutes entre deux messages. Les refus et les résultats incertains ne sont pas relancés automatiquement.</p><p>Les désinscrits et les contacts déjà sollicités dans les 7 derniers jours sont exclus. Les réponses et retours d’erreur reçus dans Gmail doivent être signalés dans le suivi ci-dessous.</p><label className={styles.check}><input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)}/>J’ai vérifié les contacts professionnels sélectionnés et relu le message.</label><button disabled={busy || !approved || !state?.connection?.ready || !canManage} onClick={launch}>{busy ? 'Validation…' : `Lancer le lot de ${selected.length} contacts`}</button>{!state?.connection?.ready && <p className={styles.hint}>Termine la connexion de l’expéditeur en haut de la page pour activer ce bouton.</p>}</aside></div></>}
    </section>
    <section className={styles.panel}><div className={styles.sectionHead}><div><h2>Suivi des envois</h2><p>« Accepté » signifie que le serveur de messagerie a accepté l’email. La réception en boîte principale n’est pas confirmée.</p></div><button className={styles.secondary} disabled={busy} onClick={() => run(refresh)}>Actualiser</button></div>
      {!state?.campaigns?.length && <p>Aucun lot lancé pour le moment.</p>}{state?.campaigns?.map(c => <article key={c.id} className={styles.campaign}><div><strong>{c.name}</strong><p>{labels[c.status]} · {c.counts.sent || 0} acceptés · {c.counts.queued || 0} en attente · {(c.counts.failed || 0) + (c.counts.unknown || 0) + (c.counts.sending || 0)} à vérifier · {c.counts.replied || 0} réponses signalées</p></div><div className={styles.row}><button className={styles.secondary} disabled={busy} onClick={() => details(c.id)}>Voir les contacts</button>{canManage && c.status === 'queued' && <button disabled={busy} onClick={() => changeStatus(c.id, 'paused')}>Pause</button>}{canManage && c.status === 'paused' && <button disabled={busy || !state.connection?.ready} onClick={() => changeStatus(c.id, 'queued')}>Reprendre</button>}{canManage && ['queued', 'paused'].includes(c.status) && <button className={styles.secondary} disabled={busy} onClick={() => changeStatus(c.id, 'cancelled')}>Annuler le lot</button>}</div></article>)}
      {detailId && <div className={styles.tableWrap}><table><thead><tr><th>Email</th><th>État</th><th>Signaler et arrêter les prochains envois</th></tr></thead><tbody>{recipients.map(r => <tr key={r.id}><td>{r.email}</td><td>{labels[r.status]}{r.error_code && <small> · à vérifier dans Gmail</small>}</td><td><div className={styles.row}>{canManage && <><button className={styles.secondary} disabled={busy} onClick={() => suppress(r.id, 'replied')}>A répondu</button><button className={styles.secondary} disabled={busy} onClick={() => suppress(r.id, 'bounced')}>Adresse invalide</button><button className={styles.secondary} disabled={busy} onClick={() => suppress(r.id, 'suppressed')}>Ne plus contacter</button></>}</div></td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
