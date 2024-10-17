import { IoChevronDown, IoWarningOutline } from "react-icons/io5";
import { useAccount } from "wagmi";

import ChainIcon from "@/components/ChainIcon";
import Tooltip from "@/components/Tooltip";
import { getChainNameFromChainObj } from "@/utils/getChainName";
import { isChainSupported } from "@/utils/isChainSupported";

function Button({ open, showName }: { open: boolean; showName: boolean }) {
	const { chain } = useAccount();

	const buttonContent = (
		<div className="flex size-full justify-between space-x-1 rounded-full p-2">
			<div className="flex space-x-3">
				<div className="flex size-7 items-center justify-center rounded-full">
					{chain && isChainSupported(chain.id) ? (
						<ChainIcon
							className="flex items-center justify-center"
							chainId={chain.id}
						/>
					) : (
						<IoWarningOutline size={16} />
					)}
				</div>
				<div>
					{showName && (
						<span className="text-sm text-black">
							{chain
								? getChainNameFromChainObj(chain)
								: "Invalid chain"}
						</span>
					)}
				</div>
			</div>

			<div>
				<IoChevronDown
					className={`${open && "rotate-180 transform"} hidden xs:flex xs:shrink-0`}
					size={16}
				/>
			</div>
		</div>
	);

	return chain && isChainSupported(chain.id) ? (
		buttonContent
	) : (
		<Tooltip marginTop="mt-4" label="'s current network is unsupported.">
			{buttonContent}
		</Tooltip>
	);
}

export default Button;
