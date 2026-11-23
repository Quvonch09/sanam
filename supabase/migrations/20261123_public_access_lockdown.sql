-- RLS and column-grant changes only. No table rows or Storage objects are changed.
-- The authenticated storage.objects FOR ALL policy is intentionally left untouched.

ALTER POLICY "Allow all" ON public.products USING (false) WITH CHECK (false);
CREATE POLICY public_read_products ON public.products
  FOR SELECT TO anon, authenticated USING (true);

ALTER POLICY "Allow all" ON public.categories USING (false) WITH CHECK (false);
CREATE POLICY public_read_categories ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

ALTER POLICY "Allow all" ON public.news USING (false) WITH CHECK (false);
CREATE POLICY public_read_news ON public.news
  FOR SELECT TO anon, authenticated USING (true);

ALTER POLICY "Allow all" ON public.team_members USING (false) WITH CHECK (false);
REVOKE SELECT ON TABLE public.team_members FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, name, role, image_url) ON TABLE public.team_members TO anon, authenticated;
CREATE POLICY public_read_team_members ON public.team_members
  FOR SELECT TO anon, authenticated USING (true);

ALTER POLICY "Allow all" ON public.feedbacks USING (false) WITH CHECK (false);
CREATE POLICY public_read_approved_feedback ON public.feedbacks
  FOR SELECT TO anon, authenticated USING (approved IS TRUE);
CREATE POLICY public_submit_unapproved_feedback ON public.feedbacks
  FOR INSERT TO anon, authenticated WITH CHECK (approved IS FALSE);

ALTER POLICY "Allow all" ON public.leads USING (false) WITH CHECK (false);
CREATE POLICY public_submit_leads ON public.leads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER POLICY "Allow all" ON public.calc_inquiries USING (false) WITH CHECK (false);
CREATE POLICY public_submit_calc_inquiries ON public.calc_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Keep public reads of existing sanam assets; disable public mutations only.
ALTER POLICY "Allow public insert to sanam bucket" ON storage.objects
  WITH CHECK (false);
ALTER POLICY "Allow public update to sanam bucket" ON storage.objects
  USING (false) WITH CHECK (false);
ALTER POLICY "Allow public delete to sanam bucket" ON storage.objects
  USING (false);
