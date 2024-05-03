import { useClerk } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
	IoCopyOutline,
	IoLogOutOutline,
	IoSettingsOutline,
} from "react-icons/io5";

import ChainIcon from "@/components/ChainIcon";
import Button from "@/components/HeaderMenu/Button";
import { PATHS } from "@/data/paths";

function HeaderMenu() {
	const router = useRouter();
	const { signOut } = useClerk();

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
								<ChainIcon
									className="mr-3 flex items-center justify-center"
									name="EthereumIcon"
									size="16px"
								/>
								<span>0.00001 ETH</span>
							</div>
							<Menu.Item>
								{({ active }) => (
									<button
										className={`${
											active &&
											"bg-light-300 dark:bg-dark-300"
										} flex w-full items-center p-2`}
										onClick={() =>
											console.log("copy address")
										}
									>
										<IoCopyOutline
											className="mr-3 flex items-center justify-center"
											size="16px"
										/>
										<span>0xDe0...16f49</span>
									</button>
								)}
							</Menu.Item>
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
										onClick={() =>
											signOut(() =>
												router.push(PATHS.LANDING)
											)
										}
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
