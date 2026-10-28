import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import { parseContacts, emailAddress, renderMessage, validateMessage, normalizeContacts, SENDER, MAILBOX, WORKSPACE } from '../lib/campaigns/model.js';
import { fingerprint, mailReady } from '../lib/campaigns/sender.js';
import { outgoingMessage, dispatchOne } from '../lib/campaigns/dispatch.js';

const csv = 'email;prenom;entreprise;source\r\n"MARIE@EXEMPLE.FR";"Marie";"OF; Région";"https://exemple.fr"\r\nmarie@exemple.fr;Autre;Doublon;\r\ninvalide;X;Y;\r\npaul@exemple.fr;Paul;"Une ""équipe""";';
const imported = parseContacts(csv);
assert.equal(imported.contacts.length, 2); assert.equal(imported.duplicates, 1); assert.equal(imported.invalid, 1);
assert.equal(imported.contacts[0].company, 'OF; Région'); assert.equal(imported.contacts[1].company, 'Une "équipe"');
assert.equal(parseContacts('email,prenom,entreprise\na@exemple.fr,"Anne, Marie","Groupe\nFrance"').contacts[0].company, 'Groupe\nFrance');
assert.equal(parseContacts('email\tprénom\tentreprise\na@exemple.fr\tAnne\tGroupe').contacts[0].firstName, 'Anne');
assert.equal(parseContacts('a@exemple.fr\nb@exemple.fr').contacts.length, 2);
assert.throws(() => parseContacts('email,prenom\na@exemple.fr,"Anne'));
assert.throws(() => emailAddress('a@exemple.fr\r\nBcc: other@exemple.fr'));
assert.throws(() => emailAddress('Nom <a@exemple.fr>'));
assert.throws(() => validateMessage('Objet\nBcc: x@exemple.fr', 'un message suffisamment long'));
assert.throws(() => validateMessage('Objet', '{{mot_de_passe}} un message suffisamment long'));
assert.equal(renderMessage('Bonjour {{prenom}} chez {{entreprise}}', { firstName: 'Marie', company: 'OF' }), 'Bonjour Marie chez OF');
assert.equal(normalizeContacts([{ email: 'A@EXEMPLE.FR' }, { email: 'a@exemple.fr' }]).length, 1);
const settings = { password: 'synthetic-test-not-a-secret', workspaceId: WORKSPACE };
assert.equal(mailReady(settings), false); settings.verified = fingerprint(settings.password); assert.equal(mailReady(settings), true);
assert.equal(mailReady({ ...settings, password: 'changed' }), false);
assert.equal(mailReady({ ...settings, workspaceId: 'different-workspace' }), false);
const recipient = { id: 'test-row', campaign_id: 'test-campaign', email: 'a@example.test', subject: 'Test', body: 'Bonjour Marie', unsubscribe_token: '00000000-0000-0000-0000-000000000001' };
const message = outgoingMessage(recipient);
assert.equal(message.from.address, SENDER); assert.equal(message.to, recipient.email); assert.equal(message.cc, undefined); assert.equal(message.bcc, undefined);
assert.equal(message.replyTo, SENDER); assert.ok(message.text.includes('/email/unsubscribe/')); assert.ok(message.headers['List-Unsubscribe'].includes('/api/email-unsubscribe/'));
assert.equal(message.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
assert.equal(message.disableFileAccess, true); assert.equal(message.disableUrlAccess, true);
// Stream transport serializes a real MIME message without opening any network connection.
const mime = await nodemailer.createTransport({ streamTransport: true, buffer: true }).sendMail(message);
assert.match(mime.message.toString(), /From:.*AUTONOMIA/); assert.match(mime.message.toString(), /contact@majy.me/);

function fakeClient({ claim = recipient, paused = false, suppressed = false, saveFails = false } = {}) {
  const updates = [], rpcCalls = [];
  return { updates, rpcCalls, rpc: async (name, args) => { rpcCalls.push({ name, args }); return { data: claim }; },
    from(table) { let update;
      const chain = { select() { return chain; }, eq() { return chain; }, in() { return chain; },
        update(value) { update = value; updates.push({ table, ...value }); return chain; },
        maybeSingle: async () => ({ data: table === 'email_campaigns' ? { status: paused ? 'paused' : 'queued' } : suppressed ? { email: recipient.email } : null }),
        then(resolve) { return Promise.resolve({ count: 0, error: saveFails && update ? new Error('db down') : null }).then(resolve); }
      }; return chain;
    }
  };
}
let sends = 0;
const accepting = { sendMail: async () => { sends++; return { accepted: [recipient.email] }; }, close() {} };
let client = fakeClient();
assert.equal((await dispatchOne({ client, settings: {}, transport: accepting })).state, 'not_connected'); assert.equal(sends, 0); assert.equal(client.rpcCalls.length, 0);
client = fakeClient({ claim: null }); assert.equal((await dispatchOne({ client, settings, transport: accepting })).state, 'waiting'); assert.equal(sends, 0);
client = fakeClient({ paused: true }); assert.equal((await dispatchOne({ client, settings, transport: accepting })).state, 'paused'); assert.equal(sends, 0);
client = fakeClient({ suppressed: true }); assert.equal((await dispatchOne({ client, settings, transport: accepting })).state, 'paused'); assert.equal(sends, 0);
client = fakeClient(); assert.equal((await dispatchOne({ client, settings, transport: accepting })).state, 'sent'); assert.equal(sends, 1);
assert.equal(client.rpcCalls.length, 1); assert.ok(client.updates.some(u => u.status === 'sent' && u.message_id));
for (const [error, expected] of [[{ code: 'ETIMEDOUT' }, 'unknown'], [{ code: 'EAUTH' }, 'failed'], [{ responseCode: 550 }, 'failed'], [{ responseCode: 421 }, 'failed']]) {
  client = fakeClient(); let attempted = 0;
  const transport = { sendMail: async () => { attempted++; throw error; }, close() {} };
  assert.equal((await dispatchOne({ client, settings, transport })).state, expected); assert.equal(attempted, 1);
  assert.ok(client.updates.some(u => u.status === expected));
}
client = fakeClient({ saveFails: true }); let count = 0;
await assert.rejects(dispatchOne({ client, settings, transport: { sendMail: async () => { count++; return { accepted: [recipient.email] }; }, close() {} } }), /send_result_not_persisted/);
assert.equal(count, 1);
console.log('email campaigns smoke ok: imports, MIME, approval gate, pause, suppression, and uncertain delivery without retry; no real email sent');
