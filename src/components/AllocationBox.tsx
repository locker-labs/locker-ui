import BankIcon from "@/components/BankIcon";
import ChannelPieChart from "@/components/ChannelPieChart";
import SaveIcon from "@/components/SaveIcon";
import WalletIcon from "@/components/WalletIcon";

export interface IAllocationBox {
	bankPercent: number;
	hotWalletPercent: number;
	savePercent: number;
}

function AllocationBox({
	bankPercent,
	hotWalletPercent,
	savePercent,
}: IAllocationBox) {
	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-4 rounded-md border border-light-200 p-3 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none">
			<div className="flex w-full flex-col items-center justify-between xs1:flex-row">
				<ChannelPieChart
					bankPercent={bankPercent}
					hotWalletPercent={hotWalletPercent}
					savePercent={savePercent}
					lineWidth={30}
					size="size-24"
				/>
				<div className="ml-0 mt-4 flex w-40 flex-col space-y-4 px-2 text-sm xs1:ml-4 xs1:mt-0 xs1:px-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<SaveIcon divSize="size-6" iconSize="14px" />
							<span className="ml-3">Save</span>
						</div>
						<span className="ml-3 whitespace-nowrap text-light-600">
							{savePercent} %
						</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<WalletIcon divSize="size-6" iconSize="12px" />
							<span className="ml-3">Forward</span>
						</div>
						<span className="ml-3 whitespace-nowrap text-light-600">
							{hotWalletPercent} %
						</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<BankIcon divSize="size-6" iconSize="15px" />
							<span className="ml-3">Bank</span>
						</div>
						<span className="ml-3 whitespace-nowrap text-light-600">
							{bankPercent} %
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AllocationBox;
