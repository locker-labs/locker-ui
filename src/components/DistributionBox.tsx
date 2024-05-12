import { FaPiggyBank, FaWallet } from "react-icons/fa";
import { PiBankFill } from "react-icons/pi";

import PercentInput from "@/components/PercentInput";

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
		<div className="flex w-full flex-col">
			<div className="flex w-full min-w-60 max-w-sm flex-col space-y-2 overflow-hidden rounded-md border-[0.5px] border-light-200 dark:border-dark-200">
				{selectedChannels.save && (
					<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100/20 text-primary-100">
								<FaPiggyBank size="16px" />
							</div>
							<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
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
					<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary-100/20 text-secondary-100">
								<FaWallet size="16px" />
							</div>
							<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
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
					<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
						<div className="mr-2 flex items-center">
							<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
								<PiBankFill size="16px" />
							</div>
							<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
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
				<span className="ml-2 mt-2 text-xs text-dark-100 dark:text-light-400">
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

// import { FaPiggyBank, FaWallet } from "react-icons/fa";
// import { PiBankFill } from "react-icons/pi";

// import PercentInput from "@/components/PercentInput";

// interface IDistributionBox {
// 	savePercent: string;
// 	hotWalletPercent: string;
// 	bankPercent: string;
// 	percentLeft: string;
// 	handlePercentChange: (
// 		event: React.FormEvent<HTMLInputElement>,
// 		inputType: "save" | "wallet" | "bank"
// 	) => void;
// }

// function DistributionBox({
// 	savePercent,
// 	hotWalletPercent,
// 	bankPercent,
// 	percentLeft,
// 	handlePercentChange,
// }: IDistributionBox) {
// 	return (
// 		<div className="flex w-full flex-col">
// 			<div className="flex w-full min-w-60 max-w-sm flex-col space-y-2 overflow-hidden rounded-md border-[0.5px] border-light-200 dark:border-dark-200">
// 				<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
// 					<div className="mr-2 flex items-center">
// 						<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100/20 text-primary-100">
// 							<FaPiggyBank size="16px" />
// 						</div>
// 						<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
// 							Save in my locker
// 						</span>
// 					</div>
// 					<PercentInput
// 						value={savePercent}
// 						onInput={(e) => handlePercentChange(e, "save")}
// 					/>
// 				</div>
// 				<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
// 					<div className="mr-2 flex items-center">
// 						<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary-100/20 text-secondary-100">
// 							<FaWallet size="16px" />
// 						</div>
// 						<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
// 							Forward to my hot wallet
// 						</span>
// 					</div>
// 					<PercentInput
// 						value={hotWalletPercent}
// 						onInput={(e) => handlePercentChange(e, "wallet")}
// 					/>
// 				</div>
// 				<div className="flex w-full items-center justify-between border-b-[0.5px] border-b-light-200 p-2 dark:border-b-dark-200">
// 					<div className="mr-2 flex items-center">
// 						<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
// 							<PiBankFill size="16px" />
// 						</div>
// 						<span className="ml-3 whitespace-normal text-sm xs1:whitespace-nowrap xs1:text-[16px]">
// 							Send to my bank
// 						</span>
// 					</div>
// 					<PercentInput
// 						value={bankPercent}
// 						onInput={(e) => handlePercentChange(e, "bank")}
// 					/>
// 				</div>
// 			</div>
// 			<span className="ml-2 mt-2 text-xs text-dark-100 dark:text-light-400">
// 				Left to allocate:{" "}
// 				<span
// 					className={`${Number(percentLeft) < 0 ? "text-error" : "text-success"}`}
// 				>
// 					{percentLeft}%
// 				</span>
// 			</span>
// 		</div>
// 	);
// }

// export default DistributionBox;
