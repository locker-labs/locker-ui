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
		<main className="p-4 lg:px-6 xl:px-8">
			<Header />
			<Suspense fallback={<Loading />}>{children}</Suspense>
			<Footer />
		</main>
	);
}
