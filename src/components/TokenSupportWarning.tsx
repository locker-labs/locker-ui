import { IoWarningOutline } from "react-icons/io5";

function TokenSupportWarning() {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
				<IoWarningOutline size={16} />
			</div>
			<span className="text-light-600 mx-3 text-center text-xs">
				Only USDC is supported at the moment. Support for other ERC-20
				and native tokens is coming soon!
			</span>
			<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-warning/20 text-warning">
				<IoWarningOutline size={16} />
			</div>
		</div>
	);
}

export default TokenSupportWarning;
