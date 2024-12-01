import { IDistributionBoxlet } from "@/lib/boxlets";
import { EAutomationType } from "@/types";

import { IconEfrogs, IconSavingsGoal } from "./Icons";

function DistributionBoxletExtra({
	boxletId,
	boxlet,
}: {
	boxletId: string;
	boxlet: IDistributionBoxlet;
}) {
	let img;
	switch (boxletId) {
		case EAutomationType.GOAL_CUSTOM:
			img = <IconSavingsGoal />;
			break;
		case EAutomationType.GOAL_EFROGS:
			img = <IconEfrogs />;

			break;
		default:
			img = (
				<div
					className="flex size-7 shrink-0 items-center justify-center rounded-full"
					style={{ backgroundColor: boxlet.color }}
				/>
			);
	}
	return (
		<div className="flex flex-row items-center space-x-3 rounded-sm bg-white p-2">
			<div className="flex h-[3.2rem] items-center">{img}</div>
			<div className="flex flex-col text-left text-xs">
				<div className="font-semibold">{boxlet.title}</div>
				{boxlet.subtitle && (
					<div className="text-gray-500">{boxlet.subtitle}</div>
				)}
			</div>
		</div>
	);
}

export default DistributionBoxletExtra;
