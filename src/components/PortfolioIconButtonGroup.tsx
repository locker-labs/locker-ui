import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoQrCodeOutline,
} from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { Locker } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";

export interface ILockerPortfolio {
	locker: Locker;
}

function PortfolioIconButtonGroup({ locker }: ILockerPortfolio) {
	const [copied, setCopied] = useState<boolean>(false);
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();

	return (
		<div className="flex items-center space-x-4 text-xs">
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dark-500/10 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10"
					aria-label="Copy locker address"
					onClick={() => copyToClipboard(locker.address, setCopied)}
				>
					{copied ? (
						<IoCheckboxOutline size="14px" />
					) : (
						<IoCopyOutline size="14px" />
					)}
				</button>
				<span className="text-light-600">Copy</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dark-500/10 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10"
					aria-label="Display locker QR code"
					onClick={openQrCodeModal}
				>
					<IoQrCodeOutline size="14px" />
				</button>
				<span className="text-light-600">Scan</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dark-500/10 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10"
					aria-label="Send money out of locker"
					onClick={() => console.log("Send money out of locker")}
				>
					<IoIosSend size="14px" />
				</button>
				<span className="text-light-600">Send</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-8 shrink-0 items-center justify-center rounded-full bg-dark-500/10 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10"
					aria-label="Edit locker automation settings"
					onClick={() =>
						console.log("Edit locker automation settings")
					}
				>
					<VscSettings size="14px" />
				</button>
				<span className="text-light-600">Edit</span>
			</div>
			{renderQrCodeModal(locker.address)}
		</div>
	);
}

export default PortfolioIconButtonGroup;
