"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AuthButton from "@/components/AuthButton";
import { errors } from "@/data/constants/errorMessages";
import { paths } from "@/data/constants/paths";
import lockerPaths from "@/data/lottie/lockerPaths.json";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

export default function LandingPage() {
	const [inviteCode, setInviteCode] = useState<string>("");
	const [hasValidInviteCode, setHasValidInviteCode] =
		useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const router = useRouter();
	const { isSignedIn } = useAuth();

	const inviteCodes = process.env.BETA_INVITE_CODES!.split(",");

	const handleInviteCodeSubmission = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		setErrorMessage("");
		e.preventDefault();
		if (inviteCodes.includes(inviteCode)) {
			localStorage.setItem("inviteCode", inviteCode);
			setHasValidInviteCode(true);
		} else {
			setErrorMessage(errors.INVALID_INVITE);
		}
	};

	useEffect(() => {
		if (isSignedIn) {
			router.push(paths.HOME);
		}
	}, [isSignedIn]);

	useEffect(() => {
		const storedInviteCode = localStorage.getItem("inviteCode");
		if (storedInviteCode && inviteCodes.includes(storedInviteCode)) {
			setHasValidInviteCode(true);
		}
	}, []);

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
				{hasValidInviteCode ? (
					<div className="flex w-full max-w-2xl flex-col items-center space-y-4 text-lg">
						<AuthButton
							type="sign-in"
							label="Sign in"
							height="h-12"
							width="w-full"
						/>
						<AuthButton
							type="sign-up"
							label="Sign up"
							height="h-12"
							width="w-full"
						/>
					</div>
				) : (
					<div className="flex w-full max-w-2xl flex-col items-center space-y-4 text-lg">
						<Link
							className="flex w-full items-center outline-none"
							href="https://waitlist.locker.money"
							target="_blank"
							rel="noopener noreferrer"
						>
							<button className="h-12 w-full items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100">
								Join waitlist
							</button>
						</Link>
						<form
							className="flex w-full flex-col space-y-4"
							onSubmit={handleInviteCodeSubmission}
						>
							<input
								type="text"
								value={inviteCode}
								onChange={(e) => setInviteCode(e.target.value)}
								className="h-12 w-full rounded-full border border-light-400 bg-light-100 text-center outline-none focus:border-dark-100 dark:border-dark-200 dark:bg-dark-500 dark:focus:border-light-600"
								placeholder="Enter invite code"
							/>
							<button
								type="submit"
								className="h-12 w-full rounded-full bg-light-200 px-4 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
							>
								Access
							</button>
						</form>
						{errorMessage && (
							<span className="text-sm text-error">
								{errorMessage}
							</span>
						)}
					</div>
				)}
				<div className="flex w-full max-w-2xl flex-1 items-center justify-center py-10">
					<LottieAnimation animationData={lockerPaths} />
				</div>
			</div>
		</div>
	);
}
