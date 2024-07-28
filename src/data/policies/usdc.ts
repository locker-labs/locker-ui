import { errors } from "@/data/constants/errorMessages";
import { supportedChainIds } from "@/data/constants/supportedChains";

// https://developers.circle.com/stablecoins/docs/usdc-on-main-networks
export const getUsdcAddress = (chainId: number) => {
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
		case supportedChainIds.linea:
			return "0x176211869cA2b568f2A7D4EE941E073a821EE1ff";
		default:
			throw new Error(`${chainId}: ${errors.UNSUPPORTED_CHAIN}`);
	}
};
