import { useClerk } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { GrConnect } from "react-icons/gr";
import {
	IoLogOutOutline,
	IoSettingsOutline,
	IoWalletOutline,
	IoWarningOutline,
} from "react-icons/io5";
import { useAccount, useDisconnect } from "wagmi";

import ChainIcon from "@/components/ChainIcon";
import Button from "@/components/HeaderMenu/Button";
import { paths } from "@/data/constants/paths";
import { isChainSupported } from "@/utils/isChainSupported";
import { truncateAddressShort } from "@/utils/truncateAddress";

function HeaderMenu() {
	const router = useRouter();
	const { signOut } = useClerk();
	const { address, chain, isConnected } = useAccount();
	const { disconnect } = useDisconnect();

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
						<span className="whitespace-nowrap">{chain.name}</span>
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
			<div className="flex w-full flex-row items-center p-2">
				<Wallet className="mr-3 flex h-[16px] w-[16px] shrink-0 items-center justify-center" />
				<span>{truncateAddressShort(address as `0x${string}`)}</span>
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
					<Menu.Button className="z-10 flex h-10 w-fit shrink-0 items-center justify-center rounded-full bg-white px-2 hover:bg-gray-300 ">
						<Button open={open} />
					</Menu.Button>
					<Transition show={open}>
						<Menu.Items className="absolute right-0 z-50 mt-3 w-fit origin-top-right rounded-xl bg-white p-1 text-sm outline-none ">
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
