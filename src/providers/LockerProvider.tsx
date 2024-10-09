"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";

import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { Automation, IOfframpAddress, LockerDb, PolicyDb, Tx } from "@/types";
import {
	TABLE_LOCKERS,
	TABLE_OFFRAMP_ADDRESSES,
	TABLE_POLICIES,
	TABLE_TOKEN_TXS,
} from "@/utils/supabase/tables";

export interface ILockerPortfolio {
	initialLockers: LockerDb[];
	initialPolicies: PolicyDb[];
	initialOfframpAddresses: IOfframpAddress[];
}

interface LockerPortfolioContextProps {
	lockers: LockerDb[];
	locker: LockerDb | undefined;
	policies: PolicyDb[];
	automations: Automation[] | undefined;
	txs: Tx[];
	offrampAddresses: IOfframpAddress[];
}

// Create the context with a default value
const LockerPortfolioContext = createContext<
	LockerPortfolioContextProps | undefined
>(undefined);

// Provider component
export function LockerProvider({
	initialLockers,
	initialPolicies,
	initialOfframpAddresses,
	children,
}: ILockerPortfolio & { children: ReactNode }) {
	const initialTxs = (initialLockers || []).flatMap(
		(locker) => locker.txs
	) as Tx[];
	const { records: txs } = useRealtimeTable<Tx>(TABLE_TOKEN_TXS, initialTxs);
	// console.log("Tx records", txs);

	const { records: policies } = useRealtimeTable<PolicyDb>(
		TABLE_POLICIES,
		initialPolicies
	);
	// console.log("Policy records", policies);

	const { records: offrampAddresses } = useRealtimeTable<IOfframpAddress>(
		TABLE_OFFRAMP_ADDRESSES,
		initialOfframpAddresses
	);
	// console.log("Offramp address records", offrampAddresses);

	const { records: lockers } = useRealtimeTable<LockerDb>(
		TABLE_LOCKERS,
		initialLockers
	);
	// console.log("lockers records", lockers);
	// console.log("lockers initialLockers", initialLockers);
	const locker = lockers && lockers.length > 0 ? lockers[0] : undefined;
	const automations = (policies && policies[0]?.automations) ?? [];

	// Memoize the value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			lockers: lockers || [],
			locker,
			policies,
			automations,
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
export const useLocker = (): LockerPortfolioContextProps => {
	const context = useContext(LockerPortfolioContext);
	if (!context) {
		throw new Error(
			"useLockerPortfolio must be used within a LockerPortfolioProvider"
		);
	}
	return context;
};
