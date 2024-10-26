import Main from "@/components/Main";

export default function Loading() {
	return (
		<Main>
			<div className="flex h-full animate-pulse items-center justify-center">
				<img
					src="/assets/portfolioLoaderDesktop.svg"
					className="hidden sm:flex"
					alt="Loading..."
				/>
				<img
					src="/assets/portfolioLoaderMobile.svg"
					className="sm:hidden"
					alt="Loading..."
				/>
			</div>
		</Main>
	);
}
