import { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

export default async function Main({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className="p-4 lg:px-6 xl:px-8 ">
			<Header />
			{children}
			<Footer />
		</main>
	);
}
