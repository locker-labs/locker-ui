import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose, IoOpenOutline } from "react-icons/io5";
import { formatUnits } from "viem";

import ChainIcon from "@/components/ChainIcon";
import { Tx } from "@/types";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromChainObj } from "@/utils/getChainName";
import { getChainObjFromId } from "@/utils/getChainObj";

export interface ITxDetailsModal {
	isOpen: boolean;
	closeModal: () => void;
	tx: Tx;
}

function TxDetailsModal({ isOpen, closeModal, tx }: ITxDetailsModal) {
	const chain = getChainObjFromId(tx.chainId)!;

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="bg-dark-600/75 fixed inset-0" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="bg-light-100 dark:bg-dark-500 flex w-full min-w-64 max-w-4xl flex-col items-center justify-center overflow-hidden rounded-2xl p-6 shadow-xl">
								<Dialog.Title
									as="h3"
									className="flex w-full items-center justify-between"
								>
									<span className="text-lg font-medium">
										Transaction details
									</span>
									<button
										className="bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300 rounded-full p-1"
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center overflow-x-auto">
									<table className="divide-light-200 dark:divide-dark-200 min-w-full divide-y text-left text-sm">
										<tbody className="divide-light-200 dark:divide-dark-200 divide-y">
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													Date (UTC):
												</td>
												<td className="px-4 py-3">
													{tx.createdAt}
												</td>
											</tr>
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
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
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													Chain:
												</td>
												<td className="px-4 py-3">
													<div className="flex items-center">
														<div
															className={`flex size-7 items-center justify-center rounded-full ${getChainIconStyling(chain.id)}`}
														>
															<ChainIcon
																className="flex items-center justify-center"
																chainId={
																	chain.id
																}
																size="16px"
															/>
														</div>
														<span className="ml-3 whitespace-nowrap">
															{getChainNameFromChainObj(
																chain
															)}
														</span>
													</div>
												</td>
											</tr>
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													Tx hash:
												</td>
												<td className="break-all px-4 py-3">
													{chain.blockExplorers ? (
														<a
															className="hover:text-secondary-100 dark:hover:text-primary-100 flex items-center space-x-2 hover:underline"
															href={`${chain.blockExplorers.default.url}/tx/${tx.txHash}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															<code>
																{tx.txHash}
															</code>
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
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													To:
												</td>
												<td className="break-all px-4 py-3">
													{chain.blockExplorers ? (
														<a
															className="hover:text-secondary-100 dark:hover:text-primary-100 flex items-center space-x-2 hover:underline"
															href={`${chain.blockExplorers.default.url}/address/${tx.toAddress}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															<code>
																{tx.toAddress}
															</code>
															<IoOpenOutline
																className="ml-3 shrink-0"
																size="16px"
															/>
														</a>
													) : (
														<code>
															{tx.toAddress}
														</code>
													)}
												</td>
											</tr>
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													From:
												</td>
												<td className="break-all px-4 py-3">
													{chain.blockExplorers ? (
														<a
															className="hover:text-secondary-100 dark:hover:text-primary-100 flex items-center space-x-2 hover:underline"
															href={`${chain.blockExplorers.default.url}/address/${tx.fromAddress}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															<code>
																{tx.fromAddress}
															</code>
															<IoOpenOutline
																className="ml-3 shrink-0"
																size="16px"
															/>
														</a>
													) : (
														<code>
															{tx.fromAddress}
														</code>
													)}
												</td>
											</tr>
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													Amount:
												</td>
												<td className="px-4 py-3">
													{formatUnits(
														BigInt(tx.amount),
														tx.tokenDecimals
													)}{" "}
													{tx.tokenSymbol}
												</td>
											</tr>
											<tr className="sm1:flex-row sm1:items-center flex flex-col items-start">
												<td className="text-light-600 w-36 shrink-0 px-4 py-3">
													Token Type
												</td>
												<td className="px-4 py-3">
													{tx.contractAddress ===
													"0x0000000000000000000000000000000000000000"
														? "Native"
														: "ERC-20"}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default TxDetailsModal;
