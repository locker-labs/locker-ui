import { IoWarningOutline } from "react-icons/io5";

import BankIcon from "@/components/BankIcon";
import ChannelPieChart from "@/components/ChannelPieChart";
import SaveIcon from "@/components/SaveIcon";
import WalletIcon from "@/components/WalletIcon";
import { useEditAutomationsModal } from "@/hooks/useEditAutomationsModal";
import { Automation, Locker } from "@/types";

export interface IAutomationSettings {
	locker: Locker;
	fetchPolicies: () => void;
	bankAutomation: Automation | undefined;
	hotWalletAutomation: Automation | undefined;
	saveAutomation: Automation | undefined;
}

function AutomationSettings({
	locker,
	fetchPolicies,
	bankAutomation,
	hotWalletAutomation,
	saveAutomation,
}: IAutomationSettings) {
	const { openEditAutomationsModal, renderEditAutomationsModal } =
		useEditAutomationsModal();

	const bankPercent = bankAutomation
		? bankAutomation.allocationFactor * 100
		: 0;
	const hotWalletPercent = hotWalletAutomation
		? hotWalletAutomation.allocationFactor * 100
		: 0;
	const savePercent = saveAutomation
		? saveAutomation.allocationFactor * 100
		: 0;

	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-md border border-light-200 p-3 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
			<div className="flex w-full flex-col items-center justify-between xs1:flex-row">
				<ChannelPieChart
					bankPercent={bankPercent}
					hotWalletPercent={hotWalletPercent}
					savePercent={savePercent}
					lineWidth={30}
					size="size-24"
				/>
				<div className="ml-0 mt-4 flex w-40 flex-col space-y-4 px-2 text-sm xs1:ml-4 xs1:mt-0 xs1:px-0">
					{savePercent > 0 && (
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<SaveIcon divSize="size-6" iconSize="14px" />
								<span className="ml-3">Save</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{savePercent} %
							</span>
						</div>
					)}
					{hotWalletPercent > 0 && (
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<WalletIcon divSize="size-6" iconSize="12px" />
								<span className="ml-3">Forward</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{hotWalletPercent} %
							</span>
						</div>
					)}
					{bankPercent > 0 && (
						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<BankIcon divSize="size-6" iconSize="15px" />
								<span className="ml-3">Bank</span>
							</div>
							<span className="ml-3 whitespace-nowrap text-light-600">
								{bankPercent} %
							</span>
						</div>
					)}
				</div>
			</div>
			<div className="flex w-full flex-col items-center space-y-4">
				<button
					className="h-10 w-20 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
					onClick={openEditAutomationsModal}
				>
					Edit
				</button>
				{bankAutomation && bankAutomation.status === "new" && (
					<button
						className="w-fit justify-center rounded-full bg-light-200 px-4 py-2 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
						onClick={() => console.log("Complete KYC")}
					>
						<div className="flex w-full items-center">
							<div className="flex size-7 items-center justify-center rounded-full bg-warning/20 text-warning">
								<IoWarningOutline size={16} />
							</div>
							<span className="ml-3 text-sm">Finish setup</span>
						</div>
					</button>
				)}
				{bankAutomation && bankAutomation.status === "pending" && (
					<span className="text-xs text-light-600">
						Identity verification is pending.
					</span>
				)}
			</div>
			{renderEditAutomationsModal(
				fetchPolicies,
				locker,
				bankAutomation,
				hotWalletAutomation,
				saveAutomation
			)}
		</div>
	);
}

export default AutomationSettings;
