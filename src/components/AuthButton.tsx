"use client";

import { useClerk } from "@clerk/nextjs";

export interface IAuthButton {
	type: "sign-in" | "sign-up";
	label: string;
}

function AuthButton({ type, label }: IAuthButton) {
	const { openSignUp, openSignIn } = useClerk();

	const handleOnClick = () => {
		if (type === "sign-in") {
			openSignIn({ appearance: undefined });
		} else {
			openSignUp({ appearance: undefined });
		}
	};

	return (
		<button
			className={`${type === "sign-in" ? "w-full items-center justify-center rounded-md bg-locker-25 px-[1rem] py-[.6rem] text-xs font-semibold text-locker-700 hover:bg-locker-100" : "w-full items-center justify-center rounded-md bg-locker-600 px-[20px] py-[12px] text-xs font-semibold text-white hover:bg-locker-800"} `}
			onClick={handleOnClick}
		>
			{label}
		</button>
	);
}

export default AuthButton;
