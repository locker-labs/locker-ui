import { formatUnits } from "viem";
import { useChainId } from "wagmi";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useLocker } from "@/providers/LockerProvider";
import { Token } from "@/types";
import { getChainNameFromId } from "@/utils/getChainName";

import AutomateChainsModal from "./AutomateChainsModal";
import { IconReceive, IconSend } from "./Icons";

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
					<p className="xxs:text-2xs text-gray-500 sm:text-sm lg:text-base">
						Portfolio value
					</p>
					<p className="sm:text sm1:text-lg font-bold xs:text-sm lg:text-2xl">
						${portfolioValue}
					</p>
				</div>
				<button onClick={openQrCodeModal}>
					<div className="flex flex-row space-x-4">
						<div className="xxs:text-2xs sm1:h-20 sm1:w-20 sm1:text-base flex flex-col items-center justify-center rounded-sm bg-gray-100 xs:h-10 xs:w-10 xs:p-2 sm:h-12 sm:w-12">
							<IconSend />
							<p className="text-sm text-gray-500">Send</p>
						</div>
						<div className="flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gray-100">
							<IconReceive />
							<p className="text-sm text-gray-500">Receive</p>
							{renderQrCodeModal(lockerAddress, chainId)}
						</div>
					</div>
				</button>
			</div>
			<AutomateChainsModal />
			<div className="h-48 space-y-2 overflow-auto pr-2">
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
