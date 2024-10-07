import { formatUnits, parseUnits } from "viem";

import { errors } from "@/data/constants/errorMessages";
import { Token } from "@/types";

export interface ICurrencyInput {
	isLoading: boolean;
	setAmount: (value: bigint) => void;
	amountInput: string;
	setAmountInput: (value: string) => void;
	maxAmount: bigint;
	token: Token;
	setErrorMessage: (errorMessage: string) => void;
	disabled: boolean;
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
				try {
					const parsedAmount = parseUnits(
						amountString,
						token.decimals
					);
					setAmount(parsedAmount);
				} catch (error) {
					setErrorMessage(errors.INVALID_AMOUNT);
				}
			}
		}

		setAmountInput(amountString);
	};

	const handleMaxAmountClick = () => {
		if (maxAmount) {
			const maxAmountString = formatUnits(maxAmount, token.decimals);
			setAmountInput(maxAmountString);
			setAmount(maxAmount);
		}
	};

	return (
		<div className="border-light-200 focus-within:border-light-600 flex h-12 w-full items-center rounded-md border p-2 text-xs">
			<input
				className="h-full w-full text-start text-gray-500 outline-none"
				type="text"
				pattern="[0-9]*\.?[0-9]*"
				inputMode="decimal"
				placeholder="0.00"
				onWheel={(event) => (event.target as HTMLInputElement).blur()}
				autoComplete="off"
				value={amountInput}
				onInput={handleChange} // Make sure the state update happens within an event handler
				disabled={isLoading || disabled}
			/>

			<span className="text-light-600 ml-2">{token.symbol}</span>
			<div className="flex items-center justify-center pl-1 pr-2">
				<button
					className="rounded-xl bg-locker-50 px-2 py-1 text-xxs hover:bg-locker-200"
					onClick={handleMaxAmountClick}
					disabled={isLoading || disabled}
				>
					Max
				</button>
			</div>
		</div>
	);
}

export default CurrencyInput;
