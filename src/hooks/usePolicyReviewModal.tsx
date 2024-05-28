import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import PolicyReviewModal from "@/components/PolicyReviewModal";

export const usePolicyReviewModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openPolicyReviewModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closePolicyReviewModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderPolicyReviewModal = (
		createNewPolicy: () => void,
		chainId: number,
		savePercent: string,
		hotWalletPercent: string,
		bankPercent: string
	) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<PolicyReviewModal
				isOpen={isOpen}
				closeModal={closePolicyReviewModal}
				createNewPolicy={createNewPolicy}
				chainId={chainId}
				savePercent={savePercent}
				hotWalletPercent={hotWalletPercent}
				bankPercent={bankPercent}
			/>,
			document.body
		);
	};

	return { openPolicyReviewModal, renderPolicyReviewModal };
};
