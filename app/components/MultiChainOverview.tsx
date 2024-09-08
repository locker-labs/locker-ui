import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRobot } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { checksumAddress } from "viem";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

import { errors } from "../../data/constants/errorMessages";
import { supportedChainIdsArray } from "../../data/constants/supportedChains";
import { useConnectModal } from "../../hooks/useConnectModal";
import { useQrCodeModal } from "../../hooks/useQrCodeModal";
import useSmartAccount from "../../hooks/useSmartAccount";
import { createPolicy, updatePolicy } from "../../services/lockers";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	Locker,
	Policy,
} from "../../types";
import { getChainIconStyling } from "../../utils/getChainIconStyling";
import { getChainNameFromId } from "../../utils/getChainName";
import { isPolicyReady } from "../../utils/isPolicyReady";
import ChainIcon from "./ChainIcon";

export interface IMultiChainOverview {
	fundedChainIds: number[];
	policies: Policy[];
	automations: Automation[];
	chainsNetWorths: Record<number, string>;
	locker: Locker;
	setErrorMessage: (errorMessage: string) => void;
	offrampAddresses: `0x${string}`[];
}

function MultiChainOverview({
	fundedChainIds,
	policies,
	automations,
	chainsNetWorths,
	locker,
	setErrorMessage,
	offrampAddresses,
}: IMultiChainOverview) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [chainRowLoading, setChainRowLoading] = useState<number | null>(null);
	const [chainSwitched, setChainSwitched] = useState<boolean>(false);
	const [updating, setUpdating] = useState<boolean>(false);
	const [targetChainId, setTargetChainId] = useState<number | null>(null);
	const [pendingPolicyChainId, setPendingPolicyChainId] = useState<
		number | null
	>(null);
	const [pendingPolicyUpdateChainId, setPendingPolicyUpdateChainId] =
		useState<number | null>(null);

	const { getToken } = useAuth();
	const { signSessionKey } = useSmartAccount();
	const { switchChain } = useSwitchChain();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { chainId: walletChainId, address, isConnected } = useAccount();
	const { data: walletClient } = useWalletClient();
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();
	const [qrChainId, setQrChainId] = useState(0);

	const handleChainSwitch = async (
		policyChainId: number,
		update: boolean
	) => {
		if (update) {
			setUpdating(true);
		}

		setTargetChainId(policyChainId);
		switchChain({ chainId: policyChainId });
		setChainSwitched(true);
	};

	const createNewPolicy = async (policyChainId: number) => {
		setIsLoading(true);
		setChainRowLoading(policyChainId);
		setErrorMessage("");

		if (checksumAddress(locker.ownerAddress) !== address) {
			setErrorMessage(
				`${errors.UNAUTHORIZED} Expected wallet: ${locker.ownerAddress}`
			);
			setIsLoading(false);
			setChainRowLoading(null);
			return;
		}

		if (walletChainId !== policyChainId) {
			await handleChainSwitch(policyChainId, false);
			return; // Exit early as the useEffect will handle calling createNewPolicy again
		}

		if (!walletClient) {
			setPendingPolicyChainId(policyChainId);
			return;
		}

		const hotWalletAutomation = automations.find(
			(a) => a.type === "forward_to"
		);

		const hotWalletAddress =
			hotWalletAutomation && hotWalletAutomation.recipientAddress
				? hotWalletAutomation.recipientAddress
				: locker.ownerAddress;

		const sig = await signSessionKey(
			walletChainId,
			// lockerIndex will be non-zero when we support multiple lockers on the same chain
			0, // lockerIndex
			hotWalletAddress,
			offrampAddresses // offrampAddress
		);
		if (!sig) {
			setIsLoading(false);
			setChainRowLoading(null);
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
		setChainRowLoading(null);
	};

	const updateStalePolicy = async (policyChainId: number) => {
		setIsLoading(true);
		setChainRowLoading(policyChainId);
		setErrorMessage("");

		if (checksumAddress(locker.ownerAddress) !== address) {
			setErrorMessage(
				`${errors.UNAUTHORIZED} Expected wallet: ${locker.ownerAddress}`
			);
			setIsLoading(false);
			setChainRowLoading(null);
			return;
		}

		if (walletChainId !== policyChainId) {
			await handleChainSwitch(policyChainId, true);
			return; // Exit early as the useEffect will handle calling createNewPolicy again
		}

		if (!walletClient) {
			setPendingPolicyUpdateChainId(policyChainId);
			return;
		}

		const hotWalletAutomation = automations.find(
			(a) => a.type === EAutomationType.FORWARD_TO
		);

		const hotWalletAddress =
			hotWalletAutomation && hotWalletAutomation.recipientAddress
				? hotWalletAutomation.recipientAddress
				: locker.ownerAddress;

		const sig = await signSessionKey(
			walletChainId,
			0,
			hotWalletAddress,
			offrampAddresses
		); // lockerIndex
		// hotWalletAddress
		// undefined // offrampAddress
		if (!sig) {
			setIsLoading(false);
			setChainRowLoading(null);
			return;
		}

		const currentPolicy = policies.find(
			(pol) => pol.chainId === policyChainId
		) as Policy;

		const readyAutomations = currentPolicy.automations.map((automation) => {
			const updatedAutomation = { ...automation };
			if (automation.status === EAutomationStatus.AUTOMATE_THEN_READY) {
				updatedAutomation.status = EAutomationStatus.READY;
			}

			return updatedAutomation;
		});

		const policy: Policy = {
			id: currentPolicy.id,
			lockerId: locker.id as number,
			chainId: policyChainId as number,
			sessionKey: sig as string,
			automations: readyAutomations,
		};

		const authToken = await getToken();
		if (authToken) {
			await updatePolicy(authToken, policy, setErrorMessage);
		}

		setIsLoading(false);
		setChainRowLoading(null);
	};

	const handlePolicyCreation = (policyChainId: number) => {
		if (isConnected) {
			createNewPolicy(policyChainId);
		} else {
			openConnectModal();
		}
	};

	const handlePolicyUpdate = (policyChainId: number) => {
		if (isConnected) {
			updateStalePolicy(policyChainId);
		} else {
			openConnectModal();
		}
	};

	useEffect(() => {
		if (chainSwitched && walletChainId === targetChainId && !updating) {
			createNewPolicy(targetChainId!);
			setChainSwitched(false);
		}

		if (chainSwitched && walletChainId === targetChainId && updating) {
			updateStalePolicy(targetChainId!);
			setChainSwitched(false);
		}
	}, [chainSwitched, walletChainId, targetChainId, updating]);

	useEffect(() => {
		if (walletClient && pendingPolicyChainId !== null) {
			createNewPolicy(pendingPolicyChainId);
			setPendingPolicyChainId(null);
		}

		if (walletClient && pendingPolicyUpdateChainId !== null) {
			updateStalePolicy(pendingPolicyUpdateChainId);
			setPendingPolicyUpdateChainId(null);
		}
	}, [walletClient, pendingPolicyChainId, pendingPolicyUpdateChainId]);

	const showQrModal = (chainId: number) => {
		setQrChainId(chainId);
	};

	useEffect(() => {
		if (qrChainId !== 0) openQrCodeModal();
	}, [qrChainId]);

	return (
		<div className="flex w-full min-w-52 max-w-lg flex-col divide-y divide-light-200 overflow-hidden rounded-md border border-light-200 text-sm shadow-sm shadow-light-600 dark:divide-dark-200 dark:border-dark-200 dark:shadow-none">
			{policies.some((pol) => !isPolicyReady(pol)) && (
				<div className="flex w-full items-center justify-center p-2 text-center">
					<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
						<IoWarningOutline size={16} />
					</div>
					<span className="ml-3 text-xs text-light-600">
						One or more chains requires re-enabling automations.
						<br /> Automations must be individually authorized on
						each chain.
					</span>
				</div>
			)}

			{supportedChainIdsArray.map((chainId) => {
				const isFunded = fundedChainIds.includes(chainId);
				const policy = policies.find((pol) => pol.chainId === chainId);

				return (
					<div key={chainId} className="flex w-full items-center p-3">
						<div className="flex w-full flex-row xs1:flex-row xs1:items-center xs1:justify-between">
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
								<span className="w-full text-xs text-light-600">
									Value: $
									{chainsNetWorths[chainId]
										? chainsNetWorths[chainId]
										: "0.00"}
								</span>
							</div>
							<div className="mt-4 flex flex-row space-y-2 xs1:mt-0 xs1:flex-row xs1:space-x-2 xs1:space-y-0">
								<button
									className="flex h-8 w-16 items-center justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
									onClick={() => showQrModal(chainId)}
									disabled={isLoading}
								>
									Fund
								</button>
								{!policy && (
									<button
										className="flex h-8 w-24 items-center justify-center rounded-full bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										onClick={() =>
											handlePolicyCreation(chainId)
										}
										disabled={isLoading}
									>
										{isLoading &&
										chainRowLoading === chainId ? (
											<AiOutlineLoading3Quarters
												className="animate-spin"
												size={16}
											/>
										) : (
											"Enable"
										)}
									</button>
								)}
								{policy && !isPolicyReady(policy) && (
									<button
										className="flex h-8 w-24 items-center justify-center rounded-full bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
										onClick={() =>
											handlePolicyUpdate(chainId)
										}
										disabled={isLoading}
									>
										{isLoading &&
										chainRowLoading === chainId ? (
											<AiOutlineLoading3Quarters
												className="animate-spin"
												size={16}
											/>
										) : (
											"Re-Enable"
										)}
									</button>
								)}
							</div>
						</div>
						{policy && isPolicyReady(policy) && (
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
			{renderQrCodeModal(locker.address, qrChainId)}
			{renderConnectModal()}
		</div>
	);
}

export default MultiChainOverview;
