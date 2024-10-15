import { Big } from "big.js";
import { formatUnits } from "viem";

import { getBoxletsArrOn, IBoxlets } from "@/lib/boxlets";
import { Automation, EAutomationStatus, EAutomationType } from "@/types";

export default function adaptBoxlets2Automations(
	boxlets: IBoxlets
): Automation[] {
	return getBoxletsArrOn(boxlets).map((boxlet) => {
		const { id, percent, forwardToAddress } = boxlet;
		const status =
			id === EAutomationType.OFF_RAMP
				? EAutomationStatus.NEW
				: EAutomationStatus.READY;

		const allocationStr = formatUnits(BigInt(percent), 2);
		const allocation = new Big(allocationStr).toNumber();
		const recipientAddress = forwardToAddress as `0x${string}`;

		return {
			type: id,
			allocation,
			recipientAddress,
			status,
		} as Automation;
	});
}
