import { PiggyBank } from "lucide-react";

function LockerPortfolioSavingsGoals() {
	return (
		<div className="flex h-full w-full flex-col">
			<p className="font-bold">Savings Goals</p>
			<div className="mt-3 flex h-full w-full flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center space-y-2">
					<p className="rounded-sm bg-gray-300 p-3 text-center text-white sm:p-5">
						<PiggyBank size={28} />
					</p>
					<p className="text-sm">Coming soon!</p>
				</div>
			</div>
		</div>
	);
}

export default LockerPortfolioSavingsGoals;
