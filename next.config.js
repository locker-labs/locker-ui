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
		// ********************************************* //

		// ****************** PUBLIC ****************** //
		// Metadata
		APP_NAME: "Locker",
		APP_DESCRIPTION: "Save and invest every time you get paid on-chain.",
		APP_BASE_URL: "http://localhost:3000",

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
	webpack: (config) => {
		// eslint-disable-next-line no-param-reassign
		config.resolve.fallback = { fs: false, net: false, tls: false };
		config.externals.push("pino-pretty", "lokijs", "encoding");
		return config;
	},
});
