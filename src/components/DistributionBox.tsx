/* eslint-disable react/require-default-props */
import AddressInput from "@/components/AddressInput";
import BankIcon from "@/components/BankIcon";
import PercentInput from "@/components/PercentInput";
import SaveIcon from "@/components/SaveIcon";
import WalletIcon from "@/components/WalletIcon";

interface IDistributionBox {
	savePercent: string;
	hotWalletPercent: string;
	bankPercent: string;
	percentLeft: string;
	handlePercentChange: (
		event: React.FormEvent<HTMLInputElement>,
		inputType: "save" | "wallet" | "bank"
	) => void;
	selectedChannels: { save: boolean; wallet: boolean; bank: boolean };
	sendToAddress: string;
	setSendToAddress: (value: string) => void;
	isLoading: boolean;
	setErrorMessage: (errorMessage: string) => void;
	disabled?: boolean;
}

function DistributionBox({
	savePercent,
	hotWalletPercent,
	bankPercent,
	percentLeft,
	handlePercentChange,
	selectedChannels,
	sendToAddress,
	setSendToAddress,
	isLoading,
	setErrorMessage,
	disabled = false,
}: IDistributionBox) {
	const isSingleChannel =
		Object.values(selectedChannels).filter((channel) => channel).length ===
		1;

	return (
		<div className="flex w-full min-w-60 max-w-sm flex-col">
			<div className="flex w-full min-w-60 max-w-sm flex-col divide-y divide-light-200 overflow-hidden rounded-md border border-light-200 shadow-sm shadow-light-600 dark:divide-dark-200 dark:border-dark-200 dark:shadow-none">
				{selectedChannels.save && (
					<div className="flex w-full items-center justify-between p-3 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<SaveIcon />
							<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
								Save in your locker
							</span>
						</div>
						<PercentInput
							value={savePercent}
							onInput={(e) => handlePercentChange(e, "save")}
							disabled={isSingleChannel || disabled}
						/>
					</div>
				)}
				{selectedChannels.wallet && (
					<div className="flex w-full flex-col items-center p-3 dark:border-b-dark-200">
						<div className="flex w-full items-center justify-between dark:border-b-dark-200">
							<div className="mr-2 flex items-center">
								<WalletIcon />
								<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
									Forward to a hot wallet
								</span>
							</div>
							<PercentInput
								value={hotWalletPercent}
								onInput={(e) =>
									handlePercentChange(e, "wallet")
								}
								disabled={isSingleChannel || disabled}
							/>
						</div>
						<div className="mt-2 flex w-full flex-col space-y-1">
							<span className="self-start text-xs text-light-600">
								Recipient address
							</span>
							<AddressInput
								sendToAddress={sendToAddress}
								setSendToAddress={setSendToAddress}
								isLoading={isLoading}
								setErrorMessage={setErrorMessage}
								disabled={disabled}
							/>
						</div>
					</div>
				)}
				{selectedChannels.bank && (
					<div className="flex w-full items-center justify-between p-3 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<BankIcon />
							<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
								Send to your bank
							</span>
						</div>
						<PercentInput
							value={bankPercent}
							onInput={(e) => handlePercentChange(e, "bank")}
							disabled={isSingleChannel || disabled}
						/>
					</div>
				)}
			</div>
			{!isSingleChannel && (
				<span className="ml-2 mt-3 text-xs text-dark-100 dark:text-light-400">
					Left to allocate:{" "}
					<span
						className={`${Number(percentLeft) < 0 ? "text-error" : "text-success"}`}
					>
						{percentLeft}%
					</span>
				</span>
			)}
		</div>
	);
}

export default DistributionBox;
