import Big from "big.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocker } from "@/providers/LockerProvider";
import { EAutomationType, ELockerDirection, Tx } from "@/types";
import { getChainObjFromId } from "@/utils/getChainObj";
import { truncateAddress } from "@/utils/truncateAddress";

export default function LockerPortfolioTxHistoryContent() {
	dayjs.extend(relativeTime);
	const { txs, locker, policies } = useLocker();

	// Helper function to format amount
	const formatAmount = (amount: string, decimals: number) => {
		// Create a Big number instance from the input amount
		let num = new Big(amount);

		// Divide the number by 10 to the power of decimals to shift the decimal place
		num = num.div(new Big(10).pow(decimals));

		// Convert to string with fixed decimals, and ensure trailing zeros are maintained if necessary
		let formatted = num.toFixed(decimals);

		// Check for trailing zeros and decimal point adjustments
		if (formatted.includes(".")) {
			// Remove unnecessary trailing zeros while ensuring at least two decimal places
			formatted = formatted.replace(/(\.\d*?)0+$/, "$1");
			if (formatted.endsWith(".")) {
				formatted += "00"; // Append '00' if it ends with a decimal point
			} else if (/\.\d$/.test(formatted)) {
				formatted += "0"; // Append '0' if there's only one digit after the decimal
			}
		} else {
			formatted += ".00"; // Append '.00' if no decimal part
		}

		return formatted;
	};

	const getCounterpartyLabel = (address: `0x${string}`) => {
		const isLocker = address === locker?.address;
		const isForward =
			policies &&
			address.toLowerCase() ===
				policies[0].automations
					.find((a) => a.type === EAutomationType.FORWARD_TO)
					?.recipientAddress?.toLowerCase();

		let text = truncateAddress(address);
		let bgColor = "bg-gray-300";
		if (isLocker) {
			text = "Your locker";
			bgColor = "bg-locker-50";
		} else if (isForward) {
			text = "Forward to";
			bgColor = "bg-tx-forward";
		}

		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={`${bgColor} rounded-full px-2 py-1 sm:text-xs lg:text-lg`}
						>
							{text}
						</div>
					</TooltipTrigger>
					<TooltipContent>{address}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	};

	// Function to render a transaction row
	const renderTxRow = (tx: Tx, amount?: string) => {
		const { isConfirmed } = tx;
		const txDate = new Date(tx.createdAt).toLocaleString();
		const isIncoming = tx.lockerDirection === ELockerDirection.IN;

		const directionLabel = isIncoming ? "Received" : "Sent";
		const chain = getChainObjFromId(tx.chainId)!;

		return (
			<tr key={tx.id} className="text-sm">
				{/* Label: Received/Sent with Icon, Amount and Currency */}
				<td>
					<div className="flex items-center justify-start text-sm">
						<div className="flex flex-row space-x-2">
							{!isIncoming && amount && (
								<div className="flex size-8 items-center justify-center border-b-2 border-l-2 text-xs font-bold">
									{Big(tx.amount)
										.div(amount)
										.mul(100)
										.toFixed(0)}
									%
								</div>
							)}
							<div className="flex flex-col">
								<span className="flex flex-row items-center font-semibold">
									{directionLabel}
									<span className="ml-2 rounded-full bg-locker-600 text-white">
										{isIncoming ? (
											<ArrowDown size={16} />
										) : (
											<ArrowUp size={16} />
										)}
									</span>
								</span>
								<span>
									{formatAmount(tx.amount, tx.tokenDecimals)}{" "}
									{tx.tokenSymbol}
								</span>
							</div>
						</div>
					</div>
				</td>

				{/* From */}
				<td>
					<div className="flex flex-row items-center justify-start space-x-2 text-sm">
						<span className="font-semibold">From</span>
						{getCounterpartyLabel(tx.fromAddress)}
					</div>
				</td>

				{/* To */}
				<td>
					<div className="flex flex-row items-center justify-start space-x-2 text-sm">
						<span className="font-semibold">To</span>
						{getCounterpartyLabel(tx.toAddress)}
					</div>
				</td>

				{/* Confirmed/Pending */}
				<td>
					<div className="flex flex-row items-center justify-start space-x-2">
						<span
							className={`${
								isConfirmed
									? "rounded-full bg-tx-confirmed px-2 py-1 text-sm"
									: "rounded-full px-2 py-1 text-sm text-gray-300"
							}`}
						>
							{isConfirmed ? "Confirmed" : "Pending"}
						</span>
					</div>
				</td>

				{/* Time */}
				<td>
					<span className="text-xs text-gray-500">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span>{dayjs(txDate).fromNow()}</span>
								</TooltipTrigger>
								<TooltipContent>
									{dayjs(txDate).toString()}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</span>
				</td>

				{/* View on Explorer */}
				<td className="py-2 text-sm">
					<a
						href={`${chain.blockExplorers?.default.url}/tx/${tx.txHash}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-semibold flex flex-row justify-center space-x-2 text-xs font-semibold text-locker-700"
					>
						<span>View on Explorer</span> <ArrowUpRight size={18} />
					</a>
				</td>
			</tr>
		);
	};

	// Group the transactions where lockerDirection === 'in' and find linked transactions
	const incomingTxs = txs.filter(
		(tx) => tx.lockerDirection === ELockerDirection.IN
	);

	const renderGroup = (incomingTx: Tx) => {
		const relatedTxs = txs.filter(
			(tx) => tx.triggeredByTokenTxId === incomingTx.id
		);

		return (
			<div key={incomingTx.id}>
				<table className="w-full table-fixed border-separate border-spacing-y-2 text-left">
					<thead className="text-xs uppercase text-gray-600" />
					<tbody className="">
						{/* Render the "in" transaction first */}
						{renderTxRow(incomingTx)}

						{/* Render all related transactions below, indented */}
						{relatedTxs.map((tx) =>
							renderTxRow(tx, incomingTx.amount)
						)}
					</tbody>
				</table>
				{/* Horizontal divider between groups */}
				<hr className="my-4" />
			</div>
		);
	};

	return (
		<div className="w-full">
			{incomingTxs.length > 0 ? (
				incomingTxs.map((incomingTx) => renderGroup(incomingTx))
			) : (
				<p className="text-sm text-gray-500">No transactions found.</p>
			)}
		</div>
	);
}
