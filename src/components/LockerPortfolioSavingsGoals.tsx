import { PiggyBank } from "lucide-react";

function LockerPortfolioSavingsGoals() {
	return (
		<div className="flex h-full w-full flex-col">
			<p className="text-lg font-bold">Savings goals</p>
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center space-y-2">
					<p className="rounded-sm bg-gray-300 p-5 text-center text-white">
						<PiggyBank size={28} />
					</p>
					<p>Coming soon!</p>
				</div>
			</div>
		</div>
	);
}

export default LockerPortfolioSavingsGoals;
