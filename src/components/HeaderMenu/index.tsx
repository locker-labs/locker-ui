import { useClerk } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GrConnect } from "react-icons/gr";
import {
	IoCheckboxOutline,
	IoCopyOutline,
	IoLogOutOutline,
	IoSettingsOutline,
	IoWalletOutline,
	IoWarningOutline,
} from "react-icons/io5";
import { useAccount, useBalance, useDisconnect } from "wagmi";

import ChainIcon from "@/components/ChainIcon";
import Button from "@/components/HeaderMenu/Button";
import { paths } from "@/data/constants/paths";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { isChainSupported } from "@/utils/isChainSupported";
import { truncateAddress } from "@/utils/truncateAddress";

function HeaderMenu() {
	const [copied, setCopied] = useState<boolean>(false);

	const router = useRouter();
	const { signOut } = useClerk();
	const { address, chain, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { data: balance } = useBalance({
		address,
	});

	const connectedItems = (
		<>
			<div className="flex w-full items-center p-2">
				{chain && isChainSupported(chain.id) ? (
					<>
						<ChainIcon
							className="mr-3 flex shrink-0 items-center justify-center"
							chainId={chain.id}
							size="16px"
						/>
						<span className="whitespace-nowrap">
							{parseFloat(balance?.formatted as string).toFixed(
								7
							)}{" "}
							{balance?.symbol}
						</span>
					</>
				) : (
					<>
						<IoWarningOutline
							className="mr-3 flex shrink-0 items-center justify-center text-error"
							size="16px"
						/>
						<span className="whitespace-nowrap">
							Unsupported network
						</span>
					</>
				)}
			</div>
			<div className="flex w-full flex-col">
				<button
					className="hover:bg-light-300 flex w-full items-center p-2 outline-none "
					onClick={() =>
						copyToClipboard(address as string, setCopied)
					}
				>
					{copied ? (
						<IoCheckboxOutline
							className="mr-3 flex shrink-0 items-center justify-center text-success"
							size="16px"
						/>
					) : (
						<IoCopyOutline
							className="mr-3 flex shrink-0 items-center justify-center"
							size="16px"
						/>
					)}
					<span>{truncateAddress(address as `0x${string}`)}</span>
				</button>
			</div>
		</>
	);

	const disconnectedItems = (
		<Menu.Item>
			{({ active }) => (
				<button
					className={`${
						active && "bg-light-300"
					} flex w-full items-center p-2`}
				>
					<IoWalletOutline
						className="mr-3 flex shrink-0 items-center justify-center"
						size="16px"
					/>
					<span className="whitespace-nowrap">Connect wallet</span>
				</button>
			)}
		</Menu.Item>
	);

	return (
		<Menu as="div" className="relative inline-block text-left">
			{({ open }) => (
				<>
					<Menu.Button className="bg-light-200 hover:bg-light-300 z-10 flex h-10 w-fit shrink-0 items-center justify-center rounded-full px-2 ">
						<Button open={open} />
					</Menu.Button>
					<Transition show={open}>
						<Menu.Items className="bg-light-200 absolute right-0 z-50 mt-3 w-fit origin-top-right rounded-xl p-1 text-sm outline-none ">
							{isConnected ? connectedItems : disconnectedItems}
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active && "bg-light-300"
										} flex w-full items-center p-2`}
										onClick={() =>
											router.push(paths.ACCOUNT)
										}
									>
										<IoSettingsOutline
											className="mr-3 flex shrink-0 items-center justify-center"
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
											"bg-light-300 rounded-b-xl"
										} flex w-full items-center p-2`}
										onClick={() => disconnect()}
									>
										<GrConnect
											className="mr-3 flex shrink-0 items-center justify-center"
											size="16px"
										/>
										<span>Disconnect</span>
									</button>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active &&
											"bg-light-300 rounded-b-xl"
										} flex w-full items-center p-2`}
										onClick={() =>
											signOut(() =>
												router.push(paths.LANDING)
											)
										}
									>
										<IoLogOutOutline
											className="mr-3 flex shrink-0 items-center justify-center"
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
