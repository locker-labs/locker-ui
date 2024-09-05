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
	const tokenTxsChannels = useRef<RealtimeChannel[]>([]);
	const policiesChannels = useRef<RealtimeChannel[]>([]);
	const [lockers, setLockers] = useState<Locker[] | null>(null);
	const [policies, setPolicies] = useState<Policy[] | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [offrampAddresses, setOfframpAddresses] = useState<`0x${string}`[]>(
		[]
	);

	const { getToken, userId } = useAuth();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleTxInsertsAndUpdates = async (payload: any) => {
		console.log("Tx created or changed!", payload);
		const authToken = await getToken();
		if (authToken) {
			console.log("Updating lockers with token txs state...");
			setLockers((prevLockers) => {
				if (prevLockers) {
					getTokenTxs(authToken, prevLockers).then(
						(updatedLockersWithTxs) => {
							setLockers(updatedLockersWithTxs);
						}
					);
				}
				return prevLockers;
			});
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handlePolicyInserts = async (payload: any) => {
		console.log("Policy created!", payload);
		// Since fetchPolicies is called in LockerSetup and LockerPortfolio, nothing is needed here yet
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handlePolicyUpdates = async (payload: any) => {
		console.log("Policy updated!", payload);
		const authToken = await getToken();
		if (authToken) {
			console.log("Updating policies state...");
			setLockers((prevLockers) => {
				if (prevLockers) {
					getPolicies(authToken, payload.new.locker_id).then(
						(updatedPolicies) => {
							setPolicies(updatedPolicies);
						}
					);
				}
				return prevLockers;
			});
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleLockerInserts = async (payload: any) => {
		console.log("Locker created!", payload);
		// Since fetchLockers is called in LockerCreate, nothing is needed here yet
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleLockerUpdates = async (payload: any) => {
		console.log("Locker updated!", payload);
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
			}
		}
	};

	const fetchLockers = async () => {
		const authToken = await getToken();
		if (authToken) {
			const lockersArray = await getLockers(authToken);
			setLockers(lockersArray);
			if (lockersArray && lockersArray.length > 0) {
				// Set relevant state
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

				// Subscribe to token transaction changes if lockers exist on first render
				lockersWithTxs.forEach((locker) => {
					const isAlreadySubscribed = tokenTxsChannels.current.find(
						(channel) =>
							channel.topic ===
							`token-transactions-changes-${locker.id}`
					);
					if (!isAlreadySubscribed) {
						const txChannel = supabaseClient
							.channel(`token-transactions-changes-${locker.id}`)
							.on(
								"postgres_changes",
								{
									event: "INSERT",
									schema: "public",
									table: "token_transactions",
									filter: `locker_id=eq.${locker.id}`,
								},
								(txPayload) =>
									handleTxInsertsAndUpdates(txPayload)
							)
							.on(
								"postgres_changes",
								{
									event: "UPDATE",
									schema: "public",
									table: "token_transactions",
									filter: `locker_id=eq.${locker.id}`,
								},
								(txPayload) =>
									handleTxInsertsAndUpdates(txPayload)
							)
							.subscribe();
						tokenTxsChannels.current.push(txChannel);
					}
				});

				// Subscribe to policy changes if lockers exist on first render
				lockersWithTxs.forEach((locker) => {
					const isAlreadySubscribed = policiesChannels.current.find(
						(channel) =>
							channel.topic === `policies-changes-${locker.id}`
					);
					if (!isAlreadySubscribed) {
						const policyChannel = supabaseClient
							.channel(`policies-changes-${locker.id}`)
							.on(
								"postgres_changes",
								{
									event: "INSERT",
									schema: "public",
									table: "policies",
									filter: `locker_id=eq.${locker.id}`,
								},
								(polPayload) => handlePolicyInserts(polPayload)
							)
							.on(
								"postgres_changes",
								{
									event: "UPDATE",
									schema: "public",
									table: "policies",
									filter: `locker_id=eq.${locker.id}`,
								},
								(polPayload) => handlePolicyUpdates(polPayload)
							)
							.subscribe();
						policiesChannels.current.push(policyChannel);
					}
				});
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

	// Should probalby just fetch this from an API endpoint
	// const fetchOfframpAddresses = async () => {
	// 	const { data, error } = await supabaseClient
	// 		.from("offramp_addresses")
	// 		.select("*")
	// 		.eq("user_id", `${userId}`);
	// 	console.log("Getting data from Supabase...");
	// 	console.log("data:", data);
	// 	if (error) console.error(error);
	// 	if (data?.length && data.length > 0) {
	// 		const addresses =
	// 			// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 			(data[0] as any).offramp_accounts[0].offramp_addresses.map(
	// 				(a: { address: `0x${string}` }) => a.address
	// 			);
	// 		setOfframpAddresses(addresses);
	// 		console.log("got offramp addresses", addresses);
	// 	}
	// };

	// Fetch lockers, token txs, and policies, then subscribe to changes
	useEffect(() => {
		// fetchOfframpAddresses();

		let lockersChannel: RealtimeChannel | null = null;

		fetchLockers().then(() => {
			lockersChannel = supabaseClient
				.channel("lockers-changes")
				.on(
					"postgres_changes",
					{
						event: "INSERT",
						schema: "public",
						table: "lockers",
						filter: `user_id=eq.${userId}`,
					},
					(lockerPayload) => handleLockerInserts(lockerPayload)
				)
				.on(
					"postgres_changes",
					{
						event: "UPDATE",
						schema: "public",
						table: "lockers",
						filter: `user_id=eq.${userId}`,
					},
					(lockerPayload) => handleLockerUpdates(lockerPayload)
				)
				.subscribe();
		});

		// Clean up subscriptions when the component unmounts
		return () => {
			if (lockersChannel) {
				supabaseClient.removeChannel(lockersChannel);
			}
			if (tokenTxsChannels.current.length > 0) {
				tokenTxsChannels.current.forEach((channel) => {
					if (channel) supabaseClient.removeChannel(channel);
				});
				tokenTxsChannels.current = [];
			}
			if (policiesChannels.current.length > 0) {
				policiesChannels.current.forEach((channel) => {
					if (channel) supabaseClient.removeChannel(channel);
				});
				policiesChannels.current = [];
			}
		};
	}, [userId]);

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
						offrampAddresses={offrampAddresses}
					/>
				)}
		</div>
	);
}

export default HomePage;
