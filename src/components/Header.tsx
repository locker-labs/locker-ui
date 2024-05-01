import Image from "next/image";
import Link from "next/link";

function Header() {
	return (
		<header className="top-0 z-10 flex h-20 w-full items-center justify-between">
			<Link
				className="relative mr-2 flex h-9 w-28 shrink-0 justify-center outline-none"
				href="/"
			>
				<Image src="assets/logoLocker.svg" alt="logo" fill />
			</Link>
			<span>Menu</span>
		</header>
	);
}

export default Header;
