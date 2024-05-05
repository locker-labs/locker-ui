"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import pageLoaderDark from "@/data/lottie/pageLoaderDark.json";
import pageLoaderLight from "@/data/lottie/pageLoaderLight.json";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

function PageLoader() {
	const { resolvedTheme } = useTheme();

	return (
		<div className="flex w-full max-w-xs flex-1">
			{resolvedTheme === "dark" ? (
				<LottieAnimation animationData={pageLoaderDark} />
			) : (
				<LottieAnimation animationData={pageLoaderLight} />
			)}
		</div>
	);
}

export default PageLoader;
