import { getBoxletsOff, IBoxlets, IDistributionBoxlet } from "@/lib/boxlets";
import { EAutomationUserState } from "@/types";

import DistributionBoxletExtra from "./DistributionBoxletExtra";

interface IDistributionBox {
	boxlets: IBoxlets;
	updateBoxlet: (boxlet: IDistributionBoxlet) => void;
}

function DistributionBoxExtra({ boxlets, updateBoxlet }: IDistributionBox) {
	const extraBoxlets = getBoxletsOff(boxlets);
	return (
		<div className="flex w-full flex-col space-y-4 rounded-md bg-locker-25 p-4 ">
			<p className="font-bold">Add a savings goal</p>
			<div className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
				{extraBoxlets.map(([boxletId, boxlet]) => {
					// function that is called on click
					// call updateBoxlet with boxlet.state set to "on"
					const onClick = () => {
						updateBoxlet({
							...boxlet,
							state: EAutomationUserState.ON,
						});
					};

					return (
						<button
							className="span-cols-1"
							onClick={onClick}
							aria-label="Savings goal"
							key={`boxlet-extra-${boxletId}`}
						>
							<DistributionBoxletExtra
								boxletId={boxletId}
								boxlet={boxlet}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default DistributionBoxExtra;
