import { IDistributionBoxlet } from "@/components/DistributionBoxlet";
import { EAutomationType } from "@/types";

export const DEFAULT_BOXLETS: { [id: string]: IDistributionBoxlet } = {
	[EAutomationType.SAVINGS]: {
		id: EAutomationType.SAVINGS,
		title: "Save in your locker",
		percent: 25,
		color: "#6A30C3",
		tooltip:
			"When payments are received, save this amount in your locker for later use.",
	},

	[EAutomationType.FORWARD_TO]: {
		id: EAutomationType.FORWARD_TO,
		title: "Forward to a hot wallet",
		tooltip: "When payments are received, send this amount somewhere else.",
		color: "#5490D9",
		percent: 75,
	},

	[EAutomationType.OFF_RAMP]: {
		id: EAutomationType.OFF_RAMP,
		title: "Send to your bank",
		tooltip: "When payments are received, send this amount to your bank.",
		color: "#49BFE3",
		percent: 0,
	},
};
