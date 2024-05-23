import { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

import BankIcon from "@/components/BankIcon";
import ChannelPieChart from "@/components/ChannelPieChart";
import PortfolioIconButtonGroup from "@/components/PortfolioIconButtonGroup";
import SaveIcon from "@/components/SaveIcon";
import Tooltip from "@/components/Tooltip";
import WalletIcon from "@/components/WalletIcon";
import { getLockerNetWorth } from "@/services/moralis";
import { Locker, Policy } from "@/types";
import { isTestnet } from "@/utils/isTestnet";

import TxTable from "./TxTable";

export interface ILockerPortfolio {
	lockers: Locker[];
	policies: Policy[];
}

function LockerPortfolio({ lockers, policies }: ILockerPortfolio) {
	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	const bankPercent = 70;
	const hotWalletPercent = 20;
	const savePercent = 10;

	const locker = lockers[0];
	const { txs } = locker;

	/*
		- For now, only handling one locker per user (index 0)
			- In the future, we can add a dropdown to choose which locker to display
		- The single locker may have money across multiple chains
			- Locker will only be deployed once automations are enabled on that chain
			- If locker is funded on chain, but automations are not enabled, show "Enable automations" for that chain
		- Per chain, show:
			- Balance
			- Policy percentages
			- Adjust percentages option
		- If user opted for off-ramp and KYC is not complete, show "finish setup" button
	*/

	/*
		What will the "Send" button do?
		- Show a modal with an address input field
		- Once transfer is successful, show a success message
	*/

	/*
		What will the "Edit" button do?
		- Not sure yet...
	*/

	const fetchLockerNetWorth = async () => {
		if (locker && txs) {
			const fundedMainnetChainIds = txs
				.map((tx) => tx.chainId)
				.filter((chainId) => !isTestnet(chainId));
			const netWorth = await getLockerNetWorth(
				locker.address,
				fundedMainnetChainIds
			);

			if (netWorth) {
				setLockerNetWorth(netWorth);
			}
		}
	};

	// Only fetch locker net worth on initial render to prevent call to Moralis API
	// every 5 seconds. This can be updated once we implement a websocket.
	useEffect(() => {
		fetchLockerNetWorth();
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col items-start">
			<div className="flex w-fit flex-col overflow-visible">
				<div className="flex w-fit flex-col">
					<Tooltip
						width="w-36"
						label="Total USD value of your locker across all supported chains."
						placement="auto-start"
					>
						<span className="mb-1 flex cursor-pointer whitespace-nowrap text-sm text-light-600">
							Total balance <span className="ml-2">ⓘ</span>
						</span>
					</Tooltip>

					<span className="text-3xl">${lockerNetWorth}</span>
				</div>
				{locker && (
					<div className="mt-4 flex items-center">
						<PortfolioIconButtonGroup locker={locker} />
					</div>
				)}
			</div>

			{/* This cannot be here because it will differ across chains */}
			<div className="mt-6 flex w-full min-w-52 max-w-xs flex-col items-center space-y-4 rounded-md border border-light-200 p-3 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
				<div className="flex w-full items-center justify-between">
					<span className="text-sm">Payment allocation</span>
					<button
						className="hover:text-secondary-100 dark:hover:text-primary-100"
						aria-label="Edit payment distribution"
						onClick={() =>
							console.log("Edit payment distribution", policies)
						}
					>
						<HiDotsVertical size={18} />
					</button>
				</div>
				<div className="flex w-full flex-col items-center justify-between xs:flex-row">
					<ChannelPieChart
						bankPercent={bankPercent}
						hotWalletPercent={hotWalletPercent}
						savePercent={savePercent}
						lineWidth={30}
						size="size-24"
					/>
					<div className="ml-0 mt-4 flex w-40 flex-col space-y-4 text-sm xs:ml-4 xs:mt-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<SaveIcon divSize="size-6" iconSize="14px" />
								<span className="ml-3">Save</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{savePercent} %
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<WalletIcon divSize="size-6" iconSize="12px" />
								<span className="ml-3">Forward</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{hotWalletPercent} %
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<BankIcon divSize="size-6" iconSize="15px" />
								<span className="ml-3">Bank</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{bankPercent} %
							</span>
						</div>
					</div>
				</div>
			</div>
			{/* ******************************************************** */}
			{txs && (
				<div className="mt-6 flex w-full flex-col space-y-2">
					<span className="text-sm">Transaction history</span>
					<TxTable txs={txs} />
				</div>
			)}
		</div>
	);
}

export default LockerPortfolio;
