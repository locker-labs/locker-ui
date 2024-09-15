"use client";

import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Blockies from "react-blockies";

import AutomationSettings from "@/components/AutomationSettings";
import MultiChainOverview from "@/components/MultiChainOverview";
import PortfolioIconButtonGroup from "@/components/PortfolioIconButtonGroup";
import Tooltip from "@/components/Tooltip";
import TxTable from "@/components/TxTable";
import { supportedChainIdsArray } from "@/data/constants/supportedChains";
import { useLockerOnboardedModal } from "@/hooks/useLockerOnboardedModal";
import { getLockerNetWorth } from "@/services/moralis";
import { getTokenBalances } from "@/services/transactions";
import { EAutomationType, Token } from "@/types";
import { getFundedChainIds } from "@/utils/getFundedChainIds";
import { isChainSupported } from "@/utils/isChainSupported";
import { isTestnet } from "@/utils/isTestnet";

import { useLocker } from "../providers/LockerProvider";

function LockerPortfolio() {
	const { lockers, policies, txs, offrampAddresses } = useLocker();
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [tokenList, setTokenList] = useState<Token[]>([]);
	const [fundedChainIds, setFundedChainIds] = useState<number[]>([]);
	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	const [chainsNetWorths, setChainsNetWorths] = useState<
		Record<number, string>
	>({});

	const { getToken } = useAuth();

	const searchParams = useSearchParams();

	const { openLockerOnboardedModal, renderLockerOnboardedModal } =
		useLockerOnboardedModal();
	const onboardingFlag = searchParams.get("o");
	console.log(`Got onboarding flag ${onboardingFlag}`);

	useEffect(() => {
		if (onboardingFlag) openLockerOnboardedModal();
	}, [onboardingFlag]);

	// Props destructured variables
	const locker = lockers[0];
	// const { txs } = locker;
	const filteredTxs = txs
		? txs.filter((tx) => isChainSupported(tx.chainId))
		: [];
	const basePolicy = policies[0];
	const { automations } = basePolicy;

	// Props derived variables
	const bankAutomation = automations.find(
		(a) => a.type === EAutomationType.OFF_RAMP
	);
	const hotWalletAutomation = automations.find(
		(a) => a.type === EAutomationType.FORWARD_TO
	);
	const saveAutomation = automations.find(
		(a) => a.type === EAutomationType.SAVINGS
	);

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
			const filteredList = list
				? list.filter((token) => isChainSupported(token.chainId))
				: [];
			const fundedChainIdsList = getFundedChainIds(filteredList);
			setTokenList(filteredList);
			setFundedChainIds(fundedChainIdsList);
		}
	};

	const fetchLockerNetWorth = async () => {
		if (locker && filteredTxs.length > 0) {
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
			<div className="mt-6 flex w-full min-w-fit max-w-xs flex-col space-y-2 overflow-visible">
				<div className="flex w-full items-center">
					<Tooltip
						width="w-36"
						label="These automation settings will be applied to all chains that have been enabled."
						placement="auto"
					>
						<span className="cursor-pointer text-sm text-light-600">
							Automation settings
							<span className="ml-2 text-xs">ⓘ</span>
						</span>
					</Tooltip>
				</div>
				<AutomationSettings
					locker={locker}
					bankAutomation={bankAutomation}
					hotWalletAutomation={hotWalletAutomation}
					saveAutomation={saveAutomation}
				/>
			</div>
			{locker && policies && (
				<div className="mt-6 flex w-full min-w-fit max-w-md flex-col space-y-2 overflow-visible">
					<div className="flex w-full items-center">
						<Tooltip
							width="w-40"
							label="For security reasons, automations must be individually authorized on each chain."
							placement="auto"
						>
							<span className="cursor-pointer text-sm text-light-600">
								Multi-chain overview
								<span className="ml-2 text-xs">ⓘ</span>
							</span>
						</Tooltip>
					</div>
					<MultiChainOverview
						fundedChainIds={fundedChainIds}
						policies={policies}
						automations={automations}
						chainsNetWorths={chainsNetWorths}
						locker={locker}
						setErrorMessage={setErrorMessage}
						offrampAddresses={offrampAddresses}
					/>
				</div>
			)}
			{errorMessage && (
				<span className="mt-6 text-sm text-error">{errorMessage}</span>
			)}
			{filteredTxs.length > 0 && (
				<div className="mt-6 flex w-full flex-col space-y-2">
					<div className="flex w-full items-center">
						<Tooltip
							width="w-40"
							label="History of all incoming and outgoing transactions from your locker."
							placement="auto"
						>
							<span className="cursor-pointer text-sm text-light-600">
								Transaction history
								<span className="ml-2 text-xs">ⓘ</span>
							</span>
						</Tooltip>
					</div>
					<TxTable txs={filteredTxs} />
				</div>
			)}
			{onboardingFlag && renderLockerOnboardedModal()}
		</div>
	);
}

export default LockerPortfolio;
