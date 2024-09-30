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
			className={`${type === "sign-in" ? "bg-locker-25 text-locker-700 hover:bg-locker-100" : "bg-locker-600 text-light-100 hover:bg-locker-800"} ${height} ${width} items-center justify-center rounded-md font-semibold`}
			onClick={handleOnClick}
		>
			{label}
		</button>
	);
}

export default AuthButton;
