"use client";

// import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { PiCheckSquareOffset, PiCopy } from "react-icons/pi";

import type { Locker } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";

export interface ILockerEmpty {
	emptyLocker: Locker;
}

function LockerEmpty({ emptyLocker }: ILockerEmpty) {
	const [copied, setCopied] = useState<boolean>(false);

	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<span>Your locker is empty</span>
			<span>
				Tell your employer, hackathon organizer, or clients to pay you
				at your Locker address below.
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
							<PiCheckSquareOffset
								className="ml-3 shrink-0 text-success"
								size="25px"
							/>
						) : (
							<PiCopy className="ml-3 shrink-0" size="25px" />
						)}
					</button>
				</div>
				{/* <a
					href="https://faucet.circle.com/"
					target="_blank"
					className="self-center underline hover:text-[#515EF1]"
				>
					Testnet Faucet
				</a> */}
			</div>
		</div>
	);
}

export default LockerEmpty;
