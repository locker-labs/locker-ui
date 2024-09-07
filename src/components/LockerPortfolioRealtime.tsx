"use client";

import { useEffect, useState } from "react";

import { Locker, Policy } from "@/types";
import supabaseClient from "@/utils/supabase/client";
import { TABLE_TOKEN_TXS } from "@/utils/supabase/tables";

import LockerPortfolio from "./LockerPortfolio";

export interface ILockerPortfolio {
	initialLockers: Locker[];
	initialPolicies: Policy[];
	initialOfframpAddresses: `0x${string}`[];
}

export default function LockerPortfolioRealtime({
	initialLockers,
	initialPolicies,
	initialOfframpAddresses,
}: ILockerPortfolio) {
	const [lockers, setLockers] = useState(initialLockers);
	const [policies, setPolicies] = useState(initialPolicies);
	const [offrampAddresses, setOfframpAddresses] = useState(
		initialOfframpAddresses
	);

	const handleInserts = (payload) => {
		console.log("Change received!", payload);
	};

	useEffect(() => {
		console.log(`Subscribing to ${TABLE_TOKEN_TXS}`);
		const channel = supabaseClient
			.channel(TABLE_TOKEN_TXS)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: TABLE_TOKEN_TXS,
				},
				(txPayload) => handleInserts(txPayload)
			)
			// .on(
			// 	"postgres_changes",
			// 	{
			// 		event: "UPDATE",
			// 		schema: "public",
			// 		table: TABLE_TOKEN_TXS,
			// 	},
			// 	(txPayload) => handleInserts(txPayload)
			// )
			.subscribe();

		return () => {
			console.log(`Unsubscribing from ${TABLE_TOKEN_TXS}`);
			supabaseClient.removeChannel(channel);
		};
	}, [supabaseClient]);

	return (
		<LockerPortfolio
			lockers={lockers}
			policies={policies}
			offrampAddresses={offrampAddresses}
		/>
	);
}
