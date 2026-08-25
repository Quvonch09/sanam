import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadFileToSupabase = async (file: File, folder: string): Promise<string> => {
  const bucketName = 'sanam';
  const fileExt = file.name.split('.').pop() || '';
  // Safe filename
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Try to create the bucket if it doesn't exist (fails silently if we lack permissions, which is normal for Anon key)
  try {
    await supabase.storage.createBucket(bucketName, { public: true });
  } catch (e) {
    // Ignore error
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
