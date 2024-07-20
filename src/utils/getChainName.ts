import { Chain } from "viem";

import { supportedChains } from "@/data/constants/supportedChains";

export const getChainNameFromChainObj = (chain: Chain): string | null => {
	switch (chain.name) {
		case "OP Mainnet":
			return "Optimism";
		case "Arbitrum One":
			return "Arbitrum";
		case "Linea Mainnet":
			return "Linea";
		default:
			return chain.name;
	}
};

export const getChainNameFromId = (chainId: number): string | null => {
	const chain = supportedChains.find((chainObj) => chainObj.id === chainId);

	if (!chain) return null;
	return getChainNameFromChainObj(chain);
};
