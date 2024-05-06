import type { Chain } from "wagmi/chains";
import { arbitrum, avalanche, optimism, polygon, sepolia } from "wagmi/chains";

export const supportedChains: readonly [Chain, ...Chain[]] = [
	arbitrum,
	optimism,
	polygon,
	avalanche,
	sepolia,
];

export const supportedChainIds: { [key: string]: number } = {
	ARBITRUM: arbitrum.id,
	OPTIMISM: optimism.id,
	POLYGON: polygon.id,
	AVALANCHE: avalanche.id,
	SEPOLIA: sepolia.id,
};
