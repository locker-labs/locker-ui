import "@/styles/globals.css";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
// eslint-disable-next-line camelcase
import { Open_Sans } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode, Suspense } from "react";
import { cookieToInitialState } from "wagmi";

import { globalMetadata } from "@/data/seo/globalMetadata";
import AuthProvider from "@/providers/AuthProvider";
import EvmProvider from "@/providers/EvmProvider";
import { wagmiConfig } from "@/providers/wagmiConfig";

import Loading from "./loading";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = globalMetadata;

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width",
};

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
				className={`${inter.className} flex min-h-screen w-full flex-col items-center`}
			>
				<Suspense
					fallback={
						<div className="min-h-fit">
							<Loading />
						</div>
					}
				>
					<AuthProvider>
						<EvmProvider initialState={initialState}>
							{children}
						</EvmProvider>
					</AuthProvider>
					<VercelAnalytics />
				</Suspense>
			</body>
		</html>
	);
}
