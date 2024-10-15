import { Trash2, TriangleAlert } from "lucide-react";

import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { disclosures } from "@/data/constants/disclosures";
import { IDistributionBoxlet } from "@/lib/boxlets";
import { EAutomationType } from "@/types";

import DistributionBoxletExtra from "./DistributionBoxletExtra";
import PercentInput from "./PercentInput";

function DistributionBoxlet({
	boxlet,
	updateBoxlet,
}: {
	boxlet: IDistributionBoxlet;
	updateBoxlet: (boxlet: IDistributionBoxlet) => void;
}) {
	const { title: boxletTitle, color, percent } = boxlet;

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
	const isGoal =
		boxlet.id === EAutomationType.GOAL_EFROGS ||
		boxlet.id === EAutomationType.GOAL_CUSTOM;

	const title = isGoal ? "Savings goal" : boxletTitle;
	return (
		<div className="flex w-full flex-col space-y-4 rounded-md border border-solid border-gray-300 bg-gray-25 p-3">
			<div className="flex flex-row justify-between space-x-3">
				<div className="mr-2 flex items-center">
					<div
						className="flex size-7 shrink-0 items-center justify-center rounded-full"
						style={{ backgroundColor: color }}
					/>
					<span className="ml-3 whitespace-normal font-bold">
						{title}
					</span>
					<div className="ml-2">
						<TooltipProvider>
							<Tooltip delayDuration={300}>
								<TooltipTrigger asChild>
									<span className="cursor-pointer text-xs">
										ⓘ
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p>{boxlet.tooltip}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
				{isGoal && (
					<button
						aria-label="Remove savings goal"
						onClick={() => {
							updateBoxlet({ ...boxlet, state: "off" });
						}}
					>
						<Trash2 className="size-[0.9rem] text-gray-500" />
					</button>
				)}
			</div>

			{/* Offramp restrictions */}
			{isOfframp && (
				<div className="flex flex-row items-center text-xs text-gray-500">
					<TriangleAlert
						color="white"
						fill="#FFA336"
						size={20}
						className="mr-1"
					/>
					<span>{disclosures.BANK_SETUP_US_ONLY}</span>
				</div>
			)}

			{/* Savings goal info */}
			{isGoal && (
				<div className="rounded-sm outline outline-1 outline-gray-300">
					<DistributionBoxletExtra
						boxletId={boxlet.id}
						boxlet={boxlet}
					/>
				</div>
			)}

			{/* Allocation percentage */}
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

			{/* Forwarding address */}
			{isForwardTo && (
				<div className="flex flex-col">
					<span className="mb-1 text-xxs font-semibold text-gray-700">
						Recipient address
					</span>
					<input
						type="text"
						className="w-100 rounded-md border border-solid border-gray-300 bg-white p-2 text-xxs placeholder:text-gray-400"
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
