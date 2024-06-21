import { http } from "wagmi";
import type { Chain } from "wagmi/chains";
import {
	arbitrum,
	avalanche,
	base,
	baseSepolia,
	optimism,
	polygon,
	sepolia,
} from "wagmi/chains";

const chains = {
	arbitrum,
	optimism,
	base,
	polygon,
	avalanche,
	sepolia,
	baseSepolia,
};

// Wagmi code names for each chain
export const chainCodeNames: {
	[key: number]: string;
} = {
	[arbitrum.id]: "arbitrum",
	[optimism.id]: "optimism",
	[base.id]: "base",
	[polygon.id]: "polygon",
	[avalanche.id]: "avalanche",
	[sepolia.id]: "sepolia",
	[baseSepolia.id]: "baseSepolia",
};

// Private RPC URLs for each chain
export const transports = {
	[arbitrum.id]: http(process.env.ARBITRUM_RPC_URL),
	[optimism.id]: http(process.env.OPTIMISM_RPC_URL),
	[base.id]: http(process.env.BASE_RPC_URL),
	[polygon.id]: http(process.env.POLYGON_RPC_URL),
	[avalanche.id]: http(process.env.AVALANCHE_RPC_URL),
	[sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
	[baseSepolia.id]: http(process.env.BASE_SEPOLIA_RPC_URL),
};

// Default chains if no environment variable is set
const defaultChains: readonly Chain[] = Object.values(chains);
const defaultChainIds = Object.fromEntries(
	Object.entries(chains).map(([key, chain]) => [key, chain.id])
);

// Parse chains from environment variable
const envChains = process.env.SUPPORTED_CHAINS
	? (JSON.parse(process.env.SUPPORTED_CHAINS) as (keyof typeof chains)[])
	: [];

// Set supported chains based on environment variable or default
export const supportedChains = (
	envChains.length ? envChains.map((chain) => chains[chain]) : defaultChains
) as [Chain, ...Chain[]];

// Set supported chain ids based on environment variable or default
export const supportedChainIds: { [chain: string]: number } = envChains.length
	? Object.fromEntries(envChains.map((chain) => [chain, chains[chain].id]))
	: defaultChainIds;

export const supportedChainIdsArray = Object.values(supportedChainIds);
