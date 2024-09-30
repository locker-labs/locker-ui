import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { Automation } from "@/types";

export default function adaptAutomations2Boxlets(automations: Automation[]) {
	return Object.fromEntries(
		automations.map((automation) => {
			const { type, allocation } = automation;
			return [
				automation.type,
				{ ...DEFAULT_BOXLETS[type], percent: allocation * 100 },
			];
		})
	);
}
