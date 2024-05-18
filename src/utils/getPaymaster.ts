import { supportedChainIds } from "@/data/constants/supportedChains";

export const getBundler = (chainId: number) => {
	const paymasters = {
		[supportedChainIds.arbitrum]: process.env.ARBITRUM_PAYMASTER_RPC_URL!,
		[supportedChainIds.optimism]: process.env.OPTIMISM_PAYMASTER_RPC_URL!,
		[supportedChainIds.polygon]: process.env.POLYGON_PAYMASTER_RPC_URL!,
		[supportedChainIds.avalanche]: process.env.AVALANCHE_PAYMASTER_RPC_URL!,
		[supportedChainIds.sepolia]: process.env.SEPOLIA_PAYMASTER_RPC_URL!,
		[supportedChainIds.polygonAmoy]:
			process.env.POLYGON_AMOY_PAYMASTER_RPC_URL!,
		[supportedChainIds.avalancheFuji]:
			process.env.AVALANCHE_FUJI_PAYMASTER_RPC_URL!,
	};

	return paymasters[chainId] || null;
};
