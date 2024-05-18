/* eslint-disable no-param-reassign */
/** @type {import('next').NextConfig} */

const prod = process.env.NODE_ENV === "production";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: !prod,
});

module.exports = withPWA({
	reactStrictMode: true,
	env: {
		// ****************** PRIVATE ****************** //
		// Clerk
		NEXT_PUBLIC_CLERK_SIGN_IN_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
		NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

		// WalletConnect
		WC_PROJECT_ID: process.env.WC_PROJECT_ID,

		// Locker Backend
		LOCKER_API_BASE_URL: process.env.LOCKER_API_BASE_URL,
		LOCKER_AGENT_ADDRESS: process.env.LOCKER_AGENT_ADDRESS,

		// Private RPC URLs
		ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL,
		OPTIMISM_RPC_URL: process.env.OPTIMISM_RPC_URL,
		POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
		AVALANCHE_RPC_URL: process.env.AVALANCHE_RPC_URL,
		SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
		POLYGON_AMOY_RPC_URL: process.env.POLYGON_AMOY_RPC_URL,
		AVALANCHE_FUJI_RPC_URL: process.env.AVALANCHE_FUJI_RPC_URL,

		// ZeroDev
		ARBITRUM_PROJECT_ID: process.env.ARBITRUM_PROJECT_ID,
		OPTIMISM_PROJECT_ID: process.env.OPTIMISM_PROJECT_ID,
		POLYGON_PROJECT_ID: process.env.POLYGON_PROJECT_ID,
		AVALANCHE_PROJECT_ID: process.env.AVALANCHE_PROJECT_ID,
		SEPOLIA_PROJECT_ID: process.env.SEPOLIA_PROJECT_ID,
		POLYGON_AMOY_PROJECT_ID: process.env.POLYGON_AMOY_PROJECT_ID,
		AVALANCHE_FUJI_PROJECT_ID: process.env.AVALANCHE_FUJI_PROJECT_ID,
		ARBITRUM_BUNDLER_RPC_URL: process.env.ARBITRUM_BUNDLER_RPC_URL,
		OPTIMISM_BUNDLER_RPC_URL: process.env.OPTIMISM_BUNDLER_RPC_URL,
		POLYGON_BUNDLER_RPC_URL: process.env.POLYGON_BUNDLER_RPC_URL,
		AVALANCHE_BUNDLER_RPC_URL: process.env.AVALANCHE_BUNDLER_RPC_URL,
		SEPOLIA_BUNDLER_RPC_URL: process.env.SEPOLIA_BUNDLER_RPC_URL,
		POLYGON_AMOY_BUNDLER_RPC_URL: process.env.POLYGON_AMOY_BUNDLER_RPC_URL,
		AVALANCHE_FUJI_BUNDLER_RPC_URL:
			process.env.AVALANCHE_FUJI_BUNDLER_RPC_URL,
		ARBITRUM_PAYMASTER_RPC_URL: process.env.ARBITRUM_PAYMASTER_RPC_URL,
		OPTIMISM_PAYMASTER_RPC_URL: process.env.OPTIMISM_PAYMASTER_RPC_URL,
		POLYGON_PAYMASTER_RPC_URL: process.env.POLYGON_PAYMASTER_RPC_URL,
		AVALANCHE_PAYMASTER_RPC_URL: process.env.AVALANCHE_PAYMASTER_RPC_URL,
		SEPOLIA_PAYMASTER_RPC_URL: process.env.SEPOLIA_PAYMASTER_RPC_URL,
		POLYGON_AMOY_PAYMASTER_RPC_URL:
			process.env.POLYGON_AMOY_PAYMASTER_RPC_URL,
		AVALANCHE_FUJI_PAYMASTER_RPC_URL:
			process.env.AVALANCHE_FUJI_PAYMASTER_RPC_URL,

		// Supported chains (different for dev and prod)
		SUPPORTED_CHAINS: process.env.SUPPORTED_CHAINS,
		// ********************************************* //

		// ****************** PUBLIC ****************** //
		// Metadata
		APP_NAME: "Locker",
		APP_DESCRIPTION: "Save and invest every time you get paid on-chain.",
		APP_BASE_URL: "http://localhost:3000",
		LANDING_PAGE_URL: "https://locker.money",

		// Socials
		GITHUB_URL: "https://github.com/chainrule-labs",
		TWITTER_URL: "https://twitter.com/locker_money",
		FARCASTER_URL: "https://warpcast.com/locker",
		TELEGRAM_URL: "https://t.me/+stsNEbe16tU5MTY5",
		// ******************************************** //
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.clerk.com",
				port: "",
				pathname: "/**",
			},
		],
	},
});
