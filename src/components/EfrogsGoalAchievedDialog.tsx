import Big from "big.js";
import { PartyPopper } from "lucide-react";
import React, { useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
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
	const floor = process.env.NEXT_PUBLIC_EFROGS_FLOOR || efrogsFloorEth;
	const ethSaved =
		(ethUsd &&
			new Big(portfolioValue).div(ethUsd).mul(automation.allocation)) ||
		Big(0);
	console.log("ethSaved", ethSaved.toString());
	console.log("floor", floor);
	const savedEnough = true;
	// const savedEnough = floor && Big(ethSaved).gte(floor);
	const [isClosed, setIsClosed] = useState(!savedEnough);

	const handleClose = () => {
		setIsClosed(true);
	};

	return (
		<Dialog open={!isClosed} onOpenChange={setIsClosed}>
			<DialogContent>
				<DialogTitle>
					<div className="flex w-full flex-col items-center space-y-4 text-center">
						<PartyPopper className="h-[3.5rem] w-[3.5rem] text-green" />
						<div>You&apos;ve reached your savings goal</div>
					</div>
				</DialogTitle>
				<DialogDescription>
					<div className="flex flex-col items-center space-y-4">
						<SavingsGoalProgress
							automation={automation}
							ethUsd={ethUsd}
							portfolioValue={portfolioValue}
							efrogsFloorEth={efrogsFloorEth}
						/>
					</div>
				</DialogDescription>
				<DialogClose
					asChild
					onClick={handleClose}
					className="mt-4 self-end rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				>
					<button>Close</button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

export default EfrogsGoalAchievedDialog;
