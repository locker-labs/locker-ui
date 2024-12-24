"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { mainnet } from "viem/chains";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { supportedChains } from "@/data/constants/supportedChains";
import { projectId, wagmiAdapter } from "@/providers/wagmiConfig";

export interface IEvmProvider {
	children: ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cookie: any;
}

// Set up metadata
const metadata = {
	// this is optional
	name: "locker",
	description: "Locker automates your crypto",
	url: "https://locker.money", // origin must match your domain & subdomain
	icons: [
		"https://github.com/locker-labs/locker-static/blob/main/images/logo/iconLockerDarkBg.png?raw=true",
	],
};

// Create the modal
export const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: supportedChains,
	defaultNetwork: mainnet,
	metadata,
	themeMode: "light",
	features: {
		analytics: true, // Optional - defaults to your Cloud configuration
	},
});

function EvmProvider({ children, cookie }: IEvmProvider) {
	const queryClient = new QueryClient();
	const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookie);

	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(initialState ? { initialState } : {})}
		>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default EvmProvider;
