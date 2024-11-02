import React, { ReactNode } from "react";

import Footer from "./Footer";
import HeaderMinimal from "./HeaderMinimal";

export default function MainLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className="p-4 text-left sm:max-w-[1100px] lg:p-10 xl:py-[2rem]">
			<HeaderMinimal />
			<div className="w-full max-w-[55rem]  text-left">{children}</div>
			<Footer />
		</main>
	);
}
