/* eslint-disable no-console */
import { endpoints } from "@/data/constants/endpoints";
import type { Locker, Tx } from "@/types";

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
		console.error("Failed to fetch transactions: ", error);
		// rethrow the error to handle it further up in the call stack
		throw error;
	}
};

export const getTx = async (
	token: string,
	txHash: string
): Promise<Tx | null> => {
	const tx: Tx = {
		id: 12,
		lockerId: 11,
		contractAddress: "0x0000000000000000000000000000000000000000", // Why is this address(0)?
		amount: "10000000000000", // should be bigint
		tokenSymbol: "ETH",
		tokenDecimals: 18,
		fromAddress: "0xde076d651613c7bde3260b8b69c860d67bc16f49",
		toAddress: "0x3abb17dd306cba6d4ccad0bbd880d0cbd0a2cdaa",
		txHash: "0x881b5a18637dc1b127e4a2580074d91c3662b9b00e6fe502bc821364c7f80f69",
		chainId: 11155111,
		createdAt: "2024-05-11T05:41:15.690Z",
		updatedAt: "2024-05-11T05:41:15.690Z",
	};

	if (token && txHash === tx.txHash) {
		return tx;
	}
	return null;
};
