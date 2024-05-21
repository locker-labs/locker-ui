/* eslint-disable jsx-a11y/control-has-associated-label */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import CurrencyInput from "@/components/CurrencyInput";
import { Token } from "@/types";

export interface ISendModal {
	isOpen: boolean;
	closeModal: () => void;
}

function SendModal({ isOpen, closeModal }: ISendModal) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState<bigint>(BigInt(0));
	const [errorMessage, setErrorMessage] = useState<string>("");

	const testToken: Token = {
		symbol: "TEST",
		address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		decimals: 18,
	};

	const dummyFunction = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

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
									className="flex w-full items-center justify-between"
								>
									<span className="text-lg font-medium">
										Send
									</span>
									<button
										className="rounded-full bg-light-200 p-1 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center space-y-4">
									<CurrencyInput
										isLoading={isLoading}
										setAmount={setAmount}
										token={testToken}
										setErrorMessage={setErrorMessage}
									/>
									<button
										className={`${isLoading || amount === BigInt(0) ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} flex h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
										onClick={() => dummyFunction()}
										disabled={
											isLoading || amount === BigInt(0)
										}
									>
										{isLoading ? (
											<AiOutlineLoading3Quarters
												className="animate-spin"
												size={22}
											/>
										) : (
											"Dummy button"
										)}
									</button>
									{errorMessage && (
										<span className="text-sm text-red-500">
											{errorMessage}
										</span>
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default SendModal;
