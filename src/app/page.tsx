"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AuthButton from "@/components/AuthButton";
import { PATHS } from "@/data/paths";

import animationLockerBlob from "../../public/assets/animationLockerBlob.json";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

export default function LandingPage() {
	const router = useRouter();
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn) {
			router.push(PATHS.HOME);
		}
	}, [isSignedIn]);

	return (
		<div className="flex w-full flex-1 flex-col items-center pt-16">
			<div className="flex w-full max-w-2xl flex-col space-y-10">
				<h1 className="text-5xl">
					<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
						Automate
					</span>{" "}
					your crypto
				</h1>
				<span className="text-2xl font-light text-dark-300 dark:text-light-500">
					Save and invest every time you get paid on-chain. Set up
					your locker today and watch your crypto go where you want
					it.
				</span>
				<div className="flex w-full max-w-2xl items-center text-lg">
					<AuthButton
						type="sign-up"
						label="Sign up"
						height="h-12"
						width="w-32"
					/>
				</div>
			</div>
			<div className="mt-14 flex w-full max-w-xl">
				<LottieAnimation animationData={animationLockerBlob} />
				{/* <LottieAnimation animationUrl="/assets/animationLockerBlob.json" /> */}
			</div>
		</div>
	);
}
