interface IPercentInput {
	value: string;
	disabled: boolean;
	onInput: (event: React.FormEvent<HTMLInputElement>) => void;
}

function PercentInput({ value, onInput, disabled }: IPercentInput) {
	return (
		<div className="flex items-center rounded border border-light-200 bg-light-100 p-1 focus-within:border-light-600">
			<input
				className={`${disabled && "cursor-not-allowed bg-light-100"} w-12 bg-light-100 text-center outline-none `}
				type="text"
				pattern="[0-9]*"
				inputMode="numeric"
				placeholder="0"
				onWheel={(event) => (event.target as HTMLInputElement).blur()}
				autoComplete="off"
				value={value}
				onInput={onInput}
				disabled={disabled}
			/>
			<span className="select-none">%</span>
		</div>
	);
}

export default PercentInput;
