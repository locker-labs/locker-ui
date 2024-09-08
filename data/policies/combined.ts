import {
	CallPolicyVersion,
	ParamCondition,
	toCallPolicy,
} from "@zerodev/permissions/policies";
import { erc20Abi, zeroAddress } from "viem";

/**
 * - send to any ERC20
 * - send native ETH (with high limit)
 */
export const getCombinedPolicy = (toAddress: `0x${string}`) =>
	toCallPolicy({
		policyVersion: CallPolicyVersion.V0_0_2,
		permissions: [
			{
				// zeroAddress is not working
				// Using zeroAddress means this policy applies to all ERC-20 tokens
				target: zeroAddress,

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

					// value - null allows to send to any amount
					null,
				],
			},
			{
				target: toAddress,
				valueLimit: BigInt("100000000000000000000000000000"),
			},
		],
	});

export const getCombinedPolicyMultRecipient = (toAddresses: `0x${string}`[]) =>
	toCallPolicy({
		policyVersion: CallPolicyVersion.V0_0_2,
		permissions: [
			{
				// zeroAddress is not working
				// Using zeroAddress means this policy applies to all ERC-20 tokens
				target: zeroAddress,

				// Generic ERC-20 ABI
				abi: erc20Abi,

				// Limit scope to the transfer() function
				functionName: "transfer",

				// Specify the conditions of each argument
				//     --> transfer(address to, uint256 value)
				args: [
					// to
					{
						condition: ParamCondition.ONE_OF,
						value: toAddresses,
					},

					// value - null allows to send to any amount
					null,
				],
			},
			// {
			// 	target: toAddress,
			// 	valueLimit: BigInt("100000000000000000000000000000"),
			// },
		],
	});
