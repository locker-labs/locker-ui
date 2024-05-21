export type Tx = {
	id: number;
	lockerId: number;
	contractAddress: `0x${string}`;
	amount: string; // update locker-api to return bigint
	tokenSymbol: string;
	tokenDecimals: number;
	fromAddress: `0x${string}`;
	toAddress: `0x${string}`;
	txHash: `0x${string}`;
	chainId: number;
	isConfirmed: boolean;
	createdAt: string;
	updatedAt: string;
};

type Deployment = {
	id: number;
	lockerId: number;
	txHash: `0x${string}`;
	chainId: number;
	createdAt: string;
	updatedAt: string;
};
export type Locker = {
	id?: number;
	userId?: string;
	seed: number;
	provider: string;
	address: `0x${string}`;
	ownerAddress: `0x${string}`;
	deployments?: Deployment[];
	txs?: Tx[];
	createdAt?: string;
	updatedAt?: string;
};

export type Policy = {
	lockerId: number;
	chainId: number;
	sessionKey: string;
	automations: {
		savings: number;
		hot_wallet: number;
		off_ramp: number;
	};
};

export type Token = {
	symbol: string;
	address: `0x${string}`;
	decimals: number;
};
