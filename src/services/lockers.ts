/* eslint-disable no-console */
import { endpoints } from "@/data/constants/endpoints";
import { errors } from "@/data/constants/errorMessages";
import type { Locker } from "@/types";

export const getLockers = async (token: string): Promise<Locker[] | null> => {
	try {
		const response = await fetch(endpoints.GET_LOCKERS, {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.ok) {
			const responseData = await response.json();
			return responseData.data.lockers;
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
		const response = await fetch(endpoints.CREATE_LOCKER, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(locker),
		});

		if (!response.ok) {
			// Handle error in catch
			throw response;
		}
	} catch (error) {
		if (error instanceof Response) {
			const errorMessage =
				error.status === 409
					? errors.LOCKER_CONFLICT
					: `${error.status} (${error.statusText}): ${errors.UNEXPECTED}`;
			setErrorMessage(errorMessage);
		} else {
			// Handle other errors like network errors, etc.
			console.error(error);
			setErrorMessage(errors.UNEXPECTED);
		}
	}
};
