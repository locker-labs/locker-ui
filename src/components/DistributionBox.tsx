/* eslint-disable react/require-default-props */

import DistributionBoxlet, {
	IBoxlets,
	IDistributionBoxlet,
} from "./DistributionBoxlet";

interface IDistributionBox {
	boxlets: IBoxlets;
	updateBoxlet: (boxlet: IDistributionBoxlet) => void;
}

function DistributionBox({ boxlets, updateBoxlet }: IDistributionBox) {
	return (
		<div className="flex w-full flex-col space-y-4">
			{Object.keys(boxlets).map((boxletId) => (
				<DistributionBoxlet
					key={boxletId}
					boxlet={boxlets[boxletId]}
					updateBoxlet={updateBoxlet}
				/>
			))}
		</div>
	);
}

export default DistributionBox;
