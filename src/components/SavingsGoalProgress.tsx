import { Progress } from "@radix-ui/react-progress";
import Big from "big.js";

import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { cn } from "@/lib/utils";
import { Automation, EAutomationType } from "@/types";

import { IconEfrogs, IconSavingsGoal } from "./Icons";

type ISavingsGoalProgressParams = {
	automation: Automation;
	ethUsd: number | null;
	portfolioValue: string;
	efrogsFloorEth: string | null;
	// eslint-disable-next-line react/require-default-props
	className?: string;
};

export default function SavingsGoalProgress({
	automation,
	ethUsd,
	portfolioValue,
	efrogsFloorEth,
	className,
}: ISavingsGoalProgressParams) {
	// console.log(
	// 	"SavingsGoalProgress",
	// 	automation,
	// 	ethUsd,
	// 	portfolioValue,
	// 	efrogsFloorEth,
	// 	className
	// );
	const img =
		automation.type === EAutomationType.GOAL_CUSTOM ? (
			<IconSavingsGoal />
		) : (
			<IconEfrogs />
		);

	const { title } = DEFAULT_BOXLETS[automation.type];
	const ethSaved =
		ethUsd &&
		new Big(portfolioValue).div(ethUsd).mul(automation.allocation);
	const usdSaved = new Big(portfolioValue).mul(automation.allocation);
	// Set amount saved to 0, <0.0001, or rounded to 4 decimal places
	let roundedEthSaved = "0";
	if (ethSaved) {
		if (ethSaved.gte(0.0001)) roundedEthSaved = ethSaved.toFixed(4);
		else if (ethSaved.gt(0)) roundedEthSaved = "<0.0001";
	}
	const amountSaved = ethUsd ? `${roundedEthSaved} ETH` : `$${usdSaved}`;

	const value =
		ethSaved && efrogsFloorEth
			? ethSaved.div(efrogsFloorEth).mul(100).toNumber()
			: 0;

	let floor = DEFAULT_BOXLETS[EAutomationType.GOAL_EFROGS].subtitle;
	if (efrogsFloorEth) floor = `${efrogsFloorEth} ${floor}`;
	return (
		<div
			className={cn(
				"flex w-full flex-row items-center justify-between space-x-2 rounded-md bg-white p-2 shadow-md outline outline-1 outline-gray-300",
				className // Merge the provided className with the default classes
			)}
		>
			<div className="rounded-sm">{img}</div>
			<div className="flex w-full flex-col space-y-1">
				<div>{title}</div>
				<Progress
					value={Math.min(value, 100)}
					className="relative h-2 w-full overflow-hidden rounded bg-gray-300"
				>
					<div
						className={cn(
							"absolute h-full",
							value >= 100 ? "bg-green" : "bg-locker-600"
						)}
						style={{ width: `${value}%` }}
					/>
				</Progress>
				<div className="flex flex-row justify-between">
					<div className="text-xs text-gray-500">{amountSaved}</div>
					<div className="text-xs text-gray-500">{floor}</div>
				</div>
			</div>
		</div>
	);
}
