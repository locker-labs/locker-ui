/* eslint-disable no-console */
import { chainCodeNames } from "@/data/constants/supportedChains";

export const getLockerNetWorth = async (
	lockerAddress: `0x${string}`,
	chaindIds: number[]
): Promise<string | null> => {
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

	const queryParams = new URLSearchParams({
		...chainQueryParams,
		exclude_spam: "true",
		exclude_unverified_contracts: "true",
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
			const responseData = await response.json();
			return responseData.total_networth_usd;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};
