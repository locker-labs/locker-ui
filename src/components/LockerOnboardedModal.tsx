import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";
import { useChainId } from "wagmi";

import { useLocker } from "@/providers/LockerProvider";

import { IconGreenCheck } from "./Icons";
import QrModalContent from "./QrModalContent";

export interface ILockerOnboardedModal {
	isOpen: boolean;
	closeModal: () => void;
}

function LockerOnboardedModal({ isOpen, closeModal }: ILockerOnboardedModal) {
	const { lockers } = useLocker();
	const chainId = useChainId();

	if (!lockers) return null;
	const locker = lockers[0];
	const { address: lockerAddress } = locker;
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={closeModal}>
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
								<QrModalContent
									lockerAddress={lockerAddress}
									chainId={chainId}
								/>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default LockerOnboardedModal;
