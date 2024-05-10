interface Deployment {
	id: number;
	lockerId: number;
	txHash: `0x${string}`;
	chainId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Tx {
	id: number;
	lockerId: number;
	contractAddress: `0x${string}`;
	amount: string;
	fromAddress: `0x${string}`;
	toAddress: `0x${string}`;
	txHash: `0x${string}`;
	chainId: number;
	createdAt: Date;
	updatedAt: Date;
}
export interface Locker {
	id?: number;
	userId?: string;
	seed: number;
	provider: string;
	address: `0x${string}`;
	ownerAddress: `0x${string}`;
	deployments?: Deployment[];
	txs?: Tx[];
	createdAt?: Date;
	updatedAt?: Date;
}
