import { useCallback, useState } from "react";
import ReactDOM from "react-dom";

import EditAutomationsModal from "@/components/EditAutomationsModal";
import { Automation, Locker, Policy } from "@/types";

export const useEditAutomationsModal = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openEditAutomationsModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	const closeEditAutomationsModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const renderEditAutomationsModal = (
		currentPolicies: Policy[],
		fetchPolicies: () => void,
		locker: Locker,
		bankAutomation: Automation | undefined,
		hotWalletAutomation: Automation | undefined,
		saveAutomation: Automation | undefined
	) => {
		if (!isOpen) return null;
		return ReactDOM.createPortal(
			<EditAutomationsModal
				isOpen={isOpen}
				closeModal={closeEditAutomationsModal}
				fetchPolicies={fetchPolicies}
				currentPolicies={currentPolicies}
				locker={locker}
				currentBankAutomation={bankAutomation}
				currentHotWalletAutomation={hotWalletAutomation}
				currentSaveAutomation={saveAutomation}
			/>,
			document.body
		);
	};

	return { openEditAutomationsModal, renderEditAutomationsModal };
};
