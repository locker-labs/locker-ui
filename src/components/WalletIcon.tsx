/* eslint-disable react/prop-types */
import { FaWallet } from "react-icons/fa6";

export interface IWalletIcon {
	divSize?: string;
	iconSize?: string;
}

function WalletIcon({ divSize = "size-7", iconSize = "16px" }) {
	return (
		<div
			className={`flex ${divSize} shrink-0 items-center justify-center rounded-full bg-secondary-100/20 text-secondary-100`}
		>
			<FaWallet size={iconSize} />
		</div>
	);
}
export default WalletIcon;
