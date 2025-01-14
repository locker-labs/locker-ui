"use client";

import {
	getKernelAddressFromECDSA,
	signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import {
	serializePermissionAccount,
	toPermissionValidator,
} from "@zerodev/permissions";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
	addressToEmptyAccount,
	createKernelAccount,
	createKernelAccountClient,
	createZeroDevPaymasterClient,
	getUserOperationGasPrice,
} from "@zerodev/sdk";
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants";
import {
	Address,
	type Chain,
	encodeFunctionData,
	erc20Abi,
	Hex,
	http,
	type PublicClient,
	zeroAddress,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import {
	getCombinedPolicy,
	getCombinedPolicyMultRecipient,
} from "@/data/policies/combined";
import { Automation, EAutomationType } from "@/types";
import { getBundler } from "@/utils/getBundler";
import { getChainObjFromId } from "@/utils/getChainObj";
import { getPaymaster } from "@/utils/getPaymaster";
import getZerodevIndex from "@/utils/getZerodevIndex";
import supabaseClient from "@/utils/supabase/client";
import { TABLE_OFFRAMP_ADDRESSES } from "@/utils/supabase/tables";

const entryPoint = getEntryPoint("0.7");

const useSmartAccount = () => {
	const publicClient = usePublicClient();
	// console.log("!publicClient", publicClient);
	const { data: walletClient } = useWalletClient();

	if (!process.env.LOCKER_AGENT_ADDRESS)
		throw new Error("LOCKER_AGENT_ADDRESS is not set");

	// ************************************************************* //
	// Prompts user to sign session key for current chain
	// ************************************************************* //
	const signSessionKey = async (
		lockerIndex: number,
		hotWalletAddresses: `0x${string}`[], // If not specified, defaults locker owner address
		offrampAddresses: `0x${string}`[]
	): Promise<string | undefined> => {
		// console.log(
		// 	"signSessionKey",
		// 	lockerIndex,
		// 	hotWalletAddresses,
		// 	offrampAddresses
		// );
		if (!walletClient) {
			throw new Error("Wallet client is not available");
		}

		// const smartAccountSigner =
		// 	walletClientToSmartAccountSigner(walletClient);

		const ecdsaValidator = await signerToEcdsaValidator(
			publicClient as PublicClient,
			{
				signer: walletClient,
				entryPoint,
				kernelVersion: KERNEL_V3_1,
			}
		);

		const emptyAccount = addressToEmptyAccount(
			process.env.LOCKER_AGENT_ADDRESS as `0x${string}`
		);

		const emptySessionKeySigner = await toECDSASigner({
			signer: emptyAccount,
		});

		// Policies to allow Locker agent to send money to user's hot wallet
		let combinedPolicy;
		const toAddresses = [...hotWalletAddresses, ...offrampAddresses];
		if (toAddresses.length === 1) {
			combinedPolicy = getCombinedPolicy(toAddresses[0]);
		} else {
			combinedPolicy = getCombinedPolicyMultRecipient(toAddresses);
		}
		console.log("combinedPolicy", combinedPolicy);

		// Type guard to filter out undefined values
		function isDefined<T>(value: T | undefined): value is T {
			return value !== undefined;
		}

		// Filter out undefined policies
		const policies = [combinedPolicy].filter(isDefined);

		const permissionPlugin = await toPermissionValidator(
			publicClient as PublicClient,
			{
				entryPoint,
				signer: emptySessionKeySigner,
				policies,
				kernelVersion: KERNEL_V3_1,
			}
		);
		const index = getZerodevIndex(lockerIndex);
		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				kernelVersion: KERNEL_V3_1,
				index,
				entryPoint,
				plugins: {
					sudo: ecdsaValidator,
					regular: permissionPlugin,
				},
			}
		);

		let sig;
		try {
			sig = await serializePermissionAccount(kernelAccountObj);
			console.log("sig", sig);
		} catch (error) {
			const acceptableErrorMessages = [
				"rejected",
				"request reset",
				"denied",
			];
			if (
				!acceptableErrorMessages.some((msg) =>
					(error as Error).message.includes(msg)
				)
			) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		}

		return sig;
	};
	// ************************************************************* //

	const refreshPolicy = async ({
		automations,
		chainId,
	}: {
		automations: Automation[];
		chainId: number;
	}) => {
		// get offramp_addresses for this chainId
		const { data: offrampAddressesData, error: offrampAddressesError } =
			await supabaseClient
				.from(TABLE_OFFRAMP_ADDRESSES)
				.select(`address`)
				.eq("chain_id", chainId);

		if (offrampAddressesError) console.error(offrampAddressesError);

		const offrampAddresses = Array.from(
			new Set(offrampAddressesData!.map((item) => item.address))
		) as `0x${string}`[];

		const hotWalletAddresses = automations
			.filter(
				(a) =>
					a.type === EAutomationType.FORWARD_TO && a.recipientAddress
			)
			.map((a) => a.recipientAddress!);

		const sig = await signSessionKey(
			0,
			hotWalletAddresses || [],
			offrampAddresses
		);

		return sig;
	};

	// ************************************************************* //
	// Constructs and submits userOp to send money out of locker
	// ************************************************************* //
	const sendUserOp = async (
		lockerIndex: number,
		chainId: number,
		recipient: `0x${string}`,
		token: `0x${string}`,
		amount: bigint
	): Promise<`0x${string}` | undefined> => {
		if (!walletClient) {
			throw new Error("Wallet client is not available");
		}

		const ecdsaValidator = await signerToEcdsaValidator(
			publicClient as PublicClient,
			{
				signer: walletClient,
				entryPoint,
				kernelVersion: KERNEL_V3_1,
			}
		);
		const index = getZerodevIndex(lockerIndex);
		console.log("sendUserOp");
		console.log("index", index);
		console.log("publicClient", publicClient);
		console.log("ecdsaValidator", ecdsaValidator);
		console.log("ENTRYPOINT_ADDRESS_V07", entryPoint);

		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				kernelVersion: KERNEL_V3_1,
				index,
				entryPoint,
				plugins: {
					sudo: ecdsaValidator,
				},
			}
		);

		const chain = getChainObjFromId(chainId) as Chain;
		const bundlerRpcUrl = getBundler(chainId);
		const paymasterRpcUrl = getPaymaster(chainId);

		if (!chain) throw new Error("No chain defined");

		const zerodevPaymaster = createZeroDevPaymasterClient({
			chain,
			transport: http(paymasterRpcUrl as string),
		});

		const kernelAccountClient = createKernelAccountClient({
			account: kernelAccountObj,
			chain: chain!,
			bundlerTransport: http(bundlerRpcUrl),
			client: publicClient,
			paymaster: {
				getPaymasterData(userOperation) {
					return zerodevPaymaster.sponsorUserOperation({
						userOperation,
					});
				},
			},
			userOperation: {
				estimateFeesPerGas: async ({ bundlerClient }) =>
					getUserOperationGasPrice(bundlerClient),
			},
		});

		let hash;
		try {
			if (
				token === zeroAddress ||
				token === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
			) {
				const sendParams = {
					to: recipient,
					value: amount,
					data: "0x00000000", // default to 0x
				} as {
					to: Address;
					value: bigint;
					data: Hex;
				};
				// fix TypeError: Do not know how to serialize a BigInt

				console.log(
					"sendParams",
					sendParams.to,
					sendParams.value.toString(),
					sendParams.data
				);
				// Native token
				hash = await kernelAccountClient.sendTransaction({
					calls: [sendParams],
				});
				// console.log("ETH transfer", recipient, amount);
				// hash = await kernelAccountClient.sendUserOperation({
				// 	callData: await kernelAccountObj.encodeCalls([
				// 		{
				// 			to: recipient,
				// 			value: amount,
				// 		},
				// 	]),
				// });
			} else {
				// ERC-20 token
				console.log("ERC-20 token", token, recipient, amount);
				hash = await kernelAccountClient.sendUserOperation({
					callData: await kernelAccountObj.encodeCalls([
						{
							to: token,
							value: BigInt(0),
							data: encodeFunctionData({
								abi: erc20Abi,
								functionName: "transfer",
								args: [recipient, amount],
							}),
						},
					]),
				});
			}

			return hash;
		} catch (error) {
			const acceptableErrorMessages = [
				"rejected",
				"request reset",
				"denied",
			];
			if (
				!acceptableErrorMessages.some((msg) =>
					(error as Error).message.includes(msg)
				)
			) {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		}

		return hash;
	};
	// ************************************************************* //

	// ************************************************************* //
	// Generates a smart account address from an EOA address and
	// a locker index
	// ************************************************************* //
	const genSmartAccountAddress = async (
		eoaAddress: `0x${string}`,
		lockerIndex: number
	): Promise<`0x${string}`> =>
		getKernelAddressFromECDSA({
			publicClient: publicClient as PublicClient,
			eoaAddress,
			index: getZerodevIndex(lockerIndex),
			kernelVersion: KERNEL_V3_1,
			entryPoint,
		});
	// ************************************************************* //

	return {
		genSmartAccountAddress,
		signSessionKey,
		sendUserOp,
		refreshPolicy,
	};
};

export default useSmartAccount;
