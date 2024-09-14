import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import ChainSelectModal from "@/components/ChainSelectModal";

export const useChainSelectModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openChainSelectModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeChainSelectModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderChainSelectModal = (
		createNewPolicy: () => void,
		chainId: number
	) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<ChainSelectModal
				isOpen={isOpen}
				closeModal={closeChainSelectModal}
				createNewPolicy={createNewPolicy}
				chainId={chainId}
			/>,
			document.body
		);
	};

	return { openChainSelectModal, renderChainSelectModal };
};
