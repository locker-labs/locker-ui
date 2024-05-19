/* eslint-disable no-console */
import { endpoints } from "@/data/constants/endpoints";
import { errors } from "@/data/constants/errorMessages";
import type { Locker, Policy } from "@/types";

export const getLockers = async (
	authToken: string
): Promise<Locker[] | null> => {
	try {
		const response = await fetch(endpoints.GET_LOCKERS, {
			headers: { Authorization: `Bearer ${authToken}` },
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
	authToken: string,
	locker: Locker,
	setErrorMessage: (value: string | null) => void
) => {
	try {
		// response.status should be 201 (Created)
		const response = await fetch(endpoints.CREATE_LOCKER, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authToken}`,
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

export const createPolicy = async (
	authToken: string,
	policy: Policy,
	setErrorMessage: (value: string) => void
) => {
	try {
		// response.status should be 201 (Created)
		const response = await fetch(endpoints.CREATE_POLICY, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(policy),
		});

		if (!response.ok) {
			// Handle error in catch
			throw response;
		}
	} catch (error) {
		if (error instanceof Response) {
			const errorMessage =
				error.status === 409
					? errors.POLICY_CONFLICT
					: `${error.status} (${error.statusText}): ${errors.UNEXPECTED}`;
			setErrorMessage(errorMessage);
		} else {
			// Handle other errors like network errors, etc.
			console.error(error);
			setErrorMessage(errors.UNEXPECTED);
		}
	}
};

export const getPolicies = async (
	authToken: string,
	lockerId: number
): Promise<Policy[] | null> => {
	try {
		const response = await fetch(`${endpoints.GET_POLICIES}/${lockerId}`, {
			headers: { Authorization: `Bearer ${authToken}` },
		});

		if (response.ok) {
			const responseData = await response.json();
			return responseData.data.policies;
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};
