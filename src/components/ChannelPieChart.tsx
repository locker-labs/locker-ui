import { PieChart } from "react-minimal-pie-chart";

export interface IChannelPieChart {
	bankPercent: number;
	hotWalletPercent: number;
	savePercent: number;
	lineWidth: number;
	size: string;
}

function ChannelPieChart({
	bankPercent,
	hotWalletPercent,
	savePercent,
	lineWidth,
	size,
}: IChannelPieChart) {
	const data = [
		{
			value: bankPercent,
			color: "#14B8A6", // success
		},
		{
			value: hotWalletPercent,
			color: "#1E82BC", // secondary-200
		},
		{
			value: savePercent,
			color: "#4546C4", // primary-200
		},
	];

	return (
		<div className={`flex ${size} items-center justify-center`}>
			<PieChart data={data} lineWidth={lineWidth} />
		</div>
	);
}

export default ChannelPieChart;
/*
**************************** Pie Chart Design Options **************************** //
**** Partial pie chart with rounded padded arcs and inner percentage labels ****
<div className="flex size-48 items-center justify-center bg-yellow-100">
	<PieChart
		data={data}
		lineWidth={18}
		paddingAngle={13}
		startAngle={180}
		lengthAngle={180}
		viewBoxSize={[100, 50]}
		rounded
		label={({ dataEntry }) => `${dataEntry.value}%`}
		labelStyle={(index) => ({
			fill: data[index].color,
			fontSize: "5px",
		})}
		labelPosition={72}
	/>
</div>




**** Partial pie chart with rounded padded arcs and single inner label ****
<div className="flex size-48 items-center justify-center bg-yellow-100">
	<PieChart
		data={data}
		lineWidth={18}
		paddingAngle={13}
		startAngle={180}
		lengthAngle={180}
		viewBoxSize={[100, 50]}
		rounded
	/>
	<span className="absolute flex h-[75px] items-end text-lg">
		Test
	</span>
</div>





**** Full pie chart with rounded padded arcs and single inner label ****
<div className="flex size-48 items-center justify-center bg-yellow-100">
	<PieChart
		data={data}
		lineWidth={18}
		paddingAngle={13}
		rounded
	/>
	<span className="absolute flex size-36 flex-col items-center justify-center rounded-full text-lg">
		Test
	</span>
</div>
// ******************************************************************************* //
*/
