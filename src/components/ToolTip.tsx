/* eslint-disable react/require-default-props */
import { type ReactNode } from "react";

export interface ITooltip {
	children: ReactNode;
	tip: string;
	top?: boolean;
}

function Tooltip({ children, tip, top }: ITooltip) {
	return (
		<div className="group relative inline-block h-full w-full text-left text-xs">
			{children}
			<span
				className={`${top && "-top-16"} invisible absolute -right-5 mt-4 w-fit rounded-xl bg-light-200 p-3 opacity-0 transition group-hover:visible group-hover:opacity-100 dark:bg-dark-400`}
			>
				{tip}
			</span>
		</div>
	);
}

export default Tooltip;
