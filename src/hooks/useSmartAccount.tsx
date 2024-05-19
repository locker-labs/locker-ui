import {
	getKernelAddressFromECDSA,
	signerToEcdsaValidator,
} from "@zerodev/ecdsa-validator";
import {
	serializePermissionAccount,
	toPermissionValidator,
} from "@zerodev/permissions";
import { ParamCondition, toCallPolicy } from "@zerodev/permissions/policies";
import { toECDSASigner } from "@zerodev/permissions/signers";
import { addressToEmptyAccount, createKernelAccount } from "@zerodev/sdk";
import {
	ENTRYPOINT_ADDRESS_V07,
	walletClientToSmartAccountSigner,
} from "permissionless";
import { type PublicClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import counterAbi from "@/data/abi/counter.json";

const useSmartAccount = () => {
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();

	if (!process.env.LOCKER_AGENT_ADDRESS)
		throw new Error("LOCKER_AGENT_ADDRESS is not set");

	// Prompts user to sign session key for current chain
	const signSessionKey = async () => {
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

		// Dummy policy
		const callPolicy = toCallPolicy({
			permissions: [
				{
					target: "0x7366325a27c5e39B594Db7eda7Ca65962A7C3284", // test counter contract
					valueLimit: BigInt(0), // max value tranfer
					abi: counterAbi,
					// @ts-expect-error: ZeroDev docs say to do it like this , and it works.
					// https://docs.zerodev.app/sdk/permissions/1-click-trading#creating-a-number-of-policies
					functionName: "increment",
					args: [
						{
							// Only allow increments of 2
							condition: ParamCondition.EQUAL,
							value: 2,
						},
					],
				},
			],
		});

		const permissionPlugin = await toPermissionValidator(
			publicClient as PublicClient,
			{
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				signer: emptySessionKeySigner,
				policies: [callPolicy],
			}
		);

		const sessionKeyAccount = await createKernelAccount(
			publicClient as PublicClient,
			{
				entryPoint: ENTRYPOINT_ADDRESS_V07,
				plugins: {
					sudo: ecdsaValidator,
					regular: permissionPlugin,
				},
			}
		);

		let sig;
		try {
			sig = await serializePermissionAccount(sessionKeyAccount);
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

	return { genSmartAccountAddress, signSessionKey };
};

export default useSmartAccount;
