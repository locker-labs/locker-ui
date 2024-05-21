import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoQrCodeOutline,
} from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";

import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useSendModal } from "@/hooks/useSendModal";
import { Locker } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";

export interface ILockerPortfolio {
	locker: Locker;
}

function PortfolioIconButtonGroup({ locker }: ILockerPortfolio) {
	const [copied, setCopied] = useState<boolean>(false);
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();
	const { openSendModal, renderSendModal } = useSendModal();

	return (
		<div className="flex items-center space-x-4 text-xs">
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dark-500/10 text-dark-600 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10 dark:text-light-100"
					aria-label="Copy locker address"
					onClick={() => copyToClipboard(locker.address, setCopied)}
				>
					{copied ? (
						<IoCheckboxOutline size="16px" />
					) : (
						<IoCopyOutline size="16px" />
					)}
				</button>
				<span className="text-light-600">Copy</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dark-500/10 text-dark-600 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10 dark:text-light-100"
					aria-label="Display locker QR code"
					onClick={openQrCodeModal}
				>
					<IoQrCodeOutline size="16px" />
				</button>
				<span className="text-light-600">Scan</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dark-500/10 text-dark-600 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10 dark:text-light-100"
					aria-label="Send money out of locker"
					onClick={openSendModal}
				>
					<IoIosSend size="16px" />
				</button>
				<span className="text-light-600">Send</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dark-500/10 text-dark-600 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10 dark:text-light-100"
					aria-label="Edit locker automation settings"
					onClick={() =>
						console.log("Edit locker automation settings")
					}
				>
					<VscSettings size="16px" />
				</button>
				<span className="text-light-600">Edit</span>
			</div>
			{renderQrCodeModal(locker.address)}
			{renderSendModal()}
		</div>
	);
}

export default PortfolioIconButtonGroup;
