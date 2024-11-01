import Image from "next/image";
import { formatUnits } from "viem";

import { useLocker } from "@/providers/LockerProvider";
import { Token } from "@/types";

import ChainIcon from "./ChainIcon";
import Loader from "./Loader";

type ILockerPortfolioTokens = {
	tokens: Token[] | undefined;
};

function LockerPortfolioTokens({ tokens }: ILockerPortfolioTokens) {
	const { txs } = useLocker();

	// Show loader if there are transactions but no tokens
	if (!tokens) {
		if (txs.length > 0) return <Loader />;
		// if there are not transactions, don't display anything
		return null;
	}

	return (
		<>
			{tokens.map((token) => {
				const rawAmount = formatUnits(
					BigInt(token.balance),
					token.decimals
				);

				let valueUsd = "0.00";
				if (token && token.valueUsd) {
					valueUsd = token.valueUsd.toFixed(2);
				}

				let valueUsdChange = "0.00";
				let valueChangeColor = "black";

				if (token && token.valueUsdChange) {
					valueUsdChange = Math.abs(token.valueUsdChange).toFixed(2);
					if (token.valueUsdChange > 0) {
						valueChangeColor = "green";
					}
					if (token.valueUsdChange < 0) {
						valueChangeColor = "red-500";
					}
				}

				const key = `${token.chainId}-${token.address}`;
				return (
					<div key={key}>
						<div className="flex flex-row justify-between">
							<div className="flex flex-row space-x-3">
								<div className="flex">
									{token.imgUrl && (
										<div
											style={{
												position: "relative",
												width: "2rem",
												height: "2rem",
											}}
										>
											<Image
												alt={token.symbol}
												src={token.imgUrl}
												sizes="2rem"
												fill
												style={{
													objectFit: "contain",
												}}
											/>
											<div
												className="absolute bottom-0 right-0 h-4 w-4" // Position ChainIcon in lower right
											>
												<ChainIcon
													chainId={token.chainId}
													size="1rem"
												/>
											</div>
										</div>
									)}
								</div>
								<div className="flex flex-col">
									<div className="text-sm font-semibold">
										{token.symbol}
									</div>
									<div className="text-xxs text-gray-500">
										{rawAmount}
									</div>
								</div>
							</div>
							<div className="flex flex-col items-end">
								<div className="text-xs font-semibold">
									${valueUsd}
								</div>
								<div
									className={`text-xxxs text-${valueChangeColor}`}
								>
									${valueUsdChange}
								</div>
							</div>
						</div>
						<hr className="mt-1" />
					</div>
				);
			})}
		</>
	);
}

export default LockerPortfolioTokens;
