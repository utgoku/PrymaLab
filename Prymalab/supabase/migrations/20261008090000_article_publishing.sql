-- Additive migration: retains all existing and retired editorial content.
BEGIN;
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS meta_title text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '/images/sleep_serene.jpg',
  ADD COLUMN IF NOT EXISTS image_alt text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS direct_answer text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.blog_posts ALTER COLUMN is_published SET DEFAULT false;
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx
  ON public.blog_posts (published_at DESC) WHERE is_published = true;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public read published articles" ON public.blog_posts;
CREATE POLICY "Public read published articles" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (is_published = true AND published_at IS NOT NULL);
REVOKE INSERT, UPDATE, DELETE ON public.blog_posts FROM anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
COMMIT;
