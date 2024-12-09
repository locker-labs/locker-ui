import { formatUnits } from "viem";

import { IDistributionBoxlet } from "@/lib/boxlets";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	EAutomationUserState,
} from "@/types";

/**
 * Returns automations with percentages from boxlets and statuses from original automations
 * @param automations - The original automations containing statuses and possibly recipient addresses
 * @param boxlets - The boxlets containing percentages for each automation type
 */
export default function getAutomations4Boxlets(
	automations: Automation[],
	boxlets: { [id: string]: IDistributionBoxlet }
): Automation[] {
	const updatedAutomations = Object.values(boxlets).map((boxlet) => {
		const defaultAutomation = {
			type: boxlet.id as EAutomationType,
			name: boxlet.title,
			color: boxlet.color,
			// status: EAutomationStatus.NEW,
			userState: EAutomationUserState.ON,
			batchType: boxlet.batchType,
		};
		const automation =
			automations.find(
				(a) =>
					// By type if no extraId, or by extraId if it exists
					(!boxlet.extraId && a.type === boxlet.id) ||
					(boxlet.extraId && a.extraId === boxlet.extraId)
			) || defaultAutomation;

		// Convert the percentage from the boxlet into the allocation (fractional form)
		const allocation = Number(formatUnits(BigInt(boxlet.percent), 2));

		// Create the updated automation object
		const updatedAutomation: Automation = {
			extraId: boxlet.extraId,
			color: boxlet.color,
			status:
				boxlet.id === EAutomationType.OFF_RAMP
					? EAutomationStatus.NEW
					: EAutomationStatus.READY,
			...automation, // Keeps original status and type
			allocation, // Updated allocation from boxlet
			userState: boxlet.state,
			batchType: boxlet.batchType,
		};

		// If the automation is of type 'forward_to', include the recipientAddress from the boxlet
		if (
			boxlet.id === EAutomationType.FORWARD_TO &&
			boxlet.forwardToAddress
		) {
			updatedAutomation.recipientAddress =
				boxlet.forwardToAddress as `0x${string}`;
		}

		if (
			updatedAutomation.status === EAutomationStatus.AUTOMATE_THEN_READY
		) {
			updatedAutomation.status = EAutomationStatus.READY;
		}

		return updatedAutomation;
	});

	const updatedTypes = updatedAutomations.map((a) => a.type);
	return [
		...automations.filter((a) => !updatedTypes.includes(a.type)),
		...updatedAutomations,
	];
}
