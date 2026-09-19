// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// 部署在 GitHub Pages 项目页，URL 形如 https://<user>.github.io/cn-aihero-dev/
// 注意：Astro 不会给 markdown 正文里的链接自动加 base，所以正文内的站内链接
// 必须写成 /cn-aihero-dev/xxx/。换域名/换 base 时用这条命令批量改：
//   grep -rl '](/cn-aihero-dev/' src/content/docs | xargs sed -i '' 's|](/cn-aihero-dev/|](NEW_BASE/|g'
// npm run build 会跑 scripts/check-links.sh 检查有没有漏改。
export const BASE = '/cn-aihero-dev';

// https://astro.build/config
export default defineConfig({
	site: 'https://coocoode.github.io',
	base: BASE,
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			// 和源站的代码高亮观感对齐：暗色主题 + 透明底（用容器底色）
			themes: { light: 'github-light', dark: 'github-dark-default' },
			wrap: false,
		},
	},
});
