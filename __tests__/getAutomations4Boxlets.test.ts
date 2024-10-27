// getAutomations4Boxlets.test.ts
import { IDistributionBoxlet } from "@/lib/boxlets";
import {
	Automation,
	EAutomationStatus,
	EAutomationType,
	EAutomationUserState,
} from "@/types";
import getAutomations4Boxlets from "@/utils/policies/getAutomations4Boxlets";

describe("getAutomations4Boxlets", () => {
	const baseAutomation: Automation = {
		type: EAutomationType.SAVINGS,
		allocation: 0.5,
		status: EAutomationStatus.READY,
		userState: EAutomationUserState.ON,
	};

	const boxlets: { [id: string]: IDistributionBoxlet } = {
		[EAutomationType.SAVINGS]: {
			id: EAutomationType.SAVINGS,
			title: "Savings",
			percent: 50,
			color: "#FFFFFF",
			tooltip: "Savings automation",
			state: EAutomationUserState.ON,
		},
	};

	it("should add a new boxlet as automation", () => {
		const automations: Automation[] = [];
		const updatedAutomations = getAutomations4Boxlets(automations, boxlets);

		expect(updatedAutomations.length).toBe(1);
		expect(updatedAutomations[0]).toMatchObject({
			type: EAutomationType.SAVINGS,
			allocation: 0.5,
			status: EAutomationStatus.NEW,
			userState: EAutomationUserState.ON,
		});
	});

	it("should update an existing automation with new boxlet settings", () => {
		const automations: Automation[] = [baseAutomation];
		const updatedBoxlets = {
			[EAutomationType.SAVINGS]: {
				...boxlets[EAutomationType.SAVINGS],
				percent: 75,
				state: EAutomationUserState.OFF,
			},
		};

		const updatedAutomations = getAutomations4Boxlets(
			automations,
			updatedBoxlets
		);

		expect(updatedAutomations.length).toBe(1);
		expect(updatedAutomations[0]).toMatchObject({
			type: EAutomationType.SAVINGS,
			allocation: 0.75,
			status: EAutomationStatus.READY,
			userState: EAutomationUserState.OFF,
		});
	});

	it("should handle 'forward_to' automation with a recipient address", () => {
		const forwardBoxlet: IDistributionBoxlet = {
			id: EAutomationType.FORWARD_TO,
			title: "Forward",
			percent: 20,
			color: "#FF0000",
			tooltip: "Forward automation",
			forwardToAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
			state: EAutomationUserState.ON,
		};

		const updatedBoxlets = {
			...boxlets,
			[EAutomationType.FORWARD_TO]: forwardBoxlet,
		};
		const automations: Automation[] = [];

		const updatedAutomations = getAutomations4Boxlets(
			automations,
			updatedBoxlets
		);

		const forwardAutomation = updatedAutomations.find(
			(a) => a.type === EAutomationType.FORWARD_TO
		);

		expect(forwardAutomation).toBeDefined();
		expect(forwardAutomation).toMatchObject({
			type: EAutomationType.FORWARD_TO,
			allocation: 0.2,
			recipientAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
			userState: EAutomationUserState.ON,
		});
	});
});
