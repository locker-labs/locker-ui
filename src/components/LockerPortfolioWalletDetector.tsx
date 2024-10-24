import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useAccount } from "wagmi";

import { useLocker } from "@/providers/LockerProvider";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

export default function LockerPortfolioWalletDetector() {
	const { address } = useAccount();
	const { locker } = useLocker();
	const [isOpen, setIsOpen] = React.useState(false);
	const searchParams = useSearchParams();
	const onboardingFlag = searchParams.get("o");

	// Check if the current account address does not match the locker owner address
	React.useEffect(() => {
		const isWrongAddress =
			address &&
			locker &&
			address.toLowerCase() !== locker.ownerAddress.toLowerCase() &&
			!onboardingFlag;
		if (isWrongAddress) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [address, locker, onboardingFlag]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-md text-center">
				<div className="mb-4 flex justify-center">
					<TriangleAlert
						color="white"
						fill="#FFA336"
						size={63}
						className="mr-1"
					/>{" "}
				</div>
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold">
						Wrong wallet detected
					</DialogTitle>
					<DialogDescription className="mt-2 text-sm text-gray-600">
						Your wallet&apos;s current account is not the owner of
						this locker
					</DialogDescription>
				</DialogHeader>
				<div className="mb-6 mt-4 text-sm">
					<p className="font-semibold text-gray-800">
						Expected wallet:
					</p>
					<p className="mt-1 text-sm">{locker?.ownerAddress}</p>
				</div>
				<DialogFooter>
					<DialogClose className="w-full rounded-md bg-locker-600 py-2 text-white">
						I understand
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
