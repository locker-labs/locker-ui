"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import Loader from "@/components/Loader";
import { useConnectModal } from "@/hooks/useConnectModal";
import useSmartAccount from "@/hooks/useSmartAccount";
import { createLocker } from "@/services/lockers";
import type { Locker } from "@/types";

export interface ILockerCreate {
	lockerIndex: number;
	fetchLockers: () => Promise<void>;
}

function LockerCreate({ lockerIndex, fetchLockers }: ILockerCreate) {
	const [isCreatingLocker, setIsCreatingLocker] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { isConnected, address } = useAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { genSmartAccountAddress } = useSmartAccount();
	const { getToken } = useAuth();

	const createNewLocker = async () => {
		setErrorMessage(null);
		setIsLoading(true);
		// Show Loader for 1.5 seconds
		await new Promise((resolve) => {
			setTimeout(resolve, 1500);
		});

		// Proceed
		try {
			const smartAccountAddress = await genSmartAccountAddress(
				address as `0x${string}`,
				lockerIndex
			);

			const locker: Locker = {
				seed: lockerIndex,
				provider: "ZeroDev",
				address: smartAccountAddress,
				ownerAddress: address as `0x${string}`,
			};

			const token = await getToken();
			if (token) {
				await createLocker(token, locker, setErrorMessage);
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
			createNewLocker();
		} else {
			openConnectModal();
			setIsCreatingLocker(true);
		}
	};

	useEffect(() => {
		if (isConnected && isCreatingLocker) {
			createNewLocker();
		}
	}, [address, isCreatingLocker]);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			{isLoading ? (
				<Loader text="Setting up your locker" />
			) : (
				<>
					<h1 className="text-4xl dark:text-light-100">
						How Locker works
					</h1>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Create
						</span>{" "}
						a locker smart account.
					</span>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Customize
						</span>{" "}
						how your locker distributes payments.
					</span>
					<span className="text-xl">
						<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-2xl text-transparent">
							Get paid
						</span>{" "}
						at your locker address and watch your crypto
						automatically go where you want it.
					</span>
					<button
						className="h-12 w-40 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
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
