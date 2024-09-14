"use client";

import { useLocker } from "../providers/LockerProvider";
import LockerOnboarding from "./LockerOnboarding";
import LockerPortfolio from "./LockerPortfolio";

function LockerNav() {
	const { lockers, policies } = useLocker();

	const shouldSetupFirstPolicy =
		!policies || (policies && policies.length === 0);
	if (shouldSetupFirstPolicy) return <LockerOnboarding />;

	const shouldShowPortfolio =
		lockers && lockers.length > 0 && !shouldSetupFirstPolicy;
	if (shouldShowPortfolio) return <LockerPortfolio />;

	return null;
}

export default LockerNav;
