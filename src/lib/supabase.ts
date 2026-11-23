import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser Supabase client is intentionally limited to public reads/submissions and scoped signed uploads.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadFileToSupabase = async (file: File, folder: string): Promise<string> => {
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, type: file.type, size: file.size }),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Upload authorization failed (${response.status})`);
  }

  const result: { path?: string; token?: string; url?: string } = await response.json();
  if (!result.path || !result.token || !result.url) throw new Error('Upload authorization response is incomplete');
  const { error } = await supabase.storage.from('sanam').uploadToSignedUrl(result.path, result.token, file, {
    contentType: file.type,
    cacheControl: '3600',
  });
  if (error) throw error;
  return result.url;
};
