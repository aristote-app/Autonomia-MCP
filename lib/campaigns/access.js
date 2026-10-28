import { getCurrentWorkspaceMembership, canManageWorkspace } from '../auth/access.js';
import { WORKSPACE } from './model.js';
export const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
export async function campaignContext() {
  const c = await getCurrentWorkspaceMembership();
  return c?.claims?.sub && c.membership?.active && c.membership.workspace_id === WORKSPACE ? c : null;
}
export function writable(c) { return Boolean(c && canManageWorkspace(c.membership.role)); }
export function sameOrigin(request) { return request.headers.get('origin') === new URL(request.url).origin; }
export async function readBody(request, max = 300000) {
  if (Number(request.headers.get('content-length') || 0) > max) throw new Error('request_too_large');
  const text = await request.text(); if (text.length > max) throw new Error('request_too_large');
  return JSON.parse(text);
}
