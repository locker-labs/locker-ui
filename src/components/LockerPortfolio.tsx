import { HiDotsVertical } from "react-icons/hi";

import BankIcon from "@/components/BankIcon";
import ChannelPieChart from "@/components/ChannelPieChart";
import PortfolioIconButtonGroup from "@/components/PortfolioIconButtonGroup";
import SaveIcon from "@/components/SaveIcon";
import Tooltip from "@/components/Tooltip";
import WalletIcon from "@/components/WalletIcon";
import { Locker, Policy } from "@/types";

export interface ILockerPortfolio {
	lockers: Locker[] | null;
	policies: Policy[] | null;
}

function LockerPortfolio({ lockers, policies }: ILockerPortfolio) {
	const bankPercent = 70;
	const hotWalletPercent = 20;
	const savePercent = 10;

	console.log("\n\n\npolicies: ", policies, "\n\n\n");

	// Should use useMemo for lockers and policies here and other components where lockers,
	// policies, or txs are passed and frequent updates are unencessary

	/*
		- For now, only handling one locker per user (index 0)
			- In the future, we can add a dropdown to choose which locker to display
		- The single locker may have money across multiple chains
			- Locker will only be deployed once automations are enabled on that chain
		- 
	*/

	return (
		<div className="flex w-full flex-1 flex-col items-start">
			<div className="flex w-fit flex-col overflow-visible">
				<div className="flex w-fit flex-col">
					<div className="flex items-center">
						<span className="mb-1 flex whitespace-nowrap text-sm text-light-600">
							Total balance
						</span>
						<Tooltip
							width="w-36"
							label="Total USD value of your locker across all supported chains."
						>
							<span className="ml-2 flex cursor-pointer text-light-600">
								ⓘ
							</span>
						</Tooltip>
					</div>
					<span className="text-2xl">$1,087.01</span>
				</div>
				{lockers && (
					<div className="mt-4 flex items-center">
						<PortfolioIconButtonGroup locker={lockers[0]} />
					</div>
				)}
			</div>

			{/* This cannot be here because it will differ across chains */}
			<div className="mt-6 flex w-52 flex-col items-center space-y-4 rounded-md border border-light-200 p-3 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
				<div className="flex w-full items-center justify-between">
					<span className="text-sm text-light-600">
						Payment distribution
					</span>
					<button
						className="hover:text-secondary-100 dark:hover:text-primary-100"
						aria-label="Edit payment distribution"
						onClick={() => console.log("Edit payment distribution")}
					>
						<HiDotsVertical size={18} />
					</button>
				</div>
				<ChannelPieChart
					bankPercent={bankPercent}
					hotWalletPercent={hotWalletPercent}
					savePercent={savePercent}
					lineWidth={30}
					size="size-24"
				/>
				<div className="flex w-40 flex-col space-y-4 text-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<SaveIcon />
							<span className="ml-3">Save</span>
						</div>
						<span className="text-light-600">{savePercent} %</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<WalletIcon />
							<span className="ml-3">Forward</span>
						</div>
						<span className="text-light-600">
							{hotWalletPercent} %
						</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<BankIcon />
							<span className="ml-3">Bank</span>
						</div>
						<span className="text-light-600">{bankPercent} %</span>
					</div>
				</div>
			</div>
			{/* ******************************************************** */}

			<span className="">
				Locker detailed breakdown
				<br />
				locker address
				<br />
				locker balance per chain
				<br />
				chains locker is deployed to
			</span>
			<span className="">Withdraw from locker</span>
			<span className="">Current policy percentages</span>
			<span className="">Adjust percentages option</span>
		</div>
	);
}

export default LockerPortfolio;
