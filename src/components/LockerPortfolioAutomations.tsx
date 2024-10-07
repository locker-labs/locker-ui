import { DEFAULT_BOXLETS } from "@/data/constants/boxlets";
import { Automation, EAutomationStatus, EAutomationType } from "@/types";
import adaptAutomations2Boxlets from "@/utils/adaptAutomations2Boxlets";

import BoxletPieChart from "./BoxletPieChart";
import { EditAutomationsModal } from "./EditAutomationsModal";
import { SetupOfframpModal } from "./SetupOfframpModal";

export interface ILockerPortfolioAutomations {
	automations: Automation[];
}

function LockerPortfolioAutomations({
	automations,
}: ILockerPortfolioAutomations) {
	const boxlets = adaptAutomations2Boxlets(automations);
	return (
		<div className="flex flex-col space-y-6">
			<div className="flex flex-col justify-between">
				<div className="flex flex-row items-center justify-between xs:space-x-2 lg:space-x-8">
					<p className="font-bold">Locker Automation</p>
					<EditAutomationsModal />
				</div>
			</div>
			<div className="grid grid-flow-row grid-cols-3 gap-x-4 lg:grid-cols-1">
				<div className="col-span-1 flex flex-col items-center justify-center">
					<div className="lg:w-1/3 xl:w-1/2">
						<BoxletPieChart boxlets={boxlets} lineWidth={100} />
					</div>
				</div>
				<div className="col-span-2 space-y-3 pt-3">
					{automations
						// temoprarily hide offramp
						.filter((a) => a.type !== EAutomationType.OFF_RAMP)
						.map((automation) => {
							const { color, title } =
								DEFAULT_BOXLETS[automation.type];
							const isOfframpPending =
								automation.type === EAutomationType.OFF_RAMP &&
								automation.status === EAutomationStatus.NEW;

							return (
								<div
									className="flex flex-col space-y-2"
									key={`${automation.type}-${automation.recipientAddress}-div`}
								>
									<div className="flex flex-row justify-between text-xs">
										<div className="flex flex-row items-center justify-center space-x-2">
											<div
												className="size-5 rounded-full"
												style={{
													backgroundColor: color,
												}}
											/>
											<span>{title}</span>
										</div>
										<span className="font-semibold">
											{automation.allocation * 100}%
										</span>
									</div>
									{isOfframpPending && (
										<div className="flex flex-row">
											<SetupOfframpModal />
										</div>
									)}
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default LockerPortfolioAutomations;
