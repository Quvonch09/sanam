import 'server-only';

import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin-server';

const COOKIE_NAME = 'sanam_admin_session';
const COOKIE_PATH = '/api/admin';
const SESSION_TABLE = 'sanam_admin_sessions';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function secret(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error('Admin authentication is not configured');
  return value;
}

function signingKey(): Buffer {
  // Domain-separated derivation: credentials/service-role secret are never used directly as a MAC key.
  const material = [secret('SANAM_ADMIN_USERNAME'), secret('SANAM_ADMIN_PASSWORD'), secret('SUPABASE_SERVICE_ROLE_KEY')].join('\0');
  return createHmac('sha256', 'sanam-admin-session-key-v1').update(material).digest();
}

function credentialFingerprint(): string {
  return createHmac('sha256', signingKey()).update('sanam-admin-credential-version-v1').digest('hex');
}

function mac(payload: string): string {
  return createHmac('sha256', signingKey()).update(`sanam-admin-session-v1\0${payload}`).digest('base64url');
}

function equalText(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function sessionHash(sessionId: string): string {
  return createHash('sha256').update(sessionId).digest('hex');
}

function parseSession(request: NextRequest): { sessionIdHash: string; expiresAtSeconds: number } | null {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return null;
  const parts = value.split('.');
  if (parts.length !== 3 || !/^\d{1,12}$/.test(parts[0]) || !SESSION_ID_PATTERN.test(parts[1])) return null;
  const [expiresText, sessionId, signature] = parts;
  const expiresAtSeconds = Number(expiresText);
  if (!Number.isSafeInteger(expiresAtSeconds) || expiresAtSeconds <= Math.floor(Date.now() / 1000)) return null;
  const payload = `${expiresText}.${sessionId}`;
  try {
    if (!equalText(signature, mac(payload))) return null;
  } catch {
    return null;
  }
  return { sessionIdHash: sessionHash(sessionId), expiresAtSeconds };
}

export function checkAdminCredentials(username: string, password: string, clientKey: string): boolean {
  const now = Date.now();
  for (const [key, state] of loginAttempts) if (state.resetAt <= now) loginAttempts.delete(key);
  const state = loginAttempts.get(clientKey);
  if (state && state.count >= MAX_LOGIN_ATTEMPTS && state.resetAt > now) return false;

  let valid = false;
  try {
    const usernameMatches = equalText(username, secret('SANAM_ADMIN_USERNAME'));
    const passwordMatches = equalText(password, secret('SANAM_ADMIN_PASSWORD'));
    valid = usernameMatches && passwordMatches;
  } catch {
    valid = false;
  }

  if (valid) {
    loginAttempts.delete(clientKey);
    return true;
  }
  if (state && state.resetAt > now) state.count += 1;
  else loginAttempts.set(clientKey, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  if (loginAttempts.size > 5000) loginAttempts.clear();
  return false;
}

export async function createAdminSessionCookie(): Promise<string> {
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const now = new Date().toISOString();
  const expiresAt = new Date(expiresAtSeconds * 1000).toISOString();
  const sessionId = randomBytes(32).toString('base64url');
  const sessionIdHash = sessionHash(sessionId);
  const version = credentialFingerprint();
  const supabase = getSupabaseAdmin();

  const { error: revokeOldError } = await supabase
    .from(SESSION_TABLE)
    .update({ revoked_at: now })
    .neq('credential_fingerprint', version)
    .is('revoked_at', null);
  if (revokeOldError) throw new Error('Unable to revoke sessions from an older credential version');

  const { error } = await supabase.from(SESSION_TABLE).insert({
    session_id_hash: sessionIdHash,
    credential_fingerprint: version,
    expires_at: expiresAt,
  });
  if (error) throw new Error('Unable to create admin session');

  const payload = `${expiresAtSeconds}.${sessionId}`;
  return `${COOKIE_NAME}=${payload}.${mac(payload)}; Path=${COOKIE_PATH}; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=${COOKIE_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export async function hasAdminSession(request: NextRequest): Promise<boolean> {
  const parsed = parseSession(request);
  if (!parsed) return false;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from(SESSION_TABLE)
      .select('expires_at, revoked_at, credential_fingerprint')
      .eq('session_id_hash', parsed.sessionIdHash)
      .maybeSingle();
    if (error || !data || data.revoked_at !== null) return false;
    const storedExpiry = Date.parse(data.expires_at);
    if (!Number.isFinite(storedExpiry) || storedExpiry <= Date.now()) return false;
    if (Math.floor(storedExpiry / 1000) !== parsed.expiresAtSeconds) return false;
    return equalText(data.credential_fingerprint, credentialFingerprint());
  } catch {
    return false;
  }
}

export async function revokeAdminSession(request: NextRequest): Promise<boolean> {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return true;
  const parts = value.split('.');
  if (parts.length !== 3 || !/^\d{1,12}$/.test(parts[0]) || !SESSION_ID_PATTERN.test(parts[1])) return true;

  try {
    const { error } = await getSupabaseAdmin()
      .from(SESSION_TABLE)
      .update({ revoked_at: new Date().toISOString() })
      .eq('session_id_hash', sessionHash(parts[1]))
      .is('revoked_at', null);
    return !error;
  } catch {
    return false;
  }
}

export function isSameOriginMutation(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function loginClientKey(request: NextRequest): string {
  // Forwarded addresses are untrusted but useful for best-effort per-instance throttling.
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}
