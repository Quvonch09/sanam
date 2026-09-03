-- Supabase SQL Setup for Sanam Garment Factory
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  model TEXT,
  sizes TEXT,
  material TEXT,
  price TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  category TEXT,
  summary TEXT,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  image_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  text TEXT,
  date TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  service TEXT,
  message TEXT,
  date TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Calc inquiries table
CREATE TABLE IF NOT EXISTS calc_inquiries (
  id TEXT PRIMARY KEY,
  product_type TEXT,
  quantity INTEGER,
  estimated_days INTEGER,
  phone TEXT,
  date TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calc_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow all operations (public access for admin panel)
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON feedbacks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON calc_inquiries FOR ALL USING (true) WITH CHECK (true);

-- 8. Service Types table (Buyurtma turlari)
CREATE TABLE IF NOT EXISTS service_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ru TEXT,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON service_types FOR ALL USING (true) WITH CHECK (true);

-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE service_types;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;

-- 8. Supabase Storage Policies for 'sanam' bucket
-- These policies allow public users to upload, read, update, and delete files in the 'sanam' bucket.
-- Make sure the bucket 'sanam' is created and marked as public in the Supabase Dashboard.

CREATE POLICY "Allow public insert to sanam bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'sanam');

CREATE POLICY "Allow public select to sanam bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sanam');

CREATE POLICY "Allow public update to sanam bucket"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'sanam');

CREATE POLICY "Allow public delete to sanam bucket"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'sanam');
