import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import SendModal from "@/components/SendModal";

export const useSendModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openSendModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeSendModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderSendModal = () => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<SendModal isOpen={isOpen} closeModal={closeSendModal} />,
			document.body
		);
	};

	return { openSendModal, renderSendModal };
};
