import "@/styles/globals.css";

import { HighlightInit } from "@highlight-run/next/client";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
// eslint-disable-next-line camelcase
import { Open_Sans } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode, Suspense } from "react";

import { globalMetadata } from "@/data/seo/globalMetadata";
import AuthProvider from "@/providers/AuthProvider";
import EvmProvider from "@/providers/EvmProvider";

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
	return (
		<>
			<HighlightInit
				projectId="ng21pwne"
				serviceName="locker-ui"
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>

			<html lang="en" suppressHydrationWarning>
				<body className={`${inter.className}`}>
					<Suspense
						fallback={
							<div className="flex min-h-fit flex-row place-items-center">
								<Loading />
							</div>
						}
					>
						<AuthProvider>
							<EvmProvider cookie={headers().get("cookie") ?? ""}>
								<div className="flex min-h-screen w-full flex-col items-center">
									{children}
								</div>
							</EvmProvider>
						</AuthProvider>
						<VercelAnalytics />
					</Suspense>
				</body>
			</html>
		</>
	);
}
