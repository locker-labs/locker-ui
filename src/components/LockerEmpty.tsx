"use client";

// import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { IoCheckboxOutline, IoCopyOutline } from "react-icons/io5";
import { useAccount } from "wagmi";

import { errors } from "@/data/constants/errorMessages";
import type { Locker } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { isChainSupported } from "@/utils/isChainSupported";

// ***********************
// TO-DO:
//     - Improve verbiage, layout, and UI for this page
// ***********************

export interface ILockerEmpty {
	emptyLocker: Locker;
}

function LockerEmpty({ emptyLocker }: ILockerEmpty) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [copied, setCopied] = useState<boolean>(false);
	const { isConnected, chainId } = useAccount();

	useEffect(() => {
		if (isConnected && !isChainSupported(chainId as number)) {
			setErrorMessage(errors.UNSUPPORTED_CHAIN);
		} else {
			setErrorMessage(null);
		}
	}, [isConnected, chainId]);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<h1 className="text-4xl dark:text-light-100">
				Your locker is empty
			</h1>
			<span>
				Tell your employer, clients, or whoever to pay you at your
				locker address below.
			</span>
			<span>
				You can also deposit yourself by transferring any token to your
				Locker address from another account.
			</span>
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col items-center justify-center space-y-3">
					<span className="self-center text-4xl">
						Fund Your Locker
					</span>
					<div className="mx-auto my-8 max-w-xs rounded-lg bg-light-100 p-3 shadow-lg">
						<QRCodeSVG
							className="self-center"
							value={emptyLocker.address}
							size={200}
							level="H"
							imageSettings={{
								// Aspect ratio of iconLocker = w/h = 0.90626
								src: "/assets/iconLocker.svg",
								height: 49.7,
								width: 45,
								excavate: true,
							}}
						/>
					</div>
					<button
						className="flex items-center justify-center break-all text-left underline outline-none hover:text-secondary-100 dark:hover:text-primary-100"
						onClick={() =>
							copyToClipboard(emptyLocker.address, setCopied)
						}
					>
						<code>{emptyLocker.address}</code>
						{copied ? (
							<IoCheckboxOutline
								className="ml-3 shrink-0 text-success"
								size="25px"
							/>
						) : (
							<IoCopyOutline
								className="ml-3 shrink-0"
								size="25px"
							/>
						)}
					</button>
				</div>
				{errorMessage && (
					<span className="text-error">{errorMessage}</span>
				)}
			</div>
		</div>
	);
}

export default LockerEmpty;
