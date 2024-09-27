import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { checksumAddress } from "viem";
import { useAccount, useChainId, useConnect, useSwitchChain } from "wagmi";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { errors } from "@/data/constants/errorMessages";
import { supportedChains } from "@/data/constants/supportedChains";
import useSmartAccount from "@/hooks/useSmartAccount";
import { useLocker } from "@/providers/LockerProvider";
import { createPolicy } from "@/services/lockers";
import { EAutomationType, Policy } from "@/types";
import { filterConnectors } from "@/utils/filterConnectors";
import { getChainIconStyling } from "@/utils/getChainIconStyling";

import ChainIcon from "./ChainIcon";

export default function AutomateChainsModal() {
	const { address } = useAccount();
	const walletChainId = useChainId();
	const { policies, locker, automations } = useLocker();
	const { signSessionKey } = useSmartAccount();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state
	const { isConnected } = useAccount();
	const { getToken } = useAuth();
	const { connect, connectors } = useConnect();

	const filteredConnectors = filterConnectors(connectors);
	const { switchChain } = useSwitchChain();

	const offrampAddresses: `0x${string}`[] = [];

	const createNewPolicy = async (policyChainId: number) => {
		setIsLoading(true);
		setErrorMessage(""); // Reset error before the operation

		if (!locker) {
			setErrorMessage(errors.NO_LOCKER);
			setIsLoading(false);
			return;
		}

		if (!automations) {
			setErrorMessage(errors.NO_AUTOMATIONS);
			setIsLoading(false);
			return;
		}

		if (checksumAddress(locker.ownerAddress) !== address) {
			setErrorMessage(
				`${errors.UNAUTHORIZED} Expected wallet: ${locker.ownerAddress}`
			);
			setIsLoading(false);
			return;
		}

		if (walletChainId !== policyChainId) {
			await switchChain({ chainId: policyChainId });
			setIsLoading(false);
			return; // Exit early as the useEffect will handle calling createNewPolicy again
		}

		const hotWalletAutomation = automations.find(
			(a) => a.type === EAutomationType.FORWARD_TO
		);
		const hotWalletAddress =
			hotWalletAutomation && hotWalletAutomation.recipientAddress
				? hotWalletAutomation.recipientAddress
				: locker.ownerAddress;

		const sig = await signSessionKey(
			policyChainId,
			0, // lockerIndex
			hotWalletAddress,
			offrampAddresses // offrampAddress
		);
		if (!sig) {
			setIsLoading(false);
			return;
		}

		const policy: Policy = {
			lockerId: locker.id as number,
			chainId: policyChainId as number,
			sessionKey: sig as string,
			automations,
		};

		const authToken = await getToken();
		if (authToken) {
			await createPolicy(authToken, policy, setErrorMessage);
		}

		setIsLoading(false);
	};

	return (
		<Dialog>
			<DialogTrigger>
				<button className="w-full">
					<div className="flex flex-row justify-between rounded-md p-2 outline outline-gray-300">
						<div className="flex flex-row space-x-1">
							{policies.map((policy) => (
								<div
									className={`rounded-full ${getChainIconStyling(policy.chainId)}`}
								>
									<ChainIcon
										chainId={policy.chainId}
										key={`icon-${policy.chainId}`}
									/>
								</div>
							))}
						</div>

						<div className="text-sm text-gray-700 underline underline-offset-8">
							Manage chains
						</div>
					</div>
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manage Chains</DialogTitle>
					<DialogDescription className="text-sm">
						Locker only has permission to move funds on the chains
						you explicitly enable below.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-96 overflow-y-auto">
					<div className="flex flex-col space-y-4 pr-2 pt-2">
						{supportedChains
							.sort((a, b) => {
								const aEnabled = policies.some(
									(policy) => policy.chainId === a.id
								);
								const bEnabled = policies.some(
									(policy) => policy.chainId === b.id
								);
								return aEnabled === bEnabled
									? 0
									: aEnabled
										? -1
										: 1;
							})
							.map((chain) => {
								const isEnabled = policies.some(
									(policy) => policy.chainId === chain.id
								);
								const iconStyling = isEnabled
									? getChainIconStyling(chain.id)
									: "bg-gray-200";

								const enableButton = (
									<div
										key={`enable-${chain.id}`}
										className={`flex items-center justify-between rounded-lg p-4 ${iconStyling}`}
									>
										<div className="flex items-center space-x-4">
											<ChainIcon chainId={chain.id} />
											<p className=" text-gray-700">
												{chain.name}
											</p>
										</div>
										{!isEnabled ? (
											<button
												className="flex items-center justify-center rounded-md px-4 py-1 text-xs text-locker-500 outline outline-2 outline-locker-300 hover:bg-locker-300"
												onClick={() =>
													createNewPolicy(chain.id)
												}
												disabled={isLoading}
											>
												Enable
											</button>
										) : (
											<span className="px-4 text-xs text-locker-500">
												Enabled
											</span>
										)}
									</div>
								);

								if (isConnected || isEnabled) {
									return enableButton;
								}
								return (
									<Dialog>
										<DialogTrigger>
											{enableButton}
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Connect your wallet
												</DialogTitle>
												<DialogDescription className="text-gray-600">
													You must connect with the
													owner of this locker:{" "}
													{locker?.ownerAddress}
												</DialogDescription>
											</DialogHeader>
											<div className="flex w-full flex-col items-center justify-center space-y-2">
												{filteredConnectors.map(
													(connector) => (
														<button
															className="flex h-fit w-full min-w-44 items-center justify-center rounded-md bg-gray-50 p-2 outline outline outline-1 outline-gray-300 hover:bg-light-300"
															key={connector.uid}
															onClick={() => {
																connect({
																	connector,
																});
															}}
														>
															<div className="flex w-36 items-center">
																<Image
																	className="mr-4"
																	src={
																		connector.icon
																	}
																	alt={`${connector.name} Icon`}
																	height={45}
																	width={45}
																/>
																<span className="whitespace-nowrap">
																	{
																		connector.label
																	}
																</span>
															</div>
														</button>
													)
												)}
											</div>
										</DialogContent>
									</Dialog>
								);
							})}
					</div>
				</div>

				{/* Render error message at the bottom if it exists */}
				{errorMessage && (
					<div className="mt-4 text-center text-sm text-red-600">
						{errorMessage}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
