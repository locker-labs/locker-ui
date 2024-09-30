import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import LockerOnboardedModal from "@/components/LockerOnboardedModal";

export const useLockerOnboardedModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openLockerOnboardedModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeLockerOnboardedModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderLockerOnboardedModal = () => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<LockerOnboardedModal
				isOpen={isOpen}
				closeModal={closeLockerOnboardedModal}
			/>,
			document.body
		);
	};

	return { openLockerOnboardedModal, renderLockerOnboardedModal };
};
