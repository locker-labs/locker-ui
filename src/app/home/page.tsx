/* eslint-disable no-console */

"use client";

import { useAuth } from "@clerk/nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";
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
	const [offrampAddresses] = useState<`0x${string}`[]>([]);

	const { getToken, userId } = useAuth();

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

	const fetchPolicies = async () => {
		const authToken = await getToken();
		if (authToken && lockers) {
			setPolicies(await getPolicies(authToken, lockers[0].id as number));
		}
	};

	// Handle locker updates from Supabase subscription
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleLockerUpdates = async (payload: any) => {
		console.log("Locker Change received!", payload);
		const authToken = await getToken();
		if (authToken && lockers) {
			const updatedLockers = lockers.map((locker) =>
				locker.id === payload.new.id
					? { ...locker, ...payload.new }
					: locker
			);
			setLockers(updatedLockers);
			if (updatedLockers && updatedLockers.length > 0) {
				const lockersWithTxs = await getTokenTxs(
					authToken,
					updatedLockers
				);
				setLockers(lockersWithTxs);
				const policiesArray = await getPolicies(
					authToken,
					lockersWithTxs[0].id as number
				);
				setPolicies(policiesArray);
			}
		}
	};

	// Handle token transaction updates from Supabase subscription
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleTxUpdates = async (payload: any) => {
		console.log("Tx Change received!", payload);
		// TODO: finish implementing this
	};

	// Handle policy updates from Supabase subscription
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handlePolicyUpdates = async (payload: any) => {
		console.log("Policy Change received!", payload);
		// TODO: finish implementing this
	};

	// Fetch lockers, token txs, and policies, then subscribe to changes
	useEffect(() => {
		let lockersChannel: RealtimeChannel | null = null;
		let tokenTxsChannels: RealtimeChannel[] = [];
		let policiesChannel: RealtimeChannel | null = null;

		fetchLockers().then(() => {
			lockersChannel = supabaseClient
				.channel("lockers-changes")
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "lockers",
						filter: `user_id=eq.${userId}`,
					},
					(payload) => handleLockerUpdates(payload)
				)
				.subscribe();

			if (lockers) {
				tokenTxsChannels = lockers.map((locker) =>
					supabaseClient
						.channel(`token-transactions-changes-${locker.id}`)
						.on(
							"postgres_changes",
							{
								event: "UPDATE",
								schema: "public",
								table: "token_transactions",
								filter: `locker_id=eq.${locker.id}`,
							},
							(payload) => handleTxUpdates(payload)
						)
						.subscribe()
				);
			}

			fetchPolicies().then(() => {
				policiesChannel = supabaseClient
					.channel("policies-changes")
					.on(
						"postgres_changes",
						{
							event: "UPDATE",
							schema: "public",
							table: "policies",
						},
						(payload) => handlePolicyUpdates(payload)
					)
					.subscribe();
			});
		});

		// Clean up subscriptions when the component unmounts
		return () => {
			if (lockersChannel) {
				supabaseClient.removeChannel(lockersChannel);
			}
			if (tokenTxsChannels.length > 0) {
				tokenTxsChannels.forEach((channel) => {
					if (channel) supabaseClient.removeChannel(channel);
				});
			}
			if (policiesChannel) {
				supabaseClient.removeChannel(policiesChannel);
			}
		};
	}, [userId]);

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			{isFirstRender.current && <Loader />}
			{lockers && lockers.length === 0 && !isFirstRender.current && (
				<LockerCreate
					lockerIndex={0}
					// TODO: Remove fetchLockers since subscriptions will handle this
					fetchLockers={fetchLockers}
				/>
			)}
			{lockers &&
				lockers.length > 0 &&
				!isFirstRender.current &&
				(!policies || (policies && policies.length === 0)) && (
					<LockerSetup
						lockers={lockers}
						// TODOL Remove fetchPolicies since subscriptions will handle this
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
						// TODOL Remove fetchPolicies since subscriptions will handle this
						fetchPolicies={fetchPolicies}
						offrampAddresses={offrampAddresses}
					/>
				)}
		</div>
	);
}

export default HomePage;

// const fetchLockersSupbase = async () => {
// 	console.log("userId:", userId);

// 	const { data, error } = await supabaseClient
// 		.from("lockers")
// 		.select("*")
// 		.eq("user_id", `${userId}`);
// 	console.log("Getting data from Supabase...");
// 	console.log("data:", data);
// 	if (error) console.error(error);
// if (data?.length && data.length > 0) {
// 	const addresses =
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 		(data[0] as any).offramp_accounts[0].offramp_addresses.map(
// 			(a: { address: `0x${string}` }) => a.address
// 		);
// 	setOfframpAddresses(addresses);
// 	console.log("got offramp addresses", offrampAddresses);
// }
// };
