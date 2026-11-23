import { NextRequest, NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginMutation } from '@/lib/admin-auth-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin-server';

export const runtime = 'nodejs';

const TABLE_COLUMNS = {
  categories: ['id', 'key', 'label'],
  service_types: ['id', 'name', 'name_ru', 'name_en'],
  products: ['id', 'name', 'category', 'description', 'image_url', 'images', 'model', 'sizes', 'material', 'price', 'badge'],
  news: ['id', 'title', 'date', 'category', 'summary', 'content', 'image_url', 'video_url'],
  team_members: ['id', 'name', 'role', 'image_url', 'phone'],
  leads: ['id', 'name', 'phone', 'service', 'message', 'date', 'status'],
  calc_inquiries: ['id', 'product_type', 'quantity', 'estimated_days', 'phone', 'date', 'status'],
  feedbacks: ['id', 'name', 'rating', 'text', 'date', 'approved'],
} as const;
type TableName = keyof typeof TABLE_COLUMNS;

function isTable(value: string): value is TableName {
  return Object.prototype.hasOwnProperty.call(TABLE_COLUMNS, value);
}
function jsonError(message: string, status: number) { return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } }); }

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) return jsonError('Unauthorized', 401);
  const table = request.nextUrl.searchParams.get('table');
  if (!table || !isTable(table) || request.nextUrl.searchParams.size !== 1) return jsonError('Invalid table', 400);
  try {
    const { data, error } = await getSupabaseAdmin().from(table).select('*');
    if (error) return jsonError('Unable to retrieve data', 500);
    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch { return jsonError('Unable to retrieve data', 500); }
}

export async function POST(request: NextRequest) {
  if (!hasAdminSession(request)) return jsonError('Unauthorized', 401);
  if (!isSameOriginMutation(request)) return jsonError('Forbidden', 403);
  let body: unknown;
  try { body = await request.json(); } catch { return jsonError('Invalid request', 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonError('Invalid request', 400);
  const input = body as Record<string, unknown>;
  const allowedKeys = new Set(['table', 'operation', 'id', 'data']);
  if (Object.keys(input).some((key) => !allowedKeys.has(key)) || typeof input.table !== 'string' || !isTable(input.table) || !['insert', 'update', 'delete', 'upsert'].includes(String(input.operation))) return jsonError('Invalid request', 400);
  const table = input.table;
  const operation = input.operation as 'insert' | 'update' | 'delete' | 'upsert';
  const columns = TABLE_COLUMNS[table] as readonly string[];
  if (operation === 'delete') {
    if (Object.hasOwn(input, 'data') || typeof input.id !== 'string' && typeof input.id !== 'number') return jsonError('Invalid request', 400);
  } else {
    if (Object.hasOwn(input, 'id') && (typeof input.id !== 'string' && typeof input.id !== 'number')) return jsonError('Invalid request', 400);
    if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data)) return jsonError('Invalid data', 400);
    const data = input.data as Record<string, unknown>;
    if (Object.keys(data).length === 0 || Object.keys(data).some((key) => !columns.includes(key))) return jsonError('Invalid data', 400);
    if ((operation === 'update' || operation === 'upsert') && typeof input.id === 'string' || (operation === 'update' || operation === 'upsert') && typeof input.id === 'number') {
      if (Object.hasOwn(data, 'id') && data.id !== input.id) return jsonError('Invalid data', 400);
    }
    if (operation === 'update' && (typeof input.id !== 'string' && typeof input.id !== 'number')) return jsonError('Invalid request', 400);
  }
  try {
    const supabase = getSupabaseAdmin();
    let result: { data: unknown; error: { message: string } | null };
    if (operation === 'delete') result = await supabase.from(table).delete().eq('id', input.id as string | number).select();
    else if (operation === 'insert') result = await supabase.from(table).insert(input.data as Record<string, unknown>).select();
    else if (operation === 'upsert') result = await supabase.from(table).upsert(input.data as Record<string, unknown>).select();
    else result = await supabase.from(table).update(input.data as Record<string, unknown>).eq('id', input.id as string | number).select();
    const { data, error } = result;
    if (error) return jsonError('Unable to save data', 400);
    return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
  } catch { return jsonError('Unable to save data', 500); }
}
