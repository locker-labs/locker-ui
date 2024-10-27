import Big from "big.js";
import { PartyPopper } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getEfrogsFloorInfo, IEfrogsFloorInfo } from "@/lib/element";
import { useSendTokensModal } from "@/providers/SendTokensModalProvider";
import { Automation } from "@/types";

import SavingsGoalProgress from "./SavingsGoalProgress";

type EfrogsGoalAchievedDialogProps = {
	efrogsFloorEth: string | null;
	automation: Automation;
	ethUsd: number | null;
	portfolioValue: string;
};

function EfrogsGoalAchievedDialog({
	efrogsFloorEth,
	automation,
	ethUsd,
	portfolioValue,
}: EfrogsGoalAchievedDialogProps) {
	const ethSaved =
		(ethUsd &&
			new Big(portfolioValue).div(ethUsd).mul(automation.allocation)) ||
		Big(0);

	// const savedEnough = true;
	const savedEnough = efrogsFloorEth && Big(ethSaved).gte(efrogsFloorEth);
	const [isClosed, setIsClosed] = useState(!savedEnough);
	const [nftInfo, setNftInfo] = useState<IEfrogsFloorInfo | null>(null);
	const { openModal: openSendTokensModal } = useSendTokensModal();

	useEffect(() => {
		setIsClosed(!savedEnough);
	}, [savedEnough]);

	useEffect(() => {
		const getInfo = async () => {
			try {
				const info = await getEfrogsFloorInfo();
				setNftInfo(info);
			} catch (error) {
				console.error("Error fetching NFT info", error);
			}
		};

		getInfo();
	}, []);

	const nftSection = nftInfo && (
		<Link
			target="_blank"
			href={nftInfo.nftUrl}
			className="border-1 flex w-full flex-row space-x-2 rounded-md border border-gray-300 p-2 shadow-sm xs:space-x-8"
		>
			<div className="w-full max-w-[6rem] xs:max-w-[12rem]">
				<img
					src={nftInfo.nftImgUrl}
					alt={nftInfo.nftName}
					className="w-full rounded-sm"
				/>
			</div>

			<div className="mt-1 flex flex-col xs:mt-4">
				<div className="flex flex-row items-center space-x-2">
					<img
						src={nftInfo.collectionImgUrl}
						alt={nftInfo.collectionName}
						className="h-[1.2rem] w-[1.2rem] rounded-full"
					/>
					<span className="text-xs">{nftInfo.collectionName}</span>
				</div>
				<div className="mb-4 mt-2 text-sm font-semibold ">
					{nftInfo.nftName}
				</div>
				<div className="text-lg font-bold">{efrogsFloorEth} ETH</div>
			</div>
		</Link>
	);

	const handleWithdrawFunds = () => {
		setIsClosed(true);
		openSendTokensModal();
	};

	return (
		<Dialog open={!isClosed} onOpenChange={(open) => setIsClosed(!open)}>
			<DialogContent className="p-2 xs:p-4">
				<DialogHeader>
					<DialogTitle>
						<div className="flex w-full flex-col items-center space-y-4 text-center">
							<PartyPopper className="h-[3.5rem] w-[3.5rem] text-green" />
							<div>You&apos;ve reached your savings goal</div>
						</div>
					</DialogTitle>
				</DialogHeader>
				<div className="max-h-[calc(100vh-200px)] overflow-y-auto p-1">
					<div className="flex flex-col items-center space-y-4">
						<SavingsGoalProgress
							className="bg-[#3DB87D1A]"
							automation={automation}
							ethUsd={ethUsd}
							portfolioValue={portfolioValue}
							efrogsFloorEth={efrogsFloorEth}
						/>
						{nftSection}
					</div>
					<div className="mt-8 flex flex-col self-end">
						<div className="text-center text-sm text-gray-600">
							Withdraw your funds then complete purchase on
							Element marketplace.
						</div>
						<div className="font-seminbold mt-4 flex w-full flex-row justify-between space-x-4 text-xs">
							<button
								className="grow rounded-md bg-locker-600 text-white"
								onClick={handleWithdrawFunds}
							>
								Withdraw funds
							</button>
							<DialogClose
								asChild
								className="border-1 grow rounded-md border border-gray-300 px-4 py-2 text-gray-700"
							>
								<button>Later</button>
							</DialogClose>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default EfrogsGoalAchievedDialog;
