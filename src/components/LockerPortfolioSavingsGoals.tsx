import Big from "big.js";
import { PiggyBank, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { getCollectionFloor } from "@/lib/element";
import { useLocker } from "@/providers/LockerProvider";
import { getErc20Price } from "@/services/moralis";
import { EAutomationType } from "@/types";
import getActiveAutomations from "@/utils/getActiveAutomations";
import getSavingsAutomations from "@/utils/getSavingsAutomations";

import EditAutomationsModal from "./EditAutomationsModal";
import { IconEfrogs, IconSavingsGoal } from "./Icons";

type ILockerPortfolioSavingsGoals = {
	portfolioValue: string;
};

function LockerPortfolioSavingsGoals({
	portfolioValue,
}: ILockerPortfolioSavingsGoals) {
	const [efrogsFloor, setEfrogsFloor] = useState(null);
	const [ethUsd, setEthUsd] = useState<number | null>(null);
	const { automations } = useLocker();

	const savingsAutomations = getActiveAutomations(
		getSavingsAutomations(automations || [])
	);
	const hasGoals = automations && savingsAutomations.length > 0;

	// get efrogs floor price on page load
	useEffect(() => {
		getCollectionFloor().then(setEfrogsFloor);
	}, []);

	// get ETHUSD
	useEffect(() => {
		getErc20Price()
			.then(({ usdPrice }) => {
				console.log("got usd price", usdPrice);
				setEthUsd(usdPrice);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	console.log("portfolioValue", portfolioValue);

	const body = hasGoals ? (
		<div className="flex flex-col">
			{savingsAutomations.map((automation) => {
				const img =
					automation.type === EAutomationType.GOAL_CUSTOM ? (
						<IconSavingsGoal />
					) : (
						<IconEfrogs />
					);

				const { title } = DEFAULT_BOXLETS[automation.type];
				const ethSaved =
					ethUsd &&
					new Big(portfolioValue)
						.div(ethUsd)
						.mul(automation.allocation);
				const usdSaved = new Big(portfolioValue).mul(
					automation.allocation
				);

				// Set amount saved to 0, <0.0001, or rounded to 4 decimal places
				let roundedEthSaved = "0";
				if (ethSaved) {
					if (ethSaved.gte(0.0001))
						roundedEthSaved = ethSaved.toFixed(4);
					else if (ethSaved.gt(0)) roundedEthSaved = "<0.0001";
				}
				const amountSaved = ethUsd
					? `${roundedEthSaved} ETH`
					: `$${usdSaved}`;

				const value =
					ethSaved && efrogsFloor
						? ethSaved.div(efrogsFloor).toNumber()
						: 0;

				let floor =
					DEFAULT_BOXLETS[EAutomationType.GOAL_EFROGS].subtitle;
				if (efrogsFloor) floor = `${efrogsFloor} ${floor}`;
				return (
					<div
						key={`goal-${automation.type}`}
						className="flex flex-row items-center justify-between space-x-2 rounded-md bg-white p-2 shadow-md outline outline-1 outline-gray-300 sm:w-1/2 xl:w-full"
					>
						<div>{img}</div>
						<div className="flex w-full flex-col space-y-1">
							<div>{title}</div>
							<Progress
								value={value}
								className="w-full bg-gray-300"
							/>
							<div className="flex flex-row justify-between">
								<div className="text-xs text-gray-500">
									{amountSaved}
								</div>
								<div className="text-xs text-gray-500">
									{floor}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	) : (
		<div className="flex flex-col items-center justify-center space-y-4">
			<p className="rounded-sm bg-gray-300 p-3 text-center text-white sm:p-5">
				<PiggyBank size={28} />
			</p>
			<p className="text-sm">No savings goals yet</p>
			<EditAutomationsModal
				button={
					<button className="outline-solid flex cursor-pointer flex-row items-center justify-center rounded-md p-2 text-xxs outline outline-1 outline-gray-300">
						<Plus size={12} />
						<span className="ml-2 font-semibold">Add goal</span>
					</button>
				}
			/>
		</div>
	);
	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex flex-row justify-between">
				<p className="font-bold">Savings Goals</p>
				<EditAutomationsModal />
			</div>
			<div className="mt-3 flex h-full w-full flex-col">{body}</div>
		</div>
	);
}

export default LockerPortfolioSavingsGoals;
