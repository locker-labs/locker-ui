import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import ChainDropdown from "./ChainDropdown";

export interface IChainSelectModal {
	isOpen: boolean;
	closeModal: () => void;
	createNewPolicy: () => void;
}

function ChainSelectModal({
	isOpen,
	closeModal,
	createNewPolicy,
}: IChainSelectModal) {
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
							<Dialog.Panel className="flex w-full min-w-64 max-w-sm flex-col items-center justify-center rounded-2xl bg-light-100 p-6 shadow-xl">
								<Dialog.Title
									as="h3"
									className="flex w-full flex-col items-center justify-between text-center"
								>
									<p className="w-full text-center text-lg font-medium">
										Select a chain for your locker
									</p>
									<p className="w-full text-center text-sm text-gray-600">
										You can change or add new chains at any
										time.
									</p>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center space-y-8">
									<ChainDropdown showName />

									<div className="flex w-full flex-col items-center space-y-4">
										<button
											className="h-10 w-full justify-center rounded-md bg-secondary-100 text-light-100 hover:bg-secondary-200"
											onClick={() => {
												createNewPolicy();
												closeModal();
											}}
										>
											Enable automations
										</button>
										<button
											className="text-sm hover:text-secondary-100"
											onClick={closeModal}
										>
											Edit distributions
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

export default ChainSelectModal;
