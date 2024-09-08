import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import ConnectModal from "../components/ConnectModal";

export const useConnectModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openConnectModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeConnectModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderConnectModal = () => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<ConnectModal isOpen={isOpen} closeModal={closeConnectModal} />,
			document.body
		);
	};

	return { openConnectModal, renderConnectModal };
};
