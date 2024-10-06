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
import ChainSelectModal from "./ChainSelectModal";
// eslint-disable-next-line import/no-named-as-default
import ConnectModal from "./ConnectModal";
import { calcPrecentLeft, IDistributionBoxlet } from "./DistributionBoxlet";

function LockerSetup() {
	const { locker: _locker } = useLocker();
	const locker = _locker;
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { getToken } = useAuth();
	const { chainId, address, isConnected } = useAccount();
	const { signSessionKey } = useSmartAccount();
	const [didUserClick, setDidUserClick] = useState(false);
	const [isConnectModalOpen, setIsConnectModalOpen] =
		useState<boolean>(false); // Control for ConnectModal
	const [isChainSelectModalOpen, setIsChainSelectModalOpen] =
		useState<boolean>(false); // Control for ChainSelectModal

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
		console.log("createNewLocker");
		setErrorMessage("");
		setIsLoading(true);
		// Show Loader for 1.5 seconds
		// await new Promise((resolve) => {
		// 	setTimeout(resolve, 1500);
		// });

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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error);
			setDidUserClick(false);
			setErrorMessage(`Unable to create locker${error.toString()}`);
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

	// Create locker after connecting
	useEffect(() => {
		console.log("main loop", didUserClick, isLoading, address, locker);
		// Don't do anything if user has never clicked
		if (!didUserClick) return;

		if (address && !locker) {
			console.log("Create locker after connecting");
			// create locker if wallet connected but locker
			setIsConnectModalOpen(false);
			createNewLocker();
		} else if (address && locker) {
			console.log("Chain select modal");
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

			// Open chain selection if locker created and wallet connected
			setIsChainSelectModalOpen(true);
			// createNewLocker();
		}
	}, [address, didUserClick, locker]);

	let cta = null;
	if (isLoading) {
		cta = (
			<button
				aria-label="Connect wallet"
				className="flex w-full cursor-not-allowed items-center  justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white opacity-80 hover:bg-blue-200"
				disabled
			>
				<AiOutlineLoading3Quarters className="animate-spin" size={22} />
			</button>
		);
	} else if (percentLeft !== 0) {
		cta = (
			<button
				aria-label="Connect wallet"
				className="flex w-full cursor-not-allowed items-center  justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white opacity-80 hover:bg-blue-200"
				disabled
			>
				Adjust percentages
			</button>
		);
	} else if (isConnected) {
		cta = (
			<>
				<button
					aria-label="Enable automations"
					className="flex w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white opacity-100 hover:bg-blue-200"
					onClick={() => {
						setDidUserClick(true);
					}}
				>
					Enable automations
				</button>
				<ChainSelectModal
					open={isChainSelectModalOpen}
					onClose={() => setIsChainSelectModalOpen(false)} // Close modal handler
					createNewPolicy={createNewPolicy}
				/>
			</>
		);
	} else {
		cta = (
			<>
				<button
					aria-label="Continue"
					className="flex w-full cursor-pointer items-center justify-center rounded-md bg-locker-600 py-3 text-sm font-semibold text-white opacity-100 hover:bg-blue-200"
					onClick={() => {
						setDidUserClick(true);
						setIsConnectModalOpen(true);
					}}
				>
					Connect wallet
				</button>
				<ConnectModal
					open={isConnectModalOpen}
					onClose={() => setIsConnectModalOpen(false)} // Close modal handler
				/>
			</>
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
		<span className="ml-2 text-sm">
			<span
				className={`${isPerfectlyAllocated ? "text-black" : "text-error"} font-bold`}
			>
				{absAllocation}% {allocationString}
			</span>
		</span>
	);

	const rightPanel = (
		<div className="grid-col order-1 col-span-2 grid grid-cols-1 sm:order-2 sm:col-span-1 sm:ml-4 sm:max-w-[320px]">
			<div className="flex justify-items-center">
				<BoxletPieChart boxlets={boxlets} lineWidth={100} />
			</div>

			<div className="mt-3 text-center">{leftToAllocate}</div>

			<div className="hidden sm:block">
				{cta}
				{errorSection}
			</div>

			{/* {chainId && renderChainSelectModal(createNewPolicy)} */}
		</div>
	);

	const leftPanel = (
		<div className="order-2 col-span-2 mt-6 w-full justify-self-end sm:order-1 sm:col-span-1 sm:mt-0 sm:max-w-[512px]">
			<DistributionBox boxlets={boxlets} updateBoxlet={updateBoxlet} />
			<div className="mt-[1rem] text-center font-bold sm:hidden">
				{leftToAllocate}
			</div>
			<div className="mt-3 sm:hidden">{cta}</div>
		</div>
	);

	return (
		<div className="grid auto-cols-max grid-flow-row grid-cols-2 justify-items-center">
			{leftPanel}
			{rightPanel}
		</div>
	);
}

export default LockerSetup;
