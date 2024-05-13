import { MdCircle } from "react-icons/md";

export interface ISteps {
	step: number;
	totalSteps: number;
}

function Steps({ step, totalSteps }: ISteps) {
	return (
		<div className="flex items-center">
			<span className="mr-4 text-sm">
				Step {step} of {totalSteps}
			</span>
			{Array.from({ length: totalSteps }, (_, i) => i + 1).map(
				(stepNumber) => (
					<MdCircle
						key={stepNumber}
						className={`${step >= stepNumber ? "text-secondary-100 dark:text-primary-100" : "text-light-600"} mr-2`}
						size={16}
					/>
				)
			)}
		</div>
	);
}

export default Steps;
