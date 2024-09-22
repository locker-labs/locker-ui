import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";

import AllocationBox from "@/components/AllocationBox";
import { BOXLET, DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { useEditAutomationsModal } from "@/hooks/useEditAutomationsModal";
import { useKycModal } from "@/hooks/useKycModal";
import { createOfframp } from "@/services/lockers";
import { Automation, EAutomationType, Locker } from "@/types";

import DistributionBox from "./DistributionBox";
import { IDistributionBoxlet } from "./DistributionBoxlet";

export interface IAutomationSettings {
	locker: Locker;
	automations: Automation[];
}

function AutomationSettings({ locker, automations }: IAutomationSettings) {
	const [offrampUrl, setOfframpUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { getToken } = useAuth();
	const { openEditAutomationsModal, renderEditAutomationsModal } =
		useEditAutomationsModal();
	const { openKycModal, renderKycModal } = useKycModal();

	const boxletsFromAutomations = Object.fromEntries(
		automations.map((automation) => {
			const { type, allocation: percent } = automation;
			return [automation.type, { ...DEFAULT_BOXLETS[type], percent }];
		})
	);
	const [boxlets, setBoxlets] = useState(boxletsFromAutomations);

	const updateBoxlet = (updatedBoxlet: IDistributionBoxlet) => {
		setBoxlets((prevBoxlets) => ({
			...prevBoxlets,
			[updatedBoxlet.id]: updatedBoxlet, // Override the existing boxlet with the same id
		}));
	};

	// TODO: need to handle the case where user closes the KYC modal.
	// This means that we need to be able to fetch the offramp url without creating a new beam account
	const handleOfframpCreation = async () => {
		const authToken = await getToken();
		if (authToken && locker.address) {
			setIsLoading(true);
			const url = await createOfframp(authToken, locker.address);
			setOfframpUrl(url);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (offrampUrl) {
			openKycModal();
		}
	}, [offrampUrl]);

	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-md">
			<DistributionBox boxlets={boxlets} updateBoxlet={updateBoxlet} />
			<div className="flex w-full flex-col items-center space-y-4">
				<button
					className="h-10 w-20 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
					onClick={openEditAutomationsModal}
				>
					Edit
				</button>
				{bankAutomation && bankAutomation.status === "new" && (
					<>
						<button
							className="h-12 w-44 items-center justify-center rounded-full bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300"
							onClick={handleOfframpCreation}
						>
							<div className="flex w-full items-center justify-center">
								{isLoading ? (
									<AiOutlineLoading3Quarters
										className="animate-spin"
										size={16}
									/>
								) : (
									<>
										<div className="flex size-7 items-center justify-center rounded-full bg-warning/20 text-warning">
											<IoWarningOutline size={16} />
										</div>
										<span className="ml-3 text-sm">
											Finish setup
										</span>
									</>
								)}
							</div>
						</button>
						<div className="flex w-full max-w-52 flex-col items-center space-y-4 text-center text-xs text-light-600">
							<span>
								If identity verification process is not
								completed, any money allocated to your bank will
								stay in your locker.
							</span>
						</div>
					</>
				)}
				{bankAutomation && bankAutomation.status === "pending" && (
					<span className="text-xs text-light-600">
						Identity verification is pending.
					</span>
				)}
			</div>
			{renderKycModal(offrampUrl)}
			{renderEditAutomationsModal()}
		</div>
	);
}

export default AutomationSettings;
