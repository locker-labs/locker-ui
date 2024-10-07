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
import { createPolicy, updatePolicy } from "@/services/lockers";
import { EAutomationStatus, Policy } from "@/types";
import { filterConnectors } from "@/utils/filterConnectors";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import getAutomations4Refresh from "@/utils/policies/getAutomations4Refresh";

import ChainIcon from "./ChainIcon";

export default function AutomateChainsModal() {
	const { address } = useAccount();
	const walletChainId = useChainId();
	const { policies, locker, automations } = useLocker();
	const { refreshPolicy } = useSmartAccount();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { isConnected } = useAccount();
	const { getToken } = useAuth();
	const { connect, connectors } = useConnect();

	const filteredConnectors = filterConnectors(connectors);
	const { switchChain } = useSwitchChain();

	const createNewPolicy = async (
		policyChainId: number,
		isUpdate: boolean = false
	) => {
		setIsLoading(true);
		setErrorMessage("");

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
			return;
		}

		const sig = await refreshPolicy({
			automations,
			chainId: policyChainId,
		});
		if (!sig) {
			setIsLoading(false);
			setErrorMessage(
				"Something went wrong with session key creation. Please try again."
			);
			return;
		}

		if (isUpdate) {
			const currentPolicy = policies.find(
				(pol) => pol.chainId === policyChainId
			) as Policy;

			// Update status AUTOMATE_THEN_READY -> READY
			const automationsAfterReady = getAutomations4Refresh(
				currentPolicy.automations
			);

			const policy: Policy = {
				id: currentPolicy.id,
				lockerId: locker.id as number,
				chainId: policyChainId as number,
				sessionKey: sig as string,
				automations: automationsAfterReady,
			};

			const authToken = await getToken();
			if (authToken) {
				await updatePolicy(authToken, policy, setErrorMessage);
			}
		} else {
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
		}

		setIsLoading(false);
	};

	// Updated sorting logic to handle policies with "automate_then_ready" status
	const sortedChains = supportedChains.sort((a, b) => {
		const aPolicy = policies.find((policy) => policy.chainId === a.id);
		const bPolicy = policies.find((policy) => policy.chainId === b.id);

		const aEnabled =
			!!aPolicy &&
			aPolicy.automations.every(
				(auto) => auto.status !== "automate_then_ready"
			);
		const aAutomateThenReady =
			!!aPolicy &&
			aPolicy.automations.some(
				(auto) => auto.status === "automate_then_ready"
			);

		const bEnabled =
			!!bPolicy &&
			bPolicy.automations.every(
				(auto) => auto.status !== "automate_then_ready"
			);
		const bAutomateThenReady =
			!!bPolicy &&
			bPolicy.automations.some(
				(auto) => auto.status === "automate_then_ready"
			);

		// Sort order: enabled > automate_then_ready > disabled
		if (aEnabled && !bEnabled) return -1;
		if (!aEnabled && bEnabled) return 1;
		if (aAutomateThenReady && !bAutomateThenReady) return -1;
		if (!aAutomateThenReady && bAutomateThenReady) return 1;
		return 0;
	});

	return (
		<Dialog>
			<DialogTrigger>
				<button className="w-full">
					<div className="flex w-full flex-row justify-between rounded-md p-2 shadow-md outline outline-1 outline-gray-300">
						<div className="flex flex-row space-x-1">
							{policies.map((policy) => {
								// Grey out the chain if any automation has "automate_then_ready" status
								const isGreyedOut = policy.automations.some(
									(auto) =>
										auto.status ===
										EAutomationStatus.AUTOMATE_THEN_READY
								);
								const styling = isGreyedOut
									? "bg-gray-200"
									: getChainIconStyling(policy.chainId);

								return (
									<div
										className={`rounded-full ${styling}`}
										key={`policy-div-${policy.chainId}`}
									>
										<ChainIcon
											chainId={policy.chainId}
											key={`icon-${policy.chainId}`}
										/>
									</div>
								);
							})}
						</div>

						<div className="text-xxs text-gray-700 underline underline-offset-8">
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
						{sortedChains.map((chain) => {
							const policy = policies.find(
								(p) => p.chainId === chain.id
							);
							const isEnabled =
								!!policy &&
								policy.automations.every(
									(auto) =>
										auto.status !== "automate_then_ready"
								);
							const isAutomateThenReady =
								!!policy &&
								policy.automations.some(
									(auto) =>
										auto.status === "automate_then_ready"
								);

							const iconStyling = isEnabled
								? getChainIconStyling(chain.id)
								: "bg-gray-200";

							const enableButton = (
								<div
									key={`enable-${chain.id}`}
									className="ml-1 flex items-center justify-between rounded-lg p-4 text-gray-700 outline outline-1 outline-gray-300"
								>
									<div className="flex items-center space-x-4">
										<ChainIcon
											chainId={chain.id}
											className={`rounded-full ${iconStyling}`}
											size="2.4rem"
										/>
										<p className="text-sm font-semibold">
											{chain.name}
										</p>
									</div>
									{!isEnabled ? (
										<button
											className="flex items-center justify-center rounded-md px-4 py-1 text-xxs outline outline-2 outline-gray-300 hover:bg-gray-100"
											onClick={() =>
												isAutomateThenReady
													? createNewPolicy(
															chain.id,
															true
														)
													: createNewPolicy(chain.id)
											}
											disabled={isLoading}
										>
											{isAutomateThenReady
												? "Re-enable"
												: "Enable"}
										</button>
									) : (
										<span className="px-4 text-xxs">
											Enabled
										</span>
									)}
								</div>
							);

							if (
								isConnected ||
								isEnabled ||
								isAutomateThenReady
							) {
								return enableButton;
							}

							return (
								<Dialog key={chain.id}>
									<DialogTrigger>
										{enableButton}
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Connect your wallet
											</DialogTitle>
											<DialogDescription className="text-gray-600">
												You must connect with the owner
												of this locker:{" "}
												{locker?.ownerAddress}
											</DialogDescription>
										</DialogHeader>
										<div className="flex w-full flex-col items-center justify-center space-y-2">
											{filteredConnectors.map(
												(connector) => (
													<button
														className="hover:bg-light-300 flex h-fit w-full min-w-44 items-center justify-center rounded-md bg-gray-50 p-2 outline outline outline-1 outline-gray-300"
														key={connector.uid}
														onClick={() =>
															connect({
																connector,
															})
														}
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

				{errorMessage && (
					<div className="mt-4 text-center text-sm text-red-600">
						{errorMessage}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
