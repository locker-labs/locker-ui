import {
	DEFAULT_BOXLETS,
	IDistributionBoxlets,
} from "@/data/constants/boxlets";
import { Automation } from "@/types";

export default function adaptAutomations2Boxlets(automations: Automation[]) {
	return Object.fromEntries(
		automations.map((automation) => {
			const {
				type,
				allocation,
				recipientAddress: forwardToAddress,
			} = automation;

			// On if it has a positive allocation, or if it's type is always on by default
			const state =
				allocation > 0 || DEFAULT_BOXLETS[type].state === "on"
					? "on"
					: "off";

			return [
				automation.type,
				{
					...DEFAULT_BOXLETS[type],
					percent: Math.round(allocation * 100),
					forwardToAddress,
					state,
				},
			];
		})
	) as IDistributionBoxlets;
}
