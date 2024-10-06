import WalletButtons from "@/components/ConnectModal/WalletButtons";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"; // Your custom Radix dialog setup

interface ConnectModalProps {
	open: boolean;
	onClose: () => void;
}

export function ConnectModal({ open, onClose }: ConnectModalProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold">
						Connect Your Wallet
					</DialogTitle>
					<DialogDescription className="gray-600 max-w-[544px] text-center text-sm">
						We use your public address to generate an on-chain
						account that belongs to you.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 flex flex-col items-center space-y-2">
					<WalletButtons />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ConnectModal;
