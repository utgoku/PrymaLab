'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import type { KnowledgeArticle } from '@/lib/editorial';
import { ARTICLE_CATEGORIES } from '@/lib/article-content';

export default function ArticleLibrary({ articles }: { articles: KnowledgeArticle[] }) {
  const [category, setCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(9);
  const filtered = useMemo(() => articles.filter((article) => (category === 'Tất cả' || article.category === category)
    && `${article.title} ${article.description}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi').trim())), [articles, category, search]);
  return <div>
    <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2" aria-label="Lọc bài theo chủ đề">{['Tất cả', ...ARTICLE_CATEGORIES].map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setLimit(9); }} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold transition ${category === item ? 'border-[#153339] bg-[#153339] text-white' : 'border-[#d2ded7] bg-white text-[#526a6f] hover:border-[#0b7f72]'}`}>{item}</button>)}</div>
      <label className="relative block lg:w-80"><span className="sr-only">Tìm bài viết</span><Search className="absolute left-4 top-4 h-4 w-4 text-[#657a7e]" aria-hidden="true" /><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setLimit(9); }} placeholder="Tìm điều bạn muốn đọc…" className="min-h-12 w-full rounded-full border border-[#d2ded7] bg-white py-3 pl-11 pr-4 text-base outline-none focus:border-[#0b7f72]" /></label>
    </div>
    <p role="status" className="sr-only">{filtered.length} bài viết phù hợp</p>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.slice(0, limit).map((article) => <Link href={`/blog/${article.slug}`} key={article.slug} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#dbe4df] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#dfe8e3]"><Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 30vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /></div>
      <div className="flex flex-1 flex-col p-6"><p className="text-sm font-semibold text-[#0b7f72]">{article.category}</p><h2 className="mt-3 text-xl font-semibold leading-snug text-[#18373d] group-hover:text-[#0b7f72]">{article.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-7 text-[#5f7478]">{article.description}</p><div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-sm text-[#657a7e]"><time dateTime={article.updatedAt}>{article.displayDate}</time><span>{article.readTime}</span><ArrowUpRight className="h-4 w-4 text-[#0b7f72]" aria-hidden="true" /></div></div>
    </Link>)}</div>
    {!filtered.length && <div className="rounded-3xl border border-[#dbe4df] bg-white px-6 py-16 text-center"><h2 className="text-xl font-semibold">Chưa tìm thấy bài phù hợp</h2><p className="mt-3 text-[#657a7e]">Thử một từ khóa khác hoặc xem tất cả chủ đề.</p><button type="button" className="mt-6 min-h-11 font-semibold text-[#0b7f72]" onClick={() => { setSearch(''); setCategory('Tất cả'); }}>Xem tất cả bài viết</button></div>}
    {filtered.length > limit && <div className="mt-10 text-center"><button type="button" onClick={() => setLimit(limit + 9)} className="min-h-12 rounded-full border border-[#bdd2cc] bg-white px-7 text-sm font-semibold text-[#0b7f72]">Xem thêm bài viết</button></div>}
  </div>;
}
