const baseUrl = new URL(process.argv[2] || process.env.SEO_BASE_URL || 'https://prymalab.com');
const failures = [];
const warnings = [];

function check(condition, message, level = 'error') {
  if (condition) return;
  (level === 'warning' ? warnings : failures).push(message);
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/$/, '');
  return url.toString();
}

async function get(path) {
  const url = new URL(path, baseUrl);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'PrymaLab-SEO-Audit/1.0 (+https://prymalab.com)' },
  });
  return { url, response, text: await response.text() };
}

function content(html, pattern) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

async function main() {
  console.log(`SEO audit: ${baseUrl.origin}`);

  const robots = await get('/robots.txt');
  check(robots.response.ok, `robots.txt trả ${robots.response.status}`);
  check(/sitemap:\s*https:\/\/prymalab\.com\/sitemap\.xml/i.test(robots.text), 'robots.txt thiếu sitemap canonical');
  check(/user-agent:\s*OAI-SearchBot[\s\S]*?allow:\s*\//i.test(robots.text), 'OAI-SearchBot chưa được allow', 'warning');
  check(/user-agent:\s*GPTBot[\s\S]*?disallow:\s*\//i.test(robots.text), 'Chính sách training GPTBot chưa rõ', 'warning');

  const sitemap = await get('/sitemap.xml');
  check(sitemap.response.ok, `sitemap.xml trả ${sitemap.response.status}`);
  const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  check(urls.length > 0, 'Sitemap không có URL');
  check(new Set(urls).size === urls.length, 'Sitemap có URL trùng');
  urls.forEach((value) => check(new URL(value).origin === baseUrl.origin, `Sitemap chứa origin khác: ${value}`));

  const titles = new Map();
  for (const value of urls) {
    const page = await get(value);
    const label = new URL(value).pathname;
    check(page.response.status === 200, `${label}: HTTP ${page.response.status}`);
    check(!/noindex/i.test(page.response.headers.get('x-robots-tag') || ''), `${label}: X-Robots-Tag noindex`);
    check(!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(page.text), `${label}: meta noindex`);

    const title = content(page.text, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = content(page.text, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
      || content(page.text, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    const canonical = content(page.text, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
      || content(page.text, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    const h1Count = (page.text.match(/<h1\b/gi) || []).length;

    check(title.length >= 20 && title.length <= 75, `${label}: title dài ${title.length} ký tự`);
    check(description.length >= 70 && description.length <= 180, `${label}: meta description dài ${description.length} ký tự`);
    check(Boolean(canonical), `${label}: thiếu canonical`);
    if (canonical) check(normalizeUrl(canonical) === normalizeUrl(value), `${label}: canonical lệch (${canonical})`);
    check(h1Count === 1, `${label}: có ${h1Count} thẻ H1`);
    check(!/H\s*&\s*T/i.test(`${title} ${description}`), `${label}: còn thương hiệu H&T`);

    if (titles.has(title)) failures.push(`${label}: title trùng với ${titles.get(title)}`);
    else titles.set(title, label);

    for (const match of page.text.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(match[1]); } catch { failures.push(`${label}: JSON-LD không parse được`); }
    }
  }

  const home = await get('/');
  ['strict-transport-security', 'content-security-policy', 'x-content-type-options', 'referrer-policy']
    .forEach((header) => check(Boolean(home.response.headers.get(header)), `Homepage thiếu header ${header}`));

  console.log(`Đã kiểm tra ${urls.length} URL trong sitemap.`);
  warnings.forEach((message) => console.warn(`WARN: ${message}`));
  failures.forEach((message) => console.error(`FAIL: ${message}`));
  if (failures.length) {
    console.error(`SEO audit thất bại: ${failures.length} lỗi, ${warnings.length} cảnh báo.`);
    process.exitCode = 1;
  } else {
    console.log(`SEO audit đạt: 0 lỗi, ${warnings.length} cảnh báo.`);
  }
}

main().catch((error) => {
  console.error('SEO audit không chạy được:', error);
  process.exitCode = 1;
});
