/* eslint-disable jsx-a11y/label-has-associated-control */
// import { RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

import DistributionBox from "@/components/DistributionBox";
import { Locker } from "@/types";
import { truncateAddress } from "@/utils/truncateAddress";

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
		bank: true,
	});
	const [step, setStep] = useState(1);
	const [errorMessage, setErrorMessage] = useState("");

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
			<span>LockerSetup</span>
			<span>
				Locker: <code>{truncateAddress(lockers[0].address)}</code>
			</span>
			{step === 1 && (
				<>
					<label>
						<input
							type="checkbox"
							checked={selectedChannels.save}
							onChange={() => handleChannelSelection("save")}
						/>{" "}
						Save in my locker
					</label>
					<label>
						<input
							type="checkbox"
							checked={selectedChannels.wallet}
							onChange={() => handleChannelSelection("wallet")}
						/>{" "}
						Forward to my hot wallet
					</label>
					<label>
						<input
							type="checkbox"
							checked={selectedChannels.bank}
							onChange={() => handleChannelSelection("bank")}
						/>{" "}
						Send to my bank
					</label>
					<button onClick={proceedToNextStep}>Next</button>
					{errorMessage && (
						<p className="text-error">{errorMessage}</p>
					)}
				</>
			)}
			{step === 2 && (
				<>
					<div className="relative flex size-48 items-center justify-center">
						<PieChart
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
						<div className="absolute flex size-32 flex-col items-center justify-center rounded-full bg-light-100 dark:bg-dark-500">
							<span>Test</span>
						</div>
					</div>
					<DistributionBox
						savePercent={savePercent}
						hotWalletPercent={hotWalletPercent}
						bankPercent={bankPercent}
						percentLeft={percentLeft}
						handlePercentChange={handlePercentChange}
						selectedChannels={selectedChannels}
					/>
					<button onClick={() => setStep(1)}>Back</button>
				</>
			)}
		</div>
	);
}

export default LockerSetup;

// import { useEffect, useState } from "react";
// import { PieChart } from "react-minimal-pie-chart";

// import DistributionBox from "@/components/DistributionBox";
// import { Locker } from "@/types";
// import { truncateAddress } from "@/utils/truncateAddress";

// export interface ILockerSetup {
// 	lockers: Locker[];
// }

// function LockerSetup({ lockers }: ILockerSetup) {
// 	const [savePercent, setSavePercent] = useState<string>("20");
// 	const [hotWalletPercent, setHotWalletPercent] = useState<string>("10");
// 	const [bankPercent, setBankPercent] = useState<string>("70");
// 	const [percentLeft, setPercentLeft] = useState<string>("0");

// 	const handlePercentChange = (
// 		event: React.FormEvent<HTMLInputElement>,
// 		inputType: "save" | "wallet" | "bank"
// 	) => {
// 		const target = event.target as HTMLInputElement;

// 		let amountString;
// 		if (inputType === "save") {
// 			amountString =
// 				target.validity.valid &&
// 				Number(target.value) <= 100 &&
// 				target.value.length <= 3
// 					? target.value
// 					: savePercent;
// 			setSavePercent(amountString);
// 		} else if (inputType === "wallet") {
// 			amountString =
// 				target.validity.valid &&
// 				Number(target.value) <= 100 &&
// 				target.value.length <= 3
// 					? target.value
// 					: hotWalletPercent;
// 			setHotWalletPercent(amountString);
// 		} else if (inputType === "bank") {
// 			amountString =
// 				target.validity.valid &&
// 				Number(target.value) <= 100 &&
// 				target.value.length <= 3
// 					? target.value
// 					: bankPercent;
// 			setBankPercent(amountString);
// 		}
// 	};

// 	const handlePercentLeft = () => {
// 		const total =
// 			Number(savePercent) +
// 			Number(hotWalletPercent) +
// 			Number(bankPercent);
// 		setPercentLeft((100 - total).toString());
// 	};

// 	// Use useEffect to handle changes in percentages
// 	useEffect(() => {
// 		handlePercentLeft();
// 	}, [savePercent, hotWalletPercent, bankPercent]);

// 	return (
// 		<div className="flex w-full flex-1 flex-col items-start space-y-8">
// 			<span>LockerSetup</span>
// 			<span>
// 				Locker: <code>{truncateAddress(lockers[0].address)}</code>
// 			</span>
// 			<div className="relative flex size-48 items-center justify-center">
// 				<PieChart
// 					data={[
// 						{
// 							value: Number(bankPercent),
// 							color: "#14B8A6", // success
// 						},
// 						{
// 							value: Number(hotWalletPercent),
// 							color: "#1E82BC", // secondary-200
// 						},
// 						{
// 							value: Number(savePercent),
// 							color: "#4546C4", // primary-200
// 						},
// 					]}
// 				/>
// 				<div className="absolute flex size-32 flex-col items-center justify-center rounded-full bg-light-100 dark:bg-dark-500">
// 					<span>Test</span>
// 				</div>
// 			</div>
// 			<DistributionBox
// 				savePercent={savePercent}
// 				hotWalletPercent={hotWalletPercent}
// 				bankPercent={bankPercent}
// 				percentLeft={percentLeft}
// 				handlePercentChange={handlePercentChange}
// 			/>
// 		</div>
// 	);
// }

// export default LockerSetup;
