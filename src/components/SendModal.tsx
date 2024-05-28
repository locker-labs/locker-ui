import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { checksumAddress } from "viem";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

import AddressInput from "@/components/AddressInput";
import CurrencyInput from "@/components/CurrencyInput";
import { errors } from "@/data/constants/errorMessages";
import { successes } from "@/data/constants/successMessages";
import useSmartAccount from "@/hooks/useSmartAccount";
import { Locker, Token } from "@/types";

import TokenDropdown from "./TokenDropdown";

export interface ISendModal {
	isOpen: boolean;
	closeModal: () => void;
	tokenList: Token[];
	locker: Locker;
}

function SendModal({ isOpen, closeModal, tokenList, locker }: ISendModal) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedToken, setSelectedToken] = useState<Token>(tokenList[0]);
	const [sendToAddress, setSendToAddress] = useState<string>("");
	const [amountInput, setAmountInput] = useState<string>("");
	const [amount, setAmount] = useState<bigint>(BigInt(0));
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");

	const [chainSwitched, setChainSwitched] = useState<boolean>(false);
	const [pendingTokenChainId, setPendingTokenChainId] = useState<
		number | null
	>(null);

	const { sendUserOp } = useSmartAccount();
	const { switchChain } = useSwitchChain();
	const { chainId: walletChainId, address } = useAccount();
	const { data: walletClient } = useWalletClient();

	const handleChainSwitch = async (tokenChainId: number) => {
		switchChain({ chainId: tokenChainId });
		setChainSwitched(true);
	};

	const handleSendUserOp = async () => {
		setIsLoading(true);
		setErrorMessage("");

		if (checksumAddress(locker.ownerAddress) !== address) {
			setErrorMessage(errors.UNAUTHORIZED);
			setIsLoading(false);
			return;
		}

		if (walletChainId !== selectedToken.chainId) {
			await handleChainSwitch(selectedToken.chainId);
			return; // Exit early as the useEffect will handle calling handleSendUserOp again
		}

		if (!walletClient) {
			setPendingTokenChainId(selectedToken.chainId);
			return;
		}

		const hash = await sendUserOp(
			0,
			selectedToken.chainId,
			sendToAddress as `0x${string}`,
			selectedToken.address,
			amount
		);

		if (hash) {
			setSuccessMessage(successes.SENT_TOKEN);
		}

		setIsLoading(false);
	};

	const isValid =
		!isLoading &&
		!errorMessage &&
		sendToAddress &&
		selectedToken &&
		amount > BigInt(0) &&
		amount <= BigInt(selectedToken.balance);

	// Reset amount when selectedToken changes
	useEffect(() => {
		setAmountInput("");
		setAmount(BigInt(0));
	}, [selectedToken]);

	useEffect(() => {
		if (chainSwitched && walletChainId === selectedToken.chainId) {
			handleSendUserOp();
			setChainSwitched(false);
		}
	}, [chainSwitched, walletChainId, selectedToken]);

	useEffect(() => {
		if (walletClient && pendingTokenChainId !== null) {
			handleSendUserOp();
			setPendingTokenChainId(null);
		}
	}, [walletClient, pendingTokenChainId]);

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
							<Dialog.Panel className="flex w-full min-w-64 max-w-sm flex-col items-center justify-center overflow-visible rounded-2xl bg-light-100 p-6 shadow-xl dark:bg-dark-500">
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
												disabled={!!successMessage}
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
												disabled={!!successMessage}
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
												disabled={!!successMessage}
											/>
										</div>
									</div>
									{successMessage ? (
										<button
											className="h-10 w-24 justify-center rounded-full bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
											onClick={closeModal}
										>
											Close
										</button>
									) : (
										<button
											className={`${!isValid ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} flex h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
											onClick={() => handleSendUserOp()}
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
									)}
									{errorMessage && (
										<span className="text-sm text-error">
											{errorMessage}
										</span>
									)}
									{successMessage && (
										<span className="mt-6 text-success">
											{successMessage}
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
