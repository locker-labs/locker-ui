/* eslint-disable no-console */

import { endpoints } from "@/data/constants/endpoints";
import { errors } from "@/data/constants/errorMessages";
import type { Locker, Policy } from "@/types";

export const getLockers = async (
	authToken: string
): Promise<Locker[] | null> => {
	try {
		const response = await fetch(endpoints.GET_LOCKERS, {
			method: "GET",
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setErrorMessage: any
): Promise<Locker | undefined> => {
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

		const {
			data: { locker: createdLocker },
		} = await response.json();
		return createdLocker;
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

	return undefined;
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

export const updatePolicy = async (
	authToken: string,
	policy: Policy,
	setErrorMessage: (value: string) => void
) => {
	try {
		// response.status should be 200
		const response = await fetch(
			`${endpoints.UPDATE_POLICY}/${policy.id}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${authToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(policy),
			}
		);

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
			method: "GET",
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

export const updateAutomations = async (
	authToken: string,
	policies: Policy[],
	setErrorMessage: (value: string) => void
) => {
	try {
		const responses = await Promise.all(
			policies.map(async (policy) => {
				const response = await fetch(
					`${endpoints.UPDATE_POLICY}/${policy.id}`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${authToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(policy),
					}
				);

				if (!response.ok) {
					// Handle error here or let it be caught in the catch block below
					throw response;
				}

				return response;
			})
		);

		// Check if all responses are OK
		const allOk = responses.every((response) => response.ok);
		if (!allOk) {
			throw new Error("One or more requests failed.");
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

export const createOfframp = async (
	authToken: string,
	lockerAddress: `0x${string}`
) => {
	try {
		// response.status should be 200
		const response = await fetch(endpoints.CREATE_OFFRAMP, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ address: lockerAddress }),
		});

		if (response.ok) {
			const responseData = await response.json();
			return responseData.onboardingUrl;
		}

		if (!response.ok) {
			// Handle error in catch
			throw response;
		}
	} catch (error) {
		if (error instanceof Response) {
			const errorMessage =
				error.status === 404
					? errors.LOCKER_NOT_FOUND
					: error.status === 409
						? errors.BEAM_ACCOUNT_CONFLICT
						: `${error.status} (${error.statusText}): ${errors.UNEXPECTED}`;
			console.error(errorMessage);
		} else {
			// Handle other errors like network errors, etc.
			console.error(error);
		}
	}
	return null;
};
