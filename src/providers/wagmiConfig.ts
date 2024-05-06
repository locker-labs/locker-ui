import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import {
	supportedChainIds,
	supportedChains,
} from "@/data/constants/supportedChains";

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
				themeMode: "dark",
			},
		}),
		coinbaseWallet({
			appName: "Locker",
			appLogoUrl: "/assets/iconLocker.svg",
			darkMode: true,
		}),
	],
	transports: {
		// Replace with private RPC Urls --> http(process.env.MY_RPC_URL)
		[supportedChainIds.ARBITRUM]: http(),
		[supportedChainIds.OPTIMISM]: http(),
		[supportedChainIds.POLYGON]: http(),
		[supportedChainIds.AVALANCHE]: http(),
		[supportedChainIds.SEPOLIA]: http(),
	},
});
