"use client";

import { redirect } from "next/navigation";

import { paths } from "@/data/constants/paths";
import { useLocker } from "@/providers/LockerProvider";

import LockerSetup from "./LockerSetup";

function LockerOnboarding() {
	const { lockers, policies } = useLocker();

	const shouldSetupFirstPolicy =
		!policies || (policies && policies.length === 0);

	const shouldShowPortfolio =
		lockers && lockers.length > 0 && !shouldSetupFirstPolicy;
	if (shouldShowPortfolio) redirect(paths.HOME);

	const heading = (
		<div className="flex flex-col items-center">
			<div className="flex w-2/3 flex-col space-y-2 text-center">
				<p className="text-2xl font-bold">Create Your Locker</p>
				<p className="text-sm text-gray-600">
					Allocate what percentage of your funds goes to each
					destination.
				</p>
				<p className="text-sm text-gray-600">
					Each time the money arrives in your locker, it will be
					automatically distributed based on the settings below.
				</p>
			</div>
		</div>
	);

	return (
		<div className="flex w-full flex-col space-y-12">
			{heading}
			<LockerSetup />
		</div>
	);
}

export default LockerOnboarding;
