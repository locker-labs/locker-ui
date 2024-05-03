"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { IoChevronBackOutline } from "react-icons/io5";

import { PATHS } from "@/data/paths";

function AccountPage() {
	const router = useRouter();
	const { resolvedTheme } = useTheme();

	return (
		<div className="flex w-full flex-1 flex-col items-center py-12">
			<div className="flex-col0 mb-8 flex w-full">
				<button
					className="h-10 w-fit hover:text-secondary-200 dark:hover:text-primary-100"
					onClick={() => router.push(PATHS.HOME)}
				>
					<div className="flex items-center justify-center space-x-1">
						<IoChevronBackOutline size={20} />
						<span>Home</span>
					</div>
				</button>
			</div>
			<UserProfile
				appearance={{
					baseTheme: resolvedTheme === "dark" ? dark : undefined,
				}}
			/>
		</div>
	);
}

export default AccountPage;
