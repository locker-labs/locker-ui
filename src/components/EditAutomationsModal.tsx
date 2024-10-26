"use client";

import { useAuth } from "@clerk/nextjs";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { checksumAddress, isAddress } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import BoxletPieChart from "@/components/BoxletPieChart";
import DistributionBox from "@/components/DistributionBox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { errors } from "@/data/constants/errorMessages";
import { useToast } from "@/hooks/use-toast";
import useSmartAccount from "@/hooks/useSmartAccount";
import { calcPercentLeft, IDistributionBoxlet } from "@/lib/boxlets";
import { useLocker } from "@/providers/LockerProvider";
import { updatePolicy } from "@/services/lockers";
import { EAutomationType, Policy } from "@/types";
import adaptAutomations2Boxlets from "@/utils/adaptAutomations2Boxlets";
import getAutomations4Boxlets from "@/utils/policies/getAutomations4Boxlets";

import DistributionBoxExtra from "./DistributionBoxExtra";

type IEditAutomationsModalProps = {
	button?: JSX.Element;
};

function EditAutomationsModal({ button }: IEditAutomationsModalProps) {
	const { policies, automations, locker } = useLocker(); // Fetch locker and policies
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false); // State to control modal visibility
	const { isConnected: isWalletConnected } = useAccount();
	const defaultBoxlets =
		automations && automations.length > 0
			? adaptAutomations2Boxlets(automations)
			: DEFAULT_BOXLETS;
	const walletChainId = useChainId();
	const { switchChain } = useSwitchChain();
	const { address } = useAccount();

	// Initialize with current policy automations and any default automations, not included
	const [boxlets, setBoxlets] = useState({
		...defaultBoxlets,
		...adaptAutomations2Boxlets(automations || []),
	});
	const { toast } = useToast();
	const { openConnectModal } = useConnectModal();

	const [errorMessage, setErrorMessage] = useState<string>("");
	const { getToken } = useAuth();
	const { refreshPolicy } = useSmartAccount();

	const updateBoxlet = (updatedBoxlet: IDistributionBoxlet) => {
		setBoxlets((prevBoxlets) => ({
			...prevBoxlets,
			[updatedBoxlet.id]: updatedBoxlet, // Override the existing boxlet with the same id
		}));
	};

	const isSaveSelected =
		boxlets[EAutomationType.SAVINGS] &&
		boxlets[EAutomationType.SAVINGS].percent > 0;

	const isForwardSelected =
		boxlets[EAutomationType.FORWARD_TO] &&
		boxlets[EAutomationType.FORWARD_TO].percent > 0;

	const sendToAddress = boxlets[EAutomationType.FORWARD_TO].forwardToAddress;
	const percentLeft = calcPercentLeft(boxlets);

	const isForwardToMissing = isForwardSelected && !isAddress(sendToAddress!);

	const handleOpenChange = (open: boolean) => {
		if (isWalletConnected) {
			setIsOpen(open);
		} else {
			openConnectModal?.();
		}
	};

	const handleUpdatePolicy = async () => {
		setIsLoading(true);
		setErrorMessage("");

		// Validate inputs
		if (isSaveSelected && !sendToAddress) {
			setErrorMessage(errors.NO_ADDRESS);
			setIsLoading(false);
			return;
		}

		if (isForwardToMissing) {
			setErrorMessage(errors.RECIPIENT_EVM);
			setIsLoading(false);
			return;
		}

		if (Number(percentLeft) !== 0) {
			setErrorMessage(errors.SUM_TO_100);
			setIsLoading(false);
			return;
		}

		if (!automations) {
			setErrorMessage(errors.MISSING_AUTOMATIONS);
			setIsLoading(false);
			return;
		}

		if (!locker) {
			setErrorMessage("Locker not found");
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

		// Iterate over all policies and update each one
		try {
			// The same automations are set for all chains/policies
			const updatedAutomations = getAutomations4Boxlets(
				automations,
				boxlets
			);

			// eslint-disable-next-line no-restricted-syntax
			for (const policy of policies) {
				// get new session key with current addresses
				if (walletChainId !== policy.id) {
					// eslint-disable-next-line no-await-in-loop
					await switchChain({ chainId: policy.id });
				}

				// eslint-disable-next-line no-await-in-loop
				const sig = await refreshPolicy({
					automations: updatedAutomations,
					chainId: policy.chainId,
				});
				// console.log("sig", sig);
				if (!sig) {
					setIsLoading(false);
					setErrorMessage(
						"Something went wrong with session key creation. Please try again."
					);
					return;
				}

				const newPolicy: Policy = {
					...policy,
					sessionKey: sig as string,
					automations: updatedAutomations,
				};

				// eslint-disable-next-line no-await-in-loop
				const authToken = await getToken();
				if (authToken) {
					// eslint-disable-next-line no-await-in-loop
					await updatePolicy(authToken, newPolicy, setErrorMessage);
				}
			}

			toast({
				title: "Automations updated",
				description:
					"Your locker will now follow the new automations every time you get paid.",
			});

			// Close the modal after successful update
			setIsOpen(false);
		} catch (error) {
			console.error(error);
			setErrorMessage("Error updating policy");
		} finally {
			setIsLoading(false);
		}
	};

	let cta = (
		<button
			aria-label="Loading"
			className="flex w-full cursor-not-allowed items-center justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white opacity-80"
		>
			<AiOutlineLoading3Quarters className="animate-spin" size={22} />
		</button>
	);
	if (!isLoading) {
		if (isWalletConnected) {
			const text =
				policies.length > 1
					? `Save changes on ${policies.length} chains`
					: "Save changes";
			cta = (
				<button
					className="flex w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white"
					onClick={handleUpdatePolicy}
				>
					{text}
				</button>
			);
		} else {
			cta = (
				<button
					className="flex w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white"
					onClick={openConnectModal}
				>
					Connect Wallet
				</button>
			);
		}
	}

	const errorSection = (
		<div>
			{errorMessage && (
				<span className="text-wrap text-sm text-error">
					{errorMessage}
				</span>
			)}
		</div>
	);

	const absAllocation = Math.abs(Number(percentLeft));
	const isPerfectlyAllocated = absAllocation === 0;
	const isOverAllocated = Number(percentLeft) < 0;
	let allocationString = "left to allocate";
	if (isOverAllocated) allocationString = "over allocated";

	const leftToAllocate = (
		<span className="ml-2 text-sm">
			<span
				className={`${isPerfectlyAllocated ? "text-black" : "text-error"} font-bold`}
			>
				{absAllocation}% {allocationString}
			</span>
		</span>
	);

	const rightPanel = (
		<div className="order-1 col-span-2 flex flex-col items-start sm:order-2 sm:col-span-1 sm:ml-4 sm:max-w-[320px]">
			<div className="mx-auto max-w-[12rem]">
				<BoxletPieChart boxlets={boxlets} lineWidth={100} />
			</div>
			<div className="mt-3 w-full text-center sm:mt-4">
				{leftToAllocate}
			</div>

			<div className="hidden w-full sm:flex sm:flex-col">
				{cta}
				{errorSection}
			</div>
		</div>
	);

	const hasInactiveBoxlets = Object.values(boxlets).some(
		(boxlet) => boxlet.state === "off"
	);

	const leftPanel = (
		<div className="order-2 col-span-2 mt-6 w-full justify-self-end sm:order-1 sm:col-span-1 sm:mt-0 sm:max-w-[512px]">
			<DistributionBox boxlets={boxlets} updateBoxlet={updateBoxlet} />
			{hasInactiveBoxlets && (
				<div className="my-[1rem]">
					<DistributionBoxExtra
						boxlets={boxlets}
						updateBoxlet={updateBoxlet}
					/>
				</div>
			)}
			<div className="mt-[1rem] text-center font-bold sm:hidden">
				{leftToAllocate}
			</div>

			<div className="mt-3 flex flex-col sm:hidden">
				{cta}
				{errorSection}
			</div>
		</div>
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{button}</DialogTrigger>
			<DialogContent className="h-[95vh] overflow-y-auto sm:max-w-[95%] xl:max-w-[1280px]">
				<DialogHeader className="text-center">
					<DialogTitle className="text-center">
						Edit your locker
					</DialogTitle>
					<DialogDescription className="flex flex-row justify-center text-center">
						<div className="sm:max-w-[640px]">
							Every time there is a deposit into your locker,
							money is distributed according to your rules below.
							Funds always remain under your control.{" "}
							<Link
								href="https://docs.locker.money/privacy-and-security"
								className="text-locker-300"
								target="_blank"
							>
								Learn more
							</Link>
							.
						</div>
					</DialogDescription>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-4 overflow-y-auto py-4">
					{leftPanel}
					{rightPanel}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default EditAutomationsModal;

EditAutomationsModal.defaultProps = {
	button: (
		<button className="outline-solid flex cursor-pointer flex-row items-center justify-center rounded-md px-2 py-1 text-xxs outline outline-1 outline-gray-300">
			<Pencil size={12} />
			<span className="ml-2 font-semibold">Edit</span>
		</button>
	),
};
