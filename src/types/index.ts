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
	triggered_by_token_tx_id: number | null;
	locker_direction: "in" | "out";
	automations_state: "started" | "not_started";
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

export type Automation = {
	type: "savings" | "forward_to" | "off_ramp";
	allocationFactor: number; // 0 - 1
	status: "new" | "pending" | "ready" | "failed"; // Always "ready" for "savings" or "forward_to" types
	recipientAddress?: `0x${string}`; // Required if forward_to or off_ramp
};

export type Policy = {
	lockerId: number;
	chainId: number;
	sessionKey: string;
	automations: Automation[];
};

export type Token = {
	symbol: string;
	address: `0x${string}`;
	decimals: number;
	chainId: number;
	balance: string;
};
