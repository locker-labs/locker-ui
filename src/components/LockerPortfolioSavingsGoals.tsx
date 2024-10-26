import { PiggyBank, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { getCollectionFloor } from "@/lib/element";
import { useLocker } from "@/providers/LockerProvider";
import { getErc20Price } from "@/services/moralis";
import getActiveAutomations from "@/utils/getActiveAutomations";
import getSavingsAutomations from "@/utils/getSavingsAutomations";

import EditAutomationsModal from "./EditAutomationsModal";
import EfrogsGoalAchievedDialog from "./EfrogsGoalAchievedDialog";
import SavingsGoalProgress from "./SavingsGoalProgress";

type ILockerPortfolioSavingsGoals = {
	portfolioValue: string;
};

function LockerPortfolioSavingsGoals({
	portfolioValue,
}: ILockerPortfolioSavingsGoals) {
	const [efrogsFloor, setEfrogsFloor] = useState<string | null>(null);
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
		<>
			{savingsAutomations.map((automation) => (
				<div className="flex flex-col" key={`goal-${automation.type}`}>
					<SavingsGoalProgress
						className="sm:w-1/2 xl:w-full"
						automation={automation}
						ethUsd={ethUsd}
						portfolioValue={portfolioValue}
						efrogsFloorEth={efrogsFloor}
					/>
					<EfrogsGoalAchievedDialog
						efrogsFloorEth={efrogsFloor}
						automation={automation}
						ethUsd={ethUsd}
						portfolioValue={portfolioValue}
					/>
				</div>
			))}
		</>
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
