/* eslint-disable no-console */
import { endpoints } from "@/data/constants/endpoints";
import { supportedChainIds } from "@/data/constants/supportedChains";
import type { Locker, Tx } from "@/types";

export const getTokenTxs = async (
	authToken: string,
	lockers: Locker[]
): Promise<Locker[]> => {
	try {
		// Fetch txs for each locker and attach them to each locker object
		const updatedLockers = await Promise.all(
			lockers.map(async (locker) => {
				const response = await fetch(
					`${endpoints.GET_TXS}/${locker.id}`,
					{
						headers: { Authorization: `Bearer ${authToken}` },
					}
				);

				if (response.ok) {
					const responseData = await response.json();
					const txs = responseData.data;
					// Update the locker object with the transactions
					return { ...locker, txs };
				}
				console.error(
					`Failed to fetch transactions for locker ${locker.id}`
				);
				// return locker with empty transaction array on failure
				return { ...locker, txs: [] };
			})
		);

		return updatedLockers;
	} catch (error) {
		console.error("Failed to fetch transactions: ", error);
		// rethrow the error to handle it further up in the call stack
		throw error;
	}
};

export const getTx = async (
	authToken: string,
	chainId: number,
	txHash: string
): Promise<Tx | null> => {
	if (!Object.values(supportedChainIds).includes(chainId)) {
		return null;
	}
	try {
		const response = await fetch(
			`${endpoints.GET_TXS}/${chainId}/${txHash}`,
			{
				headers: { Authorization: `Bearer ${authToken}` },
			}
		);

		if (response.ok) {
			const responseData = await response.json();
			return responseData.data;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};
