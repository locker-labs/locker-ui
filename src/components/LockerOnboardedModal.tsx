import { useRouter, useSearchParams } from "next/navigation"; // Import from next/navigation
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
	const router = useRouter(); // Get the router
	const searchParams = useSearchParams(); // Get the search params

	// Function to handle closing the modal and removing 'o' param
	const handleCloseModal = () => {
		// Get the current query parameters
		const params = new URLSearchParams(searchParams.toString());
		params.delete("o"); // Remove 'o' from the query

		// Replace the current URL without the 'o' param
		router.replace(`?${params.toString()}`, { shallow: true });

		// Trigger the passed-in closeModal function to close the modal
		closeModal();
	};

	if (!lockers) return null;
	const locker = lockers[0];
	const { address: lockerAddress } = locker;

	return (
		<Dialog open={isOpen} onOpenChange={handleCloseModal}>
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
