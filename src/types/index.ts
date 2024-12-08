export enum ELockerDirection {
	IN = "in",
	OUT = "out",
}

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
	lockerDirection: ELockerDirection;
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
	GOAL_EFROGS = "goal_efrogs",
	GOAL_CUSTOM = "goal_custom",
}

export enum EAutomationBatchType {
	EACH = "each",
	HOURLY = "hourly",
	DAILY = "daily",
}

export enum EAutomationStatus {
	NEW = "new",
	PENDING = "pending",
	// only blocker to being READY is regenerating the session key
	AUTOMATE_THEN_READY = "automate_then_ready",
	READY = "ready",
	FAILED = "failed",
}

// How the user wants to treat the automation
// If a user activates offramp, then deactivates it.
// The status will be READY because KYC is already done
// But the userState will be "off"
export enum EAutomationUserState {
	ON = "on",
	OFF = "off",
}

export type Automation = {
	type: EAutomationType;
	allocation: number; // 0 - 1
	// Determines if automation can be used
	status: EAutomationStatus; // Always "ready" for "savings" or "forward_to" types
	recipientAddress?: `0x${string}`; // Required if forward_to or off_ramp
	name?: string;
	color?: string;
	// a random ID used for the non-standard automations like the second transfer to
	extraId?: string;
	description?: string;
	goal_amount?: string;
	// contract address not used because price is chain agnostic
	goal_currency_symbol?: string;
	// Determines if user wants the automation to be active
	// If field is missing, then app assumes the automation is on.
	// This is done in order to be backwards compatible
	userState?: EAutomationUserState;
	// Defaults to each
	batchType?: EAutomationBatchType;
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
	imgUrl: string;
	valueUsd: number;
	valueUsdChange: number;
};

export type LockerNetWorth = {
	totalNetWorth: string;
	chainsNetWorth: Record<number, string>;
};

export type IOfframpAddress = {
	id: number;
	chainId: number;
	address: string;
};
