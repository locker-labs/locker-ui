import { Pencil } from "lucide-react";

import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { useEditAutomationsModal } from "@/hooks/useEditAutomationsModal";
import { Automation } from "@/types";
import adaptAutomations2Boxlets from "@/utils/adaptAutomations2Boxlets";

import BoxletPieChart from "./BoxletPieChart";

export interface ILockerPortfolioAutomations {
	automations: Automation[];
}

function LockerPortfolioAutomations({
	automations,
}: ILockerPortfolioAutomations) {
	const { openEditAutomationsModal, renderEditAutomationsModal } =
		useEditAutomationsModal();

	const boxlets = adaptAutomations2Boxlets(automations);
	return (
		<div className="flex flex-col space-y-5">
			<div className="flex flex-col justify-between">
				<div className="flex flex-row items-center justify-between space-x-8">
					<p className="text-lg font-bold">Automation Details</p>
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
			<div className="flex flex-col items-center justify-center">
				<BoxletPieChart
					boxlets={boxlets}
					lineWidth={100}
					size="size-36"
				/>
			</div>
			<div className="space-y-3">
				{automations.map((automation) => {
					const { color, title } = DEFAULT_BOXLETS[automation.type];

					return (
						<div className="flex flex-row justify-between text-sm">
							<div className="flex flex-row items-center justify-center space-x-2">
								<div
									className="size-5 rounded-full"
									style={{ backgroundColor: color }}
								/>
								<span>{title}</span>
							</div>
							<span className="font-semibold">
								{automation.allocation * 100}%
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default LockerPortfolioAutomations;
