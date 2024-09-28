import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';



// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '我的文档',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},

			components: {
				SocialLinks: './src/components/MySocialLinks.astro',
			},

			head: [
				// 示例：添加 Fathom 分析脚本标签。
				{
					tag: 'script',
					attrs: {
						src: 'https://cdn.usefathom.com/script.js',
						'data-site': 'MY-FATHOM-ID',
						defer: true,
					},
				},
			],

			lastUpdated : true,
			credits: true,
			social: {
				github: 'https://github.com/NagatoCute',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: '踩坑日记',
					autogenerate: { directory: 'stars' },

				},
				{
					label: '游戏',
					autogenerate: { directory: 'game' },
				},

			],
		}),
	],
});
