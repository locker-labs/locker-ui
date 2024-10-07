/* eslint-disable react/require-default-props */
import { Listbox, Transition } from "@headlessui/react";
import { useState } from "react";
import {
	IoCheckboxOutline,
	IoChevronDown,
	IoCopyOutline,
} from "react-icons/io5";
import { formatUnits, zeroAddress } from "viem";

import ChainIcon from "@/components/ChainIcon";
import { Token } from "@/types";
import { copyToClipboard } from "@/utils/copytoClipboard";
import { getChainIconStyling } from "@/utils/getChainIconStyling";

export interface ITokenDropdown {
	tokens: Token[];
	selectedToken: Token;
	setSelectedToken: (token: Token) => void;
	disabled?: boolean;
}

function TokenDropdown({
	tokens,
	selectedToken,
	setSelectedToken,
	disabled = false,
}: ITokenDropdown) {
	const [copied, setCopied] = useState<boolean>(false);
	const [copiedSymbol, setCopiedSymbol] = useState<string>("");
	if (!selectedToken) return null;

	return (
		<Listbox
			as="div"
			className="flex h-12 w-full flex-col items-center justify-center rounded-md"
			value={selectedToken}
			onChange={setSelectedToken}
			disabled={disabled}
		>
			{({ open }) => (
				<div className="relative h-full w-full">
					<span className="inline-block h-full w-full">
						<Listbox.Button className="flex h-12 w-full items-center justify-between rounded-md border border-gray-200 bg-gray-100 p-2 hover:border-gray-600  dark:hover:border-gray-600">
							<div className="flex items-center justify-center">
								<div
									className={`mr-4 flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(selectedToken.chainId)}`}
								>
									<ChainIcon
										className="flex items-center justify-center"
										chainId={selectedToken.chainId}
										size="16px"
									/>
								</div>
								<div className="flex w-full flex-col items-start">
									<span className="flex items-center justify-center text-sm font-semibold">
										{selectedToken.symbol}
									</span>
									<span className="text-xs">
										<span className="text-gray-400">
											Balance:
										</span>{" "}
										<span className="text-gray-700">
											{formatUnits(
												BigInt(selectedToken.balance),
												selectedToken.decimals
											)}
										</span>
									</span>
								</div>
							</div>
							<IoChevronDown
								className={`${open && "rotate-180 transform"} shrink-0`}
								size="20px"
							/>
						</Listbox.Button>
					</span>
					<Transition
						show={open}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options
							static
							className={`${
								open && "relative z-10"
							} mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-gray-100 bg-white outline-none`}
						>
							{tokens.map((token) => (
								<Listbox.Option
									key={`${token.address}${token.symbol}${token.chainId}`}
									value={token}
								>
									{({ selected, active }) => (
										<div
											className={`${
												active ? "bg-gray-200" : ""
											} ${
												selected &&
												!active &&
												"bg-gray-200/50"
											} relative flex h-12 w-full cursor-pointer select-none items-center justify-start p-2 pr-4`}
										>
											<div className="flex w-full items-center justify-between">
												<div className="flex items-center justify-center">
													<div
														className={`mr-4 flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(token.chainId)}`}
													>
														<ChainIcon
															className="flex items-center justify-center"
															chainId={
																token.chainId
															}
															size="16px"
														/>
													</div>
													<div className="flex w-full flex-col items-start">
														<span className="text-sm">
															{token.symbol}
														</span>
														<span className="text-xs">
															<span className="text-gray-400">
																Balance:
															</span>{" "}
															<span className="text-gray-700">
																{formatUnits(
																	BigInt(
																		token.balance
																	),
																	token.decimals
																)}
															</span>
														</span>
													</div>
												</div>
												{token.address !==
													zeroAddress && (
													<button
														className="hover:text-secondary-100 flex h-12 items-center justify-center outline-none"
														onClick={(e) => {
															e.stopPropagation();
															setCopiedSymbol(
																`${token.chainId}-${token.address}`
															);
															copyToClipboard(
																token.address,
																setCopied
															);
														}}
													>
														<div className="flex h-10 w-12 items-center justify-center">
															{copied &&
															copiedSymbol ===
																`${token.chainId}-${token.address}` ? (
																<IoCheckboxOutline
																	className="text-success"
																	size="15px"
																/>
															) : (
																<IoCopyOutline size="15px" />
															)}
														</div>
													</button>
												)}
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

export default TokenDropdown;
