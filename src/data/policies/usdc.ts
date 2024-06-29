import { toCallPolicy } from "@zerodev/permissions/policies";
import { erc20Abi } from "viem";

import { errors } from "@/data/constants/errorMessages";
import { supportedChainIds } from "@/data/constants/supportedChains";

const getUsdcAddress = (chainId: number) => {
	switch (chainId) {
		case supportedChainIds.arbitrum:
			return "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
		case supportedChainIds.optimism:
			return "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
		case supportedChainIds.polygon:
			return "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
		case supportedChainIds.avalanche:
			return "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
		case supportedChainIds.base:
			return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
		case supportedChainIds.sepolia:
			return "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
		case supportedChainIds.baseSepolia:
			return "0xd74cc5d436923b8ba2c179b4bCA2841D8A52C5B5";
		default:
			throw new Error(errors.UNSUPPORTED_CHAIN);
	}
};

export const getUsdcPolicy = (chainId: number) =>
	toCallPolicy({
		permissions: [
			{
				// USDC address changes across chains
				target: getUsdcAddress(chainId),

				// BigInt(0) disallows transferring native when calling transfer()
				valueLimit: BigInt(0),

				// Generic ERC-20 ABI
				abi: erc20Abi,

				// Limit scope to the transfer() function
				functionName: "transfer",

				// Specify the conditions of each argument
				//     --> transfer(address to, uint256 value)
				args: [
					null, // to - null allows to send to any recipient
					null, // value - null allows to send to any amount
				],
			},
		],
	});
