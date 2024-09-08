import "@/styles/globals.css";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode, Suspense } from "react";
import { cookieToInitialState } from "wagmi";

import { globalMetadata } from "../data/seo/globalMetadata";
import AuthProvider from "../providers/AuthProvider";
import EvmProvider from "../providers/EvmProvider";
import ThemeProvider from "../providers/ThemeProvider";
import { wagmiConfig } from "../providers/wagmiConfig";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = globalMetadata;

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const initialState = cookieToInitialState(
		wagmiConfig,
		headers().get("cookie")
	);

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} flex min-h-screen w-full flex-col items-center bg-light-100 text-dark-500 dark:bg-dark-500 dark:text-light-200`}
			>
				<AuthProvider>
					<EvmProvider initialState={initialState}>
						<ThemeProvider>
							<main className="flex w-full min-w-[230px] max-w-5xl flex-1 flex-col items-center p-5">
								<Header />
								<Suspense fallback={<Loading />}>
									{children}
								</Suspense>
								<Footer />
							</main>
						</ThemeProvider>
					</EvmProvider>
				</AuthProvider>
				<VercelAnalytics />
			</body>
		</html>
	);
}
