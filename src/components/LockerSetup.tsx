"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { checksumAddress, formatUnits, isAddress } from "viem";
import { useAccount } from "wagmi";

import DistributionBox from "@/components/DistributionBox";
import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { errors } from "@/data/constants/errorMessages";
import { paths } from "@/data/constants/paths";
import { useChainSelectModal } from "@/hooks/useChainSelectModal";
import { useConnectModal } from "@/hooks/useConnectModal";
import useSmartAccount from "@/hooks/useSmartAccount";
import { useLocker } from "@/providers/LockerProvider";
import { createLocker, createPolicy } from "@/services/lockers";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	Locker,
	Policy,
} from "@/types";
import { isChainSupported } from "@/utils/isChainSupported";

import BoxletPieChart from "./BoxletPieChart";
import { calcPrecentLeft, IDistributionBoxlet } from "./DistributionBoxlet";

function LockerSetup() {
	const { lockers } = useLocker();
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { getToken } = useAuth();
	const { chainId, address, isConnected } = useAccount();
	const { signSessionKey } = useSmartAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { openChainSelectModal, renderChainSelectModal } =
		useChainSelectModal();
	const { genSmartAccountAddress } = useSmartAccount();

	const router = useRouter();

	const [boxlets, setBoxlets] = useState(DEFAULT_BOXLETS);

	const updateBoxlet = (updatedBoxlet: IDistributionBoxlet) => {
		setBoxlets((prevBoxlets) => ({
			...prevBoxlets,
			[updatedBoxlet.id]: updatedBoxlet, // Override the existing boxlet with the same id
		}));
	};

	useEffect(() => {
		// Prefill forwarding address with owner's address unless it already has a value
		if (address && !boxlets[EAutomationType.FORWARD_TO].forwardToAddress)
			updateBoxlet({
				...DEFAULT_BOXLETS[EAutomationType.FORWARD_TO],
				forwardToAddress: address,
			});
	}, [address]);

	let locker: Locker | undefined = lockers[0];

	const saveDecimal = Number(
		formatUnits(BigInt(boxlets[EAutomationType.SAVINGS].percent), 2)
	);
	const isSaveSelected = saveDecimal > 0;

	const forwardDecimal = Number(
		formatUnits(BigInt(boxlets[EAutomationType.FORWARD_TO].percent), 2)
	);
	const isForwardSelected = forwardDecimal > 0;

	const offrampDecimal = Number(
		formatUnits(BigInt(boxlets[EAutomationType.OFF_RAMP].percent), 2)
	);
	// const isOfframpSelected = offrampDecimal > 0;
	const percentLeft = calcPrecentLeft(boxlets);
	const lockerIndex = 0;
	const sendToAddress = boxlets[EAutomationType.FORWARD_TO].forwardToAddress;

	// 2. Create locker
	const createNewLocker = async (): Promise<Locker | undefined> => {
		setErrorMessage("");
		setIsLoading(true);
		// Show Loader for 1.5 seconds
		await new Promise((resolve) => {
			setTimeout(resolve, 1500);
		});

		// Proceed
		try {
			const smartAccountAddress = await genSmartAccountAddress(
				address as `0x${string}`,
				lockerIndex
			);

			const lockerArgs: Locker = {
				seed: lockerIndex,
				provider: "ZeroDev",
				address: smartAccountAddress,
				ownerAddress: address as `0x${string}`,
			};

			const token = await getToken();
			if (token) {
				const newLocker = await createLocker(
					token,
					lockerArgs,
					setErrorMessage
				);
				return newLocker;
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
		} finally {
			setIsLoading(false);
		}

		return undefined;
	};

	const createNewPolicy = async () => {
		setIsLoading(true);

		// 1. Get user to sign session key
		const sig = await signSessionKey(
			chainId as number, // current chainId in user's connected wallet
			0, // lockerIndex
			sendToAddress as `0x${string}`, // hotWalletAddress
			[] // offrampAddress
		);
		if (!sig) {
			setIsLoading(false);
			return;
		}

		// 2. Craft policy object
		const automations: Automation[] = [
			{
				type: EAutomationType.SAVINGS,
				allocation: saveDecimal,
				status: EAutomationStatus.READY,
			},
			{
				type: EAutomationType.FORWARD_TO,
				allocation: forwardDecimal,
				status: EAutomationStatus.READY,
				recipientAddress: sendToAddress as `0x${string}`,
			},
			{
				type: EAutomationType.OFF_RAMP,
				allocation: offrampDecimal,
				status: EAutomationStatus.NEW,
			},
		];
		const policy: Policy = {
			lockerId: locker?.id as number,
			chainId: chainId as number,
			sessionKey: sig as string,
			automations,
		};

		// 3. Get auth token and create policy through locker-api
		const authToken = await getToken();
		if (authToken) {
			await createPolicy(authToken, policy, setErrorMessage);
		}

		router.push(`${paths.HOME}?o=o`);
		setIsLoading(false);
	};

	const isForwardToMissing = isForwardSelected && !isAddress(sendToAddress!);
	const handlePolicyCreation = async () => {
		setIsLoading(true);
		// TODO: Improve error handling
		if (isConnected) {
			if (isSaveSelected && errorMessage === errors.INVALID_ADDRESS)
				return;

			setErrorMessage("");
			if (chainId && !isChainSupported(chainId)) {
				setErrorMessage(errors.UNSUPPORTED_CHAIN);
				setIsLoading(false);
				return;
			}

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

			console.log("Trying to create policy");
			console.log(locker);
			if (!locker) {
				locker = await createNewLocker();

				console.log("Created locker");
				console.log(locker);
				// Locker may already exist or some other issue
				if (!locker) {
					setIsLoading(false);
					return;
				}
			}

			const isNotOwner =
				locker && checksumAddress(locker.ownerAddress) !== address;
			if (isNotOwner) {
				setErrorMessage(
					`${errors.UNAUTHORIZED} Expected wallet: ${
						locker?.ownerAddress
					}`
				);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			openChainSelectModal();
		} else {
			openConnectModal();
		}
	};

	let cta = null;
	if (isLoading) {
		cta = (
			<button
				aria-label="Connect wallet"
				className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-md bg-locker-600 text-light-100 opacity-80 hover:bg-blue-200"
				disabled
			>
				<AiOutlineLoading3Quarters className="animate-spin" size={22} />
			</button>
		);
	} else if (percentLeft !== 0) {
		cta = (
			<button
				aria-label="Connect wallet"
				className="flex h-12 w-full cursor-not-allowed items-center justify-center rounded-md bg-locker-600 text-light-100 opacity-80 hover:bg-blue-200"
				disabled
			>
				Adjust percentages
			</button>
		);
	} else if (isConnected) {
		cta = (
			<button
				aria-label="Enable automations"
				className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 text-light-100 opacity-100 hover:bg-blue-200"
				onClick={() => handlePolicyCreation()}
			>
				Enable automations
			</button>
		);
	} else {
		cta = (
			<button
				aria-label="Continue"
				className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 text-light-100 opacity-100 hover:bg-blue-200"
				onClick={() => openConnectModal()}
			>
				Connect wallet
			</button>
		);
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
		<span className="ml-2 text-sm text-dark-100">
			<span
				className={`${isPerfectlyAllocated ? "text-success" : "text-error"}`}
			>
				{absAllocation}% {allocationString}
			</span>
		</span>
	);

	const rightPanel = (
		<div className="grid grid-cols-1 justify-center text-center xxs:order-1 xxs:col-span-2 sm:order-2 sm:col-span-1">
			<div className="flex justify-center">
				<div className="xxs:size-64 lg:size-80 xxl:size-96">
					<BoxletPieChart boxlets={boxlets} lineWidth={100} />
				</div>
			</div>

			<div className="xxs:hidden sm:block">{leftToAllocate}</div>

			<div className="xxs:hidden sm:block">
				{cta}
				{errorSection}
			</div>

			{renderConnectModal()}
			{chainId && renderChainSelectModal(createNewPolicy)}
		</div>
	);

	const leftPanel = (
		<div className="xxs:order-2 xxs:col-span-2 sm:order-1 sm:col-span-1">
			<DistributionBox boxlets={boxlets} updateBoxlet={updateBoxlet} />
			<div className="mt-6 text-center font-bold sm:hidden">
				{leftToAllocate}
			</div>
			<div className="mt-3 sm:hidden">{cta}</div>
		</div>
	);

	return (
		<div className="grid grid-flow-row grid-cols-2 xxs:gap-12 lg:gap-x-24">
			{leftPanel}
			{rightPanel}
		</div>
	);
}

export default LockerSetup;
