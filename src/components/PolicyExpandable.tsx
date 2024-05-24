import { Disclosure } from "@headlessui/react";
import { FaRobot } from "react-icons/fa";
import { IoChevronDown, IoWarning } from "react-icons/io5";

import AutomationBox from "@/components/AutomationBox";
import ChainIcon from "@/components/ChainIcon";
import { supportedChainIds } from "@/data/constants/supportedChains";
import { useQrCodeModal } from "@/hooks/useQrCodeModal";
import { Policy } from "@/types";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromId } from "@/utils/getChainName";

export interface IPolicyExpandable {
	fundedChainIds: number[];
	policies: Policy[];
	lockerAddress: `0x${string}`;
}

function PolicyExpandable({
	fundedChainIds,
	policies,
	lockerAddress,
}: IPolicyExpandable) {
	// export type Automation = {
	//     type: "savings" | "forward_to" | "off_ramp";
	//     allocationFactor: number; // 0 - 1
	//     status: "new" | "pending" | "ready" | "failed"; // Always "ready" for "savings" or "forward_to" types
	//     recipientAddress?: `0x${string}`; // Required if forward_to or off_ramp
	// };

	// export type Policy = {
	//     lockerId: number;
	//     chainId: number;
	//     sessionKey: string;
	//     automations: Automation[];
	// };

	const { openQrCodeModal, renderQrCodeModal } = useQrCodeModal();

	const allSupportedChainIds = Object.entries(supportedChainIds);

	return (
		<div className="flex min-h-fit w-full min-w-52 flex-col divide-y divide-light-200 rounded-md border border-light-200 text-sm shadow-sm shadow-light-600 dark:divide-dark-200 dark:border-dark-200 dark:shadow-none">
			{
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				allSupportedChainIds.map(([_, chainId]) => {
					const isFunded = fundedChainIds.includes(chainId);
					const policy = policies.find(
						(pol) => pol.chainId === chainId
					);

					const bankAutomation = policy
						? policy.automations.find(
								(a) => a.type === "off_ramp"
							) || null
						: null;
					const hotWalletAutomation = policy
						? policy.automations.find(
								(a) => a.type === "forward_to"
							) || null
						: null;
					const saveAutomation = policy
						? policy.automations.find(
								(a) => a.type === "savings"
							) || null
						: null;

					const bankPercent = bankAutomation
						? bankAutomation.allocationFactor * 100
						: 0;
					const hotWalletPercent = hotWalletAutomation
						? hotWalletAutomation.allocationFactor * 100
						: 0;
					const savePercent = saveAutomation
						? saveAutomation.allocationFactor * 100
						: 0;

					return (
						<Disclosure
							as="div"
							key={chainId}
							className="px-4 py-3"
							defaultOpen={false}
						>
							{({ open }) => (
								<>
									<Disclosure.Button className="flex w-full items-center justify-between text-left">
										<div className="flex w-full max-w-xs items-center space-x-4">
											<div className="flex items-center justify-center">
												<div
													className={`flex size-7 items-center justify-center rounded-full ${isFunded ? getChainIconStyling(chainId) : "bg-dark-500/10 text-dark-500 dark:bg-light-200/10 dark:text-light-200"}`}
												>
													<ChainIcon
														className="flex items-center justify-center"
														chainId={chainId}
														size={16}
													/>
												</div>
												<span
													className={`ml-3 whitespace-nowrap ${!isFunded && "text-light-600"}`}
												>
													{getChainNameFromId(
														chainId
													)}
												</span>
											</div>
											{policy && (
												<>
													<FaRobot
														className={`${!isFunded && "text-light-600"} shrink-0`}
														size={16}
													/>
													{bankAutomation &&
													bankAutomation.status ===
														"new" ? (
														<div className="flex items-center">
															<IoWarning
																className={`${isFunded ? "text-warning" : "text-light-600"} shrink-0`}
																size={16}
															/>
															<span className=" ml-2">
																Finish setup
															</span>
														</div>
													) : null}
												</>
											)}
											{isFunded && !policy && (
												<div className="flex items-center">
													<IoWarning
														className={`${isFunded ? "text-warning" : "text-light-600"} shrink-0`}
														size={16}
													/>
													<span className=" ml-2">
														Finish setup
													</span>
												</div>
											)}
										</div>
										<IoChevronDown
											className={`${open && "rotate-180 transform"} ${!isFunded && "text-light-600"} shrink-0`}
											size={20}
										/>
									</Disclosure.Button>
									<Disclosure.Panel className="flex w-full flex-col items-start justify-center space-y-10 pb-3 pt-6">
										{!isFunded && (
											<div className="flex w-full flex-col items-center justify-center space-y-4">
												<span className="text-sm text-light-600">
													Your locker has not been
													funded on this chain.
												</span>
												<button
													className="h-10 w-20 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
													onClick={openQrCodeModal}
												>
													Fund
												</button>
											</div>
										)}
										{policy ? (
											<div className="flex w-full flex-col items-center justify-center space-y-10">
												<div className="flex w-full flex-col items-center justify-center space-y-4">
													<AutomationBox
														bankPercent={
															bankPercent
														}
														hotWalletPercent={
															hotWalletPercent
														}
														savePercent={
															savePercent
														}
													/>
													<button
														className="h-10 w-20 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
														onClick={() =>
															console.log(
																"Edit policy"
															)
														}
													>
														Edit
													</button>
												</div>
												{hotWalletAutomation && (
													<div className="flex w-full flex-col items-center justify-center space-y-4">
														<span className="break-all text-sm text-light-600">
															Forwarding to:{" "}
															<code>
																{
																	hotWalletAutomation.recipientAddress
																}
															</code>
														</span>
													</div>
												)}
												{bankAutomation &&
												bankAutomation.status ===
													"new" ? (
													<div className="flex w-full flex-col items-center justify-center space-y-4">
														<span className="text-sm text-light-600">
															You need to complete
															the identity
															verification process
															for the bank
															off-ramp automation
															to work. If this
															process is not
															completed, any money
															allocated to your
															bank will stay in
															your locker.
														</span>
														<button
															className="h-10 w-32 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
															onClick={() =>
																console.log(
																	"Complete KYC"
																)
															}
														>
															Complete KYC
														</button>
													</div>
												) : bankAutomation &&
												  bankAutomation.status ===
														"pending" ? (
													<span className="text-sm text-light-600">
														Your identity
														verification is pending.
														We&apos;ll let you know
														once this process is
														complete. Any money
														allocated to your bank
														will stay in your
														locker.
													</span>
												) : null}
											</div>
										) : (
											<div className="flex w-full flex-col items-center justify-center space-y-4">
												<span className="text-sm text-light-600">
													Setup up automations for
													this chain.
												</span>
												<button
													className="h-10 w-24 justify-center rounded-full bg-secondary-100 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
													onClick={() =>
														console.log(
															"Set up policy"
														)
													}
												>
													Automate
												</button>
											</div>
										)}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					);
				})
			}
			{renderQrCodeModal(lockerAddress)}
		</div>
	);
}

export default PolicyExpandable;

// [
// 	{ type: "savings", status: "ready", allocationFactor: 0.2 },
// 	{
// 		type: "forward_to",
// 		status: "ready",
// 		allocationFactor: 0.1,
// 		recipientAddress: "0xde076d651613c7bde3260b8b69c860d67bc16f49",
// 	},
// 	{ type: "off_ramp", status: "new", allocationFactor: 0.7 },
// ];
