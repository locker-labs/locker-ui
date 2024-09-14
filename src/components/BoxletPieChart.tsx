import { PieChart } from "react-minimal-pie-chart";

import { IDistributionBoxlet } from "./DistributionBoxlet";

export interface IBoxletPieChart {
	boxlets: { [id: string]: IDistributionBoxlet };
	lineWidth: number;
	size: string;
}

function BoxletPieChart({ boxlets, lineWidth, size }: IBoxletPieChart) {
	const data = Object.values(boxlets).map((boxlet) => ({
		value: boxlet.percent,
		color: boxlet.color,
	}));

	console.log("data", data);

	return (
		<div className={`flex ${size} items-center justify-center`}>
			<PieChart data={data} lineWidth={lineWidth} />
		</div>
	);
}

export default BoxletPieChart;
