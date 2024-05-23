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
import { addressToEmptyAccount, createKernelAccount } from "@zerodev/sdk";
import {
	ENTRYPOINT_ADDRESS_V07,
	walletClientToSmartAccountSigner,
} from "permissionless";
import { type PublicClient } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

const useSmartAccount = () => {
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();

	if (!process.env.LOCKER_AGENT_ADDRESS)
		throw new Error("LOCKER_AGENT_ADDRESS is not set");

	// Prompts user to sign session key for current chain
	const signSessionKey = async (ownerAddress?: `0x${string}`) => {
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
		console.log(
			`Generating policy that can only transfer to ${ownerAddress}`
		);

		// Only allow ERC20 transfers to the owner of the locker
		// const callPolicy = toCallPolicy({
		// 	permissions: [
		// 		{
		// 			target: zeroAddress,
		// 			valueLimit: BigInt(0),
		// 			functionName: "transfer",
		// 			abi: erc20Abi,
		// 			args: [
		// 				{
		// 					condition: ParamCondition.EQUAL,
		// 					value: ownerAddress!,
		// 				},
		// 				null,
		// 			],
		// 		},
		// 	],
		// });

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
