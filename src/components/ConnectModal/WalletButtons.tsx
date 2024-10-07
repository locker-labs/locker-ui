import * as DialogPrimitive from "@radix-ui/react-dialog"; // Importing Radix Dialog components
import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";

import { Button } from "@/components/ui/button";
import { filterConnectors } from "@/utils/filterConnectors";

function WalletButtons() {
	const { connect, connectors, isSuccess } = useConnect(); // Check connection success status
	const [connecting, setConnecting] = useState(false);

	const filteredConnectors = filterConnectors(connectors);

	useEffect(() => {
		if (isSuccess) {
			setConnecting(false);
		}
	}, [isSuccess]);

	return (
		<div className="flex w-full flex-col items-center justify-center space-y-2">
			{filteredConnectors.map((connector) => (
				<DialogPrimitive.Close asChild key={connector.uid}>
					<Button
						variant="ghost"
						className="border-1 flex h-fit w-full items-center justify-center rounded-sm border border-gray-300 bg-gray-50 p-1 hover:bg-gray-300"
						disabled={connecting}
						onClick={() => {
							setConnecting(true);
							connect({ connector });
						}}
					>
						<div className="flex items-center">
							<Image
								className="mr-4"
								src={connector.icon}
								alt={`${connector.name} Icon`}
								height={45}
								width={45}
							/>
							<span className="whitespace-nowrap text-sm font-semibold">
								{connector.label}
							</span>
						</div>
					</Button>
				</DialogPrimitive.Close>
			))}
		</div>
	);
}

export default WalletButtons;
