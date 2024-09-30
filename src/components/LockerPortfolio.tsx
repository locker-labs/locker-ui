"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { paths } from "@/data/constants/paths";
import { supportedChainIdsArray } from "@/data/constants/supportedChains";
import { useLockerOnboardedModal } from "@/hooks/useLockerOnboardedModal";
import { getLockerNetWorth } from "@/services/moralis";
import { getTokenBalances } from "@/services/transactions";
import { Token } from "@/types";
import { isChainSupported } from "@/utils/isChainSupported";
import { isTestnet } from "@/utils/isTestnet";

import { useLocker } from "../providers/LockerProvider";
import LockerPortfolioAutomations from "./LockerPortfolioAutomations";
import LockerPortfolioSavingsGoals from "./LockerPortfolioSavingsGoals";
import LockerPortfolioTxHistory from "./LockerPortfolioTxHistory";
import LockerPortfolioValue from "./LockerPortfolioValue";

function LockerPortfolio() {
	const { locker, policies, txs } = useLocker();
	const [tokens, setTokens] = useState<Token[]>([]);
	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_chainsNetWorths, setChainsNetWorths] = useState<
		Record<number, string>
	>({});

	const { getToken } = useAuth();

	const searchParams = useSearchParams();

	const { openLockerOnboardedModal, renderLockerOnboardedModal } =
		useLockerOnboardedModal();
	const onboardingFlag = searchParams.get("o");

	useEffect(() => {
		if (onboardingFlag) openLockerOnboardedModal();
	}, [onboardingFlag]);

	const shouldSetupFirstPolicy =
		!policies || (policies && policies.length === 0);

	if (shouldSetupFirstPolicy) redirect(paths.ONBOARDING);

	// Props destructured variables
	// const { txs } = locker;
	const filteredTxs = txs
		? txs.filter((tx) => isChainSupported(tx.chainId))
		: [];
	const basePolicy = policies[0];
	const { automations } = basePolicy;

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
		if (authToken && locker?.id) {
			const list = await getTokenBalances(authToken, locker.id);
			const filteredList = list
				? list.filter((token) => isChainSupported(token.chainId))
				: [];
			setTokens(filteredList);
			console.log("Token list: ", filteredList);
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
		<div className="flex w-full flex-col space-y-4 bg-locker-25">
			<div className="grid grid-flow-row-dense grid-cols-2 gap-2 xxs:grid-cols-1 sm:grid-cols-11">
				<div className="xxs:col-span1 overflow-auto rounded-md bg-white p-4 sm:col-span-4 sm:h-96">
					<LockerPortfolioValue
						portfolioValue={lockerNetWorth}
						tokens={tokens}
					/>
				</div>

				<div className="overflow-auto rounded-md bg-white p-4 xxs:col-span-1 sm:col-span-3 sm:h-96">
					<LockerPortfolioAutomations automations={automations} />
				</div>

				<div className="col-span-2 overflow-auto rounded-md bg-white p-4 xxs:col-span-1 sm:col-span-4 sm:h-96">
					<LockerPortfolioSavingsGoals />
				</div>
			</div>
			<div className="w-full overflow-auto rounded-md bg-white p-4 xxs:col-span-1 sm:min-h-96">
				<LockerPortfolioTxHistory />
			</div>
			{onboardingFlag && renderLockerOnboardedModal()}
		</div>
	);
}

export default LockerPortfolio;
