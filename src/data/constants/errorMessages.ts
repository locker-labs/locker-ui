import { supportedChainNames } from "./supportedChains";

export const errors = {
	UNSUPPORTED_CHAIN: `Your wallet's current network is unsupported. Please switch to a supported chain: ${supportedChainNames}`,
	LOCKER_CONFLICT:
		"A Locker already exists for this wallet address on this chain. Please switch to a different account in your wallet.",
	LOCKER_NOT_FOUND: "Locker not found.",
	BEAM_ACCOUNT_CONFLICT: "Beam account already created for this Locker.",
	POLICY_CONFLICT: "A Policy already exists for this Locker on this chain.",
	UNEXPECTED: "An unexpected error occurred.",
	UNAUTHORIZED: "Please switch to the correct account.",
	INVALID_ADDRESS: "Invalid address.",
	NO_ADDRESS: "Enter a recipient address.",
	RECIPIENT_EVM: "Recipient must be valid 0x address.",
	TOO_MANY_DECIMALS: "Too many decimal places.",
	AT_LEAST_ONE: "Must choose at least one.",
	SUM_TO_100: "Percentages must add up to 100%.",
	INVALID_INVITE: "Invalid invite code.",
	NO_LOCKER: "No locker. Contact support@geeky.rocks.",
	NO_AUTOMATIONS: "No automations. Contact support@geeky.rocks.",
	INVALID_AMOUNT: "Invalid amount.",
	WALLET_DISCONNECTED: "Wallet is not connected.",
	MISSING_AUTOMATIONS: "Old automations missing and cannot be updated.",
	NO_TOKEN_SELECTED: "No token selected.",
};
