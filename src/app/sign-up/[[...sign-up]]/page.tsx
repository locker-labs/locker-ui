"use client";

import { SignUp, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { paths } from "@/data/constants/paths";

function SignUpPage() {
	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { resolvedTheme } = useTheme();

	const inviteCodes = process.env.BETA_INVITE_CODES!.split(",");

	// Clerk automatically handles redirect to paths.HOME if user is already signed in,
	// but sometimes it fails. So will try to redirect every second if user is signed in.
	useEffect(() => {
		const interval = setInterval(() => {
			if (isSignedIn) {
				router.push(paths.HOME);
			} else {
				clearInterval(interval);
			}
		}, 1000);

		// Clean up the interval when the component unmounts
		return () => clearInterval(interval);
	}, [isSignedIn]);

	useEffect(() => {
		const storedInviteCode = localStorage.getItem("inviteCode");
		if (!(storedInviteCode && inviteCodes.includes(storedInviteCode))) {
			router.push(paths.LANDING);
		}
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<SignUp
				appearance={{
					baseTheme: resolvedTheme === "dark" ? dark : undefined,
				}}
			/>
		</div>
	);
}

export default SignUpPage;
