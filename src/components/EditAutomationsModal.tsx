import { Pencil } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function EditAutomationsModal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="outline-solid flex cursor-pointer flex-row items-center justify-center rounded-md px-2 py-1 text-sm outline outline-gray-300">
					<Pencil size={14} />
					<span className="lg:text-md ml-2 xs:text-xs lg:text-sm">
						Edit
					</span>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit automations</DialogTitle>
					<DialogDescription>
						Coming soon! Contact support@geeky.rocks for help today.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4" />
				<DialogFooter>
					{/* <Button type="submit">Save changes</Button> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
