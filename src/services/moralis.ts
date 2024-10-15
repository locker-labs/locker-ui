/* eslint-disable no-console */
import { chainCodeNames } from "@/data/constants/supportedChains";
import { LockerNetWorth } from "@/types";

export const getLockerNetWorth = async (
	lockerAddress: `0x${string}`,
	chaindIds: number[]
): Promise<LockerNetWorth | null> => {
	const apiKey = process.env.MORALIS_WEB3_API_KEY;
	if (!apiKey) {
		throw new Error("MORALIS_WEB3_API_KEY is not set");
	}

	const chainQueryParams = chaindIds.reduce<Record<string, string>>(
		(params, chainId, index) => {
			const chainName = chainCodeNames[chainId];
			if (chainName) {
				// eslint-disable-next-line no-param-reassign
				params[`chains[${index}]`] = chainName;
			}
			return params;
		},
		{}
	);

	const chainCodeNameToId = Object.entries(chainCodeNames).reduce<
		Record<string, number>
	>((acc, [id, name]) => {
		acc[name] = Number(id);
		return acc;
	}, {});

	const queryParams = new URLSearchParams({
		...chainQueryParams,
		exclude_spam: "true",
		exclude_unverified_contracts: "false",
	}).toString();

	try {
		const response = await fetch(
			`https://deep-index.moralis.io/api/v2.2/wallets/${lockerAddress}/net-worth?${queryParams}`,
			{
				method: "GET",
				headers: new Headers({
					"X-API-Key": apiKey,
				}),
			}
		);

		if (response.ok) {
			const responseData: {
				total_networth_usd: string;
				chains: { chain: string; networth_usd: string }[];
			} = await response.json();
			const totalNetWorth = responseData.total_networth_usd;
			const chainsNetWorth: Record<number, string> = {};

			responseData.chains.forEach((chain) => {
				const chainId = chainCodeNameToId[chain.chain];
				if (chainId !== undefined) {
					chainsNetWorth[chainId] = chain.networth_usd;
				}
			});

			return { totalNetWorth, chainsNetWorth };
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};

type IErc20Price = {
	usdPrice: number;
};
export const getErc20Price = async (
	// WETH default
	tokenAddress: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
): Promise<IErc20Price> => {
	console.log(
		"getErc20Price",
		tokenAddress,
		process.env.MORALIS_WEB3_API_KEY
	);
	const apiKey = process.env.MORALIS_WEB3_API_KEY;
	if (!apiKey) {
		throw new Error("MORALIS_WEB3_API_KEY is not set");
	}

	const response = await fetch(
		`https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/price?chain=eth`,
		{
			method: "GET",
			headers: new Headers({
				"X-API-Key": apiKey,
			}),
		}
	);

	if (response.ok) {
		const { usdPrice }: IErc20Price = await response.json();

		return { usdPrice };
	}

	throw new Error(response.statusText);
};
