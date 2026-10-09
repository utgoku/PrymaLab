import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
async function tsModule(path, imports = {}) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  let { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  for (const [from, to] of Object.entries(imports)) outputText = outputText.replaceAll(`'${from}'`, `'${to}'`);
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}

const { articleSlug, parseArticleContent, sectionsToContent, validateArticle } = await import(await tsModule('../src/lib/article-content.ts'));
const errors = await tsModule('../src/lib/errors.ts');
const { POST: createSleepLog } = await import(await tsModule('../src/app/api/sleep-log/route.ts', {
  '@/lib/errors': errors,
  'next/server': pathToFileURL(require.resolve('next/server')).href,
}));

function validArticle() {
  return {
    title: 'Bữa ăn có nhịp', slug: 'bua-an-co-nhip', category: 'Nhịp sống',
    excerpt: 'Một thay đổi vừa sức cho ngày bận rộn.', content: 'Nội dung để người đọc tham khảo. '.repeat(5),
    image: '/images/hero_wellness.jpg', image_alt: 'Bữa ăn và không gian nghỉ ngơi',
    highlights: [], sources: [], is_published: true,
  };
}

test('Vietnamese titles produce valid stable URL slugs', () => {
  assert.equal(articleSlug('  Đều đặn: Ăn & ngủ!  '), 'deu-dan-an-ngu');
  const slug = articleSlug('a'.repeat(119) + ' b');
  assert.ok(slug.length <= 120 && !slug.endsWith('-'));
});

test('Mixed paragraphs and lists preserve the author’s order and round-trip', () => {
  const source = '## Mở đầu\n\nĐoạn trước.\n\n- Ý một\n- Ý hai\n\nĐoạn sau.\n\n- Ý ba\n\nKết thúc.\n\n## Phần hai\n\nTiếp tục.';
  const sections = parseArticleContent(source);
  assert.deepEqual(sections.flatMap(s => [...s.paragraphs, ...(s.bullets || [])]), ['Đoạn trước.', 'Ý một', 'Ý hai', 'Đoạn sau.', 'Ý ba', 'Kết thúc.', 'Tiếp tục.']);
  assert.deepEqual(parseArticleContent(sectionsToContent(sections)), sections);
});

test('Plain author text never becomes HTML markup in the parser', () => {
  const source = '<script>alert("hello")</script>';
  assert.deepEqual(parseArticleContent(source)[0].paragraphs, [source]);
});

test('Drafts may be incomplete but publishing requires description, body and image text', () => {
  const draft = { ...validArticle(), excerpt: '', content: '', image_alt: '', is_published: false };
  assert.equal(validateArticle(draft).is_published, false);
  assert.throws(() => validateArticle({ ...draft, is_published: true }), /Trước khi đăng/);
  assert.equal(validateArticle(validArticle()).is_published, true);
});

test('Article boundaries reject invalid categories, slugs and publishing state', () => {
  assert.throws(() => validateArticle({ ...validArticle(), category: 'Unknown' }), /chủ đề/);
  assert.throws(() => validateArticle({ ...validArticle(), slug: '../private' }), /đường dẫn/);
  assert.throws(() => validateArticle({ ...validArticle(), is_published: 'false' }), /Trạng thái/);
  assert.throws(() => validateArticle({ ...validArticle(), content: 'x'.repeat(60001) }), /vượt quá/);
});

test('Sources allow HTTP/S and reject executable or credentialed URLs', () => {
  const source = { label: 'Tài liệu', publisher: 'Đơn vị xuất bản', url: 'https://example.com/source' };
  assert.equal(validateArticle({ ...validArticle(), sources: [source] }).sources.length, 1);
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'https://user:password@example.com']) {
    assert.throws(() => validateArticle({ ...validArticle(), sources: [{ ...source, url }] }));
  }
});

function sleepRequest(changes = {}) {
  return new Request('https://example.com/api/sleep-log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logDate: '2026-10-09', bedTime: '22:30', wakeTime: '06:30', qualityRating: 4, ...changes }) });
}

test('An overnight sleep log ends on the following day', async () => {
  const response = await createSleepLog(sleepRequest());
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(new Date(data.wakeTime) - new Date(data.bedTime), 8 * 60 * 60 * 1000);
});

test('A same-day sleep log and invalid quality are handled correctly', async () => {
  const response = await createSleepLog(sleepRequest({ bedTime: '13:00', wakeTime: '14:00' }));
  const { data } = await response.json();
  assert.equal(new Date(data.wakeTime) - new Date(data.bedTime), 60 * 60 * 1000);
  assert.equal((await createSleepLog(sleepRequest({ qualityRating: 6 }))).status, 400);
});
