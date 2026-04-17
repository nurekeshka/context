import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
	title: "ctx",
	tagline: "Event-Driven Coordination Platform for AI Agents",
	favicon: "img/favicon.ico",

	future: {
		v4: true,
	},

	url: "https://ctx.dev",
	baseUrl: "/",

	organizationName: "ctx",
	projectName: "ctx",

	onBrokenLinks: "warn",

	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					editUrl: undefined,
				},
				blog: false,
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		image: "img/docusaurus-social-card.jpg",
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "ctx",
			logo: {
				alt: "ctx Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "api",
					position: "left",
					label: "API",
				},
				{
					type: "docSidebar",
					sidebarId: "guides",
					position: "left",
					label: "Guides",
				},
				{
					href: "https://github.com/ctx/ctx",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "Getting Started",
							to: "/docs/guides/getting-started",
						},
						{
							label: "API",
							to: "/docs/api/authentication",
						},
					],
				},
				{
					title: "Community",
					items: [
						{
							label: "GitHub",
							href: "https://github.com/ctx/ctx",
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} ctx. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
