import { useChainId } from "wagmi";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useLocker } from "@/providers/LockerProvider";

import LockerPortfolioTxHistoryContent from "./LockerPortfolioTxHistoryContent";

export default function LockerPortfolioTxHistory() {
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();
	const chainId = useChainId();

	const { locker, txs } = useLocker();

	const hasTxs = txs.length > 0;

	const body = hasTxs ? (
		<div>
			<LockerPortfolioTxHistoryContent />
		</div>
	) : (
		<div className="flex flex-col space-y-7">
			<div className="flex flex-col space-y-3 text-sm">
				<p>No transactions yet.</p>
				<p>
					Fund your Locker address to start automatically moving funds
					whenever you receive a deposit.
				</p>
			</div>
			<div>
				<button
					className="rounded-md px-4 py-1 text-sm text-gray-500 outline outline-1 outline-gray-300"
					onClick={openQrCodeModal}
				>
					Fund Locker
				</button>
			</div>

			{locker && renderQrCodeModal(locker?.address, chainId)}
		</div>
	);

	return (
		<div className="flex h-full w-full flex-col space-y-7">
			<p className="text-lg font-bold">Transaction History</p>
			{body}
		</div>
	);
}
