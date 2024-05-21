import { useState } from "react";
import { parseUnits } from "viem";

import { Token } from "@/types";

export interface ICurrencyInput {
	isLoading: boolean;
	setAmount: (value: bigint) => void;
	token: Token;
	setErrorMessage: (errorMessage: string) => void;
}

function CurrencyInput({
	isLoading,
	setAmount,
	token,
	setErrorMessage,
}: ICurrencyInput) {
	const [amountInput, setAmountInput] = useState<string>("");

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
				setErrorMessage("Too many decimal places.");
			} else {
				setErrorMessage("");
				setAmount(parseUnits(amountString, token.decimals));
			}
		}
		setAmountInput(amountString);
	};

	return (
		<div className="flex items-center rounded border border-light-200 bg-light-100 p-2 focus-within:border-light-600 dark:border-dark-200 dark:bg-dark-500 dark:focus-within:border-light-600">
			<input
				className="w-full bg-light-100 text-start outline-none dark:bg-dark-500"
				type="text"
				pattern="[0-9]*\.?[0-9]*"
				inputMode="decimal"
				placeholder="0.00"
				onWheel={(event) => (event.target as HTMLInputElement).blur()}
				autoComplete="off"
				value={amountInput}
				onInput={(event) => handleChange(event)}
				disabled={isLoading}
			/>
			<span className="ml-2 text-light-600">{token.symbol}</span>
		</div>
	);
}

export default CurrencyInput;
