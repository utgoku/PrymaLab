import type { MetadataRoute } from 'next';

const privatePaths = ['/admin/', '/api/', '/checkout', '/dashboard/', '/login', '/register'];

export default function robots(): MetadataRoute.Robots {
  const searchableBots = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      ...searchableBots.map((userAgent) => ({ userAgent, allow: '/', disallow: privatePaths })),
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
    ],
    sitemap: 'https://www.prymalab.com/sitemap.xml',
    host: 'https://www.prymalab.com',
  };
}
