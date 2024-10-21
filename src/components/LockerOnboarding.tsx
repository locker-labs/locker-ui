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
			<div className="flex flex-col space-y-2 text-left  sm:items-center sm:justify-center sm:text-center">
				<p className="text-xl font-bold">Create Your Locker</p>
				<div className="sm:max-w-[560px]">
					<p className="text-sm text-gray-600">
						Allocate what percentage of your funds goes to each
						destination. Every time money (native or any ERC20)
						arrives in your locker, it will be automatically
						distributed based on the settings below.
					</p>
				</div>
			</div>
		</div>
	);

	return (
		<div className="mb-10 flex w-full flex-col space-y-12">
			{heading}
			<LockerSetup />
		</div>
	);
}

export default LockerOnboarding;
