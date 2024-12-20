import { EAutomationBatchType, EAutomationUserState } from "@/types";

export type IDistributionBoxlet = {
	id: string;
	// ID is being used as type, so we need to add an extraId for when there's multiples of the same type
	extraId?: string;
	title: string;
	// used for efrogs floor price
	subtitle?: string;
	color: string;
	percent: number;
	tooltip: string;
	forwardToAddress?: string;
	state: EAutomationUserState;
	batchType?: EAutomationBatchType;
};

export type IBoxlets = {
	// Really EAutomationType, not string. But weird typescript error
	[id: string]: IDistributionBoxlet;
};

export const getBoxletsArrOn = (boxlets: IBoxlets) =>
	Object.values(boxlets).filter(
		(boxlet) => boxlet.state === EAutomationUserState.ON
	);

export const getBoxletsByState = (
	boxlets: IBoxlets,
	state: EAutomationUserState.ON | EAutomationUserState.OFF
) => Object.entries(boxlets).filter(([, boxlet]) => boxlet.state === state);

export const getBoxletsOn = (boxlets: IBoxlets) =>
	getBoxletsByState(boxlets, EAutomationUserState.ON);

export const getBoxletsOff = (boxlets: IBoxlets) =>
	getBoxletsByState(boxlets, EAutomationUserState.OFF);

export const calcPercentLeft = (boxlets: IBoxlets) =>
	getBoxletsArrOn(boxlets).reduce((acc, boxlet) => acc - boxlet.percent, 100);
