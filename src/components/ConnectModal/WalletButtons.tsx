/* eslint-disable default-case */
import Image from "next/image";
import { useConnect } from "wagmi";

import { filterConnectors } from "@/utils/filterConnectors";

export interface IWalletButtons {
	closeModal: () => void;
}

function WalletButtons({ closeModal }: IWalletButtons) {
	const { connect, connectors } = useConnect();

	const filteredConnectors = filterConnectors(connectors);

	return (
		<div className="flex w-full min-w-52 max-w-64 flex-col items-center justify-center space-y-2">
			{filteredConnectors.map((connector) => (
				<button
					className="bg-light-200 hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300 flex h-fit w-full min-w-44 items-center justify-center rounded-full p-2"
					key={connector.uid}
					onClick={() => {
						connect({ connector });
						closeModal();
					}}
				>
					<div className="flex w-36 items-center">
						<Image
							className="mr-4"
							src={connector.icon}
							alt={`${connector.name} Icon`}
							height={45}
							width={45}
						/>
						<span className="whitespace-nowrap">
							{connector.label}
						</span>
					</div>
				</button>
			))}
		</div>
	);
}

export default WalletButtons;
