"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";

import { config } from "@/providers/wagmiConfig";

export interface IEvmProvider {
	children: ReactNode;
	initialState: State | undefined;
}

function EvmProvider({ children, initialState }: IEvmProvider) {
	const queryClient = new QueryClient();

	return (
		<WagmiProvider config={config} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default EvmProvider;
