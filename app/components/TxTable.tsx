import { Fragment } from "react";
import { IoOpenOutline } from "react-icons/io5";
import { formatUnits } from "viem";

import { supportedChains } from "../../data/constants/supportedChains";
import { useTxDetailsModal } from "../../hooks/useTxDetailsModal";
import { Tx } from "../../types";
import { formatDateUtc } from "../../utils/formatDateUtc";
import { getChainNameFromId } from "../../utils/getChainName";
import { isChainSupported } from "../../utils/isChainSupported";
import { truncateAddress } from "../../utils/truncateAddress";

export interface ITxTable {
	txs: Tx[];
}

function TxTable({ txs }: ITxTable) {
	const { openTxDetailsModal, renderTxDetailsModal } = useTxDetailsModal();

	const getTxHashContent = (tx: Tx) => {
		const chain = supportedChains.find(
			(chainObj) => chainObj.id === tx.chainId
		);

		if (!chain) return null;

		if (chain.blockExplorers) {
			return (
				<a
					className="flex items-center space-x-2 hover:text-secondary-100 hover:underline dark:hover:text-primary-100"
					href={`${chain.blockExplorers.default.url}/tx/${tx.txHash}`}
					target="_blank"
					rel="noopener noreferrer"
					onClick={(e) => e.stopPropagation()}
				>
					<code>{truncateAddress(tx.txHash)}</code>
					<IoOpenOutline className="ml-3 shrink-0" size={14} />
				</a>
			);
		}
		return <code>{truncateAddress(tx.txHash)}</code>;
	};

	const getAddressContent = (chainId: number, address: `0x${string}`) => {
		const chain = supportedChains.find(
			(chainObj) => chainObj.id === chainId
		);

		if (!chain) return null;

		if (chain.blockExplorers) {
			return (
				<a
					className="flex items-center space-x-2 hover:text-secondary-100 hover:underline dark:hover:text-primary-100"
					href={`${chain.blockExplorers.default.url}/address/${address}`}
					target="_blank"
					rel="noopener noreferrer"
					onClick={(e) => e.stopPropagation()}
				>
					<code>{truncateAddress(address)}</code>
					<IoOpenOutline className="ml-3 shrink-0" size={14} />
				</a>
			);
		}
		return <code>{truncateAddress(address)}</code>;
	};

	return (
		<div className="flex w-full flex-col overflow-x-auto rounded-md border border-light-200 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
			<table className="min-w-full divide-y divide-light-200 text-left text-xs dark:divide-dark-200">
				<thead>
					<tr className="text-light-600">
						<th className="px-4 py-3">Date</th>
						<th className="px-4 py-3">Status</th>
						<th className="px-4 py-3">Chain</th>
						<th className="px-4 py-3">Amount</th>
						<th className="px-4 py-3">Tx hash</th>
						<th className="px-4 py-3">To</th>
						<th aria-label="Direction" className="px-4 py-3" />
						<th className="px-4 py-3">From</th>
					</tr>
				</thead>
				<tbody>
					{txs
						.filter((tx) => isChainSupported(tx.chainId))
						.map((tx) => (
							<Fragment key={tx.txHash}>
								<tr
									className="cursor-pointer hover:bg-light-200 dark:hover:bg-dark-400"
									onClick={() => openTxDetailsModal()}
								>
									<td className="px-4 py-3">
										{formatDateUtc(tx.createdAt, false)}
									</td>
									<td className="px-4 py-3">
										{tx.isConfirmed ? (
											<span className="w-fit rounded-full bg-success/20 px-3 py-1 text-success">
												Confirmed
											</span>
										) : (
											<span className="w-fit rounded-full bg-warning/20 px-3 py-1 text-warning">
												Pending
											</span>
										)}
									</td>
									<td className="px-4 py-3">
										<span>
											{getChainNameFromId(tx.chainId)}
										</span>
									</td>
									<td className="px-4 py-3">
										{formatUnits(
											BigInt(tx.amount),
											tx.tokenDecimals
										)}{" "}
										{tx.tokenSymbol}
									</td>
									<td className="px-4 py-3">
										{getTxHashContent(tx)}
									</td>
									<td className="px-4 py-3">
										{getAddressContent(
											tx.chainId,
											tx.toAddress
										)}
									</td>
									<td className="px-4 py-3">
										<span
											className={`w-fit rounded-full ${tx.lockerDirection === "in" ? "bg-success/20 px-3 py-1 text-success" : "bg-warning/20 px-3 py-1 text-warning"}`}
										>
											{tx.lockerDirection === "in"
												? "In"
												: "Out"}
										</span>
									</td>
									<td className="px-4 py-3">
										{getAddressContent(
											tx.chainId,
											tx.fromAddress
										)}
									</td>
								</tr>
								{renderTxDetailsModal(tx)}
							</Fragment>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default TxTable;
