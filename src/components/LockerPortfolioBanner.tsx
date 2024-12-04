import Image from "next/image";

import EditAutomationsModal from "./EditAutomationsModal";

export default function LockerPortfolioBanner() {
	return (
		<div className="flex w-full flex-row justify-between space-x-2 rounded-md bg-[#F7F8FF] p-2">
			<div className="flex flex-row space-x-2">
				<Image
					src="/assets/efrog.svg"
					className="rounded-sm"
					alt="Efrogs giveaway"
					width={80}
					height={80}
				/>
				<div className="flex flex-col justify-center">
					<p className="font-bold">Efrog NFT Giveaway</p>
					<p className="text-xs">
						Set and reach an Efrog savings goal. If you buy one,
						you&apos;ll be eligible to win another.
					</p>
				</div>
			</div>
			<div className="flex flex-col justify-center">
				<EditAutomationsModal
					button={
						<button className="rounded-md bg-locker-600 px-6 py-3 text-xs font-semibold text-white">
							Set goal
						</button>
					}
				/>
			</div>
		</div>
	);
}
