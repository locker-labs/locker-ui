import { PieChart } from "react-minimal-pie-chart";

export interface IChannelPieChart {
	data: {
		value: number;
		color: string;
	}[];
}

function ChannelPieChart({ data }: IChannelPieChart) {
	return (
		<div className="flex w-full min-w-60 max-w-sm flex-col items-center">
			<div className="flex size-48 items-center justify-center">
				<PieChart data={data} />
				<div className="absolute flex size-32 flex-col items-center justify-center rounded-full bg-light-100 dark:bg-dark-500">
					{/* <span>Test</span> */}
				</div>
			</div>
		</div>
	);
}

export default ChannelPieChart;
