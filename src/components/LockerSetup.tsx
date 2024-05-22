import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import ChannelPieChart from "@/components/ChannelPieChart";
import ChannelSelectButton from "@/components/ChannelSelectButton";
import DistributionBox from "@/components/DistributionBox";
import Steps from "@/components/Steps";
import TxTable from "@/components/TxTable";
import useSmartAccount from "@/hooks/useSmartAccount";
import { createPolicy } from "@/services/lockers";
import { IAutomation, Locker, Policy } from "@/types";

export interface ILockerSetup {
	lockers: Locker[];
	fetchPolicies: () => void;
}

function LockerSetup({ lockers, fetchPolicies }: ILockerSetup) {
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
	const { chainId } = useAccount();
	const { signSessionKey } = useSmartAccount();

	const handleChannelSelection = (channel: keyof typeof selectedChannels) => {
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

			setStep(2);
			setErrorMessage("");
		} else {
			setErrorMessage("Must choose at least one.");
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

	const handlePolicyCreation = async () => {
		if (Number(percentLeft) === 0) {
			setErrorMessage("");
			setIsLoading(true);
			// 1. Get user to sign session key
			const sig = await signSessionKey();
			if (!sig) {
				setIsLoading(false);
				return;
			}
			// 2. Craft policy object
			const locker = lockers[0];
			const automations: IAutomation[] = [
				{
					type: "savings",
					allocationFactor: Number(
						formatUnits(BigInt(savePercent), 2)
					),
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
					allocationFactor: Number(
						formatUnits(BigInt(bankPercent), 2)
					),
					status: "new",
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

			// 4. Fetch policies from DB to update state in Home component
			fetchPolicies();

			setIsLoading(false);
		} else {
			setErrorMessage("All percentages must add up to 100%.");
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
				<div className="flex w-full flex-col items-center">
					<span className="mb-4 text-lg">
						When money arrives in my locker, I want to:
					</span>
					<div className="flex w-full min-w-60 max-w-sm flex-col space-y-2">
						<ChannelSelectButton
							isSelected={selectedChannels.save}
							label="Save in my locker"
							onClick={() => handleChannelSelection("save")}
						/>
						<ChannelSelectButton
							isSelected={selectedChannels.wallet}
							label="Forward to my hot wallet"
							onClick={() => handleChannelSelection("wallet")}
						/>
						<ChannelSelectButton
							isSelected={selectedChannels.bank}
							label="Send to my bank"
							onClick={() => handleChannelSelection("bank")}
						/>
						{selectedChannels.bank && (
							<span className="text-xs text-light-600">
								Bank off-ramp is only available for US bank
								accounts and requires idendity verification
								after initial setup. If this process is not
								completed, any money allocated to your bank will
								stay in your locker.
							</span>
						)}
					</div>
					<button
						className="mt-8 h-12 w-40 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={proceedToNextStep}
					>
						Continue
					</button>
				</div>
			)}
			{step === 2 && (
				<div className="flex w-full flex-col items-center space-y-8">
					<span className="text-lg">Percentage allocation</span>
					<ChannelPieChart
						bankPercent={Number(bankPercent)}
						hotWalletPercent={Number(hotWalletPercent)}
						savePercent={Number(savePercent)}
						lineWidth={25}
						size="size-48"
					/>
					<DistributionBox
						savePercent={savePercent}
						hotWalletPercent={hotWalletPercent}
						bankPercent={bankPercent}
						percentLeft={percentLeft}
						handlePercentChange={handlePercentChange}
						selectedChannels={selectedChannels}
					/>
					<button
						className={`${isLoading ? "cursor-not-allowed opacity-80" : "cursor-pointer opacity-100"} flex h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100`}
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
				<span className="mt-8 self-center text-sm text-red-500">
					{errorMessage}
				</span>
			)}
			{selectedChannels.bank && step === 2 && (
				<span className="w-full min-w-60 max-w-sm self-center text-xs text-light-600">
					Bank off-ramp is only available for US bank accounts and
					requires idendity verification after initial setup. If this
					process is not completed, any money allocated to your bank
					will stay in your locker.
				</span>
			)}
			{lockers[0].txs && (
				<div className="flex w-full flex-col space-y-2">
					<span className="text-sm">Transaction history</span>
					<TxTable txs={lockers[0].txs} />
				</div>
			)}
			<div className="flex w-full flex-1 flex-col items-center justify-between xxs1:flex-row xxs1:items-end">
				{step === 2 ? (
					<button
						className="mb-8 h-10 w-fit hover:text-secondary-200 dark:hover:text-primary-100 xxs1:mb-0"
						onClick={() => setStep(1)}
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
				<Steps step={step} totalSteps={2} />
			</div>
		</div>
	);
}

export default LockerSetup;
