import {
	getKernelAddressFromECDSA,
	signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import {
	serializePermissionAccount,
	toPermissionValidator,
} from "@zerodev/permissions";
import { toSudoPolicy } from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import {
	addressToEmptyAccount,
	createKernelAccount,
	createKernelAccountClient,
	createZeroDevPaymasterClient,
} from "@zerodev/sdk";
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

import { getBundler } from "@/utils/getBundler";
import { getChainObjFromId } from "@/utils/getChainObj";
import { getPaymaster } from "@/utils/getPaymaster";

const useSmartAccount = () => {
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();

	if (!process.env.LOCKER_AGENT_ADDRESS)
		throw new Error("LOCKER_AGENT_ADDRESS is not set");

	// Prompts user to sign session key for current chain
	const signSessionKey = async (): Promise<string | undefined> => {
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
			}
		);

		const emptyAccount = addressToEmptyAccount(
			process.env.LOCKER_AGENT_ADDRESS as `0x${string}`
		);

		const emptySessionKeySigner = await toECDSASigner({
			signer: emptyAccount,
		});

		const callPolicy = toSudoPolicy({});

		const permissionPlugin = await toPermissionValidator(
			publicClient as PublicClient,
			{
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				signer: emptySessionKeySigner,
				policies: [callPolicy],
			}
		);

		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				// index: lockerIndex,
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				plugins: {
					sudo: ecdsaValidator,
					regular: permissionPlugin,
				},
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

	// Construct and submit userOp to send money out of locker
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
			}
		);

		const kernelAccountObj = await createKernelAccount(
			publicClient as PublicClient,
			{
				index: BigInt(lockerIndex),
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				plugins: {
					sudo: ecdsaValidator,
				},
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

	// Generates a smart account addres from an EOA address and a locker index
	const genSmartAccountAddress = async (
		eoaAddress: `0x${string}`,
		lockerIndex: number
	): Promise<`0x${string}`> =>
		getKernelAddressFromECDSA({
			publicClient: publicClient as PublicClient,
			eoaAddress,
			index: BigInt(lockerIndex),
			entryPointAddress: ENTRYPOINT_ADDRESS_V07,
		});

	return { genSmartAccountAddress, signSessionKey, sendUserOp };
};

export default useSmartAccount;
