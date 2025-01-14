import { useAuth } from "@clerk/nextjs";
import { useAppKit } from "@reown/appkit/react";
import Link from "next/link";
import { useState } from "react";
import { checksumAddress } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

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
import { useToast } from "@/hooks/use-toast";
import useSmartAccount from "@/hooks/useSmartAccount";
import { useLocker } from "@/providers/LockerProvider";
import { createPolicy, updatePolicy } from "@/services/lockers";
import { Policy } from "@/types";
import getAutomations4Refresh from "@/utils/policies/getAutomations4Refresh";

import ChainIcon from "./ChainIcon";

export default function AutomateChainsModal() {
	const { address } = useAccount();
	const walletChainId = useChainId();
	const { policies, locker, automations } = useLocker();
	const { refreshPolicy } = useSmartAccount();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { isConnected } = useAccount();
	const { getToken } = useAuth();
	const { open: openConnectModal } = useAppKit();

	const { switchChain } = useSwitchChain();
	const { toast } = useToast();

	const handleOpenChange = (open: boolean) => {
		if (isConnected) {
			setIsOpen(open);
		} else {
			openConnectModal?.();
		}
	};

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

		toast({
			title: "Chain enabled",
			description:
				"Your locker will now follow perform your automation on this chain every time you get paid.",
		});
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
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger className="w-full">
				<div className="flex w-full flex-row justify-between rounded-md p-2 shadow-md outline outline-1 outline-gray-300">
					<div className="flex flex-row space-x-1">
						{policies.map((policy) => (
							<div
								className="rounded-full"
								key={`policy-div-${policy.chainId}`}
							>
								<ChainIcon
									chainId={policy.chainId}
									key={`icon-${policy.chainId}`}
								/>
							</div>
						))}
					</div>

					<div className="text-xxs text-gray-700 underline underline-offset-8">
						Manage chains
					</div>
				</div>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">
						Manage Chains
					</DialogTitle>
					<DialogDescription className="text-center text-sm">
						Locker only has permission to move funds on the chains
						you explicitly enable below.{" "}
						<Link
							href="https://docs.locker.money/privacy-and-security"
							target="_blank"
							className="text-locker-300"
						>
							Learn more
						</Link>
						.
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[calc(100vh-200px)] overflow-y-auto p-1">
					<div className="flex flex-col space-y-3 pb-2 pr-2 pt-2">
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

							// open connect modal if not connceted
							// otherwise create/refresh policy
							let onEnable = openConnectModal;
							if (isConnected) {
								onEnable = () =>
									isAutomateThenReady
										? createNewPolicy(chain.id, true)
										: createNewPolicy(chain.id);
							}
							const enableButton = (
								<div
									key={`enable-${chain.id}`}
									className="ml-1 flex items-center justify-between rounded-lg px-4 py-2 text-gray-700 outline outline-1 outline-gray-300"
								>
									<div className="flex items-center space-x-4">
										<ChainIcon
											chainId={chain.id}
											className="rounded-full"
											size="2.4rem"
										/>
										<p className="text-sm font-semibold">
											{chain.name}
										</p>
									</div>
									{!isEnabled ? (
										<button
											className="flex items-center justify-center rounded-sm bg-locker-600 px-4 py-2 text-xxs text-white outline outline-2 hover:bg-locker-400"
											onClick={() => onEnable()}
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

							return enableButton;
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
