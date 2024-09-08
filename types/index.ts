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
	triggeredByTokenTxId: number | null;
	lockerDirection: "in" | "out";
	automationsState: "started" | "not_started";
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

export interface LockerDb extends Locker {
	id: number;
}

export enum EAutomationType {
	SAVINGS = "savings",
	FORWARD_TO = "forward_to",
	OFF_RAMP = "off_ramp",
}

export enum EAutomationStatus {
	NEW = "new",
	PENDING = "pending",
	// only blocker to being READY is regenerating the session key
	AUTOMATE_THEN_READY = "automate_then_ready",
	READY = "ready",
	FAILED = "failed",
}

export type Automation = {
	type: EAutomationType;
	allocation: number; // 0 - 1
	status: EAutomationStatus; // Always "ready" for "savings" or "forward_to" types
	recipientAddress?: `0x${string}`; // Required if forward_to or off_ramp
};

export type Policy = {
	id?: number;
	lockerId: number;
	chainId: number;
	sessionKey?: string;
	automations: Automation[];
};

export interface PolicyDb extends Policy {
	id: number;
}

export type Token = {
	symbol: string;
	address: `0x${string}`;
	decimals: number;
	chainId: number;
	balance: string;
};

export type LockerNetWorth = {
	totalNetWorth: string;
	chainsNetWorth: Record<number, string>;
};
