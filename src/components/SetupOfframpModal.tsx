import { TriangleAlert } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function SetupOfframpModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="flex flex-row items-center justify-center rounded-xl px-2 text-xs outline outline-2 outline-gray-300">
					<TriangleAlert color="white" fill="#FFA336" size={20} />
					<span className="ml-1 font-semibold">Finish setup</span>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Identity verification</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you
						are done.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-6 flex h-full w-full flex-col items-center justify-center">
					{/* <iframe
						className="flex h-[600px] w-full"
						title="Beam Identity Verification Form"
						src={offrampUrl}
					/> */}
				</div>
				<DialogFooter />
			</DialogContent>
		</Dialog>
	);
}
