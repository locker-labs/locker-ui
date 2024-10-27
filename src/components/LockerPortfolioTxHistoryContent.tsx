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

import ChainIcon from "./ChainIcon";

export default function LockerPortfolioTxHistoryContent() {
	dayjs.extend(relativeTime);
	const { txs, locker, policies, offrampAddresses } = useLocker();

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

		const isOfframp =
			offrampAddresses &&
			offrampAddresses.find(
				(offrampAddress) =>
					address.toLowerCase() ===
					offrampAddress.address.toLowerCase()
			);

		let text = truncateAddress(address);
		let bgColor = "bg-gray-200";
		if (isLocker) {
			text = "Your locker";
			bgColor = `bg-[#6A30C34D]`;
		} else if (isForward) {
			text = "Forwarding address";
			bgColor = "bg-[#5490D999]";
		} else if (isOfframp) {
			text = "Your bank";
			bgColor = "bg-[#49BFE399]";
		}

		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className={`${bgColor} w-32 break-words rounded-full px-2 py-1 text-center text-xxs`}
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
			<tr key={tx.id}>
				{/* Label: Received/Sent with Icon, Amount and Currency */}
				<td>
					<div className="flex items-center justify-start">
						<div className="flex flex-row space-x-2">
							{!isIncoming && amount && (
								<div className="flex size-8 items-center justify-center border-b-2 border-l-2 pl-2 text-xxs font-bold text-gray-800">
									{Big(tx.amount)
										.div(amount)
										.mul(100)
										.toFixed(0)}
									%
								</div>
							)}
							<div>
								<ChainIcon chainId={tx.chainId} size="2rem" />
							</div>
							<div className="flex flex-col">
								<span className="flex flex-row items-center text-xxs font-semibold">
									{directionLabel}
									<span className="ml-2 rounded-full bg-locker-600 text-white">
										{isIncoming ? (
											<ArrowDown size={16} />
										) : (
											<ArrowUp size={16} />
										)}
									</span>
								</span>
								<span className="text-xs">
									{formatAmount(tx.amount, tx.tokenDecimals)}{" "}
									{tx.tokenSymbol}
								</span>
							</div>
						</div>
					</div>
				</td>

				{/* Time */}
				<td>
					<span className=" text-xxs text-gray-500">
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

				{/* From */}
				<td className="text-xxs">
					<div className="flex flex-row items-center justify-start space-x-2">
						<span className="font-semibold">From</span>
						{getCounterpartyLabel(tx.fromAddress)}
					</div>
				</td>

				{/* To */}
				<td className="text-xxs">
					<div className="flex flex-row items-center justify-start space-x-2">
						<span className="font-semibold">To</span>
						{getCounterpartyLabel(tx.toAddress)}
					</div>
				</td>

				{/* Confirmed/Pending */}
				<td className="text-xxs">
					<div className="flex flex-row items-center justify-start space-x-2">
						<span
							className={`${
								isConfirmed
									? "rounded-full bg-tx-confirmed px-2 py-1"
									: "rounded-full bg-gray-300 px-2 py-1"
							}`}
						>
							{isConfirmed ? "Confirmed" : "Pending"}
						</span>
					</div>
				</td>

				{/* View on Explorer */}
				<td className="py-2">
					<a
						href={`${chain.blockExplorers?.default.url}/tx/${tx.txHash}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-row justify-center space-x-2 text-xxs font-semibold text-locker-700"
					>
						<span>View on Explorer</span> <ArrowUpRight size={18} />
					</a>
				</td>
			</tr>
		);
	};

	// Filter transactions without triggeredByTokenTxId (outgoing without a corresponding incoming)
	const unlinkedOutgoingTxs = txs.filter(
		(tx) =>
			tx.lockerDirection === ELockerDirection.OUT &&
			!tx.triggeredByTokenTxId
	);

	// Group the incoming transactions and find linked transactions
	const incomingTxs = txs.filter(
		(tx) => tx.lockerDirection === ELockerDirection.IN
	);

	// Sort incoming and unlinked outgoing transactions together by creation time
	const allTxs = [...incomingTxs, ...unlinkedOutgoingTxs].sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	const renderGroup = (incomingTx: Tx) => {
		const relatedTxs = txs.filter(
			(tx) => tx.triggeredByTokenTxId === incomingTx.id
		);

		return (
			<div key={incomingTx.id}>
				<table className="w-full table-auto border-separate border-spacing-x-3 border-spacing-y-2 text-left xl:table-fixed">
					<thead className="text-xs uppercase text-gray-600" />
					<tbody className="text-xs lg:text-sm xxl:text-base">
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
			{allTxs.length > 0 ? (
				allTxs.map((incomingTx) => renderGroup(incomingTx))
			) : (
				<p className="text-sm text-gray-500">No transactions found.</p>
			)}
		</div>
	);
}
