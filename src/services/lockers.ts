export const getLocker = async (token: string) => {
	try {
		const response = await fetch(
			`${process.env.LOCKER_API_BASE_URL}/lockers`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		if (response.ok) {
			const data = await response.json();
			// eslint-disable-next-line no-console
			console.log("IT WORKED! \n\n", data, "\n\n");
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error retrieving locker\n\n", error);
	}
};
