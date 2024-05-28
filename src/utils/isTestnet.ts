import { supportedChainIds } from "@/data/constants/supportedChains";

export const isTestnet = (chainId: number) => {
	if (
		chainId === supportedChainIds?.sepolia ||
		chainId === supportedChainIds?.baseSepolia
	) {
		return true;
	}
	return false;
};
