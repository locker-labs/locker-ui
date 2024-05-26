import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";

export interface ISelectionButton {
	isSelected: boolean;
	label: string;
	onClick: () => void;
}

function ChannelSelectButton({ isSelected, label, onClick }: ISelectionButton) {
	return (
		<button
			className={`flex w-full items-center rounded-md border p-3 shadow-sm shadow-light-600 dark:shadow-none ${isSelected ? "border-secondary-100 dark:border-primary-100 dark:bg-dark-400" : "border-light-200 bg-light-200/30 dark:border-dark-200 dark:bg-dark-400/50"}`}
			onClick={onClick}
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
					className="text-light-600"
					size={25}
				/>
			)}
			<span className="ml-3 flex h-7 items-center whitespace-normal text-sm xs:whitespace-nowrap xs:text-[16px]">
				{label}
			</span>
		</button>
	);
}

export default ChannelSelectButton;
