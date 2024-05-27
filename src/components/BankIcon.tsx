/* eslint-disable react/prop-types */
import { PiBankFill } from "react-icons/pi";

export interface IBankIcon {
	divSize?: string;
	iconSize?: string;
}

function BankIcon({ divSize = "size-7", iconSize = "16px" }) {
	return (
		<div
			className={`flex ${divSize} shrink-0 items-center justify-center rounded-full bg-success/20 text-success`}
		>
			<PiBankFill size={iconSize} />
		</div>
	);
}
export default BankIcon;
