import { IconReceive, IconSend } from "./Icons";

type ILockerPortfolioValue = {
	portfolioValue: string;
};

function LockerPortfolioValue({ portfolioValue }: ILockerPortfolioValue) {
	return (
		<div className="flex h-full flex-row justify-between rounded-md bg-white p-3">
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
	);
}

export default LockerPortfolioValue;
