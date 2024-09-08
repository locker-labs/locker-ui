import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import KycModal from "../app/components/KycModal";

export const useKycModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openKycModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeKycModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderKycModal = (offrampUrl: string) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<KycModal
				isOpen={isOpen}
				closeModal={closeKycModal}
				offrampUrl={offrampUrl}
			/>,
			document.body
		);
	};

	return { openKycModal, renderKycModal };
};
