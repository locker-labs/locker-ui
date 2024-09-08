import { EAutomationStatus, EAutomationType, Policy } from "../types";

export const isPolicyReady = (policy: Policy) =>
	policy.automations.every(
		(automation) =>
			automation.status === EAutomationStatus.READY ||
			(automation.type === EAutomationType.OFF_RAMP &&
				automation.status !== EAutomationStatus.AUTOMATE_THEN_READY)
	);
