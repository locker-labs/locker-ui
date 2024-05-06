import { supportedChainIds } from "@/data/constants/supportedChains";

export const getChainIconStyling = (chainId: number) => {
	const chainClasses = {
		[supportedChainIds.ARBITRUM]: "bg-arbitrum/20 text-arbitrum",
		[supportedChainIds.OPTIMISM]: "bg-optimism/20 text-optimism",
		[supportedChainIds.POLYGON]: "bg-polygon/20 text-polygon",
		[supportedChainIds.AVALANCHE]: "bg-avalanche/20 text-avalanche",
		[supportedChainIds.SEPOLIA]: "bg-ethereum/20 text-ethereum",
	};

	return chainClasses[chainId] || "bg-error/20 text-error";
};
