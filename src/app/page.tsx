"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AuthButton from "@/components/AuthButton";
import LottieAnimation from "@/components/LottieAnimation";
import { PATHS } from "@/data/paths";

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
			<div className="flex w-full max-w-2xl flex-col space-y-4">
				<h1 className="text-5xl">
					<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
						Automate
					</span>{" "}
					your crypto
				</h1>
				<span className="text-2xl text-dark-300 dark:text-light-300">
					Set up your locker to automatically route funds to your
					preferred channels every time you get paid on-chain.
				</span>
			</div>
			<div className="mt-4 flex w-full max-w-2xl items-center text-xl">
				<AuthButton
					type="sign-up"
					label="Sign up"
					height="h-14"
					width="w-40"
				/>
			</div>
			<div className="mt-14 flex w-full max-w-xl">
				<LottieAnimation
					animationUrl="/assets/animationLockerBlob.json"
					loop
					autoplay
				/>
			</div>
		</div>
	);
}
