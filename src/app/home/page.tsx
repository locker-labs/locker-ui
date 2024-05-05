"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

import LockerCreate from "@/components/LockerCreate";
// import LockerEmpty from "@/components/LockerEmpty";
// import LockerSetup from "@/components/LockerSetup";
// import { getLocker } from "@/services/lockers";

function HomePage() {
	const { getToken } = useAuth();

	useEffect(() => {
		const getTokenAndData = async () => {
			const token = await getToken();
			if (token) {
				// await getLocker(token);
				console.log("token", token);
			}
		};

		getTokenAndData();
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<LockerCreate />
			{/* <LockerEmpty />
			<LockerSetup /> */}
		</div>
	);
}

export default HomePage;
