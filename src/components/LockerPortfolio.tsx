import { useEffect, useState } from "react";

import AutomationSettings from "@/components/AutomationSettings";
import MultiChainOverview from "@/components/MultiChainOverview";
import PortfolioIconButtonGroup from "@/components/PortfolioIconButtonGroup";
import Tooltip from "@/components/Tooltip";
import TxTable from "@/components/TxTable";
import { getLockerNetWorth } from "@/services/moralis";
import { Locker, Policy } from "@/types";
import { isTestnet } from "@/utils/isTestnet";

export interface ILockerPortfolio {
	lockers: Locker[];
	policies: Policy[];
	fetchPolicies: () => void;
}

function LockerPortfolio({
	lockers,
	policies,
	fetchPolicies,
}: ILockerPortfolio) {
	// State variables
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	const [chainsNetWorths, setChainsNetWorths] = useState<
		Record<number, string>
	>({});

	// Props destructured variables
	const locker = lockers[0];
	const { txs } = locker;
	const basePolicy = policies[0];
	const { automations } = basePolicy;

	// Props derived variables
	const bankAutomation = automations.find((a) => a.type === "off_ramp");
	const hotWalletAutomation = automations.find(
		(a) => a.type === "forward_to"
	);
	const saveAutomation = automations.find((a) => a.type === "savings");

	const fundedChainIds = txs
		? txs
				.filter(
					(tx) =>
						tx.lockerDirection === "in" &&
						chainsNetWorths[tx.chainId] !== "0.00"
				)
				.map((tx) => tx.chainId)
		: [];
	// const fundedChainIds = txs ? txs.map((tx) => tx.chainId) : [];

	/* For now, we're only handling:
		- One locker per user (index 0)
			- In the future, we can add a dropdown to choose which locker to display
		- One set of automation settings across all chains
			- A policy is necessary for each chain because of the session key signature
			- Use the automations from policies[0] and use that across all chains
			- If the automation settings change, need to update policies on all enabled chains
			- KYC only needs to be completed once
				- Use basePolicy to determine whether KYC is complete
	*/

	const fetchLockerNetWorth = async () => {
		if (locker && txs) {
			const fundedMainnetChainIds = fundedChainIds.filter(
				(chainId) => !isTestnet(chainId)
			);

			const netWorth = await getLockerNetWorth(
				locker.address,
				fundedMainnetChainIds
			);

			if (netWorth) {
				setLockerNetWorth(netWorth.totalNetWorth);
				setChainsNetWorths(netWorth.chainsNetWorth);
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
			<div className="mt-6 flex w-full flex-col space-y-2">
				<span className="text-sm">Automation settings</span>
				<AutomationSettings
					currentPolicies={policies}
					fetchPolicies={fetchPolicies}
					locker={locker}
					bankAutomation={bankAutomation}
					hotWalletAutomation={hotWalletAutomation}
					saveAutomation={saveAutomation}
				/>
			</div>
			{locker && policies && (
				<div className="mt-6 flex w-full flex-col space-y-2">
					<span className="text-sm">Multi-chain overview</span>
					<MultiChainOverview
						fundedChainIds={fundedChainIds}
						policies={policies}
						automations={automations}
						chainsNetWorths={chainsNetWorths}
						locker={locker}
						setErrorMessage={setErrorMessage}
						fetchPolicies={fetchPolicies}
					/>
				</div>
			)}
			{errorMessage && (
				<span className="mt-6 text-sm text-error">{errorMessage}</span>
			)}
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
