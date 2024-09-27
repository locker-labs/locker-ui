/* eslint-disable no-console */

import { ReactNode } from "react";

import { LockerProvider } from "@/providers/LockerProvider";
import { LockerDb, PolicyDb } from "@/types";
import { TABLE_LOCKERS } from "@/utils/supabase/tables";

import { createClerkSupabaseClientSsr } from "../utils/server";

export default async function HomeLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const supabaseServerClient = createClerkSupabaseClientSsr();

	const { data: lockersData, error: lockersError } =
		await supabaseServerClient
			.from(TABLE_LOCKERS)
			.select(
				`
				id, userId:user_id, seed, provider, address, ownerAddress:owner_address, 
				policies (
					id, lockerId:locker_id, chainId:chain_id, automations
				),
				txs:token_transactions (
					id, lockerId:locker_id, chainId:chain_id, txHash:tx_hash, fromAddress:from_address, toAddress:to_address,
					contractAddress:contract_address, tokenSymbol:token_symbol, tokenDecimals:token_decimals,
					isConfirmed:is_confirmed, triggeredByTokenTxId:triggered_by_token_tx_id, lockerDirection:locker_direction,
					automationsState:automations_state, createdAt:created_at, updatedAt:updated_at,
					usdValue:usd_value, amount
				)
			`
			)
			.order("id", {
				foreignTable: "txs",
				ascending: false,
			});

	const lockers = lockersData as LockerDb[];
	const policies = lockersData?.flatMap(
		(locker) => locker.policies
	) as PolicyDb[];

	if (lockersError) console.error(lockersError);
	// console.log("Got locker data");
	// console.log(lockers);

	return (
		<LockerProvider
			initialLockers={lockers}
			initialPolicies={policies}
			initialOfframpAddresses={[]}
		>
			{children}
		</LockerProvider>
	);
}