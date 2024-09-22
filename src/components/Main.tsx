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
		<main className="flex w-full min-w-[230px] flex-1 flex-col items-center px-24">
			<Header />
			<Suspense fallback={<Loading />}>{children}</Suspense>
			<Footer />
		</main>
	);
}
