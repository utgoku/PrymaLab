import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasAdminSession } from '@/lib/admin-session';
import { getAdminSupabase } from '@/lib/supabase-admin';
import { validateArticle } from '@/lib/article-content';

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Vui lòng đăng nhập quản trị.' }, { status: 401 });
  const { data, error } = await getAdminSupabase().from('blog_posts').select('*').order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Chưa thể tải danh sách bài viết.' }, { status: 503 });
  return NextResponse.json({ articles: data }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Vui lòng đăng nhập quản trị.' }, { status: 401 });
  const origin = request.headers.get('origin');
  const requestUrl = new URL(request.url);
  const host = request.headers.get('host') || requestUrl.host;
  const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim() || requestUrl.protocol.replace(':', '');
  if (origin && origin !== `${protocol}://${host}`) return NextResponse.json({ error: 'Nguồn yêu cầu không hợp lệ.' }, { status: 403 });
  const body = await request.text();
  if (body.length > 100000) return NextResponse.json({ error: 'Bài viết quá dài.' }, { status: 413 });
  let input;
  let article;
  try { input = JSON.parse(body); article = validateArticle(input); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Dữ liệu không hợp lệ.' }, { status: 400 }); }
  const client = getAdminSupabase();
  const now = new Date().toISOString();
  let existing = null;
  if (input.id !== undefined) {
    if (!Number.isSafeInteger(input.id) || input.id < 1) return NextResponse.json({ error: 'Mã bài không hợp lệ.' }, { status: 400 });
    const result = await client.from('blog_posts').select('id, slug, published_at, updated_at').eq('id', input.id).maybeSingle();
    if (result.error) return NextResponse.json({ error: 'Chưa thể tải bài viết.' }, { status: 503 });
    existing = result.data;
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy bài viết.' }, { status: 404 });
    if (existing.published_at && existing.slug !== article.slug) return NextResponse.json({ error: 'Giữ nguyên đường dẫn của bài đã đăng để các liên kết cũ tiếp tục hoạt động.' }, { status: 400 });
    if (input.updated_at !== existing.updated_at) return NextResponse.json({ error: 'Bài đã được sửa ở cửa sổ khác. Tải lại danh sách trước khi lưu.' }, { status: 409 });
  }
  const record = { ...article, read_time: `${Math.max(1, Math.ceil(article.content.split(/\s+/).filter(Boolean).length / 200))} phút đọc`, author: 'Ban biên tập PrymaLab Việt Nam', updated_at: now,
    published_at: existing?.published_at || (article.is_published ? now : null),
    published_date: existing?.published_at || (article.is_published ? now : ''),
  };
  const query = existing
    ? client.from('blog_posts').update(record).eq('id', existing.id).eq('updated_at', existing.updated_at)
    : client.from('blog_posts').insert(record);
  const { data, error } = await query.select().maybeSingle();
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Đường dẫn này đã được dùng. Hãy chọn đường dẫn khác.' : 'Chưa lưu được bài viết. Vui lòng thử lại.' }, { status: error.code === '23505' ? 409 : 503 });
  if (!data) return NextResponse.json({ error: 'Bài đã thay đổi ở cửa sổ khác. Tải lại trước khi lưu.' }, { status: 409 });
  for (const path of ['/', '/blog', `/blog/${article.slug}`, '/sitemap.xml', '/rss.xml']) revalidatePath(path);
  return NextResponse.json({ article: data }, { headers: { 'Cache-Control': 'no-store' } });
}
