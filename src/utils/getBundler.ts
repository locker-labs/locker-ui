import { supportedChainIds } from "@/data/constants/supportedChains";

export const getBundler = (chainId: number) => {
	const bundlerRpcUrls = {
		[supportedChainIds.arbitrum]: process.env.ARBITRUM_BUNDLER_RPC_URL!,
		[supportedChainIds.optimism]: process.env.OPTIMISM_BUNDLER_RPC_URL!,
		[supportedChainIds.polygon]: process.env.POLYGON_BUNDLER_RPC_URL!,
		[supportedChainIds.avalanche]: process.env.AVALANCHE_BUNDLER_RPC_URL!,
		[supportedChainIds.sepolia]: process.env.SEPOLIA_BUNDLER_RPC_URL!,
		[supportedChainIds.polygonAmoy]:
			process.env.POLYGON_AMOY_BUNDLER_RPC_URL!,
		[supportedChainIds.avalancheFuji]:
			process.env.AVALANCHE_FUJI_BUNDLER_RPC_URL!,
	};

	return bundlerRpcUrls[chainId] || undefined;
};
