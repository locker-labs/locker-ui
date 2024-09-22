import { PolicyDb } from "@/types";

import ChainIcon from "./ChainIcon";
import { IconReceive, IconSend } from "./Icons";

type ILockerPortfolioValue = {
	portfolioValue: string;
	policies: PolicyDb[];
};

function LockerPortfolioValue({
	portfolioValue,
	policies,
}: ILockerPortfolioValue) {
	return (
		<div className="flex flex-col space-y-5">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<p className="text-gray-500">Porftolio value</p>
					<p className="text-2xl font-bold">${portfolioValue}</p>
				</div>
				<div className="flex flex-row space-x-4">
					<div className="flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gray-100">
						<IconSend />
						<p className="text-sm text-gray-500">Send</p>
					</div>
					<div className="flex h-20 w-20 flex-col items-center justify-center rounded-sm bg-gray-100">
						<IconReceive />
						<p className="text-sm text-gray-500">Receive</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row justify-between rounded-md p-2 outline outline-gray-300">
				<div>
					{policies.map((policy) => (
						<ChainIcon
							chainId={policy.chainId}
							key={policy.chainId}
						/>
					))}
				</div>
				<div className="text-sm underline underline-offset-8">
					Manage chains
				</div>
			</div>
		</div>
	);
}

export default LockerPortfolioValue;
