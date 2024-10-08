module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			node: {
				extensions: [".json", ".js", ".jsx", ".ts", ".tsx", ".d.ts"],
			},
			typescript: {
				alwaysTryTypes: true,
				project: "tsconfig.json",
			},
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
	extends: [
		"plugin:react/recommended",
		"airbnb",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:@next/next/recommended",
	],
	plugins: [
		"react",
		"prettier",
		"@typescript-eslint",
		"simple-import-sort",
		"@next/eslint-plugin-next",
	],
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	rules: {
		"no-console": ["warn"],
		"prettier/prettier": "error",
		"import/no-unresolved": "error",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"@typescript-eslint/no-shadow": "error",
		"react/jsx-no-bind": "off",
		"no-nested-ternary": "off",
		"no-shadow": "off",
		"import/extensions": "off",
		"react/button-has-type": "off",
		"import/prefer-default-export": "off",
		"no-useless-constructor": "off",
		"no-underscore-dangle": "off",
		"class-methods-use-this": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-uses-react": "off",
		radix: "off",
		"react/jsx-filename-extension": [
			2,
			{ extensions: [".js", ".jsx", ".ts", ".tsx"] },
		],
	},
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			rules: {
				// Add or override TypeScript-specific rules here
			},
		},
	],
};
