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
import Loader from "@/components/Loader";
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

	const renderSteps = (idSuffix: string) => (
		<div className="my-4 grid grid-cols-3 gap-x-3 text-xs">
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
		<div className="flex flex-col">
			<div className="w-full">
				<img
					src="/assets/logoLockerDarkLetters.svg"
					alt="Locker logo"
					className="w-1/3 xs:w-1/4 sm:w-1/3"
				/>
			</div>
			<div className="my-[2.4rem]">
				<p className="mb-[1.6rem] text-xxxl font-bold">
					<span className="bg-gradient-to-r from-[#63C8CD] to-[#4F4EE2] bg-clip-text text-transparent">
						Save and invest
					</span>{" "}
					<span>every time you get paid</span>
				</p>
				<p className="font-sm text-gray-600">
					Set up your locker and watch your crypto go where you want
					it.
				</p>
			</div>

			<Suspense fallback={<Loader />}>
				<div className="mb-[1rem] flex flex-row items-center space-x-6">
					<AuthButton type="sign-up" label="Sign Up" />
					<AuthButton type="sign-in" label="Sign In" />
				</div>
			</Suspense>
			<Link
				href="https://docs.locker.money"
				className="flex items-center justify-center rounded-md px-[1rem] py-[.6rem] text-center outline outline-1 outline-gray-300"
				target="_blank"
			>
				<span className="mr-2 text-xs font-semibold">
					Documentation
				</span>{" "}
				<IconArrowUpRight />
			</Link>
			<div className="mt-[1.6rem] hidden text-xs sm:block">
				{renderSteps("desktop")}
			</div>
		</div>
	);

	return (
		<main className="px-4 py-4 sm:max-w-[1100px] lg:p-10 xl:py-[2rem]">
			<div className="bg-light-100 text-dark-500 lg:gap-x-18 mb-24 grid grid-flow-row-dense gap-y-2 sm:grid-cols-2 sm:gap-x-12 xl:gap-x-24">
				<div className="space-y-4 sm:max-w-[480px]">{intro}</div>
				<div className="grid grid-cols-1 space-y-8 xs:grid-cols-12 sm:max-w-[520px]">
					<Suspense fallback={<Loader />}>
						<div className="col-span-12 xs:col-span-10 xs:col-start-2">
							<LottieAnimation animationData={lockerPaths} />
						</div>
					</Suspense>
					<div className="col-span-12 block sm:hidden">
						{renderSteps("mobile")}
					</div>
					<div className="col-span-12 pb-10">
						<p className="mb-5 text-lg font-bold">
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
