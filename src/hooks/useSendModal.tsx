import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import SendModal from "@/components/SendModal";
import { Locker, Token } from "@/types";

export const useSendModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openSendModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeSendModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderSendModal = (tokenList: Token[], locker: Locker) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<SendModal
				isOpen={isOpen}
				closeModal={closeSendModal}
				tokenList={tokenList}
				locker={locker}
			/>,
			document.body
		);
	};

	return { openSendModal, renderSendModal };
};
