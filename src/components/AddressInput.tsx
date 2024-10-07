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
		<div className="flex w-full items-center rounded-md border border-gray-300 p-2 text-xs text-gray-500 focus-within:border-gray-200">
			<input
				className="h-full w-full text-start text-sm outline-none"
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
