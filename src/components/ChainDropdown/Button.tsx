import { IoChevronDown, IoWarningOutline } from "react-icons/io5";
import { useAccount } from "wagmi";

import ChainIcon from "@/components/ChainIcon";
import Tooltip from "@/components/ToolTip";
import { getChainIconStyling } from "@/utils/getChainIconStyling";
import { isChainSupported } from "@/utils/isChainSupported";

function Button() {
	const { chain } = useAccount();

	const chainIconStyling = chain
		? getChainIconStyling(chain.id)
		: "bg-error/20 text-error";

	const buttonContent = (
		<div className="flex size-full items-center justify-center space-x-1 rounded-full">
			<div
				className={`flex size-7 items-center justify-center rounded-full ${chainIconStyling}`}
			>
				{chain && isChainSupported(chain.id) ? (
					<ChainIcon
						className="flex items-center justify-center"
						chainId={chain.id}
						size="16px"
					/>
				) : (
					<IoWarningOutline size={16} />
				)}
			</div>
			<IoChevronDown className="hidden xs:flex xs:shrink-0" size={16} />
		</div>
	);

	return chain && isChainSupported(chain.id) ? (
		buttonContent
	) : (
		<Tooltip tip="Unsupported network">{buttonContent}</Tooltip>
	);
}

export default Button;
