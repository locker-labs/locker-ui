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
			<div className="flex flex-col space-y-2 xxs:text-left sm:items-center sm:justify-center sm:text-center">
				<p className="text-2xl font-bold">Create Your Locker</p>
				<div className="sm:w-4/5 lg:w-2/3 xl:w-1/2">
					<p className="text-gray-600 xxs:text-sm sm:text-base lg:text-lg">
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
		<div className="flex w-full flex-col space-y-12">
			{heading}
			<LockerSetup />
		</div>
	);
}

export default LockerOnboarding;
