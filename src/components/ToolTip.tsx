import { type ReactNode } from "react";

export interface ITooltip {
	children: ReactNode;
	tip: string;
}

function Tooltip({ children, tip }: ITooltip) {
	return (
		<div className="group relative inline-block h-full w-full text-left text-xs">
			{children}
			<span className="invisible absolute -right-20 mt-4 w-48 rounded-xl bg-light-200 p-2 opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-dark-400">
				{tip}
			</span>
		</div>
	);
}

export default Tooltip;
