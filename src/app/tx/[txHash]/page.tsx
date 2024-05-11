"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { formatUnits } from "viem";
import type { Chain } from "wagmi/chains";

import Loader from "@/components/Loader";
import { paths } from "@/data/constants/paths";
import { supportedChains } from "@/data/constants/supportedChains";
import { getTx } from "@/services/transactions";
import { Tx } from "@/types";

export default function Transaction({
	params,
}: {
	params: { txHash: string };
}) {
	const router = useRouter();
	const [transaction, setTransaction] = useState<Tx | null>(null);
	const [chain, setChain] = useState<Chain | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const handleContinue = () => {
		// If locker is NOT deployed, home page will render DashboardLockerSetup
		// If locker is deployed, home page will render DashboardLockerSetup DashboardLockerPortfolio
		router.push(paths.HOME);
	};

	const getTxDetails = async () => {
		// Show Loader for 1.5 seconds for testing
		await new Promise((resolve) => {
			setTimeout(resolve, 1500);
		});
		const dummyToken = "dummyToken";
		const tx = await getTx(dummyToken, params.txHash);
		setTransaction(tx);
		setChain(
			supportedChains.find(
				(chainObj) => chainObj.id === tx?.chainId
			) as Chain
		);
		setIsLoading(false);
	};

	useEffect(() => {
		getTxDetails();
	}, [params.txHash]);

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isLoading && <Loader />}
			{!isLoading && transaction && chain && (
				<div className="flex flex-col items-center justify-center space-y-12 text-center">
					<span className="text-xl">Great News!</span>
					<IoCheckmarkCircle
						className="flex self-center justify-self-center text-success placeholder:place-self-center"
						size="50px"
					/>

					<div>
						<span className="text-2xl font-normal">
							You received{" "}
							<strong>
								{formatUnits(
									BigInt(transaction.amount),
									transaction.tokenDecimals
								)}{" "}
								{transaction.tokenSymbol}
							</strong>{" "}
						</span>
						<p className="text-center">
							on{" "}
							{chain.name === "OP Mainnet"
								? "Optimism"
								: chain.name === "Arbitrum One"
									? "Arbitrum"
									: chain.name}
							!
						</p>
					</div>

					<button
						className="h-14 w-40 rounded-full bg-secondary-100 text-lg text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => handleContinue()}
					>
						Continue
					</button>
				</div>
			)}
			{!isLoading && !transaction && (
				<span className="mb-12 text-2xl">Transaction Not Found</span>
			)}
		</div>
	);
}

// Test URL
// http://localhost:3000/tx/0x881b5a18637dc1b127e4a2580074d91c3662b9b00e6fe502bc821364c7f80f69
