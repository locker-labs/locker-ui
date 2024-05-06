"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

import AuthButton from "@/components/AuthButton";
import ChainDropdown from "@/components/ChainDropdown";
import ConnectButton from "@/components/ConnectButton";
import HeaderMenu from "@/components/HeaderMenu";
import ThemedImage from "@/components/ThemedImage";
import { PATHS } from "@/data/constants/paths";

function Header() {
	const pathname = usePathname();
	const { isSignedIn } = useAuth();
	const { isConnected } = useAccount();

	const isAuthRoute =
		pathname === PATHS.SIGN_IN || pathname === PATHS.SIGN_UP;

	const showAuthButtons = !isSignedIn && !isAuthRoute;
	const showConnectButton = isSignedIn && !isConnected;
	const showMenu = isSignedIn && isConnected;

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
			{showMenu ? (
				<div
					className={`${pathname === PATHS.ACCOUNT && "hidden"} ml-2 flex items-center justify-center space-x-1`}
				>
					<ChainDropdown />
					<HeaderMenu />
				</div>
			) : showConnectButton ? (
				<ConnectButton
					label="Connect wallet"
					height="h-10"
					width="w-36"
					color="subtle"
				/>
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
