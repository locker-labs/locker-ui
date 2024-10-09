import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { Automation } from "@/types";

export default function adaptAutomations2Boxlets(automations: Automation[]) {
	return Object.fromEntries(
		automations.map((automation) => {
			const {
				type,
				allocation,
				recipientAddress: forwardToAddress,
			} = automation;
			return [
				automation.type,
				{
					...DEFAULT_BOXLETS[type],
					percent: Math.round(allocation * 100),
					forwardToAddress,
				},
			];
		})
	);
}
