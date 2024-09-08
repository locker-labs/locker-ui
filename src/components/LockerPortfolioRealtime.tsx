"use client";

import { useState } from "react";

import { LockerDb, PolicyDb, Tx } from "@/types";
import {
	TABLE_LOCKERS,
	TABLE_POLICIES,
	TABLE_TOKEN_TXS,
} from "@/utils/supabase/tables";
import { useRealtimeTable } from "@/utils/supabase/useRealtimeTable";

import LockerPortfolio from "./LockerPortfolio";

export interface ILockerPortfolio {
	initialLockers: LockerDb[];
	initialPolicies: PolicyDb[];
	initialOfframpAddresses: `0x${string}`[];
}

export default function LockerPortfolioRealtime({
	initialLockers,
	initialPolicies,
	initialOfframpAddresses,
}: ILockerPortfolio) {
	const [offrampAddresses] = useState(initialOfframpAddresses);

	const initialTxs = initialLockers.flatMap((locker) => locker.txs) as Tx[];
	const { records: txs } = useRealtimeTable<Tx>(TABLE_TOKEN_TXS, initialTxs);
	console.log("Tx records", txs);

	const { records: policies } = useRealtimeTable<PolicyDb>(
		TABLE_POLICIES,
		initialPolicies
	);
	console.log("Policy records", policies);

	const { records: lockers } = useRealtimeTable<LockerDb>(
		TABLE_LOCKERS,
		initialLockers
	);
	console.log("lockers records", lockers);

	return (
		<LockerPortfolio
			lockers={lockers}
			policies={policies}
			txs={txs}
			offrampAddresses={offrampAddresses}
		/>
	);
}
