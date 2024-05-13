import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";

import ChannelPieChart from "@/components/ChannelPieChart";
import ChannelSelectButton from "@/components/ChannelSelectButton";
import DistributionBox from "@/components/DistributionBox";
import Steps from "@/components/Steps";
import { Locker } from "@/types";

export interface ILockerSetup {
	lockers: Locker[];
}

function LockerSetup({ lockers }: ILockerSetup) {
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
	const [step, setStep] = useState(1);
	const [errorMessage, setErrorMessage] = useState("");

	console.log("[LockerSetup] First locker: ", lockers[0].address);

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
						data={[
							{
								value: Number(bankPercent),
								color: "#14B8A6", // success
							},
							{
								value: Number(hotWalletPercent),
								color: "#1E82BC", // secondary-200
							},
							{
								value: Number(savePercent),
								color: "#4546C4", // primary-200
							},
						]}
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
						className="h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => console.log("Enable automations")}
					>
						Enable automations
					</button>
				</div>
			)}
			{errorMessage && (
				<span className="mt-8 self-center text-sm text-red-500">
					{errorMessage}
				</span>
			)}
			<div className="flex w-full flex-1 flex-col items-center justify-between xxs1:flex-row xxs1:items-end">
				{step === 2 ? (
					<button
						className="mb-8 h-10 w-fit hover:text-secondary-200 dark:hover:text-primary-100 xxs1:mb-0"
						onClick={() => setStep(1)}
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
