import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import EditAutomationsModal from "@/components/EditAutomationsModal";

export const useEditAutomationsModal = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openEditAutomationsModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeEditAutomationsModal = useCallback(() => {
		setIsOpen(false);
		router.refresh();
	}, []);

	const renderEditAutomationsModal = () => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<EditAutomationsModal
				isOpen={isOpen}
				closeModal={closeEditAutomationsModal}
			/>,
			document.body
		);
	};

	return { openEditAutomationsModal, renderEditAutomationsModal };
};
