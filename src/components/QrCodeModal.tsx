import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoCheckboxOutline, IoClose, IoCopyOutline } from "react-icons/io5";

import ChainIcon from "@/components/ChainIcon";
import LockerQrCode from "@/components/LockerQrCode";
import { supportedChains } from "@/data/constants/supportedChains";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { truncateAddress } from "@/utils/truncateAddress";

export interface IQrCodeModal {
	isOpen: boolean;
	closeModal: () => void;
	lockerAddress: `0x${string}`;
}

function QrCodeModal({ isOpen, closeModal, lockerAddress }: IQrCodeModal) {
	const [copied, setCopied] = useState<boolean>(false);

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
							<Dialog.Panel className="flex w-full min-w-64 max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl bg-light-100 p-6 shadow-xl dark:bg-dark-500">
								<Dialog.Title
									as="h3"
									className="flex w-full items-center justify-end"
								>
									<button
										className="rounded-full bg-light-200 p-1 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center">
									<LockerQrCode
										lockerAddress={lockerAddress}
									/>
									<button
										className="mt-8 flex items-center justify-center text-sm hover:text-secondary-100 dark:hover:text-primary-100"
										onClick={() =>
											copyToClipboard(
												lockerAddress,
												setCopied
											)
										}
									>
										<code>
											{truncateAddress(lockerAddress)}
										</code>
										{copied ? (
											<IoCheckboxOutline
												className="ml-3 shrink-0 text-success"
												size={18}
											/>
										) : (
											<IoCopyOutline
												className="ml-3 shrink-0"
												size={18}
											/>
										)}
									</button>
									<span className="mt-6 w-full max-w-72 text-sm text-light-600">
										You can receive tokens at this locker
										address on all supported chains.
									</span>
									<div className="mt-6 flex items-center justify-center -space-x-2">
										{supportedChains.map((chain, index) => (
											<div
												key={chain.id}
												className="flex w-full items-center rounded-full bg-light-100 dark:bg-dark-500"
												style={{ zIndex: index * 10 }}
											>
												<div
													className={`flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(chain.id)}`}
												>
													<ChainIcon
														className="flex items-center justify-center"
														chainId={chain.id}
														size={16}
													/>
												</div>
											</div>
										))}
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

export default QrCodeModal;
