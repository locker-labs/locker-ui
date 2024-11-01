import { useAuth } from "@clerk/nextjs";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useLocker } from "@/providers/LockerProvider";
import { createOfframp } from "@/services/lockers";

import Loader from "./Loader";

export function SetupOfframpModal() {
	const { getToken } = useAuth();
	const { locker } = useLocker();
	const [offrampUrl, setOfframpUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isIframeLoading, setIsIframeLoading] = useState<boolean>(false); // Loading state for iframe
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	// Handle the off-ramp creation process
	const handleOfframpCreation = async () => {
		const authToken = await getToken();
		if (authToken && locker?.address) {
			setIsLoading(true);
			const url = await createOfframp(authToken, locker.address);
			setOfframpUrl(`${url}&hideCloseIcon=true`);
			setIsLoading(false);

			// Only open the dialog after the offrampUrl is set
			if (url) {
				setIsDialogOpen(true);
				setIsIframeLoading(true); // Start iframe loading
			}
		}
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<button
					className={`flex flex-row items-center justify-center rounded-xl px-2 text-xs outline outline-1 outline-gray-300 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
					onClick={handleOfframpCreation}
					disabled={isLoading}
				>
					{isLoading ? (
						<Loader />
					) : (
						<>
							<TriangleAlert
								color="white"
								fill="#FFA336"
								size={16}
							/>
							<span className="ml-1 text-xxxs font-semibold">
								Finish setup
							</span>
						</>
					)}
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-1/2 max-h-[calc(100vh-200px)] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center">
						Identity verification
					</DialogTitle>
					<DialogDescription className="text-center">
						Your identity is securely verified with Beam. Offramp to
						your debit card in seconds once complete.{" "}
						<Link
							href="https://www.getbeam.cash/faq#ind-ob"
							className="text-locker-600"
						>
							Learn more.
						</Link>
					</DialogDescription>
				</DialogHeader>
				<div className="mt-6 flex h-full w-full flex-col items-center justify-center">
					{/* Display loader while iframe is loading */}
					{(isIframeLoading || isLoading) && (
						<Loader className="animate-spin" size={32} />
					)}
					{/* Only display the iframe if the offrampUrl is set */}
					{offrampUrl && (
						<iframe
							className={`flex h-[600px] w-full ${isIframeLoading ? "hidden" : "block"}`}
							title="Beam Identity Verification Form"
							src={offrampUrl}
							onLoad={() => setIsIframeLoading(false)} // Remove loading when iframe finishes loading
							onError={() => setIsIframeLoading(false)} // Handle loading error
						/>
					)}
				</div>
				<DialogFooter />
			</DialogContent>
		</Dialog>
	);
}
