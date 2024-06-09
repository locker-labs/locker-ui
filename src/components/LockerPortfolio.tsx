import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Blockies from "react-blockies";

import AutomationSettings from "@/components/AutomationSettings";
import MultiChainOverview from "@/components/MultiChainOverview";
import PortfolioIconButtonGroup from "@/components/PortfolioIconButtonGroup";
import TokenSupportWarning from "@/components/TokenSupportWarning";
import Tooltip from "@/components/Tooltip";
import TxTable from "@/components/TxTable";
import { supportedChainIdsArray } from "@/data/constants/supportedChains";
import { getLockerNetWorth } from "@/services/moralis";
import { getTokenBalances } from "@/services/transactions";
import { Locker, Policy, Token } from "@/types";
import { getFundedChainIds } from "@/utils/getFundedChainIds";
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
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [tokenList, setTokenList] = useState<Token[]>([]);
	const [fundedChainIds, setFundedChainIds] = useState<number[]>([]);
	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	const [chainsNetWorths, setChainsNetWorths] = useState<
		Record<number, string>
	>({});

	const { getToken } = useAuth();

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

	const getTokenList = async () => {
		const authToken = await getToken();
		if (authToken && locker.id) {
			const list = await getTokenBalances(authToken, locker.id);
			const fundedChainIdsList = getFundedChainIds(list || []);
			setTokenList(list || []);
			setFundedChainIds(fundedChainIdsList);
		}
	};

	const fetchLockerNetWorth = async () => {
		if (locker && txs) {
			const mainnetChainIds = supportedChainIdsArray.filter(
				(chainId) => !isTestnet(chainId)
			);

			const netWorth = await getLockerNetWorth(
				locker.address,
				mainnetChainIds
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
		getTokenList();
		fetchLockerNetWorth();
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col items-center">
			<div className="flex w-fit flex-col overflow-visible">
				<Blockies
					className="flex self-center rounded-full"
					seed={locker.address.toLowerCase()}
					size={14}
				/>
				<div className="mt-4 flex w-full flex-col items-center">
					<Tooltip
						width="w-36"
						label="Total USD value of your locker across all supported chains."
						placement="auto"
					>
						<span className="mb-1 flex cursor-pointer items-center whitespace-nowrap text-sm text-light-600">
							Total value <span className="ml-2 text-xs">ⓘ</span>
						</span>
					</Tooltip>
					<span className="text-4xl">${lockerNetWorth}</span>
					{/* <div className="mt-4 flex flex-col justify-center space-y-2 text-xs text-light-600">
						<div className="flex space-x-2 text-xs">
							<span>Locker:</span>
							<code>{truncateAddress(locker.address)}</code>
						</div>
						<div className="flex space-x-2 text-xs">
							<span>Owner:</span>
							<code>{truncateAddress(locker.ownerAddress)}</code>
						</div>
					</div> */}
				</div>
				{locker && (
					<div className="mt-4 flex items-center">
						<PortfolioIconButtonGroup
							locker={locker}
							tokenList={tokenList}
							getTokenList={getTokenList}
						/>
					</div>
				)}
			</div>
			<div className="mt-6 flex w-full items-center justify-center">
				<TokenSupportWarning />
			</div>
			<div className="mt-6 flex w-full min-w-fit max-w-xs flex-col space-y-2">
				<span className="self-start text-sm">Automation settings</span>
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
				<div className="mt-6 flex w-full min-w-fit max-w-md flex-col space-y-2">
					<span className="self-start text-sm">
						Multi-chain overview
					</span>
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
					<span className="self-start text-sm">
						Transaction history
					</span>
					<TxTable txs={txs} />
				</div>
			)}
		</div>
	);
}

export default LockerPortfolio;
