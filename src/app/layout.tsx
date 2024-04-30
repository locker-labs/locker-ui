import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(process.env.APP_BASE_URL as string),
	title: process.env.APP_NAME,
	description: process.env.APP_DESCRIPTION,
	keywords: [
		"Chain Rule",
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} flex min-h-screen w-full flex-col items-center bg-light-100 text-dark-600 dark:bg-dark-500 dark:text-light-200`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<main className="flex w-full min-w-[230px] max-w-5xl flex-1 flex-col items-center p-5">
						<Header />
						{children}
						<Footer />
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
