import { useClerk } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoLogOutOutline,
	IoSettingsOutline,
	IoWarningOutline,
} from "react-icons/io5";
import { useAccount, useBalance, useDisconnect } from "wagmi";

import ChainIcon from "@/components/ChainIcon";
import Button from "@/components/HeaderMenu/Button";
import { PATHS } from "@/data/constants/paths";
import { supportedChains } from "@/data/constants/supportedChains";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { truncateAddress } from "@/utils/truncateAddress";

function HeaderMenu() {
	const [copied, setCopied] = useState<boolean>(false);

	const router = useRouter();
	const { signOut } = useClerk();
	const { address, chain } = useAccount();
	const { disconnect } = useDisconnect();
	const { data: balance } = useBalance({
		address,
	});

	const chainIcon = () => {
		switch (chain?.id) {
			case supportedChains.ARBITRUM.id:
				return (
					<ChainIcon
						className="mr-3 flex items-center justify-center"
						name="ArbitrumIcon"
						size="16px"
					/>
				);

			case supportedChains.OPTIMISM.id:
				return (
					<ChainIcon
						className="mr-3 flex items-center justify-center"
						name="OptimismIcon"
						size="16px"
					/>
				);
			case supportedChains.POLYGON.id:
				return (
					<ChainIcon
						className="mr-3 flex items-center justify-center"
						name="PolygonIcon"
						size="16px"
					/>
				);

			case supportedChains.AVALANCHE.id:
				return (
					<ChainIcon
						className="mr-3 flex items-center justify-center"
						name="AvalancheIcon"
						size="16px"
					/>
				);

			case supportedChains.SEPOLIA.id:
				return (
					<ChainIcon
						className="mr-3 flex items-center justify-center"
						name="EthereumIcon"
						size="16px"
					/>
				);

			default:
				return (
					<IoWarningOutline
						className="mr-3 flex items-center justify-center"
						size="16px"
					/>
				);
		}
	};

	const supportedChainIds = new Set(
		Object.values(supportedChains).map((chainObject) => chainObject?.id)
	);

	return (
		<Menu as="div" className="relative inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className="z-10 flex h-10 w-20 items-center justify-center rounded-full bg-light-200 outline-none hover:bg-light-300 dark:bg-dark-400 dark:hover:bg-dark-300">
						<Button />
					</Menu.Button>
					<Transition show={open}>
						<Menu.Items className="absolute right-0 z-50 mt-4 w-fit origin-top-right rounded-xl bg-light-200 p-1 text-sm outline-none dark:bg-dark-400">
							<div className="flex w-full items-center p-2">
								{chainIcon()}
								{chain?.id &&
								supportedChainIds.has(chain?.id) ? (
									<span className="whitespace-nowrap">
										{parseFloat(
											balance?.formatted as string
										).toFixed(7)}{" "}
										{balance?.symbol}
									</span>
								) : (
									<span className="whitespace-nowrap">
										Unsupported network
									</span>
								)}
							</div>
							<div className="flex w-full flex-col">
								<button
									className="flex w-full items-center p-2 outline-none hover:bg-light-300 dark:hover:bg-dark-300"
									onClick={() =>
										copyToClipboard(
											address as string,
											setCopied
										)
									}
								>
									{copied ? (
										<IoCheckboxOutline
											className="mr-3 flex items-center justify-center text-success"
											size="16px"
										/>
									) : (
										<IoCopyOutline
											className="mr-3 flex items-center justify-center"
											size="16px"
										/>
									)}
									<span>
										{truncateAddress(
											address as `0x${string}`
										)}
									</span>
								</button>
							</div>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active &&
											"bg-light-300 dark:bg-dark-300"
										} flex w-full items-center p-2`}
										onClick={() =>
											router.push(PATHS.ACCOUNT)
										}
									>
										<IoSettingsOutline
											className="mr-3 flex items-center justify-center"
											size="16px"
										/>
										<span>Account</span>
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active &&
											"rounded-b-xl bg-light-300 dark:bg-dark-300"
										} flex w-full items-center p-2`}
										onClick={() => {
											disconnect();
											signOut(() =>
												router.push(PATHS.LANDING)
											);
										}}
									>
										<IoLogOutOutline
											className="mr-3 flex items-center justify-center"
											size="16px"
										/>
										<span>Sign out</span>
									</button>
								)}
							</Menu.Item>
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	);
}

export default HeaderMenu;
