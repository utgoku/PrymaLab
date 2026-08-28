import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { knowledgeArticles } from '@/lib/editorial';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Kiến thức dinh dưỡng & giấc ngủ',
  description: 'Kiến thức thực hành có nguồn về dinh dưỡng, chất lượng giấc ngủ, sleep hygiene và nhịp sinh học từ PrymaLab Việt Nam.',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogPage() {
  const blogs = knowledgeArticles.map((article) => ({
    id: article.slug,
    slug: article.slug,
    title: article.title,
    excerpt: article.description,
    category: article.category,
    author: 'Ban biên tập PrymaLab',
    date: article.displayDate,
    readTime: article.readTime,
    gradient: article.accent,
    image: article.image,
    imageAlt: article.imageAlt,
  }));
  const blogUrl = `${SITE_URL}/blog`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${blogUrl}#webpage`,
        url: blogUrl,
        name: `Kho kiến thức dinh dưỡng và giấc ngủ | ${SITE_NAME}`,
        description: 'Các bài viết có nguồn về dinh dưỡng, giấc ngủ và nhịp sống dành cho người trưởng thành.',
        inLanguage: 'vi-VN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${blogUrl}#articles` },
      },
      {
        '@type': 'ItemList',
        '@id': `${blogUrl}#articles`,
        numberOfItems: knowledgeArticles.length,
        itemListElement: knowledgeArticles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: article.title,
          url: `${SITE_URL}/blog/${article.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f3]">
      <Navigation />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      
      <main className="flex-grow pt-36 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-kicker">Kho kiến thức PrymaLab</p><h1 className="mb-5 mt-6 font-[family-name:var(--font-display)] text-4xl font-medium tracking-[-0.035em] text-[#1d4146] md:text-5xl">Hiểu đủ sâu để chọn một thay đổi đúng.</h1>
            <p className="text-[#60767a] leading-8 max-w-2xl mx-auto">Mỗi bài viết trả lời thẳng câu hỏi chính, dẫn nguồn có thể kiểm tra và nói rõ giới hạn — để kiến thức trở thành hành động thực tế.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12" aria-label="Chủ đề kiến thức hiện có">
            {['Dinh dưỡng', 'Giấc ngủ', 'Nhịp sống'].map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-[#d6e1dc] bg-white px-5 py-2 text-sm font-semibold text-[#526a6f]"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link href={`/blog/${blog.slug || blog.id}`} key={blog.id} className="group flex flex-col h-full">
                <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className={`relative h-52 w-full overflow-hidden bg-gradient-to-br ${blog.gradient}`}>
                    <Image src={blog.image} alt={blog.imageAlt} fill sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 30vw" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102f35]/75 via-[#102f35]/10 to-transparent"></div>
                    <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#102f35]/70 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur">{blog.category}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <div className="mb-3">
                      <Badge className="bg-teal-50 text-teal-700 border-teal-100">{blog.category}</Badge>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">{blog.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <span className="font-medium text-gray-900">Ban biên tập PrymaLab Việt Nam</span>
                      <div className="flex items-center space-x-2">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/chinh-sach-bien-tap" className="inline-flex rounded-full bg-[#153339] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0b7f72]">
            Xem chính sách biên tập
            </Link>
            <Link href="/phuong-phap" className="inline-flex rounded-full border border-[#bdd2cc] bg-white px-6 py-3 text-sm font-bold text-[#0b7f72] transition hover:bg-[#eef8f4]">Xem phương pháp tính</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
