"use client";

import { useLocker } from "../providers/LockerProvider";
import LockerCreate from "./LockerCreate";
import LockerPortfolio from "./LockerPortfolio";
import LockerSetup from "./LockerSetup";

function LockerNav() {
	const { lockers, policies } = useLocker();

	const shouldCreateLocker = lockers && lockers.length === 0;
	if (shouldCreateLocker) return <LockerCreate lockerIndex={0} />;

	const shouldSetupFirstPolicy =
		lockers &&
		lockers.length > 0 &&
		(!policies || (policies && policies.length === 0));
	if (shouldSetupFirstPolicy) return <LockerSetup />;

	const shouldShowPortfolio =
		lockers && lockers.length > 0 && !shouldSetupFirstPolicy;
	if (shouldShowPortfolio) return <LockerPortfolio />;

	return null;
}

export default LockerNav;
