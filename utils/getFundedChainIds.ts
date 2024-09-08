import { Token } from "../types";

export function getFundedChainIds(tokenList: Token[]): number[] {
	return tokenList.reduce((acc, token) => {
		if (token.balance !== "0" && !acc.includes(token.chainId)) {
			acc.push(token.chainId);
		}
		return acc;
	}, [] as number[]);
}
