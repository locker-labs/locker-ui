import { IDistributionBoxlet } from "@/lib/boxlets";
import { EAutomationType } from "@/types";

export type IDistributionBoxlets = {
	[id: string]: IDistributionBoxlet;
};

export const DEFAULT_BOXLETS: IDistributionBoxlets = {
	[EAutomationType.SAVINGS]: {
		id: EAutomationType.SAVINGS,
		title: "Save in your locker",
		percent: 25,
		color: "#6A30C3",
		tooltip:
			"When payments are received, save this amount in your locker for later use.",
		state: "on",
	},

	[EAutomationType.FORWARD_TO]: {
		id: EAutomationType.FORWARD_TO,
		title: "Forward to address",
		tooltip: "When payments are received, send this amount somewhere else.",
		color: "#5490D9",
		percent: 75,
		forwardToAddress: "",
		state: "on",
	},

	[EAutomationType.OFF_RAMP]: {
		id: EAutomationType.OFF_RAMP,
		title: "Send to your bank",
		tooltip: "When payments are received, send this amount to your bank.",
		color: "#49BFE3",
		percent: 0,
		state: "on",
	},

	[EAutomationType.GOAL_EFROGS]: {
		id: EAutomationType.GOAL_EFROGS,
		title: "Efrogs NFT",
		subtitle: "ETH floor",
		tooltip:
			"Get notified when you've saved enough to by the Efrogs floor.",
		color: "#63DFDF",
		percent: 0,
		state: "off",
	},

	// [EAutomationType.GOAL_CUSTOM]: {
	// 	id: EAutomationType.GOAL_CUSTOM,
	// 	title: "Custom goal",
	// 	tooltip: "Set your own goal and get notified when you've saved enough.",
	// 	color: "#63DFDF",
	// 	percent: 0,
	// 	state: "off",
	// },
};
