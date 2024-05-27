import { supportedChainIds } from "@/data/constants/supportedChains";

export const isTestnet = (chainId: number) => {
	if (
		chainId === supportedChainIds?.sepolia ||
		chainId === supportedChainIds?.polygonAmoy ||
		chainId === supportedChainIds?.avalancheFuji
	) {
		return true;
	}
	return false;
};
