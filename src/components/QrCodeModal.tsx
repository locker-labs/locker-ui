import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import QrModalContent from "./QrModalContent";

interface QrCodeModalProps {
	lockerAddress: `0x${string}`;
	chainId: number;
	// eslint-disable-next-line react/require-default-props
	button?: React.ReactNode; // Optional custom button prop
}

export default function QrCodeModal({
	lockerAddress,
	chainId,
	button,
}: QrCodeModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{button || <Button variant="outline">Show QR Code</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[640px]">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold">
						Deposit funds
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col items-center space-y-4">
					<DialogDescription className="text-center text-sm text-gray-600 sm:max-w-[400px]">
						To start saving, fund your locker with ETH or ERC20
						using the address below.{" "}
						<Link
							href="https://docs.locker.money"
							className="text-locker-300"
							target="_blank"
						>
							Learn more
						</Link>
						.
					</DialogDescription>

					{/* QR Code or Address content */}
					<QrModalContent
						lockerAddress={lockerAddress}
						chainId={chainId}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
