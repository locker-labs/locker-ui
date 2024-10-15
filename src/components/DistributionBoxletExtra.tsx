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
	const img =
		boxletId === EAutomationType.GOAL_CUSTOM ? (
			<IconSavingsGoal />
		) : (
			<IconEfrogs />
		);

	return (
		<div className="flex flex-row items-center space-x-3 rounded-sm bg-white p-2">
			<div>{img}</div>
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
