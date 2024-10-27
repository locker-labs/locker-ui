import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import { supportedChains } from "@/data/constants/supportedChains";

export const wagmiConfig = getDefaultConfig({
	appName: "Locker",
	projectId: process.env.WC_PROJECT_ID!,
	chains: supportedChains,
	ssr: true, // If your dApp uses server side rendering (SSR)
});

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
