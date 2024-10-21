import { Automation } from "@/types";

export default function getActiveAutomations(automations: Automation[]) {
	return automations.filter((automation) => automation.allocation > 0);
}
