import { Automation } from "@/types";
import adaptAutomations2Boxlets from "@/utils/adaptAutomations2Boxlets";

import BoxletPieChart from "./BoxletPieChart";

export interface IAutomationSettings {
	automations: Automation[];
}

function AutomationSettings({ automations }: IAutomationSettings) {
	const boxletsFromAutomations = adaptAutomations2Boxlets(automations);

	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-md">
			<BoxletPieChart boxlets={boxletsFromAutomations} lineWidth={100} />
		</div>
	);
}

export default AutomationSettings;
