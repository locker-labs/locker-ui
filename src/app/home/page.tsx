import LockerPortfolio from "@/components/LockerPortfolio";
import Main from "@/components/Main";

async function HomePage() {
	return (
		<div className="min-h-[100vh] w-full bg-locker-25 text-dark-500">
			<Main>
				<LockerPortfolio />
			</Main>
		</div>
	);
}

export default HomePage;
