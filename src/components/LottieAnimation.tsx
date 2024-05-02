import Lottie from "lottie-react";

export interface ILottieAnimation {
	animationData: Record<string, unknown>;
}

function LottieAnimation({ animationData }: ILottieAnimation) {
	return <Lottie animationData={animationData} />;
}

export default LottieAnimation;
