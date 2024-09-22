import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSwitchChain } from "wagmi";

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
	const { isPending, switchChain } = useSwitchChain();
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
									className="flex w-full flex-col items-center justify-between space-y-2 text-center"
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
									<ChainDropdown
										showName
										switchChain={switchChain}
										isPending={isPending}
									/>

									<div className="flex w-full flex-col items-center space-y-4">
										{isPending ? (
											<button
												className="h-10 w-full cursor-not-allowed select-none justify-center rounded-md bg-locker-300 text-light-100"
												disabled
											>
												Switching chains
											</button>
										) : (
											<button
												className="h-10 w-full  cursor-pointer select-none justify-center rounded-md bg-locker-600 text-light-100 hover:bg-secondary-200"
												onClick={() => {
													createNewPolicy();
													closeModal();
												}}
											>
												Finish setup
											</button>
										)}
										<button
											className="text-xs hover:text-secondary-100"
											onClick={closeModal}
										>
											&lt; Edit distributions
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
