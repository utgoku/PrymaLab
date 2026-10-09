import 'server-only';
import { cache } from 'react';
import { supabase } from './supabase';
import { draftToArticle, type ArticleDraft } from './article-content';

export const getPublishedArticles = cache(async () => {
  const { data, error } = await supabase.from('blog_posts').select('id,title,slug,excerpt,category,meta_title,image,image_alt,read_time,published_at,updated_at')
    .eq('is_published', true).not('published_at', 'is', null)
    .order('published_at', { ascending: false }).order('id', { ascending: false })
    .abortSignal(AbortSignal.timeout(10000));
  if (error) throw new Error('Chưa thể tải bài viết. Vui lòng thử lại sau.');
  return (data as ArticleDraft[]).map(draftToArticle);
});

export const getPublishedArticle = cache(async (slug: string) => {
  const { data, error } = await supabase.from('blog_posts').select('*')
    .eq('slug', slug).eq('is_published', true).not('published_at', 'is', null)
    .abortSignal(AbortSignal.timeout(10000)).maybeSingle();
  if (error) throw new Error('Chưa thể tải bài viết. Vui lòng thử lại sau.');
  return data ? draftToArticle(data as ArticleDraft) : undefined;
});
