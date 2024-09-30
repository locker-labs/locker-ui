"use client";

import { useLocker } from "../providers/LockerProvider";
import LockerOnboarding from "./LockerOnboarding";
import LockerPortfolio from "./LockerPortfolio";

function LockerNav() {
	const { lockers, policies } = useLocker();

	const shouldSetupFirstPolicy =
		!policies || (policies && policies.length === 0);

	if (shouldSetupFirstPolicy)
		return (
			<div className="flex w-full flex-1 flex-col items-center py-12">
				<LockerOnboarding />
			</div>
		);

	const shouldShowPortfolio =
		lockers && lockers.length > 0 && !shouldSetupFirstPolicy;
	if (shouldShowPortfolio) return <LockerPortfolio />;

	return null;
}

export default LockerNav;
