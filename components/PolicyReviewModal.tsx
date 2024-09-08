import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

import { getChainIconStyling } from "../utils/getChainIconStyling";
import { getChainNameFromId } from "../utils/getChainName";
import AllocationBox from "./AllocationBox";
import ChainIcon from "./ChainIcon";

export interface IPolicyReviewModal {
	isOpen: boolean;
	closeModal: () => void;
	createNewPolicy: () => void;
	chainId: number;
	savePercent: string;
	hotWalletPercent: string;
	bankPercent: string;
}

function PolicyReviewModal({
	isOpen,
	closeModal,
	createNewPolicy,
	chainId,
	savePercent,
	hotWalletPercent,
	bankPercent,
}: IPolicyReviewModal) {
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
					<div className="fixed inset-0 bg-dark-600/75" />
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
							<Dialog.Panel className="flex w-full min-w-64 max-w-sm flex-col items-center justify-center rounded-2xl bg-light-100 p-6 shadow-xl dark:bg-dark-500">
								<Dialog.Title
									as="h3"
									className="flex w-full items-center justify-between"
								>
									<span className="text-lg font-medium">
										Review
									</span>
									<button
										className="rounded-full bg-light-200 p-1 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center space-y-8">
									<div className="flex w-full max-w-72 items-center justify-center">
										<AllocationBox
											bankPercent={Number(bankPercent)}
											hotWalletPercent={Number(
												hotWalletPercent
											)}
											savePercent={Number(savePercent)}
										/>
									</div>
									<div className="flex w-full items-center justify-center">
										<div
											className={`flex size-7 items-center justify-center rounded-full ${getChainIconStyling(chainId)}`}
										>
											<ChainIcon
												className="flex items-center justify-center"
												chainId={chainId}
												size={16}
											/>
										</div>
										<span className="ml-3 whitespace-nowrap">
											{getChainNameFromId(chainId)}
										</span>
									</div>
									<span className="text-sm text-light-600">
										These settings will only be enabled on{" "}
										{getChainNameFromId(chainId)}. You can
										enable other chains later.
									</span>
									<span className="text-sm text-light-600">
										If this is not the chain you want to
										enable right now, switch to the desired
										chain in your wallet.
									</span>
									<div className="flex w-full flex-col items-center space-y-4">
										<button
											className="h-10 w-24 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
											onClick={() => {
												createNewPolicy();
												closeModal();
											}}
										>
											Enable
										</button>
										<button
											className="text-sm hover:text-secondary-100 dark:hover:text-primary-100"
											onClick={closeModal}
										>
											Cancel
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default PolicyReviewModal;
