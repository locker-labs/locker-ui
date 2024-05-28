import { Chain } from "viem";

import { supportedChains } from "@/data/constants/supportedChains";

export const getChainObjFromId = (chainId: number): Chain | null => {
	const chain = supportedChains.find((chainObj) => chainObj.id === chainId);

	if (!chain) return null;
	return chain;
};
