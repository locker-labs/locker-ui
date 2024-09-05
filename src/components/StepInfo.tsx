export interface IStepInfo {
	text: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
}

function StepInfo({ text, icon }: IStepInfo) {
	return (
		<div className="w-1/3 rounded-md bg-gray-100 p-3 text-center">
			<div className="flex flex-col items-center space-y-4">
				<div>{icon}</div>
				<div>{text}</div>
			</div>
		</div>
	);
}

export default StepInfo;
