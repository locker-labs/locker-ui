import { http } from "wagmi";
import type { Chain } from "wagmi/chains";
import {
	arbitrum,
	avalanche,
	avalancheFuji,
	optimism,
	polygon,
	polygonAmoy,
	sepolia,
} from "wagmi/chains";

const chains = {
	arbitrum,
	optimism,
	polygon,
	avalanche,
	sepolia,
	polygonAmoy,
	avalancheFuji,
};

// Private RPC URLs for each chain
export const transports = {
	[arbitrum.id]: http(process.env.ARBITRUM_RPC_URL),
	[optimism.id]: http(process.env.OPTIMISM_RPC_URL),
	[polygon.id]: http(process.env.POLYGON_RPC_URL),
	[avalanche.id]: http(process.env.AVALANCHE_RPC_URL),
	[sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
	[polygonAmoy.id]: http(process.env.POLYGON_AMOY_RPC_URL),
	[avalancheFuji.id]: http(process.env.AVALANCHE_FUJI_RPC_URL),
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
export const supportedChainIds = envChains.length
	? Object.fromEntries(envChains.map((chain) => [chain, chains[chain].id]))
	: defaultChainIds;

// ZeroDev Project IDs
export const zdProjectIds = {
	[arbitrum.id]: process.env.ARBITRUM_PROJECT_ID!,
	[optimism.id]: process.env.OPTIMISM_PROJECT_ID!,
	[polygon.id]: process.env.POLYGON_PROJECT_ID!,
	[avalanche.id]: process.env.AVALANCHE_PROJECT_ID!,
	[sepolia.id]: process.env.SEPOLIA_PROJECT_ID!,
	[polygonAmoy.id]: process.env.POLYGON_AMOY_PROJECT_ID!,
	[avalancheFuji.id]: process.env.AVALANCHE_FUJI_PROJECT_ID!,
};
