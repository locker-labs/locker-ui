import { PieChart } from "react-minimal-pie-chart";

import { calcPercentLeft, IDistributionBoxlet } from "@/lib/boxlets";
import { EAutomationUserState } from "@/types";

export interface IBoxletPieChart {
	boxlets: { [id: string]: IDistributionBoxlet };
	lineWidth: number;
}

function BoxletPieChart({ boxlets, lineWidth }: IBoxletPieChart) {
	// console.log("BoxletPieChart", boxlets);
	// Remove boxlets with zero allocation
	const nonZero = { ...boxlets };
	Object.entries(boxlets).forEach(([boxletId, boxlet]) => {
		// console.log(`boxlet pie ${boxletId}`);
		// console.log(boxlet);
		// console.log(boxlet.percent === 0);

		const shouldDelete =
			boxlet.percent === 0 || boxlet.state === EAutomationUserState.OFF;
		if (shouldDelete) delete nonZero[boxletId];
	});

	// console.log("nonZero", nonZero);

	// Convert to pie chart format
	const dataWithoutZero = Object.values(nonZero).map((boxlet) => ({
		value: boxlet.percent,
		color: boxlet.color,
	}));

	// console.log("BOXLETS");
	// console.log(boxlets);

	// Add grey region for unallocated percent
	const percentLeft = calcPercentLeft(boxlets);
	let data = dataWithoutZero;
	if (percentLeft > 0) {
		data = dataWithoutZero.concat({
			value: percentLeft,
			color: "#EAECF0",
		});
	}
	console.log("data", data);
	// confusing to have negative value in pie chart
	// else if (percentLeft < 0) {
	// 	data = dataWithoutZero.concat({
	// 		value: -percentLeft,
	// 		color: "red",
	// 	});
	// 	totalValue += -percentLeft;
	// }

	return <PieChart data={data} lineWidth={lineWidth} />;
}

export default BoxletPieChart;
