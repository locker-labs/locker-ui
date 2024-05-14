"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerEmpty from "@/components/LockerEmpty";
import LockerSetup from "@/components/LockerSetup";
import { paths } from "@/data/constants/paths";
import { getLockers } from "@/services/lockers";
import { getTokenTxs } from "@/services/transactions";
import type { Locker } from "@/types";

function HomePage() {
	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const [initialTxLength, setInitialTxLength] = useState<number>(0);
	const [latestTxLength, setLatestTxLength] = useState<number>(0);

	const router = useRouter();
	const { getToken } = useAuth();

	const fetchLockers = async () => {
		const authToken = await getToken();
		if (authToken) {
			const lockersArray = await getLockers(authToken);
			setLockers(lockersArray);
			if (lockersArray && lockersArray.length > 0) {
				const lockersWithTxs = await getTokenTxs(
					authToken,
					lockersArray
				);
				console.log(lockersWithTxs);
				setLockers(lockersWithTxs);
				if (lockersWithTxs[0]?.txs) {
					setInitialTxLength(lockersWithTxs[0].txs.length);
				}
			}
		}
		if (isFirstRender.current) {
			isFirstRender.current = false;
		}
	};

	const fetchTxs = async () => {
		const authToken = await getToken();
		if (authToken && lockers) {
			const lockersWithTxs = await getTokenTxs(authToken, lockers);
			console.log(lockersWithTxs);
			setLockers(lockersWithTxs);
			if (lockersWithTxs[0].txs) {
				setLatestTxLength(lockersWithTxs[0].txs.length);
			}
		}
	};

	// Fetch lockers every 5 seconds if lockers is null
	useEffect(() => {
		const interval = setInterval(() => {
			if (!lockers) {
				fetchLockers();
			} else if (lockers) {
				fetchTxs();
			} else {
				clearInterval(interval);
			}
		}, 5000);

		// Clean up the interval when the component unmounts
		return () => clearInterval(interval);
	}, [lockers]);

	// When first tx comes in, handle navigation to transaciton page
	useEffect(() => {
		if (
			!!lockers &&
			initialTxLength === 0 &&
			latestTxLength > 0 &&
			lockers[0].txs
		) {
			router.push(
				`${paths.TX}/${lockers[0].txs[0].chainId}/${lockers[0].txs[0].txHash}`
			);
		}
	}, [lockers, initialTxLength, latestTxLength, router]);

	/*
		After locker setup/deployment:
		- Call lockers/${id} with PATCH request to update the depsloymentTxHash
		- Can also use lockers/${id} lockers/${id} to update ownerAddress
	*/

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isFirstRender.current && <Loader />}
			{lockers && lockers.length === 0 && !isFirstRender.current && (
				<LockerCreate lockerIndex={0} fetchLockers={fetchLockers} />
			)}
			{lockers &&
				lockers.length > 0 &&
				!isFirstRender.current &&
				(!lockers[0].txs ||
					(lockers[0].txs && lockers[0].txs.length === 0)) && (
					<LockerEmpty emptyLocker={lockers[0]} />
				)}
			{lockers &&
				lockers.length > 0 &&
				!isFirstRender.current &&
				lockers[0].txs &&
				lockers[0].txs.length > 0 && <LockerSetup lockers={lockers} />}
		</div>
	);
}

export default HomePage;
