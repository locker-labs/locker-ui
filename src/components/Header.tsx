"use client";

import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useAccount } from "wagmi";

// import AuthButton from "@/components/AuthButton";
import ConnectButton from "@/components/ConnectButton";
import HeaderMenu from "@/components/HeaderMenu";
import { paths } from "@/data/constants/paths";
import { isTestnet } from "@/utils/isTestnet";

function Header() {
	const pathname = usePathname();
	const { isSignedIn } = useAuth();
	const { isConnected, chainId } = useAccount();

	const showConnectButton = isSignedIn && !isConnected;
	const showMenu = isSignedIn && isConnected;
	const showTestnetBanner = isConnected && chainId && isTestnet(chainId);

	const menu = showMenu ? (
		<div
			className={`${
				pathname === paths.ACCOUNT && "hidden"
			} ml-2 flex items-center justify-center space-x-1`}
		>
			<HeaderMenu />
		</div>
	) : showConnectButton ? (
		<div className="xs1:space-x-2 ml-2 flex items-center justify-center">
			<div className="xs1:flex hidden">
				<ConnectButton />
			</div>
			<HeaderMenu />
		</div>
	) : null;

	return (
		<header className="relative top-0 z-10 w-full">
			{showTestnetBanner && (
				<div className="w-full rounded-full bg-warning/20 p-2 text-center text-warning">
					Testnet
				</div>
			)}
			<div className="flex h-20 items-center justify-between">
				<Link
					className="relative mr-2 flex h-9 w-28 shrink-0 justify-center"
					href={paths.LANDING}
				>
					<Image
						src="/assets/logoLockerDarkLetters.svg"
						alt="Locker logo"
						priority
						fill
					/>
				</Link>
				<Suspense fallback={null}>{menu}</Suspense>
			</div>
		</header>
	);
}

export default Header;
