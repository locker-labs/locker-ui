import { Pencil } from "lucide-react";

import { useEditAutomationsModal } from "@/hooks/useEditAutomationsModal";
import { Automation, Locker } from "@/types";

import AutomationSettings from "./AutomationSettings";

export interface ILockerPortfolioAutomations {
	locker: Locker;
	automations: Automation[];
}

function LockerPortfolioAutomations({
	locker,
	automations,
}: ILockerPortfolioAutomations) {
	const { openEditAutomationsModal, renderEditAutomationsModal } =
		useEditAutomationsModal();
	return (
		<div className="flex flex-col space-y-4">
			<div className="flex flex-col justify-between">
				<div className="flex flex-row items-center justify-between space-x-8">
					<p className="font-bold">Automation Details</p>
					<button
						className="outline-solid flex cursor-pointer flex-row items-center justify-center rounded-md px-2 py-1 text-sm outline outline-gray-300"
						onClick={openEditAutomationsModal}
					>
						<Pencil size={14} />
						<span className="ml-2">Edit</span>
					</button>
				</div>

				{renderEditAutomationsModal()}
			</div>
			<AutomationSettings locker={locker} automations={automations} />
		</div>
	);
}

export default LockerPortfolioAutomations;
