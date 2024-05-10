export const endpoints = {
	// GET
	GET_LOCKERS: `${process.env.LOCKER_API_BASE_URL}/public/lockers`,

	// POST
	CREATE_LOCKER: `${process.env.LOCKER_API_BASE_URL}/public/lockers/create`,

	// PATCH --> /public/lockers/${lockerId}
	UPDATE_LOCKER: `${process.env.LOCKER_API_BASE_URL}/public/lockers/create`,

	// GET --> /public/tokenTxs/${lockerId}
	GET_TXS: `${process.env.LOCKER_API_BASE_URL}/public/tokenTxs`,
};
