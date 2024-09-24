import { formatUnits } from "viem";
import { useChainId } from "wagmi";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useLocker } from "@/providers/LockerProvider";
import { PolicyDb, Token } from "@/types";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromId } from "@/utils/getChainName";

import ChainIcon from "./ChainIcon";
import { IconReceive, IconSend } from "./Icons";

type ILockerPortfolioValue = {
	portfolioValue: string;
	policies: PolicyDb[];
	tokens: Token[];
};

function LockerPortfolioValue({
	portfolioValue,
	policies,
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
			<button onClick={() => {}}>
				<div className="flex flex-row justify-between rounded-md p-2 outline outline-gray-300">
					{policies.map((policy) => (
						<div
							className={`rounded-full ${getChainIconStyling(policy.chainId)}`}
						>
							<ChainIcon
								chainId={policy.chainId}
								key={policy.chainId}
							/>
						</div>
					))}
					<div className="text-sm text-gray-700 underline underline-offset-8">
						Manage chains
					</div>
				</div>
			</button>

			<div className="h-48 space-y-2 overflow-auto">
				{tokens.map((token) => {
					const rawAmount = formatUnits(
						BigInt(token.balance),
						token.decimals
					);
					return (
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
					);
				})}
			</div>
		</div>
	);
}

export default LockerPortfolioValue;
