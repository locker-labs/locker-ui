"use client";

import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useAccount, useSwitchChain } from "wagmi";
import type { Chain } from "wagmi/chains";

import Button from "@/components/ChainDropdown/Button";
import ChainIcon from "@/components/ChainIcon";
import { supportedChains } from "@/data/constants/supportedChains";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { getChainNameFromChainObj } from "@/utils/getChainName";
import { isChainSupported } from "@/utils/isChainSupported";

type IChainDropdown = {
	showName: boolean;
};

function ChainDropdown({ showName }: IChainDropdown = { showName: false }) {
	const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
	const { chain } = useAccount();
	const { switchChain, isPending } = useSwitchChain();

	useEffect(() => {
		if (chain && isChainSupported(chain.id)) {
			setSelectedChain(chain);
		} else {
			setSelectedChain(null);
		}
	}, [chain]);

	useEffect(() => {
		if (selectedChain && selectedChain?.id !== chain?.id) {
			switchChain({ chainId: selectedChain?.id });
		}
	}, [selectedChain]);

	return (
		<Listbox
			as="div"
			className="relative inline-block text-left"
			value={selectedChain}
			onChange={setSelectedChain}
		>
			{({ open }) => (
				<div className="relative">
					<Listbox.Button className="z-10 flex h-10 w-fit shrink-0 items-center justify-center rounded-md bg-light-200 px-2 hover:bg-light-300 ">
						{!isPending ? (
							<Button open={open} showName={showName} />
						) : (
							<span className="text-sm">Loading...</span>
						)}
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute right-0 z-50 mt-3 max-h-60 w-fit origin-top-right overflow-auto rounded-xl bg-light-200 p-1 text-sm outline-none">
							{supportedChains.map((chainOption, index) => (
								<Listbox.Option
									key={chainOption.id}
									value={chainOption}
								>
									{({ selected, active }) => (
										<div
											className={`${
												active && "bg-light-300"
											} flex w-full cursor-pointer select-none items-center justify-between p-2 ${
												index === 0 && "rounded-t-xl"
											} ${index === supportedChains.length - 1 && "rounded-b-xl"}`}
										>
											<div className="flex w-32 items-center">
												<div
													className={`flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(chainOption.id)}`}
												>
													<ChainIcon
														className="flex items-center justify-center"
														chainId={chainOption.id}
														size="16px"
													/>
												</div>
												<span className="ml-3 whitespace-nowrap">
													{getChainNameFromChainObj(
														chainOption
													)}
												</span>
											</div>
											<div className="flex items-center justify-center text-secondary-100">
												{selected ? (
													<FaCheck size={18} />
												) : null}
											</div>
										</div>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			)}
		</Listbox>
	);
}

export default ChainDropdown;
