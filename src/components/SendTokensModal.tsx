import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { checksumAddress } from "viem";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

import AddressInput from "@/components/AddressInput";
import CurrencyInput from "@/components/CurrencyInput";
import TokenDropdown from "@/components/TokenDropdown";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { errors } from "@/data/constants/errorMessages";
import { successes } from "@/data/constants/successMessages";
import { useToast } from "@/hooks/use-toast";
import useSmartAccount from "@/hooks/useSmartAccount";
import { cn } from "@/lib/utils";
import { useLocker } from "@/providers/LockerProvider";
import { useSendTokensModal } from "@/providers/SendTokensModalProvider";
import { Token } from "@/types";

export function SendTokensModal() {
	const { isOpen, openModal, closeModal, tokens } = useSendTokensModal();
	const { locker } = useLocker();
	const {
		isConnected: isWalletConnected,
		address,
		chainId: walletChainId,
	} = useAccount();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedToken, setSelectedToken] = useState<Token | undefined>(
		tokens ? tokens[0] : undefined
	);
	const [sendToAddress, setSendToAddress] = useState<string>("");
	const [amountInput, setAmountInput] = useState<string>("");
	const [amount, setAmount] = useState<bigint>(BigInt(0));
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { openConnectModal } = useConnectModal();

	const [chainSwitched, setChainSwitched] = useState<boolean>(false);
	const [pendingTokenChainId, setPendingTokenChainId] = useState<
		number | null
	>(null);

	const { sendUserOp } = useSmartAccount();
	const { switchChain } = useSwitchChain();
	const { data: walletClient } = useWalletClient();
	const { toast } = useToast();

	const handleChainSwitch = async (tokenChainId: number) => {
		switchChain({ chainId: tokenChainId });
		setChainSwitched(true);
	};

	const handleSendUserOp = async () => {
		setIsLoading(true);
		setErrorMessage("");

		if (!locker?.ownerAddress) {
			setErrorMessage(
				`${errors.UNEXPECTED} Could not detect your locker: ${locker}`
			);
			setIsLoading(false);
			return;
		}

		if (checksumAddress(locker?.ownerAddress) !== address) {
			setErrorMessage(
				`${errors.UNAUTHORIZED} Expected wallet: ${locker?.ownerAddress}`
			);
			setIsLoading(false);
			return;
		}

		if (!selectedToken) {
			setErrorMessage(`${errors.NO_TOKEN_SELECTED}`);
			setIsLoading(false);
			return;
		}

		if (walletChainId !== selectedToken.chainId) {
			await handleChainSwitch(selectedToken.chainId);
			return;
		}

		if (!walletClient) {
			setPendingTokenChainId(selectedToken.chainId);
			return;
		}

		try {
			console.log("Going to send tokens");
			const hash = await sendUserOp(
				0,
				selectedToken.chainId,
				sendToAddress as `0x${string}`,
				selectedToken.address,
				amount
			);
			console.log(`Sent tokens ${hash}`);

			if (hash) {
				setSendToAddress("");
				setAmountInput("");
				setAmount(BigInt(0));
				toast({
					title: "Send successful",
					description: successes.SENT_TOKEN,
				});

				closeModal();
			}

			setErrorMessage(
				"Something went wrong. This is normally because of stale nonces. Wait for all your transactions to be confirmed, then try again"
			);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error("Something unexpected happened trying to send.", err);
			setErrorMessage(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setErrorMessage("");
	}, [address]);

	const isValid =
		!isLoading &&
		!errorMessage &&
		sendToAddress &&
		!!selectedToken?.balance &&
		amount > BigInt(0) &&
		amount <= BigInt(selectedToken.balance);

	useEffect(() => {
		if (tokens && tokens.length > 0 && !selectedToken) {
			setSelectedToken(tokens[0]);
		}
	}, [tokens]);

	useEffect(() => {
		setAmountInput("");
		setAmount(BigInt(0));
	}, [selectedToken]);

	useEffect(() => {
		if (!selectedToken) return;
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

	let cta = (
		<DialogClose asChild className="mt-4">
			<Button onClick={closeModal} className="w-full bg-locker-600">
				Close
			</Button>
		</DialogClose>
	);
	if (!isWalletConnected) {
		cta = (
			<Button
				disabled={!isValid}
				onClick={() => handleSendUserOp()}
				className={cn(
					"w-full bg-locker-600",
					!isValid
						? "cursor-not-allowed opacity-80"
						: "cursor-pointer bg-locker-600 opacity-100"
				)}
			>
				{isLoading ? (
					<AiOutlineLoading3Quarters
						className="animate-spin"
						size={22}
					/>
				) : (
					"Send"
				)}
			</Button>
		);
	} else if (selectedToken) {
		cta = (
			<Button
				disabled={!isValid}
				onClick={() => handleSendUserOp()}
				className={cn(
					"w-full bg-locker-600",
					!isValid
						? "cursor-not-allowed opacity-80"
						: "cursor-pointer bg-locker-600 opacity-100"
				)}
			>
				{isLoading ? (
					<AiOutlineLoading3Quarters
						className="animate-spin"
						size={22}
					/>
				) : (
					"Send"
				)}
			</Button>
		);
	}

	const onOpenModal = isWalletConnected ? openModal : openConnectModal;
	return (
		<>
			<button onClick={onOpenModal}>
				<div className="flex h-[3.6rem] w-[3.6rem] flex-col items-center justify-center space-y-2 rounded-sm bg-gray-100 p-2 sm:space-y-1 sm:p-4">
					<div className="sm:hidden">
						<Send className="text-locker-600" size={24} />
					</div>
					<div className="hidden sm:block">
						<Send className="text-locker-600" size={24} />
					</div>
					<p className="text-xxxs text-gray-500">Send</p>
				</div>
			</button>

			<Dialog open={isOpen} onOpenChange={closeModal}>
				<DialogContent className="sm:max-w-[640px]">
					<DialogHeader>
						<DialogTitle className="text-center text-xl">
							Transfer funds
						</DialogTitle>
						<DialogDescription className="text-center text-sm text-gray-600">
							{selectedToken
								? "Withdraw from your locker to another on-chain address."
								: "You must first deposit funds into your locker."}
						</DialogDescription>
					</DialogHeader>

					{/* Scrollable Content */}
					<div className="max-h-[calc(100vh-200px)] overflow-y-auto">
						{selectedToken && (
							<div className="grid gap-4 py-4">
								<div className="flex w-full flex-col space-y-1">
									<span className="self-start font-semibold text-black">
										Recipient address
									</span>
									<AddressInput
										sendToAddress={sendToAddress}
										setSendToAddress={setSendToAddress}
										isLoading={isLoading}
										setErrorMessage={setErrorMessage}
									/>
								</div>
								<div className="flex w-full flex-col space-y-1">
									<span className="self-start font-semibold text-black">
										Token
									</span>
									<TokenDropdown
										tokens={tokens || []}
										selectedToken={selectedToken}
										setSelectedToken={setSelectedToken}
									/>
								</div>
								<div className="flex w-full flex-col space-y-1">
									<span className="self-start font-semibold text-black">
										Amount
									</span>
									<CurrencyInput
										isLoading={isLoading}
										setAmount={setAmount}
										amountInput={amountInput}
										setAmountInput={setAmountInput}
										maxAmount={BigInt(
											selectedToken?.balance || 0
										)}
										token={selectedToken}
										setErrorMessage={setErrorMessage}
										disabled={false}
									/>
								</div>
							</div>
						)}
						<DialogFooter>
							<div className="flex w-full flex-col">
								{cta}
								<div className="flex w-full flex-col">
									{errorMessage && (
										<div className="text-sm text-error">
											{errorMessage}
										</div>
									)}
								</div>
							</div>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
