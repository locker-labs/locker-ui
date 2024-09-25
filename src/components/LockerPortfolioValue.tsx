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
					<p className="text-gray-500">Portfolio value</p>
					<p className="text-2xl font-bold">${portfolioValue}</p>
				</div>
				<button onClick={openQrCodeModal}>
					<div className="flex flex-row space-x-4">
						<div className="flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gray-100">
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
						<>
							<div
								className="flex flex-row justify-between"
								key={key}
							>
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
						</>
					);
				})}
			</div>
		</div>
	);
}

export default LockerPortfolioValue;
