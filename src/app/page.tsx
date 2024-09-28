"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

	const renderSteps = (idSuffix: string) => (
		<div className="grid grid-cols-3 gap-x-3 xxs:my-4 xxs:text-sm lg:text-base">
			<StepInfo
				text="Create a locker account"
				icon={<IconPlus idSuffix={idSuffix} />}
			/>
			<StepInfo
				text="Customize payment distributions"
				icon={<IconCustomize idSuffix={idSuffix} />}
			/>
			<StepInfo
				text="Get paid at your locker"
				icon={<IconPaid idSuffix={idSuffix} />}
			/>
		</div>
	);

	const intro = (
		<>
			<div className="w-full">
				<img
					src="/assets/logoLockerDarkLetters.svg"
					alt="Locker logo"
					className="xxs:w-1/3 xs:w-1/4 sm:w-1/3"
				/>
			</div>
			<div>
				<p className="mb-3 text-3xl font-bold">
					<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
						Save and invest
					</span>{" "}
					<span>every time you get paid</span>
				</p>
				<p className="my-6 text-gray-600">
					Set up your locker and watch your crypto go where you want
					it.
				</p>
			</div>
			<Suspense fallback={<Loading />}>
				<div className="flex flex-row items-center space-x-4 text-lg">
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
			</Suspense>
			<Link
				href="https://docs.locker.money"
				className="flex h-12 items-center justify-center rounded-md text-center outline outline-1 outline-gray-400"
				target="_blank"
			>
				<span className="mr-2 font-semibold">Documentation</span>{" "}
				<IconArrowUpRight />
			</Link>
			<div className="xxs:hidden sm:block lg:mt-6">
				{renderSteps("desktop")}
			</div>
		</>
	);

	return (
		<main className="xxs:px-4 xxs:py-4 lg:p-12 xl:px-32">
			<div className="mb-24 grid grid-flow-row-dense gap-y-2 bg-light-100 text-dark-500  sm:grid-cols-2 sm:gap-x-12 xl:gap-x-36">
				<div className="xxs:space-y-4">{intro}</div>
				<div className="grid space-y-8 xxs:grid-cols-1 xs:grid-cols-8">
					<Suspense fallback={<Loading />}>
						<div className="xxs:mt-8 xs:col-span-6 xs:col-start-2 sm:col-span-8 sm:mb-2 sm:mt-0 lg:col-span-6 lg:col-start-2">
							<LottieAnimation animationData={lockerPaths} />
						</div>
					</Suspense>
					<div className="xxs:col-span-8 xxs:block sm:hidden">
						{renderSteps("mobile")}
					</div>
					<div className="pb-10 xs:col-span-8">
						<p className="mb-5 text-xl font-bold dark:text-light-100">
							Frequently asked questions
						</p>
						<FaqAccordion />
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
