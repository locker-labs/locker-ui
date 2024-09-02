"use client";

import { SignUp, useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import FaqAccordion from "@/components/FaqAccordion";
import StepInfo from "@/components/StepInfo";
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
		<div>
			<div className="flex w-full flex-row gap-x-48">
				<div className="flex w-full max-w-2xl flex-col space-y-10">
					<div>
						<h1 className="mb-6 text-3xl dark:text-light-100">
							<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
								Save and invest
							</span>{" "}
							every time you get paid
						</h1>
						<span className="text-xl font-light text-dark-300 dark:text-light-200">
							Automate your crypto. Save and invest every time you
							get paid on-chain.
						</span>
					</div>

					<div>
						<p className="mb-6 font-bold">Three simple steps</p>
						<div className="space-y-3">
							<StepInfo text="1. Create a locker" icon="🔗" />
							<StepInfo
								text="2. Customize payment distributions"
								icon="🔗"
							/>
							<StepInfo
								text="3. Get paid at your locker"
								icon="🔗"
							/>
						</div>
					</div>
				</div>
				<div className="flex w-full max-w-2xl flex-col items-center space-y-4">
					<div className="flex w-2/3">
						<LottieAnimation animationData={lockerPaths} />
					</div>
					<SignUp />
				</div>
			</div>
			<Link
				href="https://docs.locker.money"
				className="h-12 w-full rounded-full text-center text-white"
				target="_blank"
			>
				Documentation
			</Link>

			<div className="flex w-full flex-col justify-center pb-10">
				<h1 className="mb-5 text-2xl dark:text-light-100">
					Frequently asked questions
				</h1>
				<FaqAccordion />
			</div>
		</div>
	);
}
