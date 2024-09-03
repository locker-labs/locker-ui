"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { wagmiConfig } from "@/providers/wagmiConfig";

export interface IEvmProvider {
	children: ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	cookie: any;
}

function EvmProvider({ children, cookie }: IEvmProvider) {
	const queryClient = new QueryClient();
	const initialState = cookieToInitialState(wagmiConfig, cookie);

	return (
		<WagmiProvider
			config={wagmiConfig}
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
