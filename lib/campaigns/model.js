export const SENDER = 'contact@majy.me';
export const MAILBOX = 'plannification.sismiik@gmail.com';
export const WORKSPACE = '146b2896-452f-41aa-9993-612b0b7ddf5f';
export const DAILY_LIMIT = 100;
export const GAP_MINUTES = 5;
const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i;
export function emailAddress(value) {
  const email = String(value || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email) || /[\r\n\s<>]/.test(email)) throw new Error('invalid_email');
  return email;
}
export function cleanText(value, max) { return String(value || '').trim().slice(0, max); }
export function renderMessage(template, contact) {
  return String(template).replace(/\{\{(prenom|entreprise)\}\}/g, (_, key) => String(key === 'prenom' ? contact.firstName || '' : contact.company || 'votre organisme').replace(/[\r\n]+/g, ' '));
}
export function validateMessage(subject, body) {
  subject = cleanText(subject, 180); body = cleanText(body, 12000);
  if (!subject || /[\r\n]/.test(subject) || body.length < 20) throw new Error('invalid_message');
  if (/\{\{(?!prenom\}\}|entreprise\}\})/.test(subject + body)) throw new Error('unknown_variable');
  return { subject, body };
}
// Accept CSV (including quoted commas/newlines), TSV and one email per line.
export function parseContacts(text) {
  if (String(text).length > 200000) throw new Error('import_too_large');
  const firstLine = String(text).split(/\r?\n/)[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';
  const rows = []; let row = [], cell = '', quoted = false;
  const input = String(text).replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') { if (quoted && input[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === delimiter && !quoted) { row.push(cell); cell = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(cell); if (row.some(x => x.trim())) rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (quoted) throw new Error('invalid_csv');
  row.push(cell); if (row.some(x => x.trim())) rows.push(row);
  const headers = (rows[0] || []).map(x => x.trim().toLowerCase());
  const emailIndex = headers.findIndex(x => ['email', 'e-mail', 'email professionnel'].includes(x));
  const header = emailIndex >= 0;
  const nameIndex = header ? headers.findIndex(x => ['prenom', 'prénom', 'firstname', 'first name'].includes(x)) : 1;
  const companyIndex = header ? headers.findIndex(x => ['entreprise', 'organisme', 'company'].includes(x)) : 2;
  const sourceIndex = header ? headers.findIndex(x => ['source', 'origine'].includes(x)) : 3;
  const contacts = [], seen = new Set(); let invalid = 0, duplicates = 0;
  for (const cells of rows.slice(header ? 1 : 0)) {
    try {
      const email = emailAddress(cells[header ? emailIndex : 0]);
      if (seen.has(email)) { duplicates++; continue; } seen.add(email);
      contacts.push({ email, firstName: cleanText(cells[nameIndex], 100), company: cleanText(cells[companyIndex], 180), source: cleanText(cells[sourceIndex], 500) });
    } catch { invalid++; }
  }
  if (contacts.length > 1000) throw new Error('too_many_contacts');
  return { contacts, invalid, duplicates };
}
export function normalizeContacts(contacts) {
  if (!Array.isArray(contacts) || !contacts.length || contacts.length > 1000) throw new Error('invalid_contacts');
  const seen = new Set();
  return contacts.map(c => ({ email: emailAddress(c.email), firstName: cleanText(c.firstName, 100), company: cleanText(c.company, 180), source: cleanText(c.source, 500) }))
    .filter(c => !seen.has(c.email) && seen.add(c.email));
}
