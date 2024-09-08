/* eslint-disable react/require-default-props */
import { formatUnits, parseUnits } from "viem";

import { errors } from "../data/constants/errorMessages";
import { Token } from "../types";

export interface ICurrencyInput {
	isLoading: boolean;
	setAmount: (value: bigint) => void;
	amountInput: string;
	setAmountInput: (value: string) => void;
	maxAmount: bigint;
	token: Token;
	setErrorMessage: (errorMessage: string) => void;
	disabled?: boolean;
}

function CurrencyInput({
	isLoading,
	setAmount,
	amountInput,
	setAmountInput,
	maxAmount,
	token,
	setErrorMessage,
	disabled = false,
}: ICurrencyInput) {
	// Handle validity of input based on pattern defined in <input> element
	const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		let amountString = target.validity.valid ? target.value : amountInput;

		if (amountString === "") {
			setAmount(BigInt(0));
		} else if (amountString !== ".") {
			if (amountString[0] === ".") {
				amountString = `0${amountString}`;
			}

			const components = amountString.split(".");
			const decimals = components[1];

			if (decimals && decimals.length > token.decimals) {
				setErrorMessage(errors.TOO_MANY_DECIMALS);
			} else {
				setErrorMessage("");
				setAmount(parseUnits(amountString, token.decimals));
			}
		}
		setAmountInput(amountString);
	};

	const handleMaxAmountClick = () => {
		if (maxAmount) {
			setAmountInput(formatUnits(maxAmount, token.decimals));
			setAmount(maxAmount);
		}
	};

	return (
		<div className="flex h-12 w-full items-center rounded-md border border-light-200 bg-light-100 p-2 focus-within:border-light-600 dark:border-dark-200 dark:bg-dark-500 dark:focus-within:border-light-600">
			<input
				className="h-full w-full bg-light-100 text-start outline-none dark:bg-dark-500"
				type="text"
				pattern="[0-9]*\.?[0-9]*"
				inputMode="decimal"
				placeholder="0.00"
				onWheel={(event) => (event.target as HTMLInputElement).blur()}
				autoComplete="off"
				value={amountInput}
				onInput={(event) => handleChange(event)}
				disabled={isLoading || disabled}
			/>
			<div className="flex items-center justify-center pl-1 pr-2">
				<button
					className="rounded-lg bg-light-200 px-2 py-1 text-xs hover:text-secondary-100 dark:bg-dark-400 dark:hover:text-primary-100"
					onClick={() => handleMaxAmountClick()}
					disabled={isLoading || disabled}
				>
					Max
				</button>
			</div>
			<span className="ml-2 text-sm text-light-600">{token.symbol}</span>
		</div>
	);
}

export default CurrencyInput;
