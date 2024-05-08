/* eslint-disable no-console */
import type { Locker } from "@/types";

export const getLockers = async (token: string): Promise<Locker[] | null> => {
	try {
		const response = await fetch(
			`${process.env.LOCKER_API_BASE_URL}/lockers`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (response.ok) {
			const lockers = await response.json();
			return lockers.data;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const createLocker = async (token: string, locker: Locker) => {
	try {
		const response = await fetch(
			`${process.env.LOCKER_API_BASE_URL}/lockers/create`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(locker),
			}
		);

		// check that response.stats is 201
		if (!response.ok) {
			const errorData = await response.json();
			console.error("Failed to create locker: ", errorData);
			throw new Error(
				`HTTP error ${response.status}: ${errorData.message}`
			);
		}
	} catch (error) {
		console.error(error);
	}
};
