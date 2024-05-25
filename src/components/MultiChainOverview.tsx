import { FaRobot } from "react-icons/fa6";

import ChainIcon from "@/components/ChainIcon";
import { supportedChainIdsArray } from "@/data/constants/supportedChains";
import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { Policy } from "@/types";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromId } from "@/utils/getChainName";
import { isTestnet } from "@/utils/isTestnet";

export interface IMultiChainOverview {
	fundedChainIds: number[];
	policies: Policy[];
	chainsNetWorths: Record<number, string>;
	lockerAddress: `0x${string}`;
}

function MultiChainOverview({
	fundedChainIds,
	policies,
	chainsNetWorths,
	lockerAddress,
}: IMultiChainOverview) {
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();

	return (
		<div className="flex w-full min-w-52 max-w-lg flex-col divide-y divide-light-200 overflow-hidden rounded-md border border-light-200 text-sm shadow-sm shadow-light-600 dark:divide-dark-200 dark:border-dark-200 dark:shadow-none">
			{supportedChainIdsArray.map((chainId) => {
				const isFunded = fundedChainIds.includes(chainId);
				const policy = policies.find((pol) => pol.chainId === chainId);

				return (
					<div key={chainId} className="flex w-full items-center p-3">
						<div className="flex w-full flex-col xs2:flex-row xs2:items-center xs2:justify-between">
							<div className="flex w-full min-w-fit flex-col justify-center space-y-2">
								<div className="flex w-full items-center">
									<div
										className={`flex size-7 items-center justify-center rounded-full ${isFunded ? getChainIconStyling(chainId) : "bg-dark-500/10 text-dark-500 dark:bg-light-200/10 dark:text-light-200"}`}
									>
										<ChainIcon
											className="flex items-center justify-center"
											chainId={chainId}
											size={16}
										/>
									</div>
									<span
										className={`ml-3 whitespace-nowrap ${!isFunded && "text-light-600"}`}
									>
										{getChainNameFromId(chainId)}
									</span>
								</div>
								{isFunded && !isTestnet(chainId) && (
									<span className="w-full text-xs text-light-600">
										Balance: $
										{chainsNetWorths[chainId]
											? chainsNetWorths[chainId]
											: "0.00"}
									</span>
								)}
							</div>
							<div className="mt-4 flex flex-col space-y-2 xs2:mt-0 xs2:flex-row xs2:space-x-2 xs2:space-y-0">
								{!isFunded && (
									<button
										className="w-fit justify-center rounded-full bg-secondary-100 px-3 py-1 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
										onClick={openQrCodeModal}
									>
										Fund
									</button>
								)}
								{!policy && (
									<button
										className="w-fit justify-center rounded-full bg-light-200 px-3 py-1 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										onClick={() =>
											console.log(
												`Require user's wallet to be on this ${chainId}, craft policy object for this chain using existing automations, and prompt user to sign session key.`
											)
										}
									>
										Automate
									</button>
								)}
							</div>
						</div>
						{policy && (
							<div className="ml-3 flex size-7 items-center justify-center">
								<FaRobot
									className={`${isFunded ? "text-success" : "text-light-600"} shrink-0`}
									size={16}
								/>
							</div>
						)}
					</div>
				);
			})}
			{renderQrCodeModal(lockerAddress)}
		</div>
	);
}

export default MultiChainOverview;
