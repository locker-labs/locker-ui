interface IPercentInput {
	value: string;
	disabled: boolean;
	onInput: (event: React.FormEvent<HTMLInputElement>) => void;
}

function PercentInput({ value, onInput, disabled }: IPercentInput) {
	return (
		<div className="flex items-center rounded border border-light-200 p-2 focus-within:border-light-600 dark:border-dark-200 dark:focus-within:border-light-600">
			<input
				className={`${disabled && "cursor-not-allowed"} w-12 text-center outline-none`}
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
			<span>%</span>
		</div>
	);
}

export default PercentInput;
