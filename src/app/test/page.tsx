"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerEmpty from "@/components/LockerEmpty";
import LockerPortfolio from "@/components/LockerPortfolio";
import LockerSetup from "@/components/LockerSetup";
import { getLockers, getPolicies } from "@/services/lockers";
import { getTokenTxs } from "@/services/transactions";
import type { Locker, Policy } from "@/types";

function Test() {
	// ****************************************************** //
	// ************************ TEST ************************ //
	// ****************************************************** //
	const testLockerCreate = false;
	const testLockerEmpty = true;
	const testLockerSetup = false;
	const testLockerPortfolio = false;
	// ****************************************************** //
	// ****************************************************** //
	// ****************************************************** //

	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const [policies, setPolicies] = useState<Policy[] | null>(null);
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
				setLockers(lockersWithTxs);
				const policiesArray = await getPolicies(
					authToken,
					lockersWithTxs[0].id as number
				);
				setPolicies(policiesArray);
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
			setLockers(lockersWithTxs);
		}
	};

	const fetchPolicies = async () => {
		const authToken = await getToken();
		if (authToken && lockers) {
			setPolicies(await getPolicies(authToken, lockers[0].id as number));
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

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isFirstRender.current && <Loader />}
			{testLockerCreate && (
				<LockerCreate lockerIndex={0} fetchLockers={fetchLockers} />
			)}
			{testLockerEmpty && lockers && (
				<LockerEmpty emptyLocker={lockers[0]} />
			)}
			{testLockerSetup && lockers && (
				<LockerSetup lockers={lockers} fetchPolicies={fetchPolicies} />
			)}
			{testLockerPortfolio && lockers && policies && (
				<LockerPortfolio lockers={lockers} policies={policies} />
			)}
		</div>
	);
}

export default Test;
