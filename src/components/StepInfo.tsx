export interface IStepInfo {
	text: string;
	icon: string;
}

function StepInfo({ text, icon }: IStepInfo) {
	return <div className="rounded-md bg-secondary-100 p-3">{text}</div>;
}

export default StepInfo;
