import { formatUnits } from "viem";

import { IDistributionBoxlet } from "@/components/DistributionBoxlet";
import { Automation, EAutomationStatus, EAutomationType } from "@/types";

/**
 * Returns automations with percentages from boxlets and statuses from original automations
 * @param automations - The original automations containing statuses and possibly recipient addresses
 * @param boxlets - The boxlets containing percentages for each automation type
 */
export default function getAutomations4Boxlets(
	automations: Automation[],
	boxlets: { [id: string]: IDistributionBoxlet }
): Automation[] {
	return automations.map((automation) => {
		const boxlet = boxlets[automation.type];

		// Convert the percentage from the boxlet into the allocation (fractional form)
		const allocation = Number(formatUnits(BigInt(boxlet.percent), 2));

		// Create the updated automation object
		const updatedAutomation: Automation = {
			...automation, // Keeps original status and type
			allocation, // Updated allocation from boxlet
		};

		// If the automation is of type 'forward_to', include the recipientAddress from the boxlet
		if (
			automation.type === EAutomationType.FORWARD_TO &&
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
}
