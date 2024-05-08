import { supportedChainIds } from "@/data/constants/supportedChains";

export const isChainSupported = (chainId: number) =>
	Object.values(supportedChainIds).includes(chainId);
