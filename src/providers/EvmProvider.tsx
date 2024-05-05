"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
	cssStringFromTheme,
	darkTheme,
	getDefaultConfig,
	lightTheme,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";

import { supportedChains } from "@/data/constants/supportedChains";

function EvmProvider({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useTheme();

	const config = getDefaultConfig({
		appName: "Locker",
		projectId: process.env.WC_PROJECT_ID!,
		chains: supportedChains,
		ssr: true,
	});

	const queryClient = new QueryClient();

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider
					theme={null}
					initialChain={supportedChains[0]}
				>
					<style
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{
							__html: `:root {${resolvedTheme === "dark" ? cssStringFromTheme(darkTheme) : cssStringFromTheme(lightTheme)}}`,
						}}
					/>
					{children}
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default EvmProvider;
