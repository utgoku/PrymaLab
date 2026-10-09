import type { EditorialSection, EditorialSource, KnowledgeArticle } from './editorial';

export const ARTICLE_CATEGORIES = ['Giấc ngủ', 'Dinh dưỡng', 'Nhịp sống'] as const;
export const ARTICLE_IMAGES = [
  { path: '/images/sleep_serene.jpg', label: 'Không gian nghỉ ngơi' },
  { path: '/images/nutrition_premium.jpg', label: 'Bữa ăn cân bằng' },
  { path: '/images/hero_wellness.jpg', label: 'Nhịp sống lành mạnh' },
] as const;

export interface ArticleDraft {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: KnowledgeArticle['category'];
  meta_title: string;
  image: string;
  image_alt: string;
  direct_answer: string;
  highlights: string[];
  sources: EditorialSource[];
  is_published: boolean;
  published_at: string | null;
  updated_at?: string;
  read_time?: string;
}

export function articleSlug(title: string) {
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120).replace(/-$/, '');
}

// Only plain text, ## headings and - list items are supported. React escapes all
// author input; scripts and HTML are never interpreted as markup.
export function parseArticleContent(content: string): EditorialSection[] {
  const sections: EditorialSection[] = [];
  let section: EditorialSection = { heading: '', paragraphs: [] };
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) section.paragraphs.push(paragraph.join(' '));
    paragraph = [];
  };
  for (const rawLine of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('## ')) {
      flush();
      if (section.heading || section.paragraphs.length || section.bullets?.length) sections.push(section);
      section = { heading: line.slice(3).trim(), paragraphs: [] };
    } else if (line.startsWith('- ')) {
      flush();
      (section.bullets ??= []).push(line.slice(2).trim());
    } else if (!line) flush();
    else {
      // A paragraph after a list starts a continuation block so rendering never
      // moves that paragraph ahead of the list the author just wrote.
      if (section.bullets?.length) {
        sections.push(section);
        section = { heading: '', paragraphs: [] };
      }
      paragraph.push(line);
    }
  }
  flush();
  if (section.heading || section.paragraphs.length || section.bullets?.length) sections.push(section);
  return sections;
}

export function sectionsToContent(sections: EditorialSection[]) {
  return sections.map((section) => [section.heading && `## ${section.heading}`, ...section.paragraphs,
    section.bullets?.map((line) => `- ${line}`).join('\n')].filter(Boolean).join('\n\n')).join('\n\n');
}

export function draftToArticle(draft: ArticleDraft): KnowledgeArticle {
  const publishedAt = draft.published_at || draft.updated_at || new Date().toISOString();
  const updatedAt = draft.updated_at || publishedAt;
  const words = (draft.content || '').split(/\s+/).filter(Boolean).length;
  return {
    slug: draft.slug, title: draft.title, metaTitle: draft.meta_title || draft.title,
    description: draft.excerpt, directAnswer: draft.direct_answer, category: draft.category,
    publishedAt, updatedAt,
    displayDate: new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(updatedAt)),
    readTime: draft.read_time || `${Math.max(1, Math.ceil(words / 200))} phút đọc`,
    accent: 'from-[#102f35] via-[#17645f] to-[#78b9aa]',
    image: draft.image || ARTICLE_IMAGES[0].path, imageAlt: draft.image_alt,
    highlights: draft.highlights || [], sections: parseArticleContent(draft.content || ''), sources: draft.sources || [],
  };
}

export function validateArticle(input: unknown): Omit<ArticleDraft, 'id' | 'published_at' | 'updated_at'> {
  if (!input || typeof input !== 'object') throw new Error('Nội dung bài viết không hợp lệ.');
  const value = input as Record<string, unknown>;
  const text = (key: string, max: number) => {
    const result = typeof value[key] === 'string' ? (value[key] as string).trim() : '';
    if (result.length > max) throw new Error(`Trường ${key} vượt quá ${max} ký tự.`);
    return result;
  };
  const title = text('title', 180);
  const slug = text('slug', 120);
  const excerpt = text('excerpt', 320);
  const content = text('content', 60000);
  const category = text('category', 40) as ArticleDraft['category'];
  const image = text('image', 240);
  const image_alt = text('image_alt', 240);
  const direct_answer = text('direct_answer', 1200);
  if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Nhập tiêu đề và đường dẫn chỉ gồm chữ thường, số, dấu gạch ngang.');
  if (!ARTICLE_CATEGORIES.includes(category)) throw new Error('Chọn một chủ đề hợp lệ.');
  if (!ARTICLE_IMAGES.some((item) => item.path === image)) throw new Error('Chọn ảnh trong thư viện.');
  if (typeof value.is_published !== 'boolean') throw new Error('Trạng thái bài viết không hợp lệ.');
  const highlights = Array.isArray(value.highlights) ? value.highlights.map((item) => typeof item === 'string' ? item.trim() : '').filter(Boolean) : [];
  if (highlights.length > 5 || highlights.some((item) => item.length > 500)) throw new Error('Tối đa 5 điểm cần nhớ, mỗi điểm không quá 500 ký tự.');
  const sources = Array.isArray(value.sources) ? value.sources.map((source) => {
    if (!source || typeof source !== 'object') throw new Error('Nguồn tham khảo không hợp lệ.');
    const { label, publisher, url } = source;
    if (typeof label !== 'string' || !label.trim() || label.length > 240 || typeof publisher !== 'string' || publisher.length > 200 || typeof url !== 'string' || url.length > 2000) throw new Error('Nhập tên, đơn vị và URL nguồn tham khảo.');
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error('Nguồn tham khảo phải là liên kết HTTP hoặc HTTPS.');
    return { label: label.trim(), publisher: publisher.trim(), url: parsed.toString() };
  }) : [];
  if (sources.length > 20) throw new Error('Tối đa 20 nguồn tham khảo.');
  if (value.is_published && (!excerpt || content.length < 100 || !image_alt)) throw new Error('Trước khi đăng, cần mô tả ngắn, ít nhất 100 ký tự nội dung và mô tả ảnh.');
  return { title, slug, excerpt, content, category, meta_title: text('meta_title', 180), image, image_alt, direct_answer, highlights, sources, is_published: value.is_published };
}
