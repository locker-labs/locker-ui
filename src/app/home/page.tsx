"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerEmpty from "@/components/LockerEmpty";
// import LockerSetup from "@/components/LockerSetup";
import { getLockers } from "@/services/lockers";
import type { Locker } from "@/types";
import { isChainSupported } from "@/utils/isChainSupported";

function HomePage() {
	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const [lockerForCurrentChain, setLockerForCurrentChain] = useState<
		Locker | undefined
	>(undefined);
	const { isConnected, chainId } = useAccount();
	const { getToken } = useAuth();

	const fetchLockers = async () => {
		const token = await getToken();
		if (token) {
			const lockersArray = await getLockers(token);
			let currentChainLocker: Locker | undefined;
			if (lockersArray && lockersArray.length > 0) {
				currentChainLocker = lockersArray?.find(
					(item) => Number(item.chainId) === chainId
				);
			}
			console.log("lockerForCurrentChain: ", lockerForCurrentChain);
			console.log(lockersArray);
			setLockers(lockersArray);
			setLockerForCurrentChain(currentChainLocker);
		}
		if (isFirstRender.current) {
			isFirstRender.current = false;
		}
	};

	// Fetch lockers every 5 seconds if lockers is null
	useEffect(() => {
		const interval = setInterval(() => {
			if (!lockers) {
				fetchLockers();
			} else {
				clearInterval(interval);
			}
		}, 5000);

		// Clean up the interval when the component unmounts
		return () => clearInterval(interval);
	}, [lockers]);

	// Fetch lockers whenever chainId changes
	useEffect(() => {
		if (isConnected && isChainSupported(chainId as number)) {
			const lockerExists = lockers?.some(
				(locker) => locker.chainId === chainId?.toString()
			);
			if (!lockerExists) {
				fetchLockers();
			}
		}
	}, [isConnected, chainId]);

	/*
		After deploying:
		- Call lockers/${id} with PATCH request to update the depsloymentTxHash
		- Can also use lockers/${id} lockers/${id} to update ownerAddress
	*/

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isFirstRender.current && <Loader />}
			{lockers && !lockerForCurrentChain && !isFirstRender.current && (
				<LockerCreate lockerIndex={0} fetchLockers={fetchLockers} />
			)}
			{lockers &&
				lockerForCurrentChain &&
				!lockerForCurrentChain.deploymentTxHash &&
				!isFirstRender.current && (
					<LockerEmpty emptyLocker={lockers[0]} />
				)}
			{/* <LockerSetup /> */}
		</div>
	);
}

export default HomePage;
