export interface Locker {
	userId: string;
	seed: string;
	provider: string;
	deploymentTxHash?: string;
	ownerAddress: `0x${string}`;
	address: `0x${string}`;
	chainId: string;
}
