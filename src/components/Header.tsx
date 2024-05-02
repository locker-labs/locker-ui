"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import AuthButton from "@/components/AuthButton";
import ThemedImage from "@/components/ThemedImage";
import { PATHS } from "@/data/paths";

function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const { signOut } = useClerk();
	const { isSignedIn } = useAuth();

	const isAuthRoute =
		pathname === PATHS.SIGN_IN || pathname === PATHS.SIGN_UP;
	const showAuthButtons = !isSignedIn && !isAuthRoute;

	return (
		<header className="top-0 z-10 flex h-20 w-full items-center justify-between">
			<Link
				className="relative mr-2 flex h-9 w-28 shrink-0 justify-center outline-none"
				href={PATHS.LANDING}
			>
				<ThemedImage
					darkImageSrc="/assets/logoLockerWhiteLetters.svg"
					lightImageSrc="/assets/logoLockerDarkLetters.svg"
					alt="Locker Logo"
				/>
			</Link>
			{isSignedIn ? (
				<div className="ml-2 flex items-center justify-center">
					<button
						className="h-10 w-24 rounded-full bg-light-400 outline-none hover:bg-light-500 dark:bg-dark-300 dark:hover:bg-dark-200"
						onClick={() =>
							signOut(() => router.push(PATHS.LANDING))
						}
					>
						Sign out
					</button>
				</div>
			) : showAuthButtons ? (
				<div className="ml-2 flex items-center justify-center sm:space-x-2">
					<AuthButton
						type="sign-in"
						label="Sign in"
						height="h-10"
						width="w-24"
					/>
					<div className="hidden sm:flex">
						<AuthButton
							type="sign-up"
							label="Sign up"
							height="h-10"
							width="w-24"
						/>
					</div>
				</div>
			) : null}
		</header>
	);
}

export default Header;
