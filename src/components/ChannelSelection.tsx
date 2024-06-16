import ChannelSelectButton from "@/components/ChannelSelectButton";
import { disclosures } from "@/data/constants/disclosures";

export interface IChannelSelection {
	selectedChannels: {
		save: boolean;
		wallet: boolean;
		bank: boolean;
	};
	handleChannelSelection: (channel: "save" | "wallet" | "bank") => void;
	proceedToNextStep: () => void;
}

function ChannelSelection({
	selectedChannels,
	handleChannelSelection,
	proceedToNextStep,
}: IChannelSelection) {
	return (
		<div className="flex w-full flex-col items-center">
			<span className="mb-4 text-lg">
				Choose where to allocate funds received at your locker.
			</span>
			<div className="flex w-full min-w-60 max-w-sm flex-col space-y-2">
				<ChannelSelectButton
					isSelected={selectedChannels.save}
					label="Save in your locker"
					tip="When payments are received, save some funds in your locker for later use."
					onClick={() => handleChannelSelection("save")}
				/>
				<ChannelSelectButton
					isSelected={selectedChannels.wallet}
					label="Forward to a hot wallet"
					tip="When payments are received, send some funds to a hot wallet for immediate use."
					onClick={() => handleChannelSelection("wallet")}
				/>
				<ChannelSelectButton
					isSelected={selectedChannels.bank}
					label="Send to your bank"
					tip="When payments are received, send some funds to your US bank account."
					onClick={() => handleChannelSelection("bank")}
				/>
				{selectedChannels.bank && (
					<span className="text-xs text-light-600">
						{disclosures.BANK_SETUP_US_ONLY}
					</span>
				)}
			</div>
			<button
				className="mt-8 h-12 w-48 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
				onClick={proceedToNextStep}
			>
				Continue
			</button>
		</div>
	);
}

export default ChannelSelection;
