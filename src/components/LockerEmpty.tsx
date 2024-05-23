"use client";

import { useState } from "react";
import { IoCheckboxOutline, IoCopyOutline } from "react-icons/io5";

import ChainIcon from "@/components/ChainIcon";
import LockerQrCode from "@/components/LockerQrCode";
import { supportedChains } from "@/data/constants/supportedChains";
import type { Locker } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { truncateAddress } from "@/utils/truncateAddress";

export interface ILockerEmpty {
	emptyLocker: Locker;
}

function LockerEmpty({ emptyLocker }: ILockerEmpty) {
	const [copied, setCopied] = useState<boolean>(false);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<div className="flex w-full max-w-3xl flex-1 flex-col items-start space-y-8">
				<h1 className="text-4xl dark:text-light-100">
					<span className="bg-gradient-to-r from-secondary-200 to-primary-200 bg-clip-text text-transparent">
						Get paid
					</span>{" "}
					at your locker
				</h1>
				<span>
					Tell your employer, clients, or anybody to pay you at your
					locker address.
				</span>
				<span>
					Any token can be transferred to your locker from another
					account on any of the supported chains.
				</span>
				<div className="flex flex-col items-center justify-center self-center">
					<LockerQrCode lockerAddress={emptyLocker.address} />
					<button
						className="my-8 flex items-center justify-center text-sm hover:text-secondary-100 dark:hover:text-primary-100"
						onClick={() =>
							copyToClipboard(emptyLocker.address, setCopied)
						}
					>
						<code>{truncateAddress(emptyLocker.address)}</code>
						{copied ? (
							<IoCheckboxOutline
								className="ml-3 shrink-0 text-success"
								size="20px"
							/>
						) : (
							<IoCopyOutline
								className="ml-3 shrink-0"
								size="20px"
							/>
						)}
					</button>
					<div className="flex flex-col items-center justify-center space-y-4 text-xs">
						{supportedChains.map((chainOption) => (
							<div
								key={chainOption.id}
								className="flex w-full items-center"
							>
								<div
									className={`flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(chainOption.id)}`}
								>
									<ChainIcon
										className="flex items-center justify-center"
										chainId={chainOption.id}
										size="16px"
									/>
								</div>
								<span className="ml-3 whitespace-nowrap">
									{chainOption.name === "OP Mainnet"
										? "Optimism"
										: chainOption.name === "Arbitrum One"
											? "Arbitrum"
											: chainOption.name ===
												  "Polygon Amoy"
												? "Amoy"
												: chainOption.name ===
													  "Avalanche Fuji"
													? "Fuji"
													: chainOption.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LockerEmpty;
