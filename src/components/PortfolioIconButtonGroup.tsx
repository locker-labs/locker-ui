import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoQrCodeOutline,
} from "react-icons/io5";
import { useAccount } from "wagmi";

import { useConnectModal } from "@/hooks/useConnectModal";
import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { useSendModal } from "@/hooks/useSendModal";
import { getTokenBalances } from "@/services/transactions";
import { Locker, Token } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";

export interface ILockerPortfolio {
	locker: Locker;
}

function PortfolioIconButtonGroup({ locker }: ILockerPortfolio) {
	const [tokenList, setTokenList] = useState<Token[]>([]);
	const [copied, setCopied] = useState<boolean>(false);

	const { isConnected } = useAccount();
	const { openConnectModal, renderConnectModal } = useConnectModal();
	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();
	const { openSendModal, renderSendModal } = useSendModal();
	const { getToken } = useAuth();

	const getTokenList = async () => {
		const authToken = await getToken();
		if (authToken && locker.id) {
			const list = await getTokenBalances(authToken, locker.id);
			setTokenList(list || []);
		}
	};

	const handleSendModalPopup = () => {
		if (isConnected) {
			openSendModal();
		} else {
			openConnectModal();
		}
	};

	useEffect(() => {
		getTokenList();
	}, []);

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
					onClick={() => {
						getTokenList();
						openQrCodeModal();
					}}
				>
					<IoQrCodeOutline size="16px" />
				</button>
				<span className="text-light-600">Scan</span>
			</div>
			<div className="flex flex-col items-center justify-center space-y-1">
				<button
					className="flex size-10 shrink-0 items-center justify-center rounded-full bg-dark-500/10 text-dark-600 transition duration-300 ease-in-out hover:scale-105 dark:bg-light-200/10 dark:text-light-100"
					aria-label="Send money out of locker"
					onClick={handleSendModalPopup}
				>
					<IoIosSend size="16px" />
				</button>
				<span className="text-light-600">Send</span>
			</div>
			{renderQrCodeModal(locker.address)}
			{renderSendModal(tokenList, locker)}
			{renderConnectModal()}
		</div>
	);
}

export default PortfolioIconButtonGroup;
