import { isAddress } from "viem";

export interface IAddressInput {
	sendToAddress: string;
	setSendToAddress: (value: string) => void;
	isLoading: boolean;
	setErrorMessage: (errorMessage: string) => void;
}

function AddressInput({
	sendToAddress,
	setSendToAddress,
	isLoading,
	setErrorMessage,
}: IAddressInput) {
	const handleInputChange = (input: string) => {
		setSendToAddress(input);

		const isAddressValid = isAddress(input as `0x${string}`);

		if (input.length > 0 && !isAddressValid) {
			setErrorMessage("Invalid address.");
		} else {
			setErrorMessage("");
		}
	};

	return (
		<div className="flex h-12 w-full items-center rounded-md border border-light-200 bg-light-100 p-2 focus-within:border-light-600 dark:border-dark-200 dark:bg-dark-500 dark:focus-within:border-light-600">
			<input
				className="h-full w-full bg-light-100 text-start text-sm outline-none dark:bg-dark-500"
				type="text"
				inputMode="text"
				autoComplete="off"
				placeholder="0x..."
				value={sendToAddress}
				onChange={(event) => handleInputChange(event.target.value)}
				disabled={isLoading}
			/>
		</div>
	);
}

export default AddressInput;
