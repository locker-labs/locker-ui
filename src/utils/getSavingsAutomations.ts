import { Automation, EAutomationType } from "@/types";

export default function getSavingsAutomations(automations: Automation[]) {
	return automations.filter(
		(automation) =>
			automation.type === EAutomationType.GOAL_EFROGS ||
			automation.type === EAutomationType.GOAL_CUSTOM
	);
}
