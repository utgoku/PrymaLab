// Run once after 20261008090000_article_publishing.sql. Never overwrites edits.
import { createClient } from '@supabase/supabase-js';
import { knowledgeArticles } from '../src/lib/editorial.ts';
import { sectionsToContent } from '../src/lib/article-content.ts';

const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } });
for (const article of knowledgeArticles) {
  const { error } = await client.from('blog_posts').upsert({
    slug: article.slug, title: article.title, excerpt: article.description,
    content: sectionsToContent(article.sections), category: article.category,
    author: 'Ban biên tập PrymaLab Việt Nam', published_date: article.publishedAt,
    published_at: `${article.publishedAt}T00:00:00+07:00`, updated_at: `${article.updatedAt}T00:00:00+07:00`,
    meta_title: article.metaTitle, image: article.image, image_alt: article.imageAlt,
    direct_answer: article.directAnswer, highlights: article.highlights, sources: article.sources,
    read_time: article.readTime, gradient: article.accent, is_published: true,
  }, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) throw new Error(`Article migration failed: ${error.message}`);
  console.log(`Preserved or imported: ${article.slug}`);
}

const { error } = await client.from('site_settings').upsert([
  { key: 'phone', value: '0948 348 444' },
  { key: 'email', value: 'ahunglua7@gmail.com' },
  { key: 'address', value: 'Đà Nẵng, Việt Nam' },
  { key: 'workingHours', value: 'Thứ Hai – Thứ Bảy, 08:00–18:00' },
], { onConflict: 'key' });
if (error) throw new Error(`Contact update failed: ${error.message}`);
console.log('Confirmed public contact information updated.');
