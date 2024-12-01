import { isAddress } from "viem";

import { IDistributionBoxlets } from "@/data/constants/boxlets";
import { errors } from "@/data/constants/errorMessages";
import { EAutomationType, EAutomationUserState } from "@/types";

/**
 * Returns a string if there is an error. Otherwise, returns null.
 */
export default function validateBoxlets(
	boxlets: IDistributionBoxlets
): string | null {
	// eslint-disable-next-line no-restricted-syntax
	for (const boxlet of Object.values(boxlets)) {
		// eslint-disable-next-line no-continue
		if (boxlet.state === EAutomationUserState.OFF) continue;
		const sendToAddress = boxlet.forwardToAddress;

		const isForwardSelected =
			boxlet.id.includes(EAutomationType.FORWARD_TO) &&
			boxlet.percent > 0;

		const isForwardToMissing =
			isForwardSelected && !isAddress(sendToAddress!);

		if (isForwardToMissing) {
			return errors.RECIPIENT_EVM;
		}
	}

	return null;
}
