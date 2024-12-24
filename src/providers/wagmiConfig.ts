"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { cookieStorage, createStorage } from "wagmi";

import { supportedChains } from "@/data/constants/supportedChains";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: true,
	networks: supportedChains,
	projectId,
});

// export const wagmiConfig = getDefaultConfig({
// 	appName: "Save",
// 	chains: supportedChains,
// 	ssr: true, // If your dApp uses server side rendering (SSR)
// });

// export const wagmiConfig = createConfig({
// 	ssr: true,
// 	storage: createStorage({
// 		storage: cookieStorage,
// 	}),
// 	chains: supportedChains,
// 	connectors: [
// 		injected(),
// 		walletConnect({
// 			projectId: process.env.WC_PROJECT_ID!,
// 			metadata: {
// 				name: "Locker",
// 				description: process.env.APP_DESCRIPTION!,
// 				url: process.env.LANDING_PAGE_URL!,
// 				icons: ["/assets/iconLocker.svg"],
// 			},
// 			qrModalOptions: {
// 				themeMode: "light",
// 			},
// 		}),
// 		coinbaseWallet({
// 			appName: "Locker",
// 			appLogoUrl: "/assets/iconLocker.svg",
// 			darkMode: false,
// 			preference: "eoaOnly",
// 		}),
// 	],
// 	transports,
// });
