import {
	getKernelAddressFromECDSA,
	// signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
// import { toCallPolicy } from "@zerodev/permissions/policies";
// import {
// 	createKernelAccount,
// 	// createKernelAccountClient
// } from "@zerodev/sdk";
import {
	ENTRYPOINT_ADDRESS_V07,
	// walletClientToSmartAccountSigner,
} from "permissionless";
import type {
	// Account,
	// Chain,
	PublicClient,
	// Transport,
	// WalletClient,
} from "viem";

export const getSmartAccountAddress = async (
	publicClient: PublicClient,
	eoaAddress: `0x${string}`,
	lockerIndex: number
): Promise<`0x${string}`> => {
	const smartAccountAddress = await getKernelAddressFromECDSA({
		publicClient: publicClient as PublicClient,
		eoaAddress: eoaAddress as `0x${string}`,
		index: BigInt(lockerIndex),
		entryPointAddress: ENTRYPOINT_ADDRESS_V07,
	});

	return smartAccountAddress;
};

// export const getSmartAccountSigner = async (walletClient: WalletClient) =>
// 	walletClientToSmartAccountSigner(
// 		walletClient as WalletClient<Transport, Chain | undefined, Account>
// 	);

// export const getEcdsaValidator = async (
// 	publicClient: PublicClient,
// 	walletClient: WalletClient
// ) => {
// 	const signer = await getSmartAccountSigner(walletClient);
// 	return signerToEcdsaValidator(publicClient, {
// 		signer,
// 		entryPoint: ENTRYPOINT_ADDRESS_V07,
// 	});
// };

// export const testCreateAccount = async (
// 	publicClient: PublicClient,
// 	walletClient: WalletClient
// ) => {
// 	const ecdsaValidator = await getEcdsaValidator(publicClient, walletClient);
// 	const acccount = createKernelAccount(publicClient, {
// 		index: BigInt(0),
// 		plugins: {
// 			sudo: ecdsaValidator,
// 		},
// 		entryPoint: ENTRYPOINT_ADDRESS_V07,
// 	});

// 	console.log("***** acccount: ", acccount);
// };

// export const getSmartAccountClient = async (
// 	lockerAddress: `0x${string}`,
// 	chain: Chain
// ) => {
// 	const smartAccountClient = createKernelAccountClient({
// 		account: lockerAddress,
// 		entryPoint: ENTRYPOINT_ADDRESS_V07,
// 		chain,
// 	});
// };

// export const createSessionKey = async (
// 	publicClient: PublicClient,
// 	ownerAddress: `0x${string}`,
// 	lockerAddress: `0x${string}`,
// 	chain: Chain
// ) => {
// 	//
// };

/**
 * - Already have:
 *     - A `PublicClient` instance from the `useClient` hook.
 *         - This client is specific to the chain the user's wallet is connected to.
 *     - The smart account address (lockerAddress)
 *     - Entry point address (same on all chains)
 *     - Ability to sign messages using useSignMessage
 *     -
 */
