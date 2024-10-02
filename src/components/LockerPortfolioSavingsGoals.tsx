import { PiggyBank } from "lucide-react";

function LockerPortfolioSavingsGoals() {
	return (
		<div className="flex h-full w-full flex-col">
			<p className="text-lg font-bold">Savings Goals</p>
			<div className="flex h-full w-full flex-col items-center justify-center xxs:mt-3">
				<div className="flex flex-col items-center justify-center space-y-2">
					<p className="rounded-sm bg-gray-300 text-center text-white xxs:p-3 sm:p-5">
						<PiggyBank size={28} />
					</p>
					<p>Coming soon!</p>
				</div>
			</div>
		</div>
	);
}

export default LockerPortfolioSavingsGoals;
