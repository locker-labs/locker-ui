import Big from "big.js";
import React, { useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

type EfrogsGoalAchievedDialogProps = {
	savedEth: string;
	efrogsFloorEth: string;
};

function EfrogsGoalAchievedDialog({
	savedEth,
	efrogsFloorEth,
}: EfrogsGoalAchievedDialogProps) {
	const [isOpen, setIsOpen] = useState(Big(savedEth).gte(efrogsFloorEth));

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogTitle>Savings Goal Achieved!</DialogTitle>
				<DialogDescription>
					Congratulations! You&apos;ve saved {savedEth} ETH, which
					meets or exceeds the goal floor of {efrogsFloorEth} ETH.
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
