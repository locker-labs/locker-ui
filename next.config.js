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
		// ...
		// ********************************************* //

		// ****************** PUBLIC ****************** //
		APP_NAME: "Locker",
		APP_DESCRIPTION: "Save and invest every time you get paid on-chain.",
		APP_BASE_URL: "http://localhost:3000",
		GITHUB_URL: "https://github.com/chainrule-labs",
		TWITTER_URL: "https://twitter.com/locker_money",
		FARCASTER_URL: "https://warpcast.com/locker",
		TELEGRAM_URL: "https://t.me/+stsNEbe16tU5MTY5",
		// ******************************************** //
	},
});
