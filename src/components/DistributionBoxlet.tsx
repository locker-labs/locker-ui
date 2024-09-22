import { Slider } from "@/components/ui/slider";
import { disclosures } from "@/data/constants/disclosures";
import { EAutomationType } from "@/types";

import PercentInput from "./PercentInput";
import Tooltip from "./Tooltip";

export type IDistributionBoxlet = {
	id: string;
	title: string;
	color: string;
	percent: number;
	tooltip: string;
	forwardToAddress?: string;
};

export type IBoxlets = {
	[id: string]: IDistributionBoxlet;
};

export const calcPrecentLeft = (boxlets: IBoxlets) =>
	Object.values(boxlets).reduce((acc, boxlet) => acc - boxlet.percent, 100);

function DistributionBoxlet({
	boxlet,
	updateBoxlet,
}: {
	boxlet: IDistributionBoxlet;
	updateBoxlet: (boxlet: IDistributionBoxlet) => void;
}) {
	const { title, color, percent } = boxlet;

	// Handle percent change for both Slider and PercentInput
	const handlePercentChange = (newPercent: number) => {
		const updatedBoxlet = { ...boxlet, percent: newPercent }; // Update the percent in the boxlet
		updateBoxlet(updatedBoxlet); // Call the updateBoxlet function to update the parent state
	};

	// Handle input change for PercentInput (e.target.value is a string so convert to number)
	const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
		const newPercent = Number(e.currentTarget.value);
		handlePercentChange(newPercent);
	};

	// Handle percent change for both Slider and PercentInput
	const handleForwardToChange = (e: React.FormEvent<HTMLInputElement>) => {
		const newAddress = e.currentTarget.value;
		console.log("Updating to", newAddress);
		const updatedBoxlet = { ...boxlet, forwardToAddress: newAddress };
		updateBoxlet(updatedBoxlet);
	};

	const isForwardTo = boxlet.id === EAutomationType.FORWARD_TO;
	const isOfframp = boxlet.id === EAutomationType.OFF_RAMP;

	return (
		<div className="flex w-full flex-col space-y-4 rounded-md border border-solid border-gray-300 bg-gray-25 p-3">
			<div className="flex flex-row space-x-3">
				<div className="mr-2 flex items-center">
					<div
						className="flex size-7 shrink-0 items-center justify-center rounded-full"
						style={{ backgroundColor: color }}
					/>
					<span className="ml-3 whitespace-normal text-sm xs2:whitespace-nowrap xs2:text-[16px]">
						{title}
					</span>
					<div className="ml-2">
						<Tooltip
							width="w-36"
							label={boxlet.tooltip}
							placement="auto-end"
						>
							<span className="cursor-pointer text-xs">ⓘ</span>
						</Tooltip>
					</div>
				</div>
			</div>

			{isOfframp && (
				<div>
					<p className="text-xs text-gray-500">
						{disclosures.BANK_SETUP_US_ONLY}
					</p>
				</div>
			)}
			<div className="flex flex-row space-x-3">
				<Slider
					value={[percent]} // Slider expects a number array
					onValueChange={(newValue) =>
						handlePercentChange(newValue[0])
					} // Correctly handle slider value changes
					max={100}
				/>
				<PercentInput
					value={percent.toString()}
					onInput={handleInputChange} // Handle input changes correctly
					disabled={false}
				/>
			</div>
			{isForwardTo && (
				<div className="flex flex-col">
					<span className="text-sm">Recipient address</span>
					<input
						type="text"
						className="w-100 rounded-md border border-solid border-gray-300 bg-white p-2 text-xs placeholder:text-gray-400"
						placeholder="0x"
						disabled={false}
						value={boxlet.forwardToAddress}
						onChange={handleForwardToChange}
					/>
				</div>
			)}
		</div>
	);
}

export default DistributionBoxlet;
