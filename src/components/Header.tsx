"use client";

import Link from "next/link";

import AuthButton from "@/components/AuthButton";
import ThemedImage from "@/components/ThemedImage";

function Header() {
	return (
		<header className="top-0 z-10 flex h-20 w-full items-center justify-between">
			<Link
				className="relative mr-2 flex h-9 w-28 shrink-0 justify-center outline-none"
				href="/"
			>
				<ThemedImage
					darkImageSrc="/assets/logoLockerWhiteLetters.svg"
					lightImageSrc="/assets/logoLockerDarkLetters.svg"
					alt="Locker Logo"
				/>
			</Link>
			<div className="ml-2 flex items-center justify-center sm:space-x-2">
				<div className="hidden sm:flex">
					<AuthButton type="sign-in" />
				</div>
				<AuthButton type="sign-up" />
			</div>
		</header>
	);
}

export default Header;
