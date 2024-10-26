import { Automation, EAutomationUserState } from "@/types";

export default function getActiveAutomations(automations: Automation[]) {
	return automations.filter(
		(automation) =>
			automation.allocation > 0 &&
			automation.userState !== EAutomationUserState.OFF
	);
}
