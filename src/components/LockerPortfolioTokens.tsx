import { formatUnits } from "viem";

import { Token } from "@/types";
import { getChainNameFromId } from "@/utils/getChainName";

type ILockerPortfolioTokens = {
	tokens: Token[];
};

function LockerPortfolioTokens({ tokens }: ILockerPortfolioTokens) {
	return (
		<>
			{tokens.map((token) => {
				const rawAmount = formatUnits(
					BigInt(token.balance),
					token.decimals
				);

				const key = `${token.chainId}-${token.address}`;
				return (
					<div key={key}>
						<div className="flex flex-row justify-between">
							<div className="flex flex-col">
								<div className="text-sm font-semibold">
									{token.symbol}
								</div>
								<div className="text-xxs text-gray-500">
									{getChainNameFromId(token.chainId)}
								</div>
							</div>
							<div className="text-xs font-semibold">
								{rawAmount}
							</div>
						</div>
						<hr />
					</div>
				);
			})}
		</>
	);
}

export default LockerPortfolioTokens;
