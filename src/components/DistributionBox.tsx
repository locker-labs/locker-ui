/* eslint-disable react/require-default-props */

import { EAutomationType } from "@/types";

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
			{Object.keys(boxlets)
				// temporarily hide offramp
				.filter((boxletId) => boxletId !== EAutomationType.OFF_RAMP)
				.map((boxletId) => (
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
