import { supportedChainIds } from "@/data/constants/supportedChains";

export const getChainIconStyling = (chainId: number) => {
	const chainClasses = {
		[supportedChainIds.arbitrum]: "bg-arbitrum/20 text-arbitrum",
		[supportedChainIds.optimism]: "bg-optimism/20 text-optimism",
		[supportedChainIds.polygon]: "bg-polygon/20 text-polygon",
		[supportedChainIds.avalanche]: "bg-avalanche/20 text-avalanche",
		[supportedChainIds.sepolia]: "bg-ethereum/20 text-ethereum",
		[supportedChainIds.polygonAmoy]: "bg-polygon/20 text-polygon",
		[supportedChainIds.avalancheFuji]: "bg-avalanche/20 text-avalanche",
	};

	return chainClasses[chainId] || "bg-error/20 text-error";
};
