import { useAuth } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { formatUnits } from "viem";

import ChannelSelectButton from "@/components/ChannelSelectButton";
import DistributionBox from "@/components/DistributionBox";
import { disclosures } from "@/data/constants/disclosures";
import { errors } from "@/data/constants/errorMessages";
import { successes } from "@/data/constants/successMessages";
import { usePolicyReviewModal } from "@/hooks/usePolicyReviewModal";
import { updateAutomations } from "@/services/lockers";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	Locker,
	Policy,
} from "@/types";

export interface IEditAutomationsModal {
	isOpen: boolean;
	closeModal: () => void;
	fetchPolicies: () => void;
	currentPolicies: Policy[];
	locker: Locker;
	currentBankAutomation: Automation | undefined;
	currentHotWalletAutomation: Automation | undefined;
	currentSaveAutomation: Automation | undefined;
}

function EditAutomationsModal({
	isOpen,
	closeModal,
	fetchPolicies,
	currentPolicies,
	locker,
	currentBankAutomation,
	currentHotWalletAutomation,
	currentSaveAutomation,
}: IEditAutomationsModal) {
	const currentBankPercent = currentBankAutomation
		? currentBankAutomation.allocation * 100
		: 0;
	const currentHotWalletPercent = currentHotWalletAutomation
		? currentHotWalletAutomation.allocation * 100
		: 0;
	const currentSavePercent = currentSaveAutomation
		? currentSaveAutomation.allocation * 100
		: 0;

	const defaultSendToAddress =
		currentHotWalletAutomation &&
		currentHotWalletAutomation.recipientAddress
			? currentHotWalletAutomation.recipientAddress
			: locker.ownerAddress;

	const [sendToAddress, setSendToAddress] =
		useState<string>(defaultSendToAddress);
	const [savePercent, setSavePercent] = useState<string>(
		currentSavePercent.toString()
	);
	const [hotWalletPercent, setHotWalletPercent] = useState<string>(
		currentHotWalletPercent.toString()
	);
	const [bankPercent, setBankPercent] = useState<string>(
		currentBankPercent.toString()
	);
	const [percentLeft, setPercentLeft] = useState<string>("0");
	const [selectedChannels, setSelectedChannels] = useState<{
		save: boolean;
		wallet: boolean;
		bank: boolean;
	}>({
		save: currentSavePercent > 0,
		wallet: currentHotWalletPercent > 0,
		bank: currentBankPercent > 0,
	});
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { getToken } = useAuth();
	usePolicyReviewModal();

	const handleChannelSelection = (channel: keyof typeof selectedChannels) => {
		setSelectedChannels((prev) => ({
			...prev,
			[channel]: !prev[channel],
		}));
		setErrorMessage(""); // Clear error message when user interacts with selection
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

	const updatePolicies = async () => {
		setIsLoading(true);

		await new Promise((resolve) => {
			setTimeout(resolve, 1500);
		});

		// TO DO: handle the case where automation did not change

		// 1. Craft policy objects for all enabled chains
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
				status: currentBankAutomation?.status || EAutomationStatus.NEW,
			},
		];

		const newPolicies = currentPolicies.map((policy) => ({
			id: policy.id,
			lockerId: policy.lockerId,
			chainId: policy.chainId,
			automations,
		}));

		// 2. Get auth token and update policies for all enabled chains through locker-api
		const authToken = await getToken();
		if (authToken) {
			await updateAutomations(authToken, newPolicies, setErrorMessage);
		}

		// 3. Fetch policies from DB to update state in Home component
		fetchPolicies();

		setSuccessMessage(successes.UPDATED_AUTOMATIONS);
		setIsLoading(false);
	};

	const validateChannelSelection = () => {
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
				percentages = {
					save: currentSavePercent.toString(),
					wallet: currentHotWalletPercent.toString(),
					bank: currentBankPercent.toString(),
				};
			}

			// Update state based on the keys that are selected
			setSavePercent(percentages.save || "0");
			setHotWalletPercent(percentages.wallet || "0");
			setBankPercent(percentages.bank || "0");

			setErrorMessage("");
		} else {
			setErrorMessage(errors.AT_LEAST_ONE);
		}
	};

	const handleAutomationUpdate = () => {
		// TODO: Improve error handling
		if (selectedChannels.wallet && errorMessage === errors.INVALID_ADDRESS)
			return;

		setErrorMessage("");

		if (selectedChannels.wallet && !sendToAddress) {
			setErrorMessage(errors.NO_ADDRESS);
			return;
		}

		if (Number(percentLeft) !== 0) {
			setErrorMessage(errors.SUM_TO_100);
			return;
		}

		updatePolicies();
	};

	useEffect(() => {
		handlePercentLeft();
	}, [savePercent, hotWalletPercent, bankPercent, selectedChannels]);

	useEffect(() => {
		validateChannelSelection();
	}, [selectedChannels]);

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
							<Dialog.Panel className="flex w-full min-w-64 max-w-sm flex-col items-center justify-center rounded-2xl bg-light-100 p-6 shadow-xl dark:bg-dark-500">
								<Dialog.Title
									as="h3"
									className="flex w-full items-center justify-between"
								>
									<span className="text-lg font-medium">
										Edit automations
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
									<div className="flex w-full min-w-60 max-w-sm flex-col space-y-2">
										<ChannelSelectButton
											isSelected={selectedChannels.save}
											label="Save in your locker"
											tip="When payments are received, save some funds in your locker for later use."
											onClick={() =>
												handleChannelSelection("save")
											}
											disabled={!!successMessage}
										/>
										<ChannelSelectButton
											isSelected={selectedChannels.wallet}
											label="Forward to a hot wallet"
											tip="When payments are received, send some funds to a hot wallet for immediate use."
											onClick={() =>
												handleChannelSelection("wallet")
											}
											disabled={!!successMessage}
										/>
										<ChannelSelectButton
											isSelected={selectedChannels.bank}
											label="Send to your bank"
											tip="When payments are received, send some funds to your US bank account."
											onClick={() =>
												handleChannelSelection("bank")
											}
											disabled={!!successMessage}
										/>
										{selectedChannels.bank &&
											currentBankAutomation?.status ===
												"new" && (
												<span className="text-left text-xs text-light-600">
													{
														disclosures.BANK_SETUP_US_ONLY
													}
												</span>
											)}
									</div>
									<DistributionBox
										savePercent={savePercent}
										hotWalletPercent={hotWalletPercent}
										bankPercent={bankPercent}
										percentLeft={percentLeft}
										handlePercentChange={
											handlePercentChange
										}
										selectedChannels={selectedChannels}
										sendToAddress={sendToAddress}
										setSendToAddress={setSendToAddress}
										isLoading={isLoading}
										setErrorMessage={setErrorMessage}
										disabled={!!successMessage}
									/>
									{successMessage ? (
										<button
											className="h-10 w-24 justify-center rounded-full bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
											onClick={closeModal}
										>
											Close
										</button>
									) : (
										<button
											className={`${isLoading ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} flex h-10 w-24 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
											onClick={handleAutomationUpdate}
										>
											{isLoading ? (
												<AiOutlineLoading3Quarters
													className="animate-spin"
													size={22}
												/>
											) : (
												"Update"
											)}
										</button>
									)}
									{errorMessage && (
										<span className="mt-6 text-sm text-error">
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

export default EditAutomationsModal;
