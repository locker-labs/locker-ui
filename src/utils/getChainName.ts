import { Chain } from "viem";

import { supportedChains } from "@/data/constants/supportedChains";

export const getChainNameFromId = (chainId: number): string | null => {
	const chain = supportedChains.find((chainObj) => chainObj.id === chainId);

	if (!chain) return null;

	switch (chain.name) {
		case "OP Mainnet":
			return "Optimism";
		case "Arbitrum One":
			return "Arbitrum";
		case "Polygon Amoy":
			return "Amoy";
		case "Avalanche Fuji":
			return "Fuji";
		default:
			return chain.name;
	}
};

export const getChainNameFromChainObj = (chain: Chain): string | null => {
	switch (chain.name) {
		case "OP Mainnet":
			return "Optimism";
		case "Arbitrum One":
			return "Arbitrum";
		case "Polygon Amoy":
			return "Amoy";
		case "Avalanche Fuji":
			return "Fuji";
		default:
			return chain.name;
	}
};
