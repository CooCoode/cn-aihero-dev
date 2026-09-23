#!/usr/bin/env node
/**
 * 内容一致性检查。译文和术语表之间不该自相矛盾。
 *
 *   node scripts/check-content.mjs      （或 npm run check:content）
 *
 * 检查三类问题，都是"不报错但读者会发现"的那种：
 *   1. 结构：每篇译文都该有 name + 中英双语 description + 安装节
 *   2. 术语：对照表标 ✅ 的词，译文该用中文；标 🔤 的该保留英文
 *   3. 标题：同一页不该有两个同名 H2（锚点会撞）
 *
 * 退出码 0 = 干净，1 = 有问题。
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content/docs';
const walk = (d) =>
	readdirSync(d).flatMap((f) => {
		const p = join(d, f);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
	});

const read = (f) => readFileSync(f, 'utf8');
const stripFence = (s) => s.replace(/```[\s\S]*?```/g, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const files = walk(ROOT);
const skills = files.filter((f) => f.includes('/skills/') && !f.endsWith('/index.md'));
const problems = [];
const add = (f, msg) => problems.push(`${f.replace(`${ROOT}/`, '')}: ${msg}`);

// ---- 1. 结构 ----
for (const f of skills) {
	const raw = read(f);
	const yaml = (raw.match(/```yaml([\s\S]*?)```/) || [])[1];
	if (!yaml) {
		add(f, '找不到安装节的 YAML 块');
		continue;
	}
	if (!/^name:\s*[a-z-]+/m.test(yaml)) add(f, 'YAML 缺 name');
	const desc = (yaml.match(/^description:\s*(.+)$/m) || [])[1] ?? '';
	if (!/[\u4e00-\u9fff]/.test(desc)) add(f, 'description 缺中文');
	if (!/[a-zA-Z]{6,}/.test(desc)) add(f, 'description 缺英文（应为中英双语）');
}

// ---- 2. 同页重复 H2 ----
for (const f of files) {
	// 必须先剥掉代码围栏：译文里有「地图正文模板」这类示例，
	// 里面的 ## 标题不是真标题（第一版没剥，误报过 wayfinder）
	const heads = [...stripFence(read(f)).matchAll(/^## +(.+)$/gm)].map((m) => m[1].trim());
	const dup = heads.filter((h, i) => heads.indexOf(h) !== i);
	if (dup.length) add(f, `重复的 H2 标题：${[...new Set(dup)].join('、')}`);
}

// ---- 3. 术语表标记 vs 译文实际用法 ----
const dict = read(join(ROOT, 'dictionary.md'));
const body = skills.map((f) => stripFence(read(f))).join('\n');
let termsChecked = 0;
for (const m of dict.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(✅|🔤|⚠️)/gm)) {
	const en = m[1].replace(/`/g, '').trim();
	const zh = m[2].replace(/`/g, '').trim();
	const mark = m[3];
	// 只比"单个英文术语"，跳过组合条目
	if (!/^[a-zA-Z][a-zA-Z0-9 .+-]*$/.test(en) || en.includes('/')) continue;
	// 推荐译名与英文相同（就是标 🔤 的那种）没有可比的差异
	const zhTerms = zh
		.split('/')
		.map((s) => s.trim())
		.filter((s) => s && s !== '—' && s !== en);
	if (!zhTerms.length) continue;

	const enCount = (body.match(new RegExp(`\\b${esc(en)}\\b`, 'gi')) || []).length;
	const zhCount = zhTerms.reduce((n, t) => n + (body.match(new RegExp(esc(t), 'g')) || []).length, 0);
	if (enCount + zhCount < 8) continue; // 出现太少，比例没意义
	termsChecked++;

	const enShare = enCount / (enCount + zhCount);
	if (mark === '✅' && enShare > 0.7)
		add(join(ROOT, 'dictionary.md'), `标 ✅ 但译文以英文为主：${en} → ${zh}（英 ${enCount} / 中 ${zhCount}）`);
	if (mark === '🔤' && enShare < 0.3)
		add(join(ROOT, 'dictionary.md'), `标 🔤 但译文以中文为主：${en} → ${zh}（英 ${enCount} / 中 ${zhCount}）`);
}

// ---- 输出 ----
console.log(`检查 ${skills.length} 篇译文 · ${files.length} 个 markdown · ${termsChecked} 个可量化术语`);
if (problems.length) {
	console.log(`\n✗ ${problems.length} 处问题：`);
	for (const p of problems) console.log(`    ${p}`);
	process.exit(1);
}
console.log('✓ 结构与术语一致');
