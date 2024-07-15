import { CALL_POLICY_CONTRACT_V5_3_2 } from "@zerodev/permissions";
import { toCallPolicy } from "@zerodev/permissions/policies";
import { maxInt256 } from "viem";

export const getNativePolicy = (toAddress: `0x${string}`) =>
	toCallPolicy({
		policyAddress: CALL_POLICY_CONTRACT_V5_3_2,
		permissions: [
			{
				// Restrict sending native to a specific address
				target: toAddress,

				// Allow transferring the maximum possible value
				valueLimit: maxInt256,
			},
		],
	});
