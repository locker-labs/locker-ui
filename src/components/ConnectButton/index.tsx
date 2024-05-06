/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";

import WalletButtons from "@/components/ConnectButton/WalletButtons";

export interface IConnectButton {
	label: string;
	height: string;
	width: string;
	color: "subtle" | "bold";
}

function ConnectButton({ label, height, width, color }: IConnectButton) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	return (
		<>
			<button
				className={`${color === "subtle" ? "bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300" : "bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"} ${height} ${width} shrink-0 items-center justify-center rounded-full outline-none`}
				onClick={openModal}
			>
				{label}
			</button>
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
								<Dialog.Panel className="flex w-full min-w-72 max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl bg-light-100 p-6 shadow-xl dark:bg-dark-500">
									<Dialog.Title
										as="h3"
										className="flex w-full items-center justify-between"
									>
										<span className="text-lg font-medium">
											Connect a wallet
										</span>
										<button
											className="rounded-full bg-light-200 p-1 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
											onClick={closeModal}
										>
											<IoClose className="" size="22px" />
										</button>
									</Dialog.Title>
									<div className="mt-4 flex w-full flex-col items-center space-y-2">
										<WalletButtons />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

export default ConnectButton;
