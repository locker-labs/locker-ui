export type IDistributionBoxlet = {
	id: string;
	title: string;
	// used for efrogs floor price
	subtitle?: string;
	color: string;
	percent: number;
	tooltip: string;
	forwardToAddress?: string;
	state: "on" | "off";
};

export type IBoxlets = {
	[id: string]: IDistributionBoxlet;
};

export const getBoxletsArrOn = (boxlets: IBoxlets) =>
	Object.values(boxlets).filter((boxlet) => boxlet.state === "on");

export const getBoxletsByState = (boxlets: IBoxlets, state: "on" | "off") =>
	Object.entries(boxlets).filter(([, boxlet]) => boxlet.state === state);

export const getBoxletsOn = (boxlets: IBoxlets) =>
	getBoxletsByState(boxlets, "on");

export const getBoxletsOff = (boxlets: IBoxlets) =>
	getBoxletsByState(boxlets, "off");

export const calcPrecentLeft = (boxlets: IBoxlets) =>
	getBoxletsArrOn(boxlets).reduce((acc, boxlet) => acc - boxlet.percent, 100);
