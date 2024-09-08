"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { useRealtimeTable } from "@/app/utils/useRealtimeTable";
import { LockerDb, PolicyDb, Tx } from "@/types";
import {
	TABLE_LOCKERS,
	TABLE_POLICIES,
	TABLE_TOKEN_TXS,
} from "@/utils/supabase/tables";

export interface ILockerPortfolio {
	initialLockers: LockerDb[];
	initialPolicies: PolicyDb[];
	initialOfframpAddresses: `0x${string}`[];
}

interface LockerPortfolioContextProps {
	lockers: LockerDb[];
	policies: PolicyDb[];
	txs: Tx[];
	offrampAddresses: `0x${string}`[];
}

// Create the context with a default value
const LockerPortfolioContext = createContext<
	LockerPortfolioContextProps | undefined
>(undefined);

// Provider component
export function LockerPortfolioProvider({
	initialLockers,
	initialPolicies,
	initialOfframpAddresses,
	children,
}: ILockerPortfolio & { children: ReactNode }) {
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

	// Memoize the value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			lockers,
			policies,
			txs,
			offrampAddresses,
		}),
		[lockers, policies, txs, offrampAddresses] // only recompute when these dependencies change
	);

	// Provide the state to children components
	return (
		<LockerPortfolioContext.Provider value={value}>
			{children}
		</LockerPortfolioContext.Provider>
	);
}

// Custom hook for accessing the context
export const useLockerPortfolio = (): LockerPortfolioContextProps => {
	const context = useContext(LockerPortfolioContext);
	if (!context) {
		throw new Error(
			"useLockerPortfolio must be used within a LockerPortfolioProvider"
		);
	}
	return context;
};
