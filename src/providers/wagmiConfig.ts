import { cookieStorage, createConfig, createStorage } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { supportedChains, transports } from "@/data/constants/supportedChains";

export const config = createConfig({
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	chains: supportedChains,
	connectors: [
		injected(),
		walletConnect({
			projectId: process.env.WC_PROJECT_ID!,
			metadata: {
				name: "Locker",
				description: process.env.APP_DESCRIPTION!,
				url: process.env.LANDING_PAGE_URL!,
				icons: ["/assets/iconLocker.svg"],
			},
			qrModalOptions: {
				themeMode: "light",
			},
		}),
		coinbaseWallet({
			appName: "Locker",
			appLogoUrl: "/assets/iconLocker.svg",
			darkMode: false,
		}),
	],
	transports,
});
