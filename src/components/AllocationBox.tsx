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
		<div className="xs1:flex-row flex w-full flex-col items-center justify-between">
			<ChannelPieChart
				bankPercent={bankPercent}
				hotWalletPercent={hotWalletPercent}
				savePercent={savePercent}
				lineWidth={30}
				size="size-24"
			/>
			<div className="xs1:ml-4 xs1:mt-0 xs1:px-0 ml-0 mt-4 flex w-40 flex-col space-y-4 px-2 text-sm">
				{savePercent > 0 && (
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<SaveIcon divSize="size-6" iconSize="14px" />
							<span className="ml-3">Save</span>
						</div>
						<span className="text-light-600 ml-3 whitespace-nowrap">
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
						<span className="text-light-600 ml-3 whitespace-nowrap">
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
						<span className="text-light-600 ml-3 whitespace-nowrap">
							{bankPercent} %
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default AllocationBox;
