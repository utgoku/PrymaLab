const siteUrl = 'https://www.prymalab.com';
const key = 'f4c9a8127e6d43b19a05c7d2e8f631ab';
const keyLocation = `${siteUrl}/${key}.txt`;

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Không đọc được sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) {
  throw new Error('Sitemap không chứa URL nào để gửi IndexNow.');
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'www.prymalab.com',
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(`IndexNow từ chối yêu cầu: HTTP ${response.status}`);
}

console.log(`Đã gửi ${urlList.length} URL của prymalab.com tới IndexNow.`);
