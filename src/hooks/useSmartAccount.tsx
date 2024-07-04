import {
	getKernelAddressFromECDSA,
	signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import {
	CALL_POLICY_CONTRACT_V5_3_2,
	serializePermissionAccount,
	toPermissionValidator,
} from "@zerodev/permissions";
import { ParamCondition, toCallPolicy } from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
	addressToEmptyAccount,
	createKernelAccount,
	createKernelAccountClient,
	createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import {
	ENTRYPOINT_ADDRESS_V07,
	walletClientToSmartAccountSigner,
} from "permissionless";
import {
	type Chain,
	encodeFunctionData,
	erc20Abi,
	http,
	type PublicClient,
	zeroAddress,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

// import { getErc20Policy } from "@/data/policies/erc20";
// import { getNativePolicy } from "@/data/policies/native";
// import { getUsdcPolicy } from "@/data/policies/usdc";
import { getBundler } from "@/utils/getBundler";
import { getChainObjFromId } from "@/utils/getChainObj";
import { getPaymaster } from "@/utils/getPaymaster";

const useSmartAccount = () => {
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();

	if (!process.env.LOCKER_AGENT_ADDRESS)
		throw new Error("LOCKER_AGENT_ADDRESS is not set");

	// ************************************************************* //
	// Prompts user to sign session key for current chain
	// ************************************************************* //
	const signSessionKey = async (
		chainId: number,
		lockerIndex: number,
		hotWalletAddress?: `0x${string}` // If not specified, defaults locker owner address
		// offrampAddress?: `0x${string}`
	): Promise<string | undefined> => {
		if (!walletClient) {
			throw new Error("Wallet client is not available");
		}

		const smartAccountSigner =
			walletClientToSmartAccountSigner(walletClient);

		const ecdsaValidator = await signerToEcdsaValidator(
			publicClient as PublicClient,
			{
				signer: smartAccountSigner,
				kernelVersion: KERNEL_V3_1,
				entryPoint: ENTRYPOINT_ADDRESS_V07,
			}
		);

		const emptyAccount = addressToEmptyAccount(
			process.env.LOCKER_AGENT_ADDRESS as `0x${string}`
		);

		const emptySessionKeySigner = toECDSASigner({
			signer: emptyAccount,
		});

		const callPolicy = await toCallPolicy({
			policyAddress: CALL_POLICY_CONTRACT_V5_3_2,
			permissions: [
				{
					abi: erc20Abi,
					target: zeroAddress,
					functionName: "transfer",
					args: [
						{
							condition: ParamCondition.EQUAL,
							value: hotWalletAddress!,
						},
						null,
					],
				},
				{
					target: hotWalletAddress!,
					valueLimit: BigInt("1000000000000000000"),
				},
			],
		});

		// Policies to allow Locker agent to send money to user's hot wallet
		// let hotWalletUsdcPolicy;
		// // let hotWalletErc20Policy;
		// // let hotWalletNativePolicy;
		// if (hotWalletAddress) {
		// 	// hotWalletUsdcPolicy = getUsdcPolicy(hotWalletAddress, chainId);
		// 	// hotWalletErc20Policy = getErc20Policy(hotWalletAddress);
		// 	// hotWalletNativePolicy = getNativePolicy(hotWalletAddress);
		// }

		// Policies to allow Locker agent to send money to off-ramp address
		// let offrampErc20Policy;
		// let offrampNativePolicy;
		// if (offrampAddress) {
		// 	offrampErc20Policy = getErc20Policy(offrampAddress);
		// 	offrampNativePolicy = getNativePolicy(offrampAddress);
		// }

		// Type guard to filter out undefined values
		function isDefined<T>(value: T | undefined): value is T {
			return value !== undefined;
		}

		// Filter out undefined policies
		const policies = [
			callPolicy,
			// hotWalletUsdcPolicy,
			// hotWalletErc20Policy,
			// hotWalletNativePolicy,
			// offrampErc20Policy,
			// offrampNativePolicy,
		].filter(isDefined);

		const permissionPlugin = await toPermissionValidator(
			publicClient as PublicClient,
			{
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				signer: emptySessionKeySigner,
				policies,
				kernelVersion: KERNEL_V3_1,
			}
		);
		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				index:
					BigInt(lockerIndex) +
					BigInt(process.env.LOCKER_SEED_OFFSET!),
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				plugins: {
					sudo: ecdsaValidator,
					regular: permissionPlugin,
				},
				kernelVersion: KERNEL_V3_1,
			}
		);

		let sig;
		try {
			sig = await serializePermissionAccount(kernelAccountObj);
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

		const smartAccountSigner =
			walletClientToSmartAccountSigner(walletClient);

		const ecdsaValidator = await signerToEcdsaValidator(
			publicClient as PublicClient,
			{
				signer: smartAccountSigner,
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				kernelVersion: KERNEL_V3_1,
			}
		);

		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				index:
					BigInt(lockerIndex) +
					BigInt(process.env.LOCKER_SEED_OFFSET!),
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				plugins: {
					sudo: ecdsaValidator,
				},
				kernelVersion: KERNEL_V3_1,
			}
		);

		const chain = getChainObjFromId(chainId) as Chain;
		const bundlerRpcUrl = getBundler(chainId);
		const paymasterRpcUrl = getPaymaster(chainId);

		const kernelAccountClient = createKernelAccountClient({
			account: kernelAccountObj,
			entryPoint: ENTRYPOINT_ADDRESS_V07,
			chain,
			bundlerTransport: http(bundlerRpcUrl),
			middleware: {
				sponsorUserOperation: async ({ userOperation }) => {
					const zerodevPaymaster = createZeroDevPaymasterClient({
						chain,
						entryPoint: ENTRYPOINT_ADDRESS_V07,
						transport: http(paymasterRpcUrl as string),
					});
					return zerodevPaymaster.sponsorUserOperation({
						userOperation,
						entryPoint: ENTRYPOINT_ADDRESS_V07,
					});
				},
			},
		});

		let hash;
		try {
			if (token === zeroAddress) {
				// Native token
				hash = await kernelAccountClient.sendTransaction({
					to: recipient,
					value: amount,
					data: "0x", // default to 0x
				});
			} else {
				// ERC-20 token
				hash = await kernelAccountClient.sendUserOperation({
					userOperation: {
						callData: await kernelAccountObj.encodeCallData({
							to: token,
							value: BigInt(0),
							data: encodeFunctionData({
								abi: erc20Abi,
								functionName: "transfer",
								args: [recipient, amount],
							}),
						}),
					},
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
			index: BigInt(lockerIndex),
			entryPointAddress: ENTRYPOINT_ADDRESS_V07,
			kernelVersion: KERNEL_V3_1,
		});
	// ************************************************************* //

	return { genSmartAccountAddress, signSessionKey, sendUserOp };
};

export default useSmartAccount;
