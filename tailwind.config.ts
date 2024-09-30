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
		"bg-bbase/20",
		"text-bbase",
		"bg-polygon/20",
		"text-polygon",
		"bg-avalanche/20",
		"text-avalanche",
		"bg-ethereum/20",
		"text-ethereum",
		"bg-celo/20",
		"text-celo",
		"bg-binance/20",
		"bg-linea/20",
		"text-linea",
		"text-binance",
	],
	theme: {
		screens: {
			xxs: "230px",
			xs: "500px",
			sm: "640px",
			lg: "768px",
			xl: "1280px",
			xxl: "1536px",
		},
		extend: {
			colors: {
				"gray-25": "#FCFCFD",
				"gray-50": "#F9FAFB",
				"gray-100": "#F2F4F7",
				"gray-200": "#EAECF0",
				"gray-300": "#D0D5DD",
				"gray-400": "#98A2B3",
				"gray-500": "#667085",
				"gray-600": "#475467",
				"gray-700": "#344054",
				"gray-800": "#1D2939",
				"gray-900": "#101828",
				"locker-25": "#E9EAFA",
				"locker-50": "#D2D4F6",
				"locker-100": "#C1CBFF",
				"locker-200": "#A6AAED",
				"locker-300": "#8F94E8",
				"locker-400": "#797FE3",
				"locker-500": "#6269DF",
				"locker-600": "#4C54DA",
				"locker-700": "#3840C6",
				"locker-800": "#242CB2",
				"locker-900": "#10189E",
				"alt-1": "#7401B8",
				"alt-2": "#6A30C3",
				"alt-3": "#5E60CD",
				"alt-4": "#5490D9",
				"alt-5": "#4EA8DD",
				"alt-6": "#49BFE3",
				"alt-7": "#56CFE0",
				"alt-8": "#63DFDF",
				"alt-9": "#72EFDD",
				"alt-10": "#7FFFDA",
				"tx-confirmed": "#B7EDD3",
				"tx-forward": "#FFD09A",
				"tx-offramp": "#B6E5F4",
				"blue-200": "#A6AAED",
				"primary-100": "#4C4EDD",
				"primary-200": "#4546C4",
				"secondary-100": "#148DD1",
				"secondary-200": "#1E82BC",
				"alt-dark-500": "#101122",
				"alt-dark-400": "#191A35",
				"alt-dark-300": "#242538",
				"dark-100": "#515155",
				"dark-200": "#3A3A3F",
				"dark-300": "#26262A",
				"dark-400": "#1F1F23",
				"dark-500": "#131316",
				"dark-600": "#000000",
				"light-100": "#FFFFFF",
				"light-200": "#E2E2E2",
				"light-300": "#D0D0D0",
				"light-400": "#B8B8B8",
				"light-500": "#AAAAAA",
				"light-600": "#8B8B8B",
				success: "#14B8A6",
				error: "#F43F5E",
				warning: "#F59E0B",
				ethereum: "#7189F7",
				arbitrum: "#4497E7",
				optimism: "#EA3431",
				polygon: "#8D5BF6",
				avalanche: "#D64F49",
				celo: "#FDFF71",
				bbase: "#2151F5",
				binance: "#E1B43D",
				linea: "#60DFFF",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				md: "var(--radius)",
				lg: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontSize: {
				xxs: ".65rem",
			},
		},
	},
	darkMode: ["class", "class"],
	// eslint-disable-next-line global-require
	plugins: [require("tailwindcss-animate")],
};
export default config;
