import { useState } from "react";
import { IoIosSend } from "react-icons/io";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoOpenOutline,
	IoQrCodeOutline,
} from "react-icons/io5";
import { useAccount } from "wagmi";

import Tooltip from "@/components/Tooltip";
import { useConnectModal } from "@/hooks/useConnectModal";
import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { Locker, Token } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { isChainSupported } from "@/utils/isChainSupported";

export interface ILockerPortfolio {
	locker: Locker;
	tokenList: Token[];
	getTokenList: () => void;
}

function PortfolioIconButtonGroup({
	locker,
	tokenList,
	getTokenList,
}: ILockerPortfolio) {
	const [copied, setCopied] = useState<boolean>(false);

	const { isConnected, chain } = useAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();

	const handleSendModalPopup = () => {
		if (isConnected) {
			getTokenList();
		} else {
			openConnectModal();
		}
	};

	return (
		<div className="flex items-center space-x-4 text-xs">
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="bg-dark-500/10 text-dark-600 dark:bg-light-200/10 dark:text-light-100 flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ease-in-out hover:scale-105"
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
					className="bg-dark-500/10 text-dark-600 dark:bg-light-200/10 dark:text-light-100 flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ease-in-out hover:scale-105"
					aria-label="Display locker QR code"
					onClick={() => openQrCodeModal()}
				>
					<IoQrCodeOutline size="16px" />
				</button>
				<span className="text-light-600">Scan</span>
			</div>
			{!tokenList || tokenList.length === 0 ? (
				<div className="flex flex-col items-center justify-center space-y-1">
					<Tooltip label="Unable to fetch tokens in locker.">
						<button
							className="bg-dark-500/10 text-dark-600 dark:bg-light-200/10 dark:text-light-100 flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ease-in-out hover:scale-105"
							aria-label="Send money out of locker"
							onClick={handleSendModalPopup}
							disabled={!tokenList || tokenList.length === 0}
						>
							<IoIosSend size="16px" />
						</button>
					</Tooltip>
					<span className="text-light-600">Send</span>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center space-y-1">
					<button
						className="bg-dark-500/10 text-dark-600 dark:bg-light-200/10 dark:text-light-100 flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ease-in-out hover:scale-105"
						aria-label="Send money out of locker"
						onClick={handleSendModalPopup}
						disabled={!tokenList || tokenList.length === 0}
					>
						<IoIosSend size="16px" />
					</button>
					<span className="text-light-600">Send</span>
				</div>
			)}
			{isConnected &&
				chain &&
				isChainSupported(chain.id) &&
				chain.blockExplorers && (
					<div className="flex flex-col items-center justify-center space-y-1">
						<a
							className="bg-dark-500/10 text-dark-600 dark:bg-light-200/10 dark:text-light-100 flex size-10 shrink-0 items-center justify-center rounded-full transition duration-300 ease-in-out hover:scale-105"
							aria-label="View on block explorer"
							href={`${chain.blockExplorers.default.url}/address/${locker.address}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<IoOpenOutline size="16px" />
						</a>
						<span className="text-light-600">View</span>
					</div>
				)}
			{renderQrCodeModal(locker.address, chain?.id || 10)}
			{renderConnectModal()}
		</div>
	);
}

export default PortfolioIconButtonGroup;
