import { ReactNode, Suspense } from "react";

import Loading from "@/app/loading";

import Footer from "./Footer";
import Header from "./Header";

export default async function Main({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<main className="xxs:px-4 xxs:py-4 lg:px-6 lg:pb-12 xl:px-24">
			<Header />
			<Suspense fallback={<Loading />}>{children}</Suspense>
			<Footer />
		</main>
	);
}
