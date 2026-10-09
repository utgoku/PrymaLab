// Integration check against a local server. Creates one isolated temporary
// article in the configured database and removes only that exact fixture.
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const base = new URL(process.argv[2] || 'http://localhost:3100');
assert(['localhost', '127.0.0.1'].includes(base.hostname), 'Run this check only against the local server.');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const publicClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
let cookie = '';
let fixture;
const slug = `kiem-thu-bai-viet-${Date.now()}`;
async function request(path, body, authenticated = true) {
  const response = await fetch(new URL(path, base), { method: body ? 'POST' : 'GET', headers: { ...(body ? { 'Content-Type': 'application/json', Origin: base.origin } : {}), ...(authenticated && cookie ? { Cookie: cookie } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return response;
}
try {
  assert.equal((await request('/api/admin/articles', null, false)).status, 401);
  assert.equal((await request('/api/admin/articles', { title: 'unauthorized' }, false)).status, 401);
  const login = await request('/api/admin/session', { password: process.env.PRYMALAB_ADMIN_PASSWORD });
  assert.equal(login.status, 200);
  cookie = login.headers.get('set-cookie')?.split(';')[0];
  assert(cookie);
  const articles = await request('/api/admin/articles');
  assert.equal(articles.status, 200);
  assert((await articles.json()).articles.length >= 6);
  const draft = { title: 'Bài kiểm thử tạm thời', slug, excerpt: 'Nội dung kiểm thử chức năng lưu nháp, đăng và gỡ bài.', category: 'Nhịp sống', content: '## Nội dung kiểm thử\n\nĐây là dữ liệu kiểm thử tự động, được gỡ sau khi xác nhận luồng đăng bài. Không phải bài tư vấn hoặc hướng dẫn sức khỏe.\n\n- Ý thứ nhất\n- Ý thứ hai', image: '/images/hero_wellness.jpg', image_alt: 'Ảnh thư viện dùng để kiểm thử', direct_answer: '', highlights: [], sources: [], meta_title: 'Bài kiểm thử tạm thời', is_published: false, published_at: null };
  const created = await request('/api/admin/articles', draft);
  assert.equal(created.status, 200, await created.clone().text());
  fixture = (await created.json()).article;
  assert.equal(fixture.is_published, false);
  {
    const hiddenPage = await request(`/blog/${slug}`, null, false);
    const html = await hiddenPage.text();
    assert([200, 404].includes(hiddenPage.status)); // Next.js streamed not-found responses can return 200.
    assert(html.includes('NEXT_HTTP_ERROR_FALLBACK;404') || hiddenPage.status === 404);
    assert(html.includes('noindex'));
    assert(!html.includes('Bài kiểm thử tạm thời'));
  }
  const hidden = await publicClient.from('blog_posts').select('id').eq('id', fixture.id);
  assert.deepEqual(hidden.data, []);
  console.log('PASS: authentication, saved draft and public draft isolation');
  assert.equal((await request('/api/admin/articles', { ...fixture, sources: [{ label: 'Unsafe', publisher: '', url: 'javascript:alert(1)' }] })).status, 400);
  assert.equal((await request('/api/admin/articles', { ...fixture, is_published: true, content: '' })).status, 400);
  assert.equal((await request('/api/admin/articles', { ...fixture, updated_at: '2000-01-01T00:00:00Z' })).status, 409);
  const forbiddenOrigin = await fetch(new URL('/api/admin/articles', base), { method: 'POST', headers: { Cookie: cookie, Origin: 'https://example.org', 'Content-Type': 'application/json' }, body: JSON.stringify(fixture) });
  assert.equal(forbiddenOrigin.status, 403);
  console.log('PASS: input validation, source URL validation, concurrent edits and request origin');
  const published = await request('/api/admin/articles', { ...fixture, is_published: true });
  assert.equal(published.status, 200, await published.clone().text());
  fixture = (await published.json()).article;
  const page = await request(`/blog/${slug}`, null, false);
  assert.equal(page.status, 200);
  assert((await page.text()).includes('Bài kiểm thử tạm thời'));
  for (const path of ['/blog', '/', '/sitemap.xml', '/rss.xml']) assert((await (await request(path, null, false)).text()).includes(slug), `${path} must include the published article`);
  console.log('PASS: publishing, article detail, library, homepage, sitemap and RSS');
  const unpublished = await request('/api/admin/articles', { ...fixture, is_published: false });
  assert.equal(unpublished.status, 200);
  fixture = (await unpublished.json()).article;
  {
    const hiddenPage = await request(`/blog/${slug}`, null, false);
    const html = await hiddenPage.text();
    assert([200, 404].includes(hiddenPage.status)); // Next.js streamed not-found responses can return 200.
    assert(html.includes('NEXT_HTTP_ERROR_FALLBACK;404') || hiddenPage.status === 404);
    assert(html.includes('noindex'));
    assert(!html.includes('Bài kiểm thử tạm thời'));
  }
  assert(!(await (await request('/sitemap.xml', null, false)).text()).includes(slug));
  assert(!(await (await request('/rss.xml', null, false)).text()).includes(slug));
  assert.equal((await request('/api/admin/articles', { ...fixture, slug: `${slug}-changed` })).status, 400);
  console.log('PASS: unpublishing, sitemap/RSS removal and stable published URLs');
} finally {
  if (fixture?.id) {
    const { error } = await client.from('blog_posts').delete().eq('id', fixture.id).eq('slug', slug);
    if (error) throw new Error('Temporary article cleanup failed.');
    console.log('CLEANUP: removed only the temporary test article');
  }
}
