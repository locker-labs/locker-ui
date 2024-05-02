"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

import { getLocker } from "@/services/lockers";

function HomePage() {
	const { getToken } = useAuth();

	useEffect(() => {
		const getTokenAndData = async () => {
			const token = await getToken();
			if (token) {
				await getLocker(token);
			}
		};

		getTokenAndData();
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col items-center pt-16">
			<span>Home</span>
		</div>
	);
}

export default HomePage;
