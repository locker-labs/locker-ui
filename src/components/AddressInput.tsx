/* eslint-disable react/require-default-props */
import { isAddress } from "viem";

import { errors } from "@/data/constants/errorMessages";

export interface IAddressInput {
	sendToAddress: string;
	setSendToAddress: (value: string) => void;
	isLoading: boolean;
	setErrorMessage: (errorMessage: string) => void;
	disabled?: boolean;
}

function AddressInput({
	sendToAddress,
	setSendToAddress,
	isLoading,
	setErrorMessage,
	disabled,
}: IAddressInput) {
	const handleInputChange = (input: string) => {
		setSendToAddress(input);

		const isAddressValid = isAddress(input as `0x${string}`);

		if (input.length > 0 && !isAddressValid) {
			setErrorMessage(errors.INVALID_ADDRESS);
		} else {
			setErrorMessage("");
		}
	};

	return (
		<div className="border-light-200 bg-light-100 focus-within:border-light-600 dark:border-dark-200 dark:bg-dark-500 dark:focus-within:border-light-600 flex h-12 w-full items-center rounded-md border p-2">
			<input
				className="bg-light-100 dark:bg-dark-500 h-full w-full text-start text-sm outline-none"
				type="text"
				inputMode="text"
				autoComplete="off"
				placeholder="0x..."
				value={sendToAddress}
				onChange={(event) => handleInputChange(event.target.value)}
				disabled={isLoading || disabled}
			/>
		</div>
	);
}

export default AddressInput;
