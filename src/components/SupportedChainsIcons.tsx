import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming you have ShadCN's tooltip components
import { supportedChains } from "@/data/constants/supportedChains";
import { getChainNameFromId } from "@/utils/getChainName";

import ChainIcon from "./ChainIcon";

export default function SupportedChainsIcons() {
	return (
		<TooltipProvider>
			<div className="flex space-x-2">
				{supportedChains.map((chain, index) => (
					<Tooltip key={chain.id}>
						<TooltipTrigger asChild>
							<div
								className="bg-light-100 flex items-center rounded-full"
								style={{ zIndex: index * 10 }}
							>
								<div className="flex items-center justify-center rounded-full">
									<ChainIcon
										className="flex items-center justify-center"
										chainId={chain.id}
										size={32}
									/>
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{getChainNameFromId(chain.id)} ({chain.id})
							</p>
						</TooltipContent>
					</Tooltip>
				))}
			</div>
		</TooltipProvider>
	);
}
