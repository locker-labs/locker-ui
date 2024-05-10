/* eslint-disable no-console */
import { endpoints } from "@/data/constants/endpoints";
import type { Locker } from "@/types";

export const getTokenTxs = async (
	token: string,
	lockers: Locker[]
): Promise<Locker[]> => {
	try {
		// Fetch txs for each locker and attach them to each locker object
		const updatedLockers = await Promise.all(
			lockers.map(async (locker) => {
				const response = await fetch(
					`${endpoints.GET_TXS}/${locker.id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
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
		console.error("Failed to fetch transactions:", error);
		// rethrow the error to handle it further up in the call stack
		throw error;
	}
};

// // /public/tokenTxs/${lockerId}
// // For each locker in lockers, get transactions for that locker id.
// export const getTokenTxs = async (
// 	token: string,
// 	lockers: Locker[]
// ): Promise<Tx[] | null> => {
// 	try {
// 		const response = await fetch(`${endpoints.GET_TXS}/${lockers[0].id}`, {
// 			headers: { Authorization: `Bearer ${token}` },
// 		});

// 		if (response.ok) {
// 			const responseData = await response.json();
// 			console.log("responseData: ", responseData);
// 			// return a lockers array with the updated transactions for each locker
// 		}
// 		return null;
// 	} catch (error) {
// 		console.error(error);
// 		return null;
// 	}
// };
