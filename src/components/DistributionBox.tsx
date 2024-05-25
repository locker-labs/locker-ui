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
}

function DistributionBox({
	savePercent,
	hotWalletPercent,
	bankPercent,
	percentLeft,
	handlePercentChange,
	selectedChannels,
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
								Save in my locker
							</span>
						</div>
						<PercentInput
							value={savePercent}
							onInput={(e) => handlePercentChange(e, "save")}
							disabled={isSingleChannel}
						/>
					</div>
				)}
				{selectedChannels.wallet && (
					<div className="flex w-full items-center justify-between p-3 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<WalletIcon />
							<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
								Forward to my hot wallet
							</span>
						</div>
						<PercentInput
							value={hotWalletPercent}
							onInput={(e) => handlePercentChange(e, "wallet")}
							disabled={isSingleChannel}
						/>
					</div>
				)}
				{selectedChannels.bank && (
					<div className="flex w-full items-center justify-between p-3 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<BankIcon />
							<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
								Send to my bank
							</span>
						</div>
						<PercentInput
							value={bankPercent}
							onInput={(e) => handlePercentChange(e, "bank")}
							disabled={isSingleChannel}
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
