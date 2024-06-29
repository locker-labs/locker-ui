import { IoWarningOutline } from "react-icons/io5";

import AllocationBox from "@/components/AllocationBox";
import { useEditAutomationsModal } from "@/hooks/useEditAutomationsModal";
import { Automation, Locker, Policy } from "@/types";

export interface IAutomationSettings {
	locker: Locker;
	currentPolicies: Policy[];
	fetchPolicies: () => void;
	bankAutomation: Automation | undefined;
	hotWalletAutomation: Automation | undefined;
	saveAutomation: Automation | undefined;
}

function AutomationSettings({
	locker,
	currentPolicies,
	fetchPolicies,
	bankAutomation,
	hotWalletAutomation,
	saveAutomation,
}: IAutomationSettings) {
	const { openEditAutomationsModal, renderEditAutomationsModal } =
		useEditAutomationsModal();

	const bankPercent = bankAutomation ? bankAutomation.allocation * 100 : 0;
	const hotWalletPercent = hotWalletAutomation
		? hotWalletAutomation.allocation * 100
		: 0;
	const savePercent = saveAutomation ? saveAutomation.allocation * 100 : 0;

	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-md border border-light-200 p-3 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
			<AllocationBox
				bankPercent={bankPercent}
				hotWalletPercent={hotWalletPercent}
				savePercent={savePercent}
			/>
			<div className="flex w-full flex-col items-center space-y-4">
				<button
					className="h-10 w-20 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
					onClick={openEditAutomationsModal}
				>
					Edit
				</button>
				{bankAutomation && bankAutomation.status === "new" && (
					<>
						<button
							className="w-fit justify-center rounded-full bg-light-200 px-4 py-2 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
							onClick={() => console.log("Complete KYC")}
						>
							<div className="flex w-full items-center">
								<div className="flex size-7 items-center justify-center rounded-full bg-warning/20 text-warning">
									<IoWarningOutline size={16} />
								</div>
								<span className="ml-3 text-sm">
									Finish setup
								</span>
							</div>
						</button>
						<div className="flex w-full max-w-52 flex-col items-center space-y-4 text-center text-xs text-light-600">
							<span>
								If identity verification process is not
								completed, any money allocated to your bank will
								stay in your locker.
							</span>
						</div>
					</>
				)}
				{bankAutomation && bankAutomation.status === "pending" && (
					<span className="text-xs text-light-600">
						Identity verification is pending.
					</span>
				)}
			</div>
			{renderEditAutomationsModal(
				currentPolicies,
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
