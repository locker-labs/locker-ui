"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
	metaMaskWallet,
	phantomWallet,
	walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { cookieStorage, createConfig, createStorage } from "wagmi";

// import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { supportedChains, transports } from "@/data/constants/supportedChains";

// const connectors = connectorsForWallets(
// 	[
// 		{
// 			groupName: "Recommended",
// 			wallets: [rainbowWallet, walletConnectWallet],
// 		},
// 	],
// 	{
// 		appName: "My RainbowKit App",
// 		projectId: "YOUR_PROJECT_ID",
// 	}
// );

const wallets = [
	{
		groupName: "Recommended",
		wallets: [metaMaskWallet, walletConnectWallet, phantomWallet],
	},
];

const connectors = connectorsForWallets(wallets, {
	appName: "Locker",
	projectId: process.env.WC_PROJECT_ID!,
});

export const wagmiConfig = createConfig({
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
	chains: supportedChains,
	connectors,
	transports,
});
