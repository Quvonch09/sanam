import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginMutation } from '@/lib/admin-auth-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin-server';

export const runtime = 'nodejs';

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
};
const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/ogg': 'ogv', 'video/quicktime': 'mov',
};
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const FOLDERS = new Set(['products', 'team', 'news']);

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!(await hasAdminSession(request))) return error('Unauthorized', 401);
  if (!isSameOriginMutation(request)) return error('Forbidden', 403);

  let body: unknown;
  try { body = await request.json(); } catch { return error('Invalid upload request', 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return error('Invalid upload request', 400);
  const input = body as Record<string, unknown>;
  if (Object.keys(input).some((key) => !['folder', 'type', 'size'].includes(key))) return error('Invalid upload request', 400);
  if (typeof input.folder !== 'string' || !FOLDERS.has(input.folder) || typeof input.type !== 'string' || typeof input.size !== 'number' || !Number.isSafeInteger(input.size)) {
    return error('Invalid upload request', 400);
  }

  const isImage = Object.hasOwn(IMAGE_TYPES, input.type);
  const extension = (isImage ? IMAGE_TYPES : VIDEO_TYPES)[input.type];
  const limit = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (!extension || (!isImage && input.folder !== 'news')) return error('Unsupported file type', 415);
  if (input.size < 1 || input.size > limit) return error('File size is not allowed', 413);

  const path = `${input.folder}/${randomUUID()}.${extension}`;
  try {
    const storage = getSupabaseAdmin().storage.from('sanam');
    const { data, error: signingError } = await storage.createSignedUploadUrl(path, { upsert: false });
    if (signingError || !data) return error('Unable to authorize upload', 502);
    const { data: publicData } = storage.getPublicUrl(path);
    return NextResponse.json({ path: data.path, token: data.token, url: publicData.publicUrl }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return error('Unable to authorize upload', 500);
  }
}
