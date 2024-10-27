"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { paths } from "@/data/constants/paths";
import { supportedChainIdsArray } from "@/data/constants/supportedChains";
import { useLockerOnboardedModal } from "@/hooks/useLockerOnboardedModal";
import { useSendTokensModal } from "@/providers/SendTokensModalProvider";
import { getLockerNetWorth } from "@/services/moralis";
import { getTokenBalances } from "@/services/transactions";
import { isChainSupported } from "@/utils/isChainSupported";
import { isTestnet } from "@/utils/isTestnet";

import { useLocker } from "../providers/LockerProvider";
import LockerPortfolioAutomations from "./LockerPortfolioAutomations";
import LockerPortfolioSavingsGoals from "./LockerPortfolioSavingsGoals";
import LockerPortfolioTxHistory from "./LockerPortfolioTxHistory";
import LockerPortfolioValue from "./LockerPortfolioValue";
import LockerPortfolioWalletDetector from "./LockerPortfolioWalletDetector";

function LockerPortfolio() {
	const { locker, txs, automations } = useLocker();
	// Props destructured variables
	// const { txs } = locker;
	const filteredTxs = txs
		? txs.filter((tx) => isChainSupported(tx.chainId))
		: [];

	const [lockerNetWorth, setLockerNetWorth] = useState<string>("0.00");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_chainsNetWorths, setChainsNetWorths] = useState<
		Record<number, string>
	>({});

	const { getToken } = useAuth();

	const searchParams = useSearchParams();
	const { setTokens, tokens } = useSendTokensModal();
	const { openLockerOnboardedModal, renderLockerOnboardedModal } =
		useLockerOnboardedModal();
	const onboardingFlag = searchParams.get("o");

	useEffect(() => {
		if (onboardingFlag) openLockerOnboardedModal();
	}, [onboardingFlag]);

	if (!automations || automations.length === 0) redirect(paths.ONBOARDING);

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
		}
	};

	const fetchLockerNetWorth = async () => {
		// in order to not use up credits,
		// we only fetch the net worth if there are transactions
		// in development, there will sometimes be no transactions in DB,
		// but there will be tokens with balance from previous usage

		if (locker && (filteredTxs.length > 0 || tokens.length > 0)) {
			const mainnetChainIds = supportedChainIdsArray.filter(
				(chainId) => !isTestnet(chainId)
			);

			const netWorth = await getLockerNetWorth(
				locker.address,
				mainnetChainIds
			);

			if (netWorth && netWorth.totalNetWorth !== lockerNetWorth) {
				setLockerNetWorth(netWorth.totalNetWorth);
			}

			if (netWorth && netWorth.chainsNetWorth !== _chainsNetWorths) {
				setChainsNetWorths(netWorth.chainsNetWorth);
			}
		}
	};

	useEffect(() => {
		if (filteredTxs.length > 0 || tokens.length > 0) {
			fetchLockerNetWorth();
		}
	}, [txs, tokens]); // filteredTxs is not a state variable and will cause re-renders if used instead

	useEffect(() => {
		if (filteredTxs.length > 0 || lockerNetWorth !== "0.00") {
			getTokenList();
		}
	}, [txs, lockerNetWorth]);

	return (
		<div className="flex w-full max-w-[55rem] flex-col space-y-4 bg-locker-25">
			<div className="grid grid-flow-row-dense grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-11">
				<div className="col-span-1 overflow-auto rounded-md bg-white p-4 lg:col-span-1 lg:h-96 xl:col-span-4">
					<LockerPortfolioValue
						portfolioValue={lockerNetWorth}
						tokens={tokens}
					/>
				</div>

				<div className="col-span-1 overflow-auto rounded-md bg-white p-4 lg:col-span-1 lg:h-96 xl:col-span-3">
					<LockerPortfolioAutomations automations={automations} />
				</div>

				<div className="col-span-1 overflow-auto rounded-md bg-white p-4 lg:col-span-2 xl:col-span-4 xl:h-96">
					<LockerPortfolioSavingsGoals
						portfolioValue={lockerNetWorth}
					/>
				</div>
			</div>
			<div className="col-span-1 w-full overflow-auto rounded-md bg-white p-4 lg:min-h-96">
				<LockerPortfolioTxHistory tokens={tokens} />
			</div>
			{onboardingFlag && renderLockerOnboardedModal()}
			<LockerPortfolioWalletDetector />
		</div>
	);
}

export default LockerPortfolio;
