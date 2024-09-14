"use client";

import LockerSetup from "./LockerSetup";

function LockerOnboarding() {
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
		<div className="space-y-8">
			{heading}
			<LockerSetup />
		</div>
	);
}

export default LockerOnboarding;
