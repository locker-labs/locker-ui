"use client";

import { useAuth } from "@clerk/nextjs";
import { getKernelAddressFromECDSA } from "@zerodev/ecdsa-validator";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { useEffect, useState } from "react";
import type { PublicClient } from "viem";
import { useAccount, useClient } from "wagmi";

import Loader from "@/components/Loader";
import { errors } from "@/data/constants/errorMessages";
import { useConnectModal } from "@/hooks/useConnectModal";
import { createLocker } from "@/services/lockers";
import type { Locker } from "@/types";
import { isChainSupported } from "@/utils/isChainSupported";

export interface ILockerCreate {
	lockerIndex: number;
	fetchLockers: () => Promise<void>;
}

function LockerCreate({ lockerIndex, fetchLockers }: ILockerCreate) {
	const [isCreatingLocker, setIsCreatingLocker] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { isConnected, address, chainId } = useAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { getToken, userId } = useAuth();
	const client = useClient();

	const createNewLocker = async () => {
		setErrorMessage(null);
		setIsLoading(true);
		// Show Loader for 3 seconds
		await new Promise((resolve) => {
			setTimeout(resolve, 3000);
		});

		// Proceed
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

	const handleLockerCreation = () => {
		if (isConnected) {
			if (isChainSupported(chainId as number)) {
				createNewLocker();
			} else {
				setErrorMessage(errors.UNSUPPORTED_CHAIN);
			}
		} else {
			openConnectModal();
			setIsCreatingLocker(true);
		}
	};

	useEffect(() => {
		if (isConnected && isCreatingLocker) {
			if (isChainSupported(chainId as number)) {
				createNewLocker();
			} else {
				setErrorMessage(errors.UNSUPPORTED_CHAIN);
				setIsCreatingLocker(false);
			}
		}
	}, [address, isCreatingLocker]);

	useEffect(() => {
		if (
			isConnected &&
			errorMessage === errors.UNSUPPORTED_CHAIN &&
			isChainSupported(chainId as number)
		) {
			setErrorMessage(null);
		}
	}, [chainId]);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			{isLoading ? (
				<Loader text="Setting up your locker" />
			) : (
				<>
					<h1 className="text-4xl dark:text-light-100">
						How locker works
					</h1>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Create
						</span>{" "}
						your locker smart account.
					</span>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Customize
						</span>{" "}
						how your locker distributes future deposits.
					</span>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Get paid
						</span>{" "}
						at your locker address and watch your crypto
						automatically go where you want it.
					</span>
					<button
						className="h-12 w-40 items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
						onClick={() => handleLockerCreation()}
						disabled={isLoading}
					>
						Create a Locker
					</button>
					{errorMessage && (
						<span className="text-error">{errorMessage}</span>
					)}
				</>
			)}
			{renderConnectModal()}
		</div>
	);
}

export default LockerCreate;
