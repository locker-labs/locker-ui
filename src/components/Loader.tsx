/* eslint-disable react/require-default-props */

"use client";

import dynamic from "next/dynamic";

import pageLoaderLight from "@/data/lottie/pageLoaderLight.json";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
	ssr: false,
});

export interface ILoader {
	text?: string;
}

function Loader({ text }: ILoader) {
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center">
			<div className="flex w-full flex-col items-center">
				{text && <span className="text-xl">{text}</span>}

				<div className="max-w-56">
					<LottieAnimation animationData={pageLoaderLight} />
				</div>
			</div>
		</div>
	);
}

export default Loader;
