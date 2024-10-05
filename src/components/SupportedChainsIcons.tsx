import { supportedChains } from "@/data/constants/supportedChains";
import { getChainIconStyling } from "@/utils/getChainIconStyling";

import ChainIcon from "./ChainIcon";

export default function SupportedChainsIcons() {
	return supportedChains.map((chain, index) => (
		<div
			key={chain.id}
			className="bg-light-100 flex w-full items-center rounded-full"
			style={{ zIndex: index * 10 }}
		>
			<div
				className={`flex size-7 shrink-0 items-center justify-center rounded-full ${getChainIconStyling(chain.id)}`}
			>
				<ChainIcon
					className="flex items-center justify-center"
					chainId={chain.id}
					size={16}
				/>
			</div>
		</div>
	));
}
