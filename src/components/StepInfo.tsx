export interface IStepInfo {
	text: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
}

function StepInfo({ text, icon }: IStepInfo) {
	return (
		<div className="rounded-md bg-gray-100 p-2 text-center sm:p-4">
			<div className="flex flex-col items-center justify-center space-y-1 lg:space-y-2">
				<div>{icon}</div>
				<div className="text-xs font-semibold">{text}</div>
			</div>
		</div>
	);
}

export default StepInfo;
