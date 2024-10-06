import { QrCode } from "lucide-react";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";

import { useLocker } from "@/providers/LockerProvider";
import { Token } from "@/types";
import { getChainNameFromId } from "@/utils/getChainName";

import AutomateChainsModal from "./AutomateChainsModal";
import QrCodeModal from "./QrCodeModal";
import { SendTokensModal } from "./SendTokensModal";

type ILockerPortfolioValue = {
	portfolioValue: string;
	tokens: Token[];
};

function LockerPortfolioValue({
	portfolioValue,
	tokens,
}: ILockerPortfolioValue) {
	const { locker } = useLocker();
	const chainId = useChainId();

	const lockerAddress = locker?.address;

	return (
		<div className="flex flex-col space-y-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<p className="text-sm text-gray-500">Portfolio Value</p>
					<p className="text-xxl font-bold">${portfolioValue}</p>
				</div>
				<div className="flex flex-row space-x-4">
					<SendTokensModal tokens={tokens} />

					<QrCodeModal
						button={
							<button>
								<div className="flex h-[3.6rem] w-[3.6rem] flex-col items-center justify-center space-y-2 rounded-sm bg-gray-100 p-2 sm:space-y-1 sm:p-4">
									<div className="sm:hidden">
										<QrCode
											className="text-locker-600"
											size={24}
										/>
									</div>
									<div className=" hidden sm:block">
										<QrCode
											className="text-locker-600"
											size={24}
										/>
									</div>
									<p className="text-xxxs text-gray-500 ">
										Receive
									</p>
								</div>
							</button>
						}
						lockerAddress={lockerAddress || "0x"}
						chainId={chainId}
					/>
				</div>
			</div>
			<div className="hidden w-full flex-col sm:flex">
				<AutomateChainsModal />
			</div>
			<div className="hidden space-y-2 overflow-auto pr-2 sm:block sm:max-h-52">
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
			</div>
		</div>
	);
}

export default LockerPortfolioValue;
