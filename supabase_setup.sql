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

-- Public catalog/content is read-only; no stored rows are changed.
DROP POLICY IF EXISTS "Allow all" ON products;
DROP POLICY IF EXISTS public_read_products ON products;
CREATE POLICY public_read_products ON products
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow all" ON categories;
DROP POLICY IF EXISTS public_read_categories ON categories;
CREATE POLICY public_read_categories ON categories
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow all" ON news;
DROP POLICY IF EXISTS public_read_news ON news;
CREATE POLICY public_read_news ON news
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow all" ON team_members;
DROP POLICY IF EXISTS public_read_team_members ON team_members;
REVOKE SELECT ON TABLE team_members FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, name, role, image_url) ON TABLE team_members TO anon, authenticated;
CREATE POLICY public_read_team_members ON team_members
  FOR SELECT TO anon, authenticated USING (true);

-- Only approved feedback is publicly readable; new submissions start unapproved.
DROP POLICY IF EXISTS "Allow all" ON feedbacks;
DROP POLICY IF EXISTS public_read_approved_feedback ON feedbacks;
DROP POLICY IF EXISTS public_submit_unapproved_feedback ON feedbacks;
CREATE POLICY public_read_approved_feedback ON feedbacks
  FOR SELECT TO anon, authenticated USING (approved IS TRUE);
CREATE POLICY public_submit_unapproved_feedback ON feedbacks
  FOR INSERT TO anon, authenticated WITH CHECK (approved IS FALSE);

-- New inquiries may be submitted; existing inquiries are not publicly readable or mutable.
DROP POLICY IF EXISTS "Allow all" ON leads;
DROP POLICY IF EXISTS public_submit_leads ON leads;
CREATE POLICY public_submit_leads ON leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all" ON calc_inquiries;
DROP POLICY IF EXISTS public_submit_calc_inquiries ON calc_inquiries;
CREATE POLICY public_submit_calc_inquiries ON calc_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 8. Service Types table (Buyurtma turlari)
CREATE TABLE IF NOT EXISTS service_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ru TEXT,
  name_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON service_types;
DROP POLICY IF EXISTS public_read_service_types ON service_types;
CREATE POLICY public_read_service_types ON service_types
  FOR SELECT TO anon, authenticated USING (true);

-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE service_types;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;

-- Supabase Storage Policies for the 'sanam' bucket.
-- Keep public reads of existing files; public inserts, updates, and deletes are disabled.
DROP POLICY IF EXISTS "Allow public insert to sanam bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select to sanam bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to sanam bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete to sanam bucket" ON storage.objects;
CREATE POLICY "Allow public select to sanam bucket"
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'sanam');
