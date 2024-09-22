"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Suspense, useEffect } from "react";

import AuthButton from "@/components/AuthButton";
import FaqAccordion from "@/components/FaqAccordion";
import Footer from "@/components/Footer";
import {
	IconArrowUpRight,
	IconCustomize,
	IconPaid,
	IconPlus,
} from "@/components/Icons";
import StepInfo from "@/components/StepInfo";
import { paths } from "@/data/constants/paths";
import lockerPaths from "@/data/lottie/lockerPaths.json";

import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

export default function LandingPage() {
	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { setTheme } = useTheme();
	setTheme("light");
	useEffect(() => {
		if (isSignedIn) {
			router.push(paths.HOME);
		}
	}, [isSignedIn]);

	return (
		<main className="flex min-h-[50vh] w-full min-w-[230px] flex-1 flex-col items-center p-24">
			<Suspense fallback={<Loading />}>
				<div
					className={`${inter.className} flex min-h-screen w-full flex-col items-center bg-light-100 text-dark-500`}
				>
					<div className="flex w-full flex-row gap-x-36">
						<div className="flex w-full max-w-2xl flex-col space-y-10">
							<div className="w-full">
								<img
									src="/assets/logoLockerDarkLetters.svg"
									alt="Locker logo"
									className="w-1/3"
								/>
							</div>
							<div>
								<h1 className="mb-6 text-[40px]">
									<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
										Save and invest
									</span>{" "}
									every time you get paid
								</h1>
								<span className="gray-600 text-xl">
									Set up your locker and watch your crypto go
									where you want it.
								</span>
							</div>

							<div className="flex w-full max-w-2xl flex-row items-center space-x-4 text-lg">
								<AuthButton
									type="sign-up"
									label="Sign up"
									height="h-12"
									width="w-full"
								/>
								<AuthButton
									type="sign-in"
									label="Sign in"
									height="h-12"
									width="w-full"
								/>
							</div>

							<Link
								href="https://docs.locker.money"
								className="flex h-12 w-full items-center justify-center rounded-md text-center outline outline-gray-400"
								target="_blank"
							>
								Documentation <IconArrowUpRight />
							</Link>
							<div className="flex flex-row space-x-3">
								<StepInfo
									text="Create a locker account"
									icon={<IconPlus />}
								/>
								<StepInfo
									text="Customize payment distributions"
									icon={<IconCustomize />}
								/>
								<StepInfo
									text="Get paid at your locker"
									icon={<IconPaid />}
								/>
							</div>
						</div>
						<div className="flex w-full max-w-2xl flex-col items-center space-y-8">
							<div className="flex w-full">
								<LottieAnimation animationData={lockerPaths} />
							</div>
							<div className="flex w-full flex-col justify-center pb-10">
								<p className="mb-5 text-xl dark:text-light-100">
									Frequently asked questions
								</p>
								<FaqAccordion />
							</div>
						</div>
					</div>
				</div>
			</Suspense>
			<Footer />
		</main>
	);
}
