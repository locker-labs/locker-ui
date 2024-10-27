// utils/calculateSavings.ts
import Big from "big.js";

export const calculateSavingsProgress = (
	portfolioValue: string,
	allocation: number,
	ethUsd: number | null,
	efrogsFloor: number | null
) => {
	const ethSaved = ethUsd
		? new Big(portfolioValue).div(ethUsd).mul(allocation)
		: null;
	const usdSaved = new Big(portfolioValue).mul(allocation);

	let roundedEthSaved = "0";
	if (ethSaved) {
		if (ethSaved.gte(0.0001)) {
			roundedEthSaved = ethSaved.toFixed(4);
		} else if (ethSaved.gt(0)) {
			roundedEthSaved = "<0.0001";
		}
	}
	const amountSaved = ethUsd ? `${roundedEthSaved} ETH` : `$${usdSaved}`;

	const value =
		ethSaved && efrogsFloor ? ethSaved.div(efrogsFloor).toNumber() : 0;

	return {
		amountSaved,
		progressValue: value,
		isGoalMet: ethSaved && efrogsFloor ? ethSaved.gte(efrogsFloor) : false,
	};
};
