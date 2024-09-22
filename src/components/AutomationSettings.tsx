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

import BoxletPieChart from "./BoxletPieChart";
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

	const { openKycModal, renderKycModal } = useKycModal();

	const boxletsFromAutomations = Object.fromEntries(
		automations.map((automation) => {
			const { type, allocation } = automation;
			return [
				automation.type,
				{ ...DEFAULT_BOXLETS[type], percent: allocation * 100 },
			];
		})
	);
	const [boxlets, setBoxlets] = useState(boxletsFromAutomations);

	const updateBoxlet = (updatedBoxlet: IDistributionBoxlet) => {
		setBoxlets((prevBoxlets) => ({
			...prevBoxlets,
			[updatedBoxlet.id]: updatedBoxlet, // Override the existing boxlet with the same id
		}));
	};

	useEffect(() => {
		if (offrampUrl) {
			openKycModal();
		}
	}, [offrampUrl]);

	return (
		<div className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-md">
			<BoxletPieChart boxlets={boxlets} lineWidth={100} size="size-48" />
			{renderKycModal(offrampUrl)}
		</div>
	);
}

export default AutomationSettings;
