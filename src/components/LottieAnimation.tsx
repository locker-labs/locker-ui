"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export interface ILottieAnimation {
	animationUrl: string;
	loop: boolean;
	autoplay: boolean;
}

// TODO: Getting an "Internal Server Error" with code 500. Need to fix this.

function LottieAnimation({
	animationUrl,
	loop = true,
	autoplay = true,
}: ILottieAnimation) {
	const [animationData, setAnimationData] = useState<string>("");

	useEffect(() => {
		fetch(animationUrl)
			.then((response) => response.json())
			.then((data) => setAnimationData(data))
			.catch((error) =>
				// eslint-disable-next-line no-console
				console.error("Error loading animation data:", error)
			);
	}, [animationUrl]);

	return (
		animationData && (
			<Lottie
				animationData={animationData}
				loop={loop}
				autoplay={autoplay}
			/>
		)
	);
}

export default LottieAnimation;
