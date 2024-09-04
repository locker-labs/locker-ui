import type { Connector } from "wagmi";

export const filterConnectors = (connectors: readonly Connector[]) => {
	const allowedIds = ["injected", "walletConnect", "coinbaseWalletSDK"];
	const infoToAdd: {
		[key in (typeof allowedIds)[number]]: { icon: string; label: string };
	} = {
		injected: { icon: "/assets/iconInjected.svg", label: "Browser" },
		walletConnect: {
			icon: "/assets/iconWalletConnect.svg",
			label: "Mobile",
		},
		coinbaseWalletSDK: {
			icon: "/assets/iconCoinbase.svg",
			label: "Coinbase",
		},
	};

	const filteredConnectors = connectors
		.filter((connector) => {
			console.log("a connector");
			console.log(connector);
			return allowedIds.includes(connector.id);
		})
		.map((connector) => {
			const { icon, label } = infoToAdd[connector.id];
			return { ...connector, icon, label };
		});

	return filteredConnectors;
};
