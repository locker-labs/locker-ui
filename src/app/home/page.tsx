"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerEmpty from "@/components/LockerEmpty";
// import LockerSetup from "@/components/LockerSetup";
import { getLockers } from "@/services/lockers";
import type { Locker } from "@/types";

function HomePage() {
	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const { getToken } = useAuth();

	const fetchLockers = async () => {
		const token = await getToken();
		if (token) {
			const lockersArray = await getLockers(token);
			console.log(lockersArray);
			setLockers(lockersArray);
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
			{lockers && lockers.length > 0 && !isFirstRender.current && (
				<LockerEmpty emptyLocker={lockers[0]} />
			)}
			{/* <LockerSetup /> */}
		</div>
	);
}

export default HomePage;
