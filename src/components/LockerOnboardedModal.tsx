import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoCheckboxOutline, IoClose, IoCopyOutline } from "react-icons/io5";

import { useLocker } from "@/providers/LockerProvider";
import { copyToClipboard } from "@/utils/copytoClipboard";

import { IconGreenCheck } from "./Icons";
import LockerQrCode from "./LockerQrCode";

export interface ILockerOnboardedModal {
	isOpen: boolean;
	closeModal: () => void;
}

function LockerOnboardedModal({ isOpen, closeModal }: ILockerOnboardedModal) {
	const [copied, setCopied] = useState<boolean>(false);
	const { lockers } = useLocker();
	if (!lockers) return null;
	const locker = lockers[0];
	const { address: lockerAddress } = locker;
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
							<Dialog.Panel className="flex w-full min-w-64 max-w-md flex-col items-center justify-center rounded-2xl bg-light-100 p-6 shadow-xl">
								<div className="flex w-full items-end justify-end">
									<button
										className="rounded-full bg-light-200 p-1 hover:bg-light-300"
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</div>
								<div className="flex w-full justify-center">
									<IconGreenCheck />
								</div>

								<Dialog.Title
									as="h5"
									className="mb-2 mt-3 flex w-full flex-col items-center justify-center space-y-2 text-center text-xl"
								>
									Your locker was created
								</Dialog.Title>
								<Dialog.Description className="text-sm text-gray-600">
									Fund your locker using the address below to
									see your first auto dispursement in action.
								</Dialog.Description>
								<p className="mt-6 w-full text-center text-xs font-semibold">
									Your locker address
								</p>
								<div className="mb-6 mt-3 flex flex-row space-x-2 text-xs">
									<div className="rounded-sm border border-solid border-gray-600 p-2 text-xs">
										<code>{locker.address}</code>
									</div>
									<button
										className="flex flex-row rounded-md bg-locker-600 p-2 text-xs text-white"
										onClick={() =>
											copyToClipboard(
												lockerAddress,
												setCopied
											)
										}
									>
										{copied ? "Copied" : "Copy"}
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
								</div>
								<LockerQrCode lockerAddress={lockerAddress} />
								<div className="mt-6 flex w-full flex-col items-center justify-center space-y-8" />
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default LockerOnboardedModal;
