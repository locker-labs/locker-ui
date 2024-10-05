import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoClose } from "react-icons/io5";

import WalletButtons from "@/components/ConnectModal/WalletButtons";

export interface IConnectModal {
	isOpen: boolean;
	closeModal: () => void;
}

function ConnectModal({ isOpen, closeModal }: IConnectModal) {
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
							<Dialog.Panel className="bg-light-100 dark:bg-dark-500 flex w-full min-w-72 max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl p-6 shadow-xl">
								<Dialog.Title
									as="h3"
									className="flex w-full items-center justify-between"
								>
									<span className="text-lg font-medium">
										Connect a wallet
									</span>
									<button
										className="bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300 rounded-full p-1"
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<span className="text-left text-sm">
									We use your public address to generate an
									on-chain account that belongs to you.
								</span>
								<div className="mt-4 flex w-full flex-col items-center space-y-2">
									<WalletButtons closeModal={closeModal} />
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default ConnectModal;
