import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		"bg-arbitrum/20",
		"text-arbitrum",
		"bg-optimism/20",
		"text-optimism",
		"bg-polygon/20",
		"text-polygon",
		"bg-avalanche/20",
		"text-avalanche",
		"bg-ethereum/20",
		"text-ethereum",
	],
	theme: {
		screens: {
			xxs: "230px",
			xs: "300px",
			xs1: "360px",
			sm: "400px",
			md: "815px",
			lg: "1024px",
			xl: "1280px",
		},
		extend: {
			colors: {
				// ******* PRIMARY ******* //
				"primary-100": "#4C4EDD",
				"primary-200": "#4546C4",
				// ********************** //

				// ***** SECONDARY ***** //
				"secondary-100": "#148DD1",
				"secondary-200": "#1E82BC",
				// ********************** //

				// ****** ALT DARK ****** //
				"alt-dark-500": "#101122",
				"alt-dark-400": "#191A35",
				"alt-dark-300": "#242538",
				// ********************** //

				// ******** DARK ******** //
				"dark-100": "#515155",
				"dark-200": "#3A3A3F",
				"dark-300": "#26262A",
				"dark-400": "#1F1F23",
				"dark-500": "#131316",
				"dark-600": "#000000",
				// ********************** //

				// ******* LIGHT ******* //
				"light-100": "#FFFFFF",
				"light-200": "#E2E2E2",
				"light-300": "#D0D0D0",
				"light-400": "#B8B8B8",
				"light-500": "#AAAAAA",
				"light-600": "#8B8B8B",
				// ********************** //

				// ******* OTHER ******* //
				success: "#14B8A6",
				error: "#F43F5E",
				warning: "#F59E0B",
				ethereum: "#7189F7",
				arbitrum: "#4497E7",
				optimism: "#EA3431",
				polygon: "#8D5BF6",
				avalanche: "#D64F49",
				celo: "#FDFF71",
				base: "#2151F5",
				binance: "#E1B43D",
				// ********************** //
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
export default config;
