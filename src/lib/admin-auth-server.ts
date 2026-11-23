import 'server-only';

import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'sanam_admin_session';
const COOKIE_PATH = '/api/admin';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
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

function mac(payload: string): string {
  return createHmac('sha256', signingKey()).update(`sanam-admin-session-v1\0${payload}`).digest('base64url');
}

function equalText(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
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

export function createAdminSessionCookie(): string {
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}.${randomBytes(16).toString('base64url')}`;
  return `${COOKIE_NAME}=${payload}.${mac(payload)}; Path=${COOKIE_PATH}; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=${COOKIE_PATH}; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export function hasAdminSession(request: NextRequest): boolean {
  const value = request.cookies.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expiry = Number(parts[0]);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false;
  try {
    return equalText(parts[2], mac(payload));
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
