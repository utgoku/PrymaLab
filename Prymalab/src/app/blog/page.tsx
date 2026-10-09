import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import ArticleLibrary from '@/components/blog/ArticleLibrary';
import { getPublishedArticles } from '@/lib/articles';
import { getPublicHomeData } from '@/lib/db';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Bài viết về dinh dưỡng, giấc ngủ và nhịp sống',
  description: 'Bài viết và hướng dẫn thực hành về dinh dưỡng, giấc ngủ, nhịp sinh học. Tìm theo chủ đề, đọc nguồn tham khảo và chọn thay đổi phù hợp.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const [articles, { settings }] = await Promise.all([getPublishedArticles(), getPublicHomeData()]);
  const url = `${SITE_URL}/blog`;
  const structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${url}#webpage`, url,
    name: `Kiến thức | ${SITE_NAME}`, inLanguage: 'vi-VN', isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: { '@type': 'ItemList', numberOfItems: articles.length, itemListElement: articles.map((article, index) => ({ '@type': 'ListItem', position: index + 1, name: article.title, url: `${url}/${article.slug}` })) },
  };
  return <div className="min-h-screen bg-[#f5f7f3] text-[#153339]">
    <Navigation />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <header className="mb-12 max-w-3xl"><p className="section-kicker">Kiến thức PrymaLab</p><h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl tracking-[-0.025em] sm:text-5xl">Đọc để hiểu. Thử để thay đổi.</h1><p className="mt-5 max-w-2xl text-base leading-8 text-[#5f7478]">Những hướng dẫn dễ áp dụng về bữa ăn, giấc ngủ và thói quen mỗi ngày. Có nguồn tham khảo để bạn đọc thêm khi cần.</p></header>
      <ArticleLibrary articles={articles} />
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#dbe4df] pt-6 text-sm"><Link href="/chinh-sach-bien-tap" className="font-semibold text-[#0b7f72]">Chính sách biên tập</Link><a href="/rss.xml" className="font-semibold text-[#0b7f72]">Theo dõi bài mới qua RSS</a></div>
    </main>
    <Footer settings={settings} />
  </div>;
}
