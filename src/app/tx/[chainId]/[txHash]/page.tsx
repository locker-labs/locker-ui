"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdPending } from "react-icons/md";
import { formatUnits } from "viem";
import type { Chain } from "wagmi/chains";

import Loader from "@/components/Loader";
import TxDetails from "@/components/TxDetails";
import { paths } from "@/data/constants/paths";
import { supportedChains } from "@/data/constants/supportedChains";
import { getTx } from "@/services/transactions";
import { Tx } from "@/types";
import { getChainNameFromChainObj } from "@/utils/getChainName";

export default function Transaction({
	params,
}: {
	params: { txHash: string; chainId: string };
}) {
	const router = useRouter();
	const [transaction, setTransaction] = useState<Tx | null>(null);
	const [chain, setChain] = useState<Chain | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { getToken } = useAuth();

	const handleContinue = () => {
		// If locker is NOT deployed, home page will render LockerSetup
		// If locker is deployed, home page will render LockerPortfolio
		router.push(paths.HOME);
	};

	const getChain = () => {
		setChain(
			supportedChains.find(
				(chainObj) => chainObj.id === Number(params.chainId)
			) as Chain
		);
	};

	const getTxDetails = async () => {
		const authToken = await getToken();
		if (authToken) {
			const tx = await getTx(
				authToken,
				Number(params.chainId),
				params.txHash
			);
			setTransaction(tx);
		}
		setIsLoading(false);
	};

	const renderPending =
		!isLoading && transaction && !transaction.isConfirmed && chain;

	const renderConfirmed =
		!isLoading && transaction && transaction.isConfirmed && chain;

	useEffect(() => {
		getChain();
		getTxDetails();
	}, [params.txHash]);

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isLoading && <Loader />}
			{renderPending ? (
				<div className="flex w-full flex-col items-center justify-center space-y-12 text-center">
					<span className="text-xl">Payment pending</span>
					<MdPending className="text-warning" size={50} />
					<div className="flex w-full max-w-sm flex-col items-center justify-center">
						<span className="text-xl">
							You received{" "}
							<strong className="text-2xl">
								{formatUnits(
									BigInt(transaction.amount),
									transaction.tokenDecimals
								)}{" "}
								{transaction.tokenSymbol}
							</strong>{" "}
							<span>on {getChainNameFromChainObj(chain)}!</span>
						</span>
					</div>
					<button
						className="h-14 w-40 rounded-full bg-secondary-100 text-lg text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => handleContinue()}
					>
						Continue
					</button>
					<span className="text-sm text-light-600">
						Transaction confirmation may take several minutes.
					</span>
					<TxDetails tx={transaction} chain={chain} />
				</div>
			) : renderConfirmed ? (
				<div className="flex w-full flex-col items-center justify-center space-y-12 text-center">
					<span className="text-xl">Payment confirmed</span>
					<IoCheckmarkCircle className="text-success" size={50} />
					<div className="flex w-full max-w-sm flex-col items-center justify-center">
						<span className="text-xl">
							You received{" "}
							<strong className="text-2xl">
								{formatUnits(
									BigInt(transaction.amount),
									transaction.tokenDecimals
								)}{" "}
								{transaction.tokenSymbol}
							</strong>{" "}
							<span>on {getChainNameFromChainObj(chain)}!</span>
						</span>
					</div>
					<button
						className="h-14 w-40 rounded-full bg-secondary-100 text-lg text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => handleContinue()}
					>
						Continue
					</button>
					<TxDetails tx={transaction} chain={chain} />
				</div>
			) : null}
			{!isLoading && !transaction && (
				<span className="mb-12 text-2xl">Transaction Not Found</span>
			)}
		</div>
	);
}

// Example URL
// http://localhost:3000/tx/11155111/0x17482e888aae9e7897ebbc851f134d3aaeebaff8df65d2a453094a2ce1b478df
