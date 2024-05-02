"use client";

import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export interface IAuthButton {
	type: "sign-in" | "sign-up";
	label: string;
	height: string;
	width: string;
}

function AuthButton({ type, label, height, width }: IAuthButton) {
	const { openSignUp, openSignIn } = useClerk();
	const { resolvedTheme } = useTheme();

	const clerKTheme = {
		baseTheme: resolvedTheme === "dark" ? dark : undefined,
	};

	const handleOnClick = () => {
		if (type === "sign-in") {
			openSignIn({ appearance: clerKTheme });
		} else {
			openSignUp({ appearance: clerKTheme });
		}
	};

	return (
		<button
			className={`${type === "sign-in" ? "bg-light-400 hover:bg-light-500 dark:bg-dark-300 dark:hover:bg-dark-200" : "bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"} ${height} ${width} items-center justify-center rounded-full outline-none`}
			onClick={handleOnClick}
		>
			{label}
		</button>
	);
}

export default AuthButton;
