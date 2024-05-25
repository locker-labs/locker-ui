"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AuthButton from "@/components/AuthButton";
import { paths } from "@/data/constants/paths";
import lockerPaths from "@/data/lottie/lockerPaths.json";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

export default function LandingPage() {
	const router = useRouter();
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn) {
			router.push(paths.HOME);
		}
	}, [isSignedIn]);

	return (
		<div className="flex w-full flex-1 flex-col items-center">
			<div className="flex w-full max-w-2xl flex-col space-y-10">
				<h1 className="text-5xl dark:text-light-100">
					<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
						Automate
					</span>{" "}
					your crypto
				</h1>
				<span className="text-2xl font-light text-dark-300 dark:text-light-200">
					Save and invest every time you get paid on-chain. Set up
					your locker today and watch your crypto go where you want
					it.
				</span>

				<div className="flex w-full max-w-2xl items-center text-lg">
					<div className="flex w-full flex-col space-y-4 ">
						<Link
							href="https://waitlist.locker.money"
							target="_blank"
						>
							<button className="h-12 w-full items-center justify-center rounded-full bg-secondary-100 text-light-100 outline-none hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100">
								Join waitlist
							</button>
						</Link>
						<AuthButton
							type="sign-in"
							label="I have an invitation"
							height="h-12"
							width="w-full"
						/>
					</div>
				</div>

				<div className="flex w-full max-w-2xl flex-1 items-center justify-center py-10">
					<LottieAnimation animationData={lockerPaths} />
				</div>
			</div>
		</div>
	);
}
