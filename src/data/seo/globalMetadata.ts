export const globalMetadata = {
	metadataBase: new URL(process.env.APP_BASE_URL as string),
	title: process.env.APP_NAME,
	description: process.env.APP_DESCRIPTION,
	keywords: [
		"Locker",
		"DeFi",
		"Crypto",
		"Smart Contracts",
		"EVM",
		"Savings",
		"Acorns",
		"Payroll",
		"Account Abstraction",
		"Modular",
		"ERC-4337",
		"ERC-7579",
		"Automated",
		"Investments",
		"Staking",
		"Yield",
		"Arbitrum",
		"Sepolia",
		"Gnosis",
		"Base",
		"Linea",
	],
	icons: {
		icon: [
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				url: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				url: "/favicon-16x16.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				url: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				url: "/android-chrome-192x192.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "256x256",
				url: "/android-chrome-256x256.png",
			},
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#4c4fe4",
			},
		],
	},
	openGraph: {
		title: process.env.APP_NAME,
		description: process.env.APP_DESCRIPTION,
		url: process.env.APP_BASE_URL,
		type: "website",
		images: [
			{
				url: `${process.env.APP_BASE_URL}/seo-card.png`,
			},
		],
	},
	twitter: {
		title: process.env.APP_NAME!,
		description: process.env.APP_DESCRIPTION!,
		card: "summary_large_image",
		images: [
			{
				url: `${process.env.APP_BASE_URL}/seo-card.png`,
			},
		],
		site: "@locker_money",
	},
};
