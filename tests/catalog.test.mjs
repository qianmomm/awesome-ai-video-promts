import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ROOT, canonicalURL, validateCases, loadCases, generateOutputs, detail, draft, importRows, build, json } from '../scripts/catalog.mjs';
import { validateSchema, validURL, validDate } from '../scripts/schema.mjs';

const { cases, schema } = await loadCases();
const sample = cases.find(c => c.id === 'veo-standup-fofr');
const clone = () => structuredClone(sample);
const readme = await fs.readFile(path.join(ROOT, 'README.md'), 'utf8');

async function temporary(t, records = [sample]) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-video-catalog-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  for (const dir of ['schema', 'data/cases', 'data/candidates']) await fs.mkdir(path.join(root, dir), { recursive: true });
  await fs.writeFile(path.join(root, 'schema/case.schema.json'), json(schema));
  await fs.writeFile(path.join(root, 'README.md'), readme);
  for (const c of records) await fs.writeFile(path.join(root, 'data/cases', `${c.id}.json`), json(c));
  return root;
}

test('new or undisclosed video models are valid; tools retain separate roles', () => {
  const c = clone();
  c.platform = '尚未出现的新平台';
  c.models = [{ name: '未来模型 / β', version: null, role: 'video_generation', evidence_url: c.prompt.source_url }, { name: '一个图像模型', version: null, role: 'image_generation', evidence_url: c.prompt.source_url }];
  assert.deepEqual(validateCases([c], schema), []);
  const output = generateOutputs([c], readme);
  assert.match(output.get('README.md'), /未来模型/);
  assert.doesNotMatch(output.get('README.md'), /一个图像模型/);
  assert.match(output.get(`docs/cases/${c.id}.md`), /一个图像模型/);
  c.models = [];
  assert.deepEqual(validateCases([c], schema), []);
  assert.match(generateOutputs([c], readme).get('README.md'), /模型未公开/);
});

test('pending and rejected entries never appear in public pages or catalog export', () => {
  const pending = draft({ url: 'https://example.com/pending', title: 'PRIVATE_MARKER' });
  const rejected = draft({ url: 'https://example.com/rejected', title: 'REJECTED_MARKER' });
  rejected.review.status = 'rejected';
  const outputs = generateOutputs([sample, pending, rejected], readme);
  assert.equal(JSON.parse(outputs.get('data/catalog.json')).cases.length, 1);
  for (const value of outputs.values()) assert.doesNotMatch(value, /PRIVATE_MARKER|REJECTED_MARKER/);
});

test('source URL aliases deduplicate but independent demonstrations remain distinct', () => {
  const pairs = [
    ['https://twitter.com/name/status/123?s=20', 'https://x.com/another/status/123/video/1'],
    ['https://www.youtube.com/watch?v=abcdef&si=x&t=20', 'https://youtu.be/abcdef?si=y'],
    ['https://youtube.com/shorts/abcdef', 'https://youtube.com/watch?v=abcdef'],
    ['https://www.reddit.com/r/demo/comments/abc123/some_title/?context=3', 'https://redd.it/abc123'],
    ['https://example.com/work/?utm_source=x', 'https://example.com/work']
  ];
  for (const [a, b] of pairs) assert.equal(canonicalURL(a), canonicalURL(b));
  const c = clone(), other = clone();
  other.id = 'separate-id';
  other.source.url = c.source.url.replace('x.com', 'twitter.com') + '?s=20';
  assert.ok(validateCases([c, other], schema).some(e => /duplicate work/.test(e)));
  other.source.item_key = 'different-demo';
  assert.deepEqual(validateCases([c, other], schema), []);
});

test('source access, approval, playback and reproduction require independent evidence', () => {
  for (const [edit, pattern] of [
    [c => { c.verification.level = 'secondary'; }, /primary evidence/],
    [c => { c.verification.level = 'primary'; c.source.access = 'inaccessible'; }, /accessible original/],
    [c => { c.verification.ai_evidence = ''; }, /AI video/],
    [c => { c.video.playback = 'verified'; }, /date and viewing notes/],
    [c => { c.reproduction.status = 'reproduced'; }, /output evidence/],
    [c => { c.rights.status = 'permission_granted'; }, /permission requires evidence/],
    [c => { c.review.reviewed_at = null; }, /dated review/]
  ]) {
    const c = clone(); edit(c);
    assert.ok(validateCases([c], schema).some(e => pattern.test(e)), String(pattern));
  }
});

test('partial, excerpt and link-only prompts are not silently promoted to full prompts', () => {
  for (const status of ['partial', 'excerpt', 'link_only', 'not_found', 'not_public']) {
    const c = clone(); c.prompt.status = status;
    if (['link_only', 'not_found', 'not_public'].includes(status)) {
      c.prompt.original = null; c.prompt.translation_zh = null; c.prompt.language = null;
    }
    c.references = [{ kind: 'first_frame', url: null, status: 'missing', notes: 'Input not acquired.' }];
    assert.deepEqual(validateCases([c], schema), []);
    assert.equal(JSON.parse(generateOutputs([c], readme).get('data/catalog.json')).cases[0].prompt.status, status);
    assert.match(detail(c), /未取得素材链接/);
  }
  const c = clone(); c.prompt.original = null;
  assert.ok(validateCases([c], schema).some(e => /requires original/.test(e)));
  c.prompt.status = 'not_found';
  assert.ok(validateCases([c], schema).some(e => /cannot have a translation/.test(e)));
});

