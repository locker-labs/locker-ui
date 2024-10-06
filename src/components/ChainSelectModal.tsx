import { useSwitchChain } from "wagmi";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"; // Assuming you have these set up according to ShadCN

import ChainDropdown from "./ChainDropdown";

interface IChainSelectModal {
	open: boolean;
	onClose: () => void;
	createNewPolicy: () => void;
}

function ChainSelectModal({
	open,
	onClose,
	createNewPolicy,
}: IChainSelectModal) {
	const { isPending, switchChain } = useSwitchChain();

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[644px]">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold">
						Select a chain for your locker
					</DialogTitle>
					<DialogDescription className="max-w-[544px] text-center text-sm text-gray-600">
						You can change or add new chains at any time.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-6 flex w-full flex-col items-center justify-center space-y-8">
					<ChainDropdown
						showName
						switchChain={switchChain}
						isPending={isPending}
					/>

					<div className="flex w-full flex-col items-center space-y-4">
						{isPending ? (
							<button
								className="w-full cursor-not-allowed select-none justify-center rounded-sm bg-locker-300 py-2 text-sm font-semibold text-white"
								disabled
							>
								Switching chains
							</button>
						) : (
							<button
								className="hover:bg-secondary-200 w-full cursor-pointer select-none justify-center rounded-sm bg-locker-600 py-2 text-sm font-semibold text-white"
								onClick={createNewPolicy}
							>
								Finish setup
							</button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ChainSelectModal;
