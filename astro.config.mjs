// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://aihero.zh.dev',
	integrations: [
		starlight({
			title: 'AI Hero 中文',
			description: 'Matt Pocock 的 AI 工程方法中文站：可直接安装的 Skills、术语对照表、精选导读。',
			defaultLocale: 'root',
			locales: {
				root: { label: '简体中文', lang: 'zh-CN' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mattpocock/skills' },
			],
			lastUpdated: true,
			sidebar: [
				{
					label: '开始阅读',
					items: [
						{ label: '这是什么', slug: 'start-here' },
						{ label: 'AI 编程术语对照表', slug: 'dictionary' },
					],
				},
				{
					label: 'Skills 中文版',
					items: [
						{ label: '总览与安装', slug: 'skills' },
						{ label: '工程（Engineering）', items: [{ autogenerate: { directory: 'skills/engineering' } }] },
						{ label: '协作与表达（Productivity）', items: [{ autogenerate: { directory: 'skills/productivity' } }] },
						{ label: '杂项（Misc）', items: [{ autogenerate: { directory: 'skills/misc' } }] },
					],
				},
				{
					label: '关于',
					items: [{ label: '版权与署名', slug: 'about' }],
				},
			],
		}),
	],
});
