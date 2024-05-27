import { IoOpenOutline } from "react-icons/io5";
import { formatUnits } from "viem";
import type { Chain } from "wagmi/chains";

import ChainIcon from "@/components/ChainIcon";
import { Tx } from "@/types";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromChainObj } from "@/utils/getChainName";

export interface ITxDetails {
	tx: Tx;
	chain: Chain;
}

function TxDetails({ tx, chain }: ITxDetails) {
	return (
		<div className="flex w-full flex-col overflow-x-auto rounded-md border border-light-200 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
			<table className="min-w-full divide-y divide-light-200 text-left text-sm dark:divide-dark-200">
				<tbody className="divide-y divide-light-200 dark:divide-dark-200">
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Date (UTC):
						</td>
						<td className="px-4 py-3">{tx.createdAt}</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Status:
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
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Chain:
						</td>
						<td className="px-4 py-3">
							<div className="flex items-center">
								<div
									className={`flex size-7 items-center justify-center rounded-full ${getChainIconStyling(chain.id)}`}
								>
									<ChainIcon
										className="flex items-center justify-center"
										chainId={chain.id}
										size="16px"
									/>
								</div>
								<span className="ml-3 whitespace-nowrap">
									{getChainNameFromChainObj(chain)}
								</span>
							</div>
						</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Tx hash:
						</td>
						<td className="break-all px-4 py-3">
							{chain.blockExplorers ? (
								<a
									className="flex items-center space-x-2 hover:text-secondary-100 hover:underline dark:hover:text-primary-100"
									href={`${chain.blockExplorers.default.url}/tx/${tx.txHash}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<code>{tx.txHash}</code>
									<IoOpenOutline
										className="ml-3 shrink-0"
										size="16px"
									/>
								</a>
							) : (
								<code>{tx.txHash}</code>
							)}
						</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Locker address:
						</td>
						<td className="break-all px-4 py-3">
							{chain.blockExplorers ? (
								<a
									className="flex items-center space-x-2 hover:text-secondary-100 hover:underline dark:hover:text-primary-100"
									href={`${chain.blockExplorers.default.url}/address/${tx.toAddress}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<code>{tx.toAddress}</code>
									<IoOpenOutline
										className="ml-3 shrink-0"
										size="16px"
									/>
								</a>
							) : (
								<code>{tx.toAddress}</code>
							)}
						</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Sender address:
						</td>
						<td className="break-all px-4 py-3">
							{chain.blockExplorers ? (
								<a
									className="flex items-center space-x-2 hover:text-secondary-100 hover:underline dark:hover:text-primary-100"
									href={`${chain.blockExplorers.default.url}/address/${tx.fromAddress}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<code>{tx.fromAddress}</code>
									<IoOpenOutline
										className="ml-3 shrink-0"
										size="16px"
									/>
								</a>
							) : (
								<code>{tx.fromAddress}</code>
							)}
						</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Amount:
						</td>
						<td className="px-4 py-3">
							{formatUnits(BigInt(tx.amount), tx.tokenDecimals)}{" "}
							{tx.tokenSymbol}
						</td>
					</tr>
					<tr className="flex flex-col items-start sm1:flex-row sm1:items-center">
						<td className="w-36 shrink-0 px-4 py-3 text-light-600">
							Token Type
						</td>
						<td className="px-4 py-3">
							{tx.contractAddress ===
							"0x0000000000000000000000000000000000000000"
								? "Native"
								: "ERC-20"}
						</td>
					</tr>
					{/* Add more rows as needed */}
				</tbody>
			</table>
		</div>
	);
}

export default TxDetails;
