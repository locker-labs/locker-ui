import { PieChart } from "react-minimal-pie-chart";

import { calcPrecentLeft, IDistributionBoxlet } from "./DistributionBoxlet";

export interface IBoxletPieChart {
	boxlets: { [id: string]: IDistributionBoxlet };
	lineWidth: number;
	size: string;
}

function BoxletPieChart({ boxlets, lineWidth, size }: IBoxletPieChart) {
	console.log("BoxletPieChart", boxlets);
	// Remove non-zero boxlets
	const nonZero = { ...boxlets };
	Object.entries(boxlets).forEach((kv) => {
		if (kv[1].percent === 0) delete nonZero[kv[0]];
	});

	// Convert to pie chart format
	const dataWithoutZero = Object.values(nonZero).map((boxlet) => ({
		value: boxlet.percent,
		color: boxlet.color,
	}));

	// Add grey region for unallocated percent
	const percentLeft = calcPrecentLeft(boxlets);
	let data = dataWithoutZero;
	if (percentLeft > 0) {
		data = dataWithoutZero.concat({
			value: percentLeft,
			color: "#EAECF0",
		});
	}
	// confusing to have negative value in pie chart
	// else if (percentLeft < 0) {
	// 	data = dataWithoutZero.concat({
	// 		value: -percentLeft,
	// 		color: "red",
	// 	});
	// 	totalValue += -percentLeft;
	// }

	return (
		<div className={`flex ${size} items-center justify-center`}>
			<PieChart data={data} lineWidth={lineWidth} />
		</div>
	);
}

export default BoxletPieChart;
