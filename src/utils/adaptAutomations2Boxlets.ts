import {
	DEFAULT_BOXLETS,
	IDistributionBoxlets,
} from "@/data/constants/boxlets";
import { Automation, EAutomationUserState } from "@/types";

export default function adaptAutomations2Boxlets(automations: Automation[]) {
	const automationBoxlets = Object.fromEntries(
		automations.map((automation) => {
			const {
				type,
				allocation,
				recipientAddress: forwardToAddress,
				extraId,
				color,
				batchType,
			} = automation;

			// On if it has a positive allocation, or if it's type is always on by default
			const state =
				automation?.userState === EAutomationUserState.OFF
					? EAutomationUserState.OFF
					: EAutomationUserState.ON;

			const boxlet = {
				// If there are multiple TRANSFER_TO, then they should have the same title, but a random color
				...DEFAULT_BOXLETS[type],
				percent: Math.round(allocation * 100),
				forwardToAddress,
				state,
				extraId,
				// color,
			};
			if (color) {
				boxlet.color = color;
			}
			if (batchType) {
				boxlet.batchType = batchType;
			}
			return [extraId || automation.type, boxlet];
		})
	);

	// Merge with DEFAULT_BOXLETS to ensure any missing keys get their defaults
	return {
		...DEFAULT_BOXLETS,
		...automationBoxlets,
	} as IDistributionBoxlets;
}
