/* eslint-disable react/prop-types */
import { FaPiggyBank } from "react-icons/fa6";

export interface ISaveIcon {
	divSize?: string;
	iconSize?: string;
}

function SaveIcon({ divSize = "size-7", iconSize = "16px" }) {
	return (
		<div
			className={`flex ${divSize} bg-primary-100/20 text-primary-100 shrink-0 items-center justify-center rounded-full`}
		>
			<FaPiggyBank size={iconSize} />
		</div>
	);
}
export default SaveIcon;
