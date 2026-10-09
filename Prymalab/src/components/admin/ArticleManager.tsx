'use client';

import { useEffect, useRef, useState } from 'react';
import { BookOpen, ExternalLink, Eye, FilePlus2, Plus, Save, Search, Send, X } from 'lucide-react';
import { ARTICLE_CATEGORIES, ARTICLE_IMAGES, articleSlug, draftToArticle, type ArticleDraft } from '@/lib/article-content';

function blankArticle(): ArticleDraft {
  return { title: '', slug: '', excerpt: '', content: '', category: 'Nhịp sống', meta_title: '', image: ARTICLE_IMAGES[2].path,
    image_alt: '', direct_answer: '', highlights: [], sources: [], is_published: false, published_at: null };
}

const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#cbd8d2] bg-white px-4 py-3 text-base text-[#18373d] outline-none focus:border-[#0b7f72] focus:ring-2 focus:ring-[#0b7f72]/15';
const actionClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-50';

export default function ArticleManager() {
  const [articles, setArticles] = useState<ArticleDraft[]>([]);
  const [draft, setDraft] = useState<ArticleDraft | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/articles', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Không thể tải bài viết.');
        if (!cancelled) setArticles(data.articles);
      })
      .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : 'Không thể tải bài viết.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  function edit(value: ArticleDraft) {
    if (dirty && !window.confirm('Bạn có thay đổi chưa lưu. Bỏ thay đổi để mở bài khác?')) return;
    setDraft({ ...value, content: value.content || '', highlights: value.highlights || [], sources: value.sources || [] });
    setDirty(false); setPreview(false); setMessage(''); setError('');
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  function change(changes: Partial<ArticleDraft>) {
    setDraft((current) => current ? { ...current, ...changes } : current);
    setDirty(true); setMessage('');
  }

  async function save(published: boolean) {
    if (!draft) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/admin/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draft, is_published: published }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lưu bài viết.');
      setDraft(data.article); setDirty(false);
      setArticles((current) => [data.article, ...current.filter((item) => item.id !== data.article.id)]);
      setMessage(published ? 'Đã đăng. Bài viết có trong mục Kiến thức, sitemap và RSS.' : 'Đã lưu nháp. Chỉ quản trị viên nhìn thấy bài này.');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Không thể lưu bài viết.'); }
    finally { setSaving(false); }
  }

  const visible = articles.filter((item) => (filter === 'all' || (filter === 'published' ? item.is_published : !item.is_published))
    && `${item.title} ${item.slug} ${item.category}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')));
  const article = draft ? draftToArticle(draft) : null;

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d9e3dd] bg-white p-6 sm:flex-row sm:items-center">
      <div><h2 className="text-xl font-semibold">Nơi viết và đăng bài</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f7478]">Lưu nháp khi đang viết. Khi đăng, bài xuất hiện trên website ngay, không cần triển khai lại.</p></div>
      <button type="button" onClick={() => edit(blankArticle())} className={`${actionClass} shrink-0 bg-[#153339] text-white`}><FilePlus2 className="h-4 w-4" /> Viết bài mới</button>
    </div>

    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{message}</p>}

    <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><label className="relative"><span className="sr-only">Tìm bài viết</span><Search className="absolute left-4 top-4 h-4 w-4 text-[#718589]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tiêu đề hoặc chủ đề…" className={`${fieldClass} mt-0 pl-11`} /></label><select aria-label="Lọc trạng thái bài viết" value={filter} onChange={(event) => setFilter(event.target.value)} className={`${fieldClass} mt-0 sm:w-48`}><option value="all">Tất cả ({articles.length})</option><option value="published">Đã đăng</option><option value="draft">Bản nháp</option></select></div>

    <div className="overflow-hidden rounded-2xl border border-[#d9e3dd] bg-white">
      {loading ? <p className="p-6 text-sm" role="status">Đang tải bài viết…</p> : visible.length ? visible.map((item) => <div key={item.id} className="flex flex-col gap-4 border-b border-[#e3eae6] p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={() => edit(item)} className="min-w-0 text-left"><span className="block text-base font-semibold text-[#153339]">{item.title}</span><span className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#657a7e]"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{item.is_published ? 'Đã đăng' : 'Bản nháp'}</span>{item.category}{item.updated_at && <time dateTime={item.updated_at}>{new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(item.updated_at))}</time>}</span></button>
        <div className="flex shrink-0 gap-4"><button type="button" onClick={() => edit(item)} className="min-h-11 text-sm font-semibold text-[#0b7f72]">Chỉnh sửa</button>{item.is_published && <a href={`/blog/${item.slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#526a6f]">Xem bài <ExternalLink className="h-4 w-4" /></a>}</div>
      </div>) : <p className="p-6 text-sm text-[#657a7e]">Chưa có bài phù hợp. Bạn có thể bắt đầu bằng “Viết bài mới”.</p>}
    </div>

    {draft && article && <div ref={editorRef} className="scroll-mt-6 rounded-2xl border border-[#d9e3dd] bg-white p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">{draft.id ? 'Chỉnh sửa bài viết' : 'Bài viết mới'}{dirty && <span className="ml-3 text-sm font-normal text-amber-800">Chưa lưu</span>}</h2><button type="button" onClick={() => setPreview(!preview)} className={`${actionClass} border border-[#cbd8d2]`}><Eye className="h-4 w-4" />{preview ? 'Tiếp tục viết' : 'Xem trước'}</button></div>
      {preview ? <article className="article-body mx-auto max-w-3xl rounded-2xl bg-[#f6f8f4] p-6 sm:p-8">
        <p className="text-sm font-semibold text-[#0b7f72]">Xem trước · {article.category}</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">{article.title || 'Tiêu đề bài viết'}</h1><p className="mt-5 text-lg text-[#526a6f]">{article.description}</p>
        {article.directAnswer && <p className="mt-6 rounded-xl border border-[#cbded4] bg-white p-5">{article.directAnswer}</p>}
        {!!article.highlights.length && <ul className="mt-6 list-disc space-y-2 pl-5">{article.highlights.map((line, index) => <li key={index}>{line}</li>)}</ul>}
        {article.sections.map((section, index) => <section key={index} className="mt-8">{section.heading && <h2 className="mb-4 text-2xl font-semibold">{section.heading}</h2>}{section.paragraphs.map((paragraph, p) => <p className="mb-4" key={p}>{paragraph}</p>)}{section.bullets && <ul className="list-disc space-y-2 pl-5">{section.bullets.map((line, b) => <li key={b}>{line}</li>)}</ul>}</section>)}
        {!!article.sources.length && <section className="mt-8 border-t pt-6"><h2 className="text-xl font-semibold">Nguồn tham khảo</h2>{article.sources.map((source, index) => <p key={index} className="mt-3 break-words text-sm">{source.label} — {source.publisher}<br />{source.url}</p>)}</section>}
      </article> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)]">
        <div className="space-y-5">
          <label className="block text-sm font-semibold">Tiêu đề<input maxLength={180} value={draft.title} onChange={(event) => change({ title: event.target.value, ...(!draft.id ? { slug: articleSlug(event.target.value) } : {}) })} className={fieldClass} placeholder="Một câu hỏi người đọc đang quan tâm" /></label>
          <label className="block text-sm font-semibold">Mô tả ngắn<textarea maxLength={320} rows={3} value={draft.excerpt} onChange={(event) => change({ excerpt: event.target.value })} className={fieldClass} placeholder="2–3 câu giới thiệu nội dung, dùng cho Google và danh sách bài." /><span className="mt-1 block text-xs font-normal text-[#657a7e]">{draft.excerpt.length}/320 ký tự</span></label>
          <label className="block text-sm font-semibold">Nội dung bài<textarea maxLength={60000} rows={20} value={draft.content} onChange={(event) => change({ content: event.target.value })} className={`${fieldClass} leading-8`} placeholder={'Viết đoạn mở đầu tại đây.\n\n## Tiêu đề phần\n\nMỗi đoạn cách nhau một dòng trống.\n\n- Ý thứ nhất\n- Ý thứ hai'} /><span className="mt-2 block text-sm font-normal leading-6 text-[#657a7e]">Dùng ## ở đầu dòng cho tiêu đề phần; dùng - cho danh sách. Để trống một dòng giữa các đoạn. Nút Xem trước cho biết cách bài sẽ hiển thị.</span></label>
          <label className="block text-sm font-semibold">Tóm tắt câu trả lời <span className="font-normal text-[#657a7e]">(không bắt buộc)</span><textarea rows={3} maxLength={1200} value={draft.direct_answer} onChange={(event) => change({ direct_answer: event.target.value })} className={fieldClass} /></label>
          <label className="block text-sm font-semibold">Các điểm cần nhớ <span className="font-normal text-[#657a7e]">(mỗi dòng một ý, tối đa 5)</span><textarea rows={4} value={draft.highlights.join('\n')} onChange={(event) => change({ highlights: event.target.value.split('\n') })} className={fieldClass} /></label>
        </div>
        <div className="space-y-5">
          <label className="block text-sm font-semibold">Chủ đề<select value={draft.category} onChange={(event) => change({ category: event.target.value as ArticleDraft['category'] })} className={fieldClass}>{ARTICLE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="block text-sm font-semibold">Đường dẫn bài<input maxLength={120} readOnly={Boolean(draft.published_at)} value={draft.slug} onChange={(event) => change({ slug: articleSlug(event.target.value) })} className={`${fieldClass} read-only:bg-[#f3f6f2]`} /><span className="mt-2 block break-all text-xs font-normal text-[#657a7e]">/blog/{draft.slug || 'ten-bai-viet'}{draft.published_at && ' · Đã cố định sau lần đăng đầu tiên.'}</span></label>
          <label className="block text-sm font-semibold">Tiêu đề trên Google <span className="font-normal text-[#657a7e]">(tùy chọn)</span><input maxLength={180} value={draft.meta_title} onChange={(event) => change({ meta_title: event.target.value })} className={fieldClass} placeholder="Để trống để dùng tiêu đề bài" /></label>
          <label className="block text-sm font-semibold">Ảnh bìa<select value={draft.image} onChange={(event) => change({ image: event.target.value })} className={fieldClass}>{ARTICLE_IMAGES.map((image) => <option key={image.path} value={image.path}>{image.label}</option>)}</select></label>
          <label className="block text-sm font-semibold">Mô tả ảnh<input maxLength={240} value={draft.image_alt} onChange={(event) => change({ image_alt: event.target.value })} className={fieldClass} placeholder="Mô tả điều người đọc thấy trong ảnh" /></label>
          <div className="rounded-xl bg-[#f3f6f2] p-4"><h3 className="text-sm font-semibold">Nguồn tham khảo</h3><p className="mt-2 text-sm leading-6 text-[#5f7478]">Với nội dung sức khỏe, dẫn nguồn gốc để người đọc kiểm tra.</p>
            {draft.sources.map((source, index) => <div key={index} className="mt-4 border-t border-[#d6e0da] pt-4">
              <div className="flex items-center justify-between"><span className="text-xs font-semibold">Nguồn {index + 1}</span><button type="button" aria-label={`Bỏ nguồn ${index + 1}`} onClick={() => change({ sources: draft.sources.filter((_, i) => i !== index) })} className="flex h-11 w-11 items-center justify-center"><X className="h-4 w-4" /></button></div>
              {(['label', 'publisher', 'url'] as const).map((key) => <label key={key} className="mt-3 block text-xs font-semibold">{key === 'label' ? 'Tên tài liệu' : key === 'publisher' ? 'Đơn vị xuất bản' : 'Liên kết nguồn'}<input value={source[key]} onChange={(event) => change({ sources: draft.sources.map((item, i) => i === index ? { ...item, [key]: event.target.value } : item) })} className={fieldClass} /></label>)}
            </div>)}
            <button type="button" disabled={draft.sources.length >= 20} onClick={() => change({ sources: [...draft.sources, { label: '', publisher: '', url: '' }] })} className={`${actionClass} mt-3 text-[#0b7f72]`}><Plus className="h-4 w-4" /> Thêm nguồn</button>
          </div>
          <a href="/chinh-sach-bien-tap" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b7f72]"><BookOpen className="h-4 w-4" /> Xem chính sách biên tập</a>
        </div>
      </div>}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-[#d9e3dd] bg-white/95 py-4 backdrop-blur">
        <button type="button" disabled={saving} onClick={() => { if (draft.is_published && !window.confirm('Gỡ bài khỏi website và chuyển về bản nháp? Bạn có thể đăng lại sau.')) return; void save(false); }} className={`${actionClass} border border-[#cbd8d2]`}><Save className="h-4 w-4" />{draft.is_published ? 'Chuyển về nháp' : 'Lưu nháp'}</button>
        <button type="button" disabled={saving} onClick={() => void save(true)} className={`${actionClass} bg-[#153339] text-white`}><Send className="h-4 w-4" />{saving ? 'Đang lưu…' : draft.is_published ? 'Cập nhật bài đã đăng' : 'Đăng bài'}</button>
        {draft.is_published && <a href={`/blog/${draft.slug}`} target="_blank" rel="noreferrer" className={`${actionClass} text-[#0b7f72]`}>Mở bài trên website <ExternalLink className="h-4 w-4" /></a>}
      </div>
    </div>}
  </div>;
}
