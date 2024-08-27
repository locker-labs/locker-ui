export const endpoints = {
	// GET
	GET_LOCKERS: `${process.env.LOCKER_API_BASE_URL}/public/lockers`,

	// POST
	CREATE_LOCKER: `${process.env.LOCKER_API_BASE_URL}/public/lockers/create`,

	// PATCH --> /public/lockers/${lockerId}
	UPDATE_LOCKER: `${process.env.LOCKER_API_BASE_URL}/public/lockers/create`,

	// GET --> /public/tokenTxs/${lockerId}
	GET_TXS: `${process.env.LOCKER_API_BASE_URL}/public/tokenTxs`,

	// POST --> /public/policies/create
	CREATE_POLICY: `${process.env.LOCKER_API_BASE_URL}/public/policies/create`,

	// PATCH --> /public/policies/${policyId}
	UPDATE_POLICY: `${process.env.LOCKER_API_BASE_URL}/public/policies`,

	// GET --> /public/policies/${lockerId}
	GET_POLICIES: `${process.env.LOCKER_API_BASE_URL}/public/policies`,

	// GET --> /public/tokenTxs/${lockerId}/balances
	GET_TOKEN_BALANCES: `${process.env.LOCKER_API_BASE_URL}/public/tokenTxs`,

	// POST --> /public/offramp/create
	CREATE_OFFRAMP: `${process.env.LOCKER_API_BASE_URL}/public/offramp/create`,
};
