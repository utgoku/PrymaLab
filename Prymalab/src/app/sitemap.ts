import type { MetadataRoute } from 'next';
import { knowledgeArticles } from '@/lib/editorial';

const siteUrl = 'https://prymalab.com';
const updatedAt = new Date('2026-08-28T00:00:00+07:00');

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: updatedAt, changeFrequency: 'weekly', priority: 1 },
    { url: siteUrl + '/services', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.9 },
    { url: siteUrl + '/quiz', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.9 },
    { url: siteUrl + '/phuong-phap', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.85 },
    { url: siteUrl + '/blog', lastModified: updatedAt, changeFrequency: 'weekly', priority: 0.85 },
    { url: siteUrl + '/about', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.7 },
    { url: siteUrl + '/chinh-sach-bien-tap', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.65 },
    { url: siteUrl + '/contact', lastModified: updatedAt, changeFrequency: 'monthly', priority: 0.65 },
    { url: siteUrl + '/privacy', lastModified: updatedAt, changeFrequency: 'yearly', priority: 0.3 },
    { url: siteUrl + '/terms', lastModified: updatedAt, changeFrequency: 'yearly', priority: 0.3 },
  ];
  return [...routes, ...knowledgeArticles.map((article) => ({
    url: siteUrl + '/blog/' + article.slug,
    lastModified: new Date(article.updatedAt + 'T00:00:00+07:00'),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
    images: [siteUrl + article.image],
  }))];
}
