import { useAuth } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { formatUnits } from "viem";

import ChannelSelectButton from "@/components/ChannelSelectButton";
import DistributionBox from "@/components/DistributionBox";
import { disclosures } from "@/data/constants/disclosures";
import { errors } from "@/data/constants/errorMessages";
import { usePolicyReviewModal } from "@/hooks/usePolicyReviewModal";
// import { updatePolcies } from "@/services/lockers";
import { Automation, Locker, Policy } from "@/types";

export interface IEditAutomationsModal {
	isOpen: boolean;
	closeModal: () => void;
	fetchPolicies: () => void;
	locker: Locker;
	currentBankAutomation: Automation | undefined;
	currentHotWalletAutomation: Automation | undefined;
	currentSaveAutomation: Automation | undefined;
}

function EditAutomationsModal({
	isOpen,
	closeModal,
	fetchPolicies,
	locker,
	currentBankAutomation,
	currentHotWalletAutomation,
	currentSaveAutomation,
}: IEditAutomationsModal) {
	const currentBankPercent = currentBankAutomation
		? currentBankAutomation.allocationFactor * 100
		: 0;
	const currentHotWalletPercent = currentHotWalletAutomation
		? currentHotWalletAutomation.allocationFactor * 100
		: 0;
	const currentSavePercent = currentSaveAutomation
		? currentSaveAutomation.allocationFactor * 100
		: 0;

	const [sendToAddress, setSendToAddress] = useState<string>("");
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

		// 1. Craft policy object
		const automations: Automation[] = [
			{
				type: "savings",
				allocationFactor: Number(formatUnits(BigInt(savePercent), 2)),
				status: "ready",
			},
			{
				type: "forward_to",
				allocationFactor: Number(
					formatUnits(BigInt(hotWalletPercent), 2)
				),
				status: "ready",
				recipientAddress: locker.ownerAddress,
			},
			{
				type: "off_ramp",
				allocationFactor: Number(formatUnits(BigInt(bankPercent), 2)),
				status: "new",
			},
		];

		// Should be array of funded chains
		const chainId = 137;

		// should be an array of polcies
		const policy: Policy = {
			lockerId: locker.id as number,
			chainId: chainId as number,
			automations,
		};

		console.log(policy);

		// 2. Get auth token and update policies on all chains with existing
		//    policies through locker-api
		const authToken = await getToken();
		if (authToken) {
			// await createPolicy(authToken, policy, setErrorMessage);
			// update policies
		}

		// 3. Fetch policies from DB to update state in Home component
		fetchPolicies();

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
											onClick={() =>
												handleChannelSelection("save")
											}
										/>
										<ChannelSelectButton
											isSelected={selectedChannels.wallet}
											label="Forward to a hot wallet"
											onClick={() =>
												handleChannelSelection("wallet")
											}
										/>
										<ChannelSelectButton
											isSelected={selectedChannels.bank}
											label="Send to your bank"
											onClick={() =>
												handleChannelSelection("bank")
											}
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
									/>
									<button
										className="h-10 w-24 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
										onClick={handleAutomationUpdate}
									>
										Update
									</button>
									{errorMessage && (
										<span className="mt-6 text-sm text-red-500">
											{errorMessage}
										</span>
									)}
									{/* <div className="flex w-full items-center justify-center">
										<div
											className={`flex size-7 items-center justify-center rounded-full ${getChainIconStyling(chainId)}`}
										>
											<ChainIcon
												className="flex items-center justify-center"
												chainId={chainId}
												size={16}
											/>
										</div>
										<span className="ml-3 whitespace-nowrap">
											{getChainNameFromId(chainId)}
										</span>
									</div>
									<div className="flex w-full flex-col items-center space-y-4">
										<button
											className="h-10 w-24 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
											onClick={() => {
												createNewPolicy();
												closeModal();
											}}
										>
											Enable
										</button>
										<button
											className="text-sm hover:text-secondary-100 dark:hover:text-primary-100"
											onClick={closeModal}
										>
											Cancel
										</button>
									</div> */}
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