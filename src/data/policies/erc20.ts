import { ParamCondition, toCallPolicy } from "@zerodev/permissions/policies";
import { erc20Abi, zeroAddress } from "viem";

export const getErc20Policy = (toAddress: `0x${string}`) =>
	toCallPolicy({
		permissions: [
			{
				// Using zeroAddress means this policy applies to all ERC-20 tokens
				target: zeroAddress,

				// BigInt(0) disallows transferring native when calling transfer()
				valueLimit: BigInt(0),

				// Generic ERC-20 ABI
				abi: erc20Abi,

				// Limit scope to the transfer() function
				functionName: "transfer",

				// Specify the conditions of each argument
				//     --> transfer(address to, uint256 value)
				args: [
					// to
					{
						condition: ParamCondition.EQUAL,
						value: toAddress,
					},

					// value
					{
						condition: ParamCondition.LESS_THAN_OR_EQUAL,
						// @ts-expect-error - null allows to send to any amount
						value: null,
					},
				],
			},
		],
	});
