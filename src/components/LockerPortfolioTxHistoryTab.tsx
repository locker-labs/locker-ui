import { useChainId } from "wagmi";

import { useLocker } from "@/providers/LockerProvider";

import LockerPortfolioTxHistoryContent from "./LockerPortfolioTxHistoryContent";
import QrCodeModal from "./QrCodeModal";

export default function LockerPortfolioTxHistoryTab() {
	const chainId = useChainId();

	const { locker, txs } = useLocker();

	const hasTxs = txs.length > 0;

	if (hasTxs)
		return (
			<div>
				<LockerPortfolioTxHistoryContent />
			</div>
		);

	return (
		<div className="flex flex-col space-y-7">
			<div className="flex flex-col space-y-3 text-sm">
				<p>No transactions yet.</p>
				<p>
					Fund your Locker address to start automatically moving funds
					whenever you receive a deposit.
				</p>
			</div>
			<div>
				<QrCodeModal
					button={
						<button className="rounded-md px-4 py-1 text-sm text-gray-500 outline outline-1 outline-gray-300">
							Fund Locker
						</button>
					}
					lockerAddress={locker?.address || "0x"}
					chainId={chainId}
				/>
			</div>
		</div>
	);
}
