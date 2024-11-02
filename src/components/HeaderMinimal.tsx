"use client";

// Header checks user state and requires context not necessary for basic pages like /privacy
// This minimal header just displays the logo
import Image from "next/image";
import Link from "next/link";

import { paths } from "@/data/constants/paths";

function HeaderMinimal() {
	return (
		<header className="relative top-0 z-10 w-full max-w-[55rem]">
			<div className="flex h-20 items-center justify-between">
				<Link
					className="relative mr-2 flex h-9 w-28 shrink-0 justify-center"
					href={paths.LANDING}
				>
					<Image
						src="/assets/locker/logoBeta.svg"
						alt="Locker logo"
						priority
						fill
					/>
				</Link>
			</div>
		</header>
	);
}

export default HeaderMinimal;
