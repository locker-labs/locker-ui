"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

function SignInPage() {
	const { resolvedTheme } = useTheme();

	// NOTE: Clerk automatically handles redirect to home page if user is already signed in

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<SignIn
				appearance={{
					baseTheme: resolvedTheme === "dark" ? dark : undefined,
				}}
			/>
		</div>
	);
}

export default SignInPage;
