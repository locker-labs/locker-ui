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

	useEffect(() => {
		fetchLockers();
	}, []);

	useEffect(() => {
		fetchLockers();
	}, [isFirstRender.current]);

	/*
		After deploying:
		- Call lockers/${id} with PATCH request to update the deploymentTxHash
		- Can also use lockers/${id} lockers/${id} to update ownerAddress
	*/

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{!lockers && isFirstRender.current && <Loader />}
			{lockers && lockers.length === 0 && !isFirstRender.current && (
				<LockerCreate lockerIndex={0} fetchLockers={fetchLockers} />
			)}
			{lockers &&
				lockers.length > 0 &&
				!lockers[0].deploymentTxHash &&
				!isFirstRender.current && (
					<LockerEmpty emptyLocker={lockers[0]} />
				)}
			{/* <LockerSetup /> */}
		</div>
	);
}

export default HomePage;
