/* eslint-disable prettier/prettier */

import "@aarc-xyz/deposit-widget/dist/style.css";
import { AarcProvider, useAarc } from "@aarc-xyz/deposit-widget";

import { getUsdcAddress } from "@/data/policies/usdc";
import { chainCodeNames } from "@/data/constants/supportedChains";
import { titleCaseWord } from "@/utils/strings";

export type IAarcButtonProps = {
	lockerAddress: string;
	chainId: number;
};

function AarcButtonContent() {
	const deposit = useAarc();
	return (
		<button
			onClick={() => deposit()}
			className="w-full rounded-md bg-primary-100 p-2"
		>
			Deposit USDC
		</button>
	);
}

function AarcButton({ lockerAddress, chainId }: IAarcButtonProps) {
	if (!chainId) return null;

	const chainName = titleCaseWord(chainCodeNames[chainId]);
	const destination = {
		walletAddress: lockerAddress,
		chainId: chainId,
		chainName,
		tokenAddress: getUsdcAddress(chainId),
		tokenSymbol: "USDC",
		tokenDecimals: 6,
	};

	const config = {
		options: {
			fetchOnlyDestinationBalance: true,
		},
		// onRamp: {
		// 	mode: "deposit",
		// 	sourceTokenData: {
		// 		sourceTokenCode: "USDC",
		// 		sourceTokenAmount: 10,
		// 	},
		// 	cryptoCurrencyData: {
		// 		cryptoCurrencyCode: "TRNSK",
		// 		cryptoCurrencyName: "Transak Test Token",
		// 		cryptoCurrencyImageURL:
		// 			"https://assets.coingecko.com/coins/images/11674/standard/aUSDC.png?1696511564",
		// 	},
		// 	exchangeScreenTitle:
		// 		"Deposit into your locker on chain " +
		// 		chainId +
		// 		": " +
		// 		lockerAddress,
		// },
		destination,
		appearance: {
			logoUrl:
				"https://github.com/chainrule-labs/locker-static/blob/f6d376111e427c179991e97060976e46cb924452/images/logo/logoLockerDarkLetters.png?raw=true",
			themeColor: "#4C4EDD",
		},
		apiKeys: {
			aarcSDK: process.env.NEXT_PUBLIC_AARC_API_KEY || "",
		},
		onTransactionSuccess: (data: any) => {
			console.log("onTransactionSuccess", data);
		},
		onTransactionError: (data: any) => {
			console.log("onTransactionError", data);
		},
		onWidgetClose: () => {
			console.log("onWidgetClose");
		},
		onWidgetOpen: () => {
			console.log("onWidgetOpen");
		},
	};

	return (
		<AarcProvider config={config}>
			<AarcButtonContent />
		</AarcProvider>
	);
}

export default AarcButton;
