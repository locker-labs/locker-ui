/* eslint-disable no-console */
import { errors } from "@/data/constants/errorMessages";
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

export const createLocker = async (
	token: string,
	locker: Locker,
	setErrorMessage: (value: string | null) => void
) => {
	try {
		// response.status should be 201 (Created)
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

		if (!response.ok) {
			// Handle error in catch
			throw response;
		}
	} catch (error) {
		if (error instanceof Response) {
			const errorData = await error.json();
			const errorMessage =
				error.status === 409
					? errors.LOCKER_CONFLICT
					: `${error.status}: ${errorData.error}`;
			setErrorMessage(errorMessage);
			console.error(`${error.status} - ${errorData.error}`);
		} else {
			// Handle other errors like network errors, etc.
			console.error(error);
			setErrorMessage("An unexpected error occurred");
		}
	}
};
