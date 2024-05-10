interface Deployment {
	id: number;
	lockerId: number;
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
	createdAt?: Date;
	updatedAt?: Date;
}
