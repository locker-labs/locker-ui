import Image from "next/image";

export default function Loading() {
	return (
		<main className="flex flex-col items-center justify-center space-y-8 bg-locker-25 py-20 sm:p-4 lg:px-6 xl:px-8">
			<header className="relative top-0 z-10 w-full max-w-[55rem]">
				<div className="flex items-center justify-between">
					<Image
						src="/assets/locker/logoBeta.svg"
						alt="Locker logo"
						priority
						width={140}
						height={45}
					/>
				</div>
			</header>
			<div className="flex h-full w-full max-w-[55rem] animate-pulse items-center justify-center">
				<img
					src="/assets/loaders/portfolioLoaderDesktop.svg"
					className="hidden sm:flex"
					alt="Loading..."
				/>
				<img
					src="/assets/loaders/portfolioLoaderMobile.svg"
					className="sm:hidden"
					alt="Loading..."
				/>
			</div>
		</main>
	);
}
