import { NextRequest, NextResponse } from 'next/server';
import { checkAdminCredentials, clearAdminSessionCookie, createAdminSessionCookie, hasAdminSession, isSameOriginMutation, loginClientKey } from '@/lib/admin-auth-server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (input.action === 'logout') {
    if (!hasAdminSession(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const response = NextResponse.json({ authenticated: false });
    response.headers.append('Set-Cookie', clearAdminSessionCookie());
    return response;
  }
  if (Object.keys(input).some((key) => key !== 'username' && key !== 'password') || typeof input.username !== 'string' || typeof input.password !== 'string' || input.username.length > 256 || input.password.length > 4096) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }
  if (!checkAdminCredentials(input.username, input.password, loginClientKey(request))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
  const response = NextResponse.json({ authenticated: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.headers.append('Set-Cookie', createAdminSessionCookie());
  return response;
}
