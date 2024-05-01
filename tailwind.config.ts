import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			xxs: "230px",
			xs: "300px",
			sm: "400px",
			md: "700px",
			lg: "1024px",
			xl: "1280px",
		},
		extend: {
			colors: {
				"primary-100": "#4C4EDD",
				"primary-200": "#4546C4",
				"secondary-100": "#56A7D5",
				"secondary-200": "#4994BF",
				"dark-100": "#3F4054",
				"dark-200": "#333547",
				"dark-300": "#2B2C40",
				"dark-400": "#242538",
				"dark-500": "#101122",
				"dark-600": "#000000",
				"light-100": "#FFFFFF",
				"light-200": "#EBEBED",
				"light-300": "#D7D7DE",
				"light-400": "#C1C1C9",
				"light-500": "#ADADBA",
				"light-600": "#9C9CAD",
			},
		},
	},
	darkMode: "class",
	plugins: [],
};
export default config;
