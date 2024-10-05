import { QrCode } from "lucide-react";
import { formatUnits } from "viem";
import { useChainId } from "wagmi";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useLocker } from "@/providers/LockerProvider";
import { Token } from "@/types";
import { getChainNameFromId } from "@/utils/getChainName";

import AutomateChainsModal from "./AutomateChainsModal";
import { SendTokensModal } from "./SendTokensModal";

type ILockerPortfolioValue = {
	portfolioValue: string;
	tokens: Token[];
};

function LockerPortfolioValue({
	portfolioValue,
	tokens,
}: ILockerPortfolioValue) {
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();
	const { lockers } = useLocker();
	const chainId = useChainId();

	const { address: lockerAddress } = lockers[0];

	return (
		<div className="flex flex-col space-y-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<p className="xxs:text-2xs text-gray-500 lg:text-sm xl:text-base">
						Portfolio value
					</p>
					<p className="font-bold xxs:text-base lg:text-lg xxl:text-xl xxl:text-xxl">
						${portfolioValue}
					</p>
				</div>
				<div className="flex flex-row space-x-4">
					<SendTokensModal tokens={tokens} />

					<button onClick={openQrCodeModal}>
						<div className="flex flex-col items-center justify-center rounded-sm bg-gray-100 xxs:h-20 xxs:w-20 xxs:space-y-2 xxs:p-2 sm:space-y-1 sm:p-4">
							<div className="sm:hidden">
								<QrCode className="text-locker-600" size={24} />
							</div>
							<div className=" xxs:hidden sm:block">
								<QrCode className="text-locker-600" size={30} />
							</div>
							<p className="text-gray-500 xxs:text-sm lg:text-base xl:text-lg">
								Receive
							</p>
							{renderQrCodeModal(lockerAddress, chainId)}
						</div>
					</button>
				</div>
			</div>
			<div className="w-full flex-col xxs:hidden sm:flex">
				<AutomateChainsModal />
			</div>
			<div className="space-y-2 overflow-auto pr-2 xxs:hidden sm:block sm:h-48">
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
									<div className="text font-semibold">
										{token.symbol}
									</div>
									<div className="text-sm text-gray-500">
										{getChainNameFromId(token.chainId)}
									</div>
								</div>
								<div className="text-sm font-semibold">
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
