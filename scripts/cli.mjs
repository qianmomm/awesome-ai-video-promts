import fs from 'node:fs/promises';
import { ROOT, loadCases, build, importRows, published, label } from './catalog.mjs';

try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'validate') {
    const { cases } = await loadCases();
    console.log(`Valid: ${published(cases).length} approved / ${cases.length - published(cases).length} other records.`);
  } else if (['build', 'check'].includes(command)) {
    const r = await build(ROOT, command === 'check');
    console.log(`${command}: ${r.cases} cases, ${r.outputs} generated files OK.`);
  } else if (command === 'new') {
    const [url, platform = 'Unknown', title = '待核验的视频线索'] = args;
    console.log(await importRows([{ url, platform, title }]));
    console.log('Draft only. Review data/candidates/, then run npm run build.');
  } else if (command === 'import') {
    if (args.length !== 1) throw new Error('Usage: npm run import -- inbox/links.jsonl');
    const raw = await fs.readFile(args[0], 'utf8');
    const rows = raw.split(/\r?\n/).filter(line => line.trim()).map((line, i) => {
      try { return JSON.parse(line); } catch { throw new Error(`Invalid JSON on nonempty line ${i + 1}`); }
    });
    console.log(await importRows(rows));
    console.log('Imported records stay pending. Run npm run build to refresh counts.');
  } else if (command === 'search') {
    const q = args.join(' ').toLowerCase();
    if (!q) throw new Error('Usage: npm run search -- 关键词');
    const { cases } = await loadCases();
    const matches = published(cases).filter(c => [c.title, c.summary_zh, c.platform, c.category, ...c.tags, ...c.models.map(m => m.name), c.prompt.original ?? ''].join(' ').toLowerCase().includes(q));
    for (const c of matches) console.log(`${c.id}\t${c.title}\t${label(c.prompt.status)}\t${c.source.url}`);
    console.log(`${matches.length} matches`);
  } else {
    throw new Error('Commands: validate | build | check | new URL [platform] [title] | import JSONL | search keywords');
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
