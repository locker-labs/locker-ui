"use client";

import { useAuth } from "@clerk/nextjs";
import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { useState } from "react";
import type { PublicClient } from "viem";
import { useAccount, useClient } from "wagmi";

import ConnectButton from "@/components/ConnectButton";
import { createLocker } from "@/services/lockers";
import type { Locker } from "@/types";

export interface ILockerCreate {
	lockerIndex: number;
	fetchLockers: () => Promise<void>;
}

function LockerCreate({ lockerIndex, fetchLockers }: ILockerCreate) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isConnected, address, chainId } = useAccount();
	const { getToken, userId } = useAuth();
	const client = useClient();

	const createNewLocker = async () => {
		setIsLoading(true);
		try {
			const smartAccountAddress = await getKernelAddressFromECDSA({
				publicClient: client as PublicClient,
				eoaAddress: address as `0x${string}`,
				index: BigInt(lockerIndex),
				entryPointAddress: ENTRYPOINT_ADDRESS_V07,
			});
			const locker: Locker = {
				userId: userId as string,
				seed: lockerIndex.toString(),
				provider: "ZeroDev",
				ownerAddress: address as `0x${string}`,
				address: smartAccountAddress,
				chainId: chainId?.toString() as string,
			};

			const token = await getToken();
			if (token) {
				await createLocker(token, locker);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		} finally {
			await fetchLockers();
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<span>How locker works</span>
			<span>Create a locker to save and invest.</span>
			<span>Customize how your locker distributes future deposits.</span>
			<span>
				Get paid at your locker address to start automatically routing
				your funds where you want them.
			</span>
			{isConnected ? (
				<button
					className="h-12 w-40 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
					onClick={() => createNewLocker()}
					disabled={isLoading}
				>
					{isLoading ? "Loading" : "Create a Locker"}
				</button>
			) : (
				<ConnectButton
					label="Create a Locker"
					height="h-12"
					width="w-40"
					color="bold"
				/>
			)}
		</div>
	);
}

export default LockerCreate;
