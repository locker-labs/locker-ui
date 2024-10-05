/* eslint-disable react/require-default-props */
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";

import Tooltip from "@/components/Tooltip";

export interface ISelectionButton {
	isSelected: boolean;
	label: string;
	tip: string;
	onClick: () => void;
	disabled?: boolean;
}

function ChannelSelectButton({
	isSelected,
	label,
	tip,
	onClick,
	disabled = false,
}: ISelectionButton) {
	return (
		<button
			className={`shadow-light-600 flex w-full items-center rounded-md border p-3 shadow-sm dark:shadow-none ${isSelected ? "border-secondary-100 dark:border-primary-100 dark:bg-dark-400" : "border-light-200 bg-light-200/30 dark:border-dark-200 dark:bg-dark-400/50"}`}
			onClick={onClick}
			disabled={disabled}
		>
			<input
				type="checkbox"
				checked={isSelected}
				onChange={() => {}} // Need this to prevent read-only field
				className="absolute opacity-0"
			/>
			{isSelected ? (
				<IoCheckmarkCircle
					className="shrink-0 text-success"
					size={25}
				/>
			) : (
				<MdOutlineRadioButtonUnchecked
					className="text-light-600 shrink-0"
					size={25}
				/>
			)}
			<span className="ml-3 flex h-7 items-center whitespace-normal text-sm xs:whitespace-nowrap xs:text-[16px]">
				{label}
			</span>
			<div className="ml-2">
				<Tooltip width="w-36" label={tip} placement="auto-end">
					<span className="text-xs">ⓘ</span>
				</Tooltip>
			</div>
		</button>
	);
}

export default ChannelSelectButton;
