import { useChainId } from "wagmi";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"; // Assuming you have ShadCN's dialog components in place
import { useLocker } from "@/providers/LockerProvider";

import { IconGreenCheck } from "./Icons";
import QrModalContent from "./QrModalContent";

export interface LockerOnboardedModalProps {
	isOpen: boolean;
	closeModal: () => void;
}

function LockerOnboardedModal({
	isOpen,
	closeModal,
}: LockerOnboardedModalProps) {
	const { lockers } = useLocker();
	const chainId = useChainId();

	if (!lockers) return null;
	const locker = lockers[0];
	const { address: lockerAddress } = locker;

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent className="max-w-[640px] p-6">
				<DialogHeader className="flex items-center justify-between">
					<div className="flex justify-center">
						<IconGreenCheck />
					</div>
					<DialogTitle className="w-full text-center text-xl font-bold">
						Your locker is ready
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col items-center space-y-4">
					<DialogDescription className="text-center text-sm text-gray-600 sm:max-w-[400px]">
						To start saving, fund your locker with ETH or ERC20
						using the address below.
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

export default LockerOnboardedModal;
