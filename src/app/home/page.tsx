/* eslint-disable no-console */

import { Suspense } from "react";

import Loader from "@/components/Loader";
import LockerPortfolioRealtime from "@/components/LockerPortfolioRealtime";
import LockerSetup from "@/components/LockerSetup";
import { Locker, Policy } from "@/types";
import { supabaseServerClient } from "@/utils/supabase/server";
import { TABLE_LOCKERS } from "@/utils/supabase/tables";

async function HomePage() {
	const { data: lockersData, error: lockersError } =
		await supabaseServerClient.from(TABLE_LOCKERS).select(
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
		);

	const lockers = lockersData as Locker[];
	const policies = lockersData?.flatMap(
		(locker) => locker.policies
	) as Policy[];

	if (lockersError) console.error(lockersError);
	console.log("Got locker data");
	console.log(lockers);

	const shouldSetupFirstPolicy =
		lockers &&
		lockers.length > 0 &&
		(!policies || (policies && policies.length === 0));

	const shouldShowPortfolio =
		lockers && lockers.length > 0 && !shouldSetupFirstPolicy;

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<Suspense fallback={<Loader />}>
				{shouldSetupFirstPolicy && <LockerSetup lockers={lockers} />}
				{shouldShowPortfolio && (
					<LockerPortfolioRealtime
						initialLockers={lockers}
						initialPolicies={policies}
						initialOfframpAddresses={[]}
					/>
				)}
			</Suspense>
		</div>
	);
}

export default HomePage;
