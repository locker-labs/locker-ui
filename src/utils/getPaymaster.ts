import { supportedChainIds } from "@/data/constants/supportedChains";

export const getPaymaster = (chainId: number) => {
	const paymasters = {
		[supportedChainIds.arbitrum]: process.env.ARBITRUM_PAYMASTER_RPC_URL!,
		[supportedChainIds.optimism]: process.env.OPTIMISM_PAYMASTER_RPC_URL!,
		[supportedChainIds.base]: process.env.BASE_PAYMASTER_RPC_URL!,
		[supportedChainIds.polygon]: process.env.POLYGON_PAYMASTER_RPC_URL!,
		[supportedChainIds.avalanche]: process.env.AVALANCHE_PAYMASTER_RPC_URL!,
		[supportedChainIds.sepolia]: process.env.SEPOLIA_PAYMASTER_RPC_URL!,
		[supportedChainIds.baseSepolia]:
			process.env.BASE_SEPOLIA_PAYMASTER_RPC_URL!,
	};

	return paymasters[chainId] || null;
};
