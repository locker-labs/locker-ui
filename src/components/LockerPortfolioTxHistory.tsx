import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Token } from "@/types";

import AutomateChainsModal from "./AutomateChainsModal";
import LockerPortfolioTokens from "./LockerPortfolioTokens";
import LockerPortfolioTxHistoryTab from "./LockerPortfolioTxHistoryTab";

type ILockerPortfolioTxHistory = {
	tokens: Token[];
};

export default function LockerPortfolioTxHistory({
	tokens,
}: ILockerPortfolioTxHistory) {
	return (
		<>
			<div className="sm:hidden">
				<Tabs defaultValue="tokens">
					<TabsList className="text-semibold grid w-full grid-cols-2 text-xxs">
						<TabsTrigger value="tokens">Tokens</TabsTrigger>
						<TabsTrigger value="history">History</TabsTrigger>
					</TabsList>
					<TabsContent value="tokens">
						<div className="my-4 w-full">
							<AutomateChainsModal />
						</div>
						<LockerPortfolioTokens tokens={tokens} />
					</TabsContent>

					<TabsContent value="history">
						<LockerPortfolioTxHistoryTab />
					</TabsContent>
				</Tabs>
			</div>
			<div className="hidden h-full w-full flex-col space-y-7 sm:flex">
				<p className="font-bold">Transaction History</p>
				<LockerPortfolioTxHistoryTab />
			</div>
		</>
	);
}
