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
import {
	EAutomationBatchType,
	EAutomationType,
	EAutomationUserState,
} from "@/types";

import DistributionBoxletExtra from "./DistributionBoxletExtra";

function DistributionBoxlet({
	boxlet,
	updateBoxlet,
}: {
	boxlet: IDistributionBoxlet;
	updateBoxlet: (boxlet: IDistributionBoxlet) => void;
}) {
	// console.log("DistributionBoxlet -> boxlet", boxlet);
	const { title: boxletTitle, color, percent } = boxlet;

	// Handle percent change for both Slider and input
	const handlePercentChange = (newPercent: number) => {
		const clampedPercent = Math.max(0, Math.min(100, newPercent)); // Ensure percentage stays between 0 and 100
		const updatedBoxlet = { ...boxlet, percent: clampedPercent };
		updateBoxlet(updatedBoxlet);
	};

	// Increment percentage by 1
	const incrementPercent = () => {
		handlePercentChange(percent + 1);
	};

	// Decrement percentage by 1
	const decrementPercent = () => {
		handlePercentChange(percent - 1);
	};

	const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
		const newPercent = Number(e.currentTarget.value.replace("%", "")); // Remove the '%' sign if present
		handlePercentChange(newPercent);
	};

	const isForwardTo = boxlet.id?.includes(EAutomationType.FORWARD_TO);
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
				{isGoal ||
					(isForwardTo && (
						<button
							aria-label="Remove automation"
							onClick={() => {
								updateBoxlet({
									...boxlet,
									state: EAutomationUserState.OFF,
								});
							}}
						>
							<Trash2 className="size-[0.9rem] text-gray-500" />
						</button>
					))}
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
			<div className="flex flex-row items-center space-x-3">
				<Slider
					value={[percent]}
					onValueChange={(newValue) =>
						handlePercentChange(newValue[0])
					}
					max={100}
				/>
				<div className="border-1 flex items-center space-x-2 rounded-md border border-[#D0D5DD] bg-white shadow-sm">
					<button
						type="button"
						className="border-0 pl-2 text-lg text-gray-400"
						onClick={decrementPercent}
						aria-label="Decrease percentage"
					>
						-
					</button>
					<input
						type="text"
						className="max-w-[3rem] border-0 text-center"
						value={`${percent}%`}
						onChange={handleInputChange}
					/>
					<button
						type="button"
						className="border-0 pr-2 text-gray-400"
						onClick={incrementPercent}
						aria-label="Increase percentage"
					>
						+
					</button>
				</div>
			</div>

			{/* Batching */}
			{isForwardTo && (
				<div className="flex flex-col">
					<span className="mb-1 text-xxs font-semibold text-gray-700">
						Batch automations to save gas
					</span>
					<select
						id="batchTypeSelect"
						className="rounded-md border border-gray-300 bg-white p-2 text-xxs"
						value={boxlet.batchType || EAutomationBatchType.EACH} // defaulting to 'EACH' if undefined
						onChange={(e) =>
							updateBoxlet({
								...boxlet,
								batchType: e.target
									.value as EAutomationBatchType,
							})
						}
					>
						{Object.values(EAutomationBatchType).map((type) => (
							<option key={type} value={type}>
								{type.charAt(0) + type.toLowerCase().slice(1)}{" "}
								{/* Capitalize the first letter */}
							</option>
						))}
					</select>
				</div>
			)}

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
						onChange={(e) =>
							updateBoxlet({
								...boxlet,
								forwardToAddress: e.currentTarget.value,
							})
						}
					/>
				</div>
			)}
		</div>
	);
}

export default DistributionBoxlet;
