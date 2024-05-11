"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerEmpty from "@/components/LockerEmpty";
import LockerSetup from "@/components/LockerSetup";
import { getLockers } from "@/services/lockers";
import { getTokenTxs } from "@/services/transactions";
import type { Locker } from "@/types";

function HomePage() {
	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const { getToken } = useAuth();

	const fetchLockers = async () => {
		const token = await getToken();
		if (token) {
			const lockersArray = await getLockers(token);
			setLockers(lockersArray);
			if (lockersArray && lockersArray.length > 0) {
				const lockersWithTxs = await getTokenTxs(token, lockersArray);
				console.log(lockersWithTxs);
				setLockers(lockersWithTxs);
			}
		}
		if (isFirstRender.current) {
			isFirstRender.current = false;
		}
	};

	const fetchTxs = async () => {
		const token = await getToken();
		if (token && lockers) {
			const lockersWithTxs = await getTokenTxs(token, lockers);
			console.log(lockersWithTxs);
			setLockers(lockersWithTxs);
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

	/*
		If locker has been funded on any supported chain,
		- Show LockerSetup component, which will show chains the locker has been funded on
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
