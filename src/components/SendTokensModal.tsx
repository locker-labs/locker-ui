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
	DialogClose, // <-- Import DialogClose
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { errors } from "@/data/constants/errorMessages";
import { successes } from "@/data/constants/successMessages";
import useSmartAccount from "@/hooks/useSmartAccount";
import { useLocker } from "@/providers/LockerProvider";
import { Token } from "@/types";

export interface ISendTokensModal {
	tokens: Token[];
}

export function SendTokensModal({ tokens }: ISendTokensModal) {
	const { locker } = useLocker();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);
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

		if (walletChainId !== selectedToken.chainId) {
			await handleChainSwitch(selectedToken.chainId);
			return;
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
		!!selectedToken.balance &&
		amount > BigInt(0) &&
		amount <= BigInt(selectedToken.balance);

	useEffect(() => {
		if (!selectedToken && tokens) {
			setSelectedToken(tokens[0]);
		}
	}, [tokens]);

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
		<Dialog>
			<DialogTrigger asChild>
				<button>
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
			</DialogTrigger>
			<DialogContent className="sm:max-w-[640px]">
				<DialogHeader>
					<DialogTitle className="text-xl">
						Transfer funds
					</DialogTitle>
					<DialogDescription className="text-sm text-gray-600">
						Withdraw from your locker to another on-chain addres
					</DialogDescription>
				</DialogHeader>
				{selectedToken && (
					<div className="grid gap-4 py-4">
						{/* Address Input */}
						<div className="flex w-full flex-col space-y-1">
							<span className="self-start font-semibold text-black">
								Recipient address
							</span>
							<AddressInput
								sendToAddress={sendToAddress}
								setSendToAddress={setSendToAddress}
								isLoading={isLoading}
								setErrorMessage={setErrorMessage}
								disabled={!!successMessage}
							/>
						</div>

						{/* Token Dropdown */}
						<div className="flex w-full flex-col space-y-1">
							<span className="self-start text-xs font-bold text-black">
								Token
							</span>
							<TokenDropdown
								tokens={tokens}
								selectedToken={selectedToken}
								setSelectedToken={setSelectedToken}
								disabled={!!successMessage}
							/>
						</div>

						{/* Amount Input */}
						<div className="flex w-full flex-col space-y-1">
							<span className="self-start text-xs  font-bold text-black">
								Amount
							</span>
							<CurrencyInput
								isLoading={isLoading}
								setAmount={setAmount}
								amountInput={amountInput}
								setAmountInput={setAmountInput}
								maxAmount={BigInt(selectedToken?.balance || 0)}
								token={selectedToken}
								setErrorMessage={setErrorMessage}
								disabled={!!successMessage}
							/>
						</div>
					</div>
				)}
				<DialogFooter className="flex flex-col">
					{successMessage ? (
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					) : (
						<Button
							disabled={!isValid}
							onClick={() => handleSendUserOp()}
							className={`${!isValid ? "cursor-not-allowed bg-locker-600 opacity-80" : "cursor-pointer bg-locker-600 opacity-100"}`}
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
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
