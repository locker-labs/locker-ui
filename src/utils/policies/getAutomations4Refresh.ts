import { Automation, EAutomationStatus } from "@/types";

/**
 * Copy of current automations, but with AUTOMATE_THEN_READY -> READY
 * To be used right before signing/refresh a policy.
 */
export default function getAutomations4Refresh(automations: Automation[]) {
	return automations.map((automation) => {
		const updatedAutomation = { ...automation };
		if (automation.status === EAutomationStatus.AUTOMATE_THEN_READY) {
			updatedAutomation.status = EAutomationStatus.READY;
		}

		return updatedAutomation;
	});
}
