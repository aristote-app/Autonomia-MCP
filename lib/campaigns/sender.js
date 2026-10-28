import nodemailer from 'nodemailer';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, chmod } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { SENDER, MAILBOX, WORKSPACE } from './model.js';

const FILE = join(process.cwd(), '.runtime', 'email-settings.json');
export function fingerprint(password) { return createHash('sha256').update(MAILBOX + ':' + SENDER + ':' + password).digest('hex'); }
export async function readMailSettings() {
  try { return JSON.parse(await readFile(FILE, 'utf8')); } catch { return {}; }
}
export async function writeMailSettings(settings) {
  await mkdir(dirname(FILE), { recursive: true });
  const temp = FILE + '.' + randomUUID() + '.tmp';
  await writeFile(temp, JSON.stringify(settings), { mode: 0o600 });
  await chmod(temp, 0o600); await rename(temp, FILE); await chmod(FILE, 0o600);
}
export function mailReady(settings) {
  return Boolean(settings.password && settings.workspaceId === WORKSPACE && settings.verified === fingerprint(settings.password));
}
export async function mailStatus() {
  const settings = await readMailSettings();
  return { configured: Boolean(settings.password), tested: Boolean(settings.password && settings.tested === fingerprint(settings.password)), ready: mailReady(settings), sender: SENDER, mailbox: MAILBOX };
}
export function smtpTransport(settings) {
  if (!settings.password || settings.workspaceId !== WORKSPACE) throw new Error('mail_not_connected');
  // Fixed Gmail TLS destination; no user supplied SMTP URL, host, or TLS bypass.
  return nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: MAILBOX, pass: settings.password }, connectionTimeout: 15000, greetingTimeout: 15000,
    socketTimeout: 30000, logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true });
}
export function smtpErrorCode(error) {
  if (error?.code === 'EAUTH') return 'mail_auth_failed';
  if (error?.responseCode >= 500) return 'mail_rejected';
  if (error?.responseCode >= 400) return 'mail_temporarily_rejected';
  return 'mail_delivery_unknown';
}
export async function verifyPassword(raw) {
  const password = String(raw || '').replace(/\s/g, '');
  if (!/^[a-zA-Z]{16}$/.test(password)) throw new Error('app_password_required');
  const settings = { password, workspaceId: WORKSPACE };
  const transport = smtpTransport(settings);
  try { await transport.verify(); } catch (error) { throw new Error(smtpErrorCode(error)); } finally { transport.close(); }
  return settings;
}
export async function sendSelfTest(settings) {
  const transport = smtpTransport(settings);
  try {
    return await transport.sendMail({ from: { name: 'Déborah Dian · AUTONOMIA Academy', address: SENDER },
      to: MAILBOX, replyTo: SENDER, subject: 'Test de connexion — AUTONOMIA',
      text: 'Ce message teste l’envoi depuis le cockpit AUTONOMIA. Vérifie que l’adresse affichée dans le champ « De » est contact@majy.me, puis confirme la réception dans le cockpit. Aucun prospect n’a été contacté.',
      disableFileAccess: true, disableUrlAccess: true });
  } finally { transport.close(); }
}
