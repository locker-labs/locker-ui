import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import AddressInput from "@/components/AddressInput";
import CurrencyInput from "@/components/CurrencyInput";
import { Token } from "@/types";

import TokenDropdown from "./TokenDropdown";

export interface ISendModal {
	isOpen: boolean;
	closeModal: () => void;
	tokenList: Token[];
}

// TODO:
// - Craft and send userOp using zerodev sdk
// - Render success message if transfer is successful

function SendModal({ isOpen, closeModal, tokenList }: ISendModal) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedToken, setSelectedToken] = useState<Token>(tokenList[0]);
	const [sendToAddress, setSendToAddress] = useState<string>("");
	const [amountInput, setAmountInput] = useState<string>("");
	const [amount, setAmount] = useState<bigint>(BigInt(0));
	const [errorMessage, setErrorMessage] = useState<string>("");

	const dummyFunction = async () => {
		setIsLoading(true);
		setTimeout(() => {
			console.log(amount);
			setIsLoading(false);
		}, 1000);
	};

	const isValid =
		!isLoading &&
		!errorMessage &&
		sendToAddress &&
		selectedToken &&
		amount > BigInt(0) &&
		amount <= BigInt(selectedToken.balance);

	// Get token balance and reset amount when selectedToken changes
	useEffect(() => {
		// getTokenBalance();
		setAmountInput("");
		setAmount(BigInt(0));
	}, [selectedToken]);

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
										aria-label="Close modal"
										onClick={closeModal}
									>
										<IoClose className="" size="22px" />
									</button>
								</Dialog.Title>
								<div className="mt-6 flex w-full flex-col items-center justify-center space-y-8">
									<div className="flex w-full flex-col items-center justify-center space-y-4">
										<div className="flex w-full flex-col space-y-1">
											<span className="self-start text-xs text-light-600">
												Recipient address
											</span>
											<AddressInput
												sendToAddress={sendToAddress}
												setSendToAddress={
													setSendToAddress
												}
												isLoading={isLoading}
												setErrorMessage={
													setErrorMessage
												}
											/>
										</div>
										<div className="flex w-full flex-col space-y-1">
											<span className="self-start text-xs text-light-600">
												Token
											</span>
											<TokenDropdown
												tokenList={tokenList}
												selectedToken={selectedToken}
												setSelectedToken={
													setSelectedToken
												}
											/>
										</div>
										<div className="flex w-full flex-col space-y-1">
											<span className="self-start text-xs text-light-600">
												Amount
											</span>
											<CurrencyInput
												isLoading={isLoading}
												setAmount={setAmount}
												amountInput={amountInput}
												setAmountInput={setAmountInput}
												maxAmount={BigInt(
													selectedToken.balance
												)}
												token={selectedToken}
												setErrorMessage={
													setErrorMessage
												}
											/>
										</div>
									</div>
									<button
										className={`${!isValid ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} flex h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
										onClick={() => dummyFunction()}
										disabled={!isValid}
									>
										{isLoading ? (
											<AiOutlineLoading3Quarters
												className="animate-spin"
												size={22}
											/>
										) : (
											"Send"
										)}
									</button>
									{errorMessage && (
										<span className="text-sm text-error">
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