test('copyable prompt fences preserve original bytes and contain embedded Markdown/HTML', () => {
  const c = clone();
  c.prompt.original = '<script>alert(1)</script>\n![x](https://example.com/tracker)\n```\n# malicious heading\n> nested';
  const before = c.prompt.original;
  const outputs = generateOutputs([c], readme);
  const page = outputs.get(`docs/cases/${c.id}.md`);
  assert.ok(page.includes('````text\n' + before + '\n````'));
  const body = page.split('````text\n')[1].split('\n````')[0];
  assert.equal(body, before);
  assert.equal(c.prompt.original, before);
  assert.equal(JSON.parse(outputs.get('data/catalog.json')).cases[0].prompt.original, before);
});

test('video display uses the same verified mapping on home and detail, with honest fallback', () => {
  for (const c of cases.filter(c => c.review.status === 'approved')) {
    const pages = generateOutputs([c], readme);
    const home = pages.get('README.md'), page = pages.get(`docs/cases/${c.id}.md`);
    const d = c.video.display;
    assert.ok(d?.embed_url || d?.poster_url, `${c.id}: missing video display`);
    for (const rendered of [home, page]) {
      if (d.embed_url) assert.ok(rendered.includes('\n\n' + d.embed_url + '\n\n'));
      else {
        assert.match(rendered, /点击封面观看原视频/);
        assert.ok(rendered.includes(d.poster_url.replace(/&/g, '&amp;')));
      }
    }
    assert.ok(page.indexOf('## Prompt') < page.indexOf('<details>'));
    assert.doesNotMatch(page, /<details open/);
  }
  const c = clone();
  c.video.display.embed_url = 'https://example.com/watch?v=not-an-attachment';
  assert.ok(validateCases([c], schema).some(e => /stable GitHub video attachment/.test(e)));
  delete c.video.display;
  assert.deepEqual(validateCases([c], schema), []);
  assert.match(detail(c), /暂无可嵌入视频或封面/);
});

test('schema rejects invalid dates, unsafe URLs, traversal IDs and unsupported keywords', () => {
  assert.equal(validDate('2025-02-29'), false);
  assert.equal(validDate('2024-02-29'), true);
  for (const u of ['javascript:alert(1)', 'https://secret:token@example.com', 'https://example.com/\npath']) assert.equal(validURL(u), false);
  const c = clone(); c.id = '../../outside';
  assert.ok(validateCases([c], schema).some(e => /invalid pattern/.test(e)));
  const s = structuredClone(schema); s.allOf = [];
  assert.throws(() => validateSchema(sample, s), /Unsupported schema keyword/);
});

test('import validates the entire batch before writing and never trusts approval input', async t => {
  const root = await temporary(t);
  await assert.rejects(importRows([{ url: 'https://example.com/valid' }, { url: 'javascript:bad' }], root), /HTTP/);
  assert.deepEqual(await fs.readdir(path.join(root, 'data/candidates')), []);
  await assert.rejects(importRows([{ url: 'https://example.com/work', review: { status: 'approved' } }], root), /unsupported import field/);
  await assert.rejects(importRows([{ url: 'https://example.com/work', id: '../escape' }], root), /invalid pattern/);
  const r = await importRows([{ url: 'https://youtu.be/abc', platform: 'YouTube' }, { url: 'https://youtube.com/watch?v=abc&si=tracking' }], root);
  assert.deepEqual(r, { added: 1, skipped: 1 });
  const { cases: loaded } = await loadCases(root);
  const imported = loaded.find(c => c.review.status === 'pending');
  assert.deepEqual(imported.models, []);
  assert.equal(imported.prompt.original, null);
  assert.equal(imported.verification.level, 'none');
  assert.deepEqual(await importRows([{ url: 'https://youtube.com/watch?v=abc' }], root), { added: 0, skipped: 1 });
});

test('build is deterministic, preserves manual README, detects stale output and removes withdrawn pages', async t => {
  const root = await temporary(t);
  await build(root);
  const names = JSON.parse(await fs.readFile(path.join(root, '.generated-files.json'), 'utf8'));
  const before = await Promise.all(names.map(n => fs.readFile(path.join(root, n), 'utf8')));
  await build(root);
  assert.deepEqual(await Promise.all(names.map(n => fs.readFile(path.join(root, n), 'utf8'))), before);
  await build(root, true);
  assert.equal((await fs.readFile(path.join(root, 'README.md'), 'utf8')).split('<!-- CATALOG:START -->')[0], readme.split('<!-- CATALOG:START -->')[0]);
  await fs.appendFile(path.join(root, `docs/cases/${sample.id}.md`), 'stale');
  await assert.rejects(build(root, true), /stale generated output/);
  await build(root);
  await fs.writeFile(path.join(root, 'docs/cases/manual-notes.md'), 'keep this manual document');
  await fs.rm(path.join(root, `data/cases/${sample.id}.json`));
  await assert.rejects(build(root, true), /obsolete generated output/);
  await build(root);
  await assert.rejects(fs.access(path.join(root, `docs/cases/${sample.id}.md`)), /ENOENT/);
  assert.equal(await fs.readFile(path.join(root, 'docs/cases/manual-notes.md'), 'utf8'), 'keep this manual document');
  await build(root, true);
});

test('published candidate placement and malformed README markers are rejected', async t => {
  const root = await temporary(t);
  await fs.rename(path.join(root, `data/cases/${sample.id}.json`), path.join(root, `data/candidates/${sample.id}.json`));
  await assert.rejects(loadCases(root), /move approved case/);
  assert.throws(() => generateOutputs([sample], '# No marker'), /marker pair/);
});
