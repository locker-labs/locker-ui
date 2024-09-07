"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";
import { checksumAddress, formatUnits } from "viem";
import { useAccount } from "wagmi";

import ChannelPieChart from "@/components/ChannelPieChart";
import ChannelSelection from "@/components/ChannelSelection";
import DistributionBox from "@/components/DistributionBox";
import Steps from "@/components/Steps";
import TxTable from "@/components/TxTable";
import { disclosures } from "@/data/constants/disclosures";
import { errors } from "@/data/constants/errorMessages";
import { useConnectModal } from "@/hooks/useConnectModal";
import { usePolicyReviewModal } from "@/hooks/usePolicyReviewModal";
import useSmartAccount from "@/hooks/useSmartAccount";
import { createPolicy } from "@/services/lockers";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	Locker,
	Policy,
} from "@/types";
import { isChainSupported } from "@/utils/isChainSupported";

export interface ILockerSetup {
	lockers: Locker[];
}

function LockerSetup({ lockers }: ILockerSetup) {
	const router = useRouter();
	const [sendToAddress, setSendToAddress] = useState<string>(
		lockers[0].ownerAddress
	);
	const [savePercent, setSavePercent] = useState<string>("20");
	const [hotWalletPercent, setHotWalletPercent] = useState<string>("0");
	const [bankPercent, setBankPercent] = useState<string>("0");
	const [percentLeft, setPercentLeft] = useState<string>("0");
	const [selectedChannels, setSelectedChannels] = useState<{
		save: boolean;
		wallet: boolean;
		bank: boolean;
	}>({
		save: true,
		wallet: true,
		bank: false,
	});
	const [step, setStep] = useState<number>(1);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { getToken } = useAuth();
	const { chainId, address, isConnected } = useAccount();
	const { signSessionKey } = useSmartAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { openPolicyReviewModal, renderPolicyReviewModal } =
		usePolicyReviewModal();

	const locker = lockers[0];
	const { txs } = locker;
	const filteredTxs = txs
		? txs.filter((tx) => isChainSupported(tx.chainId))
		: [];

	const handleChannelSelection = (channel: "save" | "wallet" | "bank") => {
		setSelectedChannels((prev) => ({
			...prev,
			[channel]: !prev[channel],
		}));
		setErrorMessage(""); // Clear error message when user interacts with selection
	};

	const proceedToNextStep = () => {
		// Check if at least one channel is selected
		if (Object.values(selectedChannels).some((value) => value)) {
			const selected = Object.entries(selectedChannels).filter(
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				([_, value]) => value
			);
			const count = selected.length;

			let percentages: { [key: string]: string } = {}; // Add index signature to percentages object

			if (count === 1) {
				percentages[selected[0][0]] = "100";
			} else if (count === 2) {
				percentages[selected[0][0]] = "50";
				percentages[selected[1][0]] = "50";
			} else if (count === 3) {
				percentages = { save: "20", wallet: "10", bank: "70" };
			}

			// Update state based on the keys that are selected
			setSavePercent(percentages.save || "0");
			setHotWalletPercent(percentages.wallet || "0");
			setBankPercent(percentages.bank || "0");

			setStep(3);
			setErrorMessage("");
		} else {
			setErrorMessage(errors.AT_LEAST_ONE);
		}
	};

	const handlePercentChange = (
		event: React.FormEvent<HTMLInputElement>,
		inputType: "save" | "wallet" | "bank"
	) => {
		const target = event.target as HTMLInputElement;
		const newValue =
			target.validity.valid &&
			Number(target.value) <= 100 &&
			target.value.length <= 3
				? target.value
				: inputType === "save"
					? savePercent
					: inputType === "wallet"
						? hotWalletPercent
						: bankPercent;
		if (inputType === "save") setSavePercent(newValue);
		else if (inputType === "wallet") setHotWalletPercent(newValue);
		else if (inputType === "bank") setBankPercent(newValue);
	};

	const handlePercentLeft = () => {
		let total = 0;
		if (selectedChannels.save) {
			total += Number(savePercent);
		}
		if (selectedChannels.wallet) {
			total += Number(hotWalletPercent);
		}
		if (selectedChannels.bank) {
			total += Number(bankPercent);
		}
		setPercentLeft((100 - total).toString());
	};

	const createNewPolicy = async () => {
		setIsLoading(true);

		// 1. Get user to sign session key
		const sig = await signSessionKey(
			chainId as number, // current chainId in user's connected wallet
			0, // lockerIndex
			sendToAddress as `0x${string}`, // hotWalletAddress
			[] // offrampAddress
		);
		if (!sig) {
			setIsLoading(false);
			return;
		}

		// 2. Craft policy object
		const automations: Automation[] = [
			{
				type: EAutomationType.SAVINGS,
				allocation: Number(formatUnits(BigInt(savePercent), 2)),
				status: EAutomationStatus.READY,
			},
			{
				type: EAutomationType.FORWARD_TO,
				allocation: Number(formatUnits(BigInt(hotWalletPercent), 2)),
				status: EAutomationStatus.READY,
				recipientAddress: sendToAddress as `0x${string}`,
			},
			{
				type: EAutomationType.OFF_RAMP,
				allocation: Number(formatUnits(BigInt(bankPercent), 2)),
				status: EAutomationStatus.NEW,
			},
		];
		const policy: Policy = {
			lockerId: locker.id as number,
			chainId: chainId as number,
			sessionKey: sig as string,
			automations,
		};

		// 3. Get auth token and create policy through locker-api
		const authToken = await getToken();
		if (authToken) {
			await createPolicy(authToken, policy, setErrorMessage);
		}

		router.refresh();
		setIsLoading(false);
	};

	const handlePolicyCreation = () => {
		// TODO: Improve error handling
		if (isConnected) {
			if (
				selectedChannels.wallet &&
				errorMessage === errors.INVALID_ADDRESS
			)
				return;

			setErrorMessage("");
			if (chainId && !isChainSupported(chainId)) {
				setErrorMessage(errors.UNSUPPORTED_CHAIN);
				return;
			}

			if (selectedChannels.wallet && !sendToAddress) {
				setErrorMessage(errors.NO_ADDRESS);
				return;
			}

			if (checksumAddress(locker.ownerAddress) !== address) {
				setErrorMessage(
					`${errors.UNAUTHORIZED} Expected wallet: ${
						locker.ownerAddress
					}`
				);
				return;
			}

			if (Number(percentLeft) !== 0) {
				setErrorMessage(errors.SUM_TO_100);
				return;
			}

			openPolicyReviewModal();
		} else {
			openConnectModal();
		}
	};

	useEffect(() => {
		handlePercentLeft();
	}, [savePercent, hotWalletPercent, bankPercent, selectedChannels]);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<span className="text-dark-100 dark:text-light-300">
				Automation setup
			</span>
			{step === 1 && (
				<div className="flex w-full flex-col items-center space-y-8">
					<span className="w-full max-w-sm">
						To set up your locker, here&apos;s what you&apos;ll do
						in the next steps:
					</span>
					<div className="flex w-full max-w-sm flex-col space-y-8 text-left">
						<span className="">
							<strong>Choose your destinations:</strong> Decide
							where your money goes when it arrives in your
							locker.
						</span>
						<span className="">
							<strong>Set your percentages:</strong> Allocate what
							percentage of your funds goes to each destination.
						</span>
					</div>
					<button
						className="h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => setStep(2)}
					>
						Continue
					</button>
				</div>
			)}
			{step === 2 && (
				<ChannelSelection
					selectedChannels={selectedChannels}
					handleChannelSelection={handleChannelSelection}
					proceedToNextStep={proceedToNextStep}
				/>
			)}
			{step === 3 && (
				<div className="flex w-full flex-col items-center">
					<span className="mb-8 text-lg">Percentage allocation</span>
					<ChannelPieChart
						bankPercent={Number(bankPercent)}
						hotWalletPercent={Number(hotWalletPercent)}
						savePercent={Number(savePercent)}
						lineWidth={25}
						size="size-48"
					/>
					<span className="mt-8 w-full min-w-60 max-w-sm">
						Each time money arrives in your locker, it will be
						automatically distributed based on the settings below.
					</span>
					<div className="mt-8">
						<DistributionBox
							savePercent={savePercent}
							hotWalletPercent={hotWalletPercent}
							bankPercent={bankPercent}
							percentLeft={percentLeft}
							handlePercentChange={handlePercentChange}
							selectedChannels={selectedChannels}
							sendToAddress={sendToAddress}
							setSendToAddress={setSendToAddress}
							setErrorMessage={setErrorMessage}
							isLoading={isLoading}
						/>
					</div>
					{selectedChannels.bank && (
						<span className="mt-2 w-full min-w-60 max-w-sm text-xs text-light-600">
							{disclosures.BANK_SETUP_US_ONLY}
						</span>
					)}
					<button
						className={`${isLoading ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} mt-8 flex h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
						onClick={() => handlePolicyCreation()}
						disabled={isLoading}
					>
						{isLoading ? (
							<AiOutlineLoading3Quarters
								className="animate-spin"
								size={22}
							/>
						) : (
							"Enable automations"
						)}
					</button>
				</div>
			)}
			{errorMessage && (
				<span className="mt-8 self-center text-sm text-error">
					{errorMessage}
				</span>
			)}
			{filteredTxs.length > 0 && (
				<div className="flex w-full flex-col space-y-2">
					<span className="text-sm">Transaction history</span>
					<TxTable txs={filteredTxs} />
				</div>
			)}
			<div className="flex w-full flex-1 flex-col items-center justify-between xxs1:flex-row xxs1:items-end">
				{step === 2 ? (
					<button
						className="mb-8 h-10 w-fit hover:text-secondary-200 dark:hover:text-primary-100 xxs1:mb-0"
						onClick={() => {
							setErrorMessage("");
							setStep(1);
						}}
						disabled={isLoading}
					>
						<div className="flex items-center justify-center space-x-1">
							<IoChevronBackOutline size={20} />
							<span>Back</span>
						</div>
					</button>
				) : step === 3 ? (
					<button
						className="mb-8 h-10 w-fit hover:text-secondary-200 dark:hover:text-primary-100 xxs1:mb-0"
						onClick={() => {
							setErrorMessage("");
							setStep(2);
						}}
						disabled={isLoading}
					>
						<div className="flex items-center justify-center space-x-1">
							<IoChevronBackOutline size={20} />
							<span>Back</span>
						</div>
					</button>
				) : (
					<div />
				)}
				<Steps step={step} totalSteps={3} />
			</div>
			{renderConnectModal()}
			{chainId &&
				renderPolicyReviewModal(
					createNewPolicy,
					chainId,
					savePercent,
					hotWalletPercent,
					bankPercent
				)}
		</div>
	);
}

export default LockerSetup;
