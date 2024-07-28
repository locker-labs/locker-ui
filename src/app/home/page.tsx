"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

import Loader from "@/components/Loader";
import LockerCreate from "@/components/LockerCreate";
import LockerPortfolio from "@/components/LockerPortfolio";
import LockerSetup from "@/components/LockerSetup";
import { getLockers, getPolicies } from "@/services/lockers";
import { getTokenTxs } from "@/services/transactions";
import type { Locker, Policy } from "@/types";
import supabaseClient from "@/utils/supabase/client";

function HomePage() {
	const isFirstRender = useRef(true);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const [policies, setPolicies] = useState<Policy[] | null>(null);

	const { getToken } = useAuth();

	const fetchLockersSupbase = async () => {
		// TODO #2: Replace with your database table name
		const { data, error } = await supabaseClient
			.from("lockers")
			.select(
				"id, user_id, seed, provider, address, updated_at, usd_value, policies (*), token_transactions (*)"
			);
		console.log("Getting data from Supabase");
		console.log(data);
		console.log(error);
	};

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
				fetchLockersSupbase();
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
			{lockers && lockers.length === 0 && !isFirstRender.current && (
				<LockerCreate lockerIndex={0} fetchLockers={fetchLockers} />
			)}
			{lockers &&
				lockers.length > 0 &&
				!isFirstRender.current &&
				(!policies || (policies && policies.length === 0)) && (
					<LockerSetup
						lockers={lockers}
						fetchPolicies={fetchPolicies}
					/>
				)}
			{lockers &&
				lockers.length > 0 &&
				!isFirstRender.current &&
				policies &&
				policies.length > 0 && (
					<LockerPortfolio
						lockers={lockers}
						policies={policies}
						fetchPolicies={fetchPolicies}
					/>
				)}
		</div>
	);
}

export default HomePage;
