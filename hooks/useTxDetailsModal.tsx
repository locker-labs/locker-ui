import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import TxDetailsModal from "../app/components/TxDetailsModal";
import { Tx } from "../types";

export const useTxDetailsModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openTxDetailsModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeTxDetailsModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderTxDetailsModal = (tx: Tx) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<TxDetailsModal
				isOpen={isOpen}
				closeModal={closeTxDetailsModal}
				tx={tx}
			/>,
			document.body
		);
	};

	return { openTxDetailsModal, renderTxDetailsModal };
};
