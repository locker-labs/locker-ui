"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

import ConnectButton from "@/components/ConnectButton";
import { createLocker } from "@/services/lockers";

import PageLoader from "./PageLoader";

function LockerCreate() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { isConnected } = useAccount();

	// Should create a locker in DB, and somehow the parent page
	// needs to pick up on the DB insertion.
	const createLockerAddress = async () => {
		setIsLoading(true);
		try {
			await createLocker();
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <PageLoader />;
	}

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
					onClick={createLockerAddress}
					disabled={isLoading}
				>
					Create a Locker
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
