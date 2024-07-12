import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import QrCodeModal from "@/components/QrCodeModal";

export const useQrCodeModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openQrCodeModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeQrCodeModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderQrCodeModal = (
		lockerAddress: `0x${string}`,
		chainId: number
	) => {
		console.log("Locker Address", lockerAddress);
		console.log("Chain ID", chainId);
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<QrCodeModal
				isOpen={isOpen}
				closeModal={closeQrCodeModal}
				lockerAddress={lockerAddress}
				chainId={chainId}
			/>,
			document.body
		);
	};

	return { openQrCodeModal, renderQrCodeModal };
};
