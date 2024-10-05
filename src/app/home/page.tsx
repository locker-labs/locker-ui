import LockerPortfolio from "@/components/LockerPortfolio";
import Main from "@/components/Main";

async function HomePage() {
	return (
		<div className="text-dark-500 min-h-[100vh] w-full bg-locker-25">
			<Main>
				<LockerPortfolio />
			</Main>
		</div>
	);
}

export default HomePage;
