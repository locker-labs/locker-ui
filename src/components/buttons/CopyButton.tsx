import { useState } from "react";
import { IoCheckboxOutline, IoCopyOutline } from "react-icons/io5";

import { copyToClipboard } from "@/utils/copytoClipboard";

export default function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState<boolean>(false);

	return (
		<div className="flex flex-row space-x-2 ">
			<div className="break-all rounded-sm border border-solid border-gray-300 p-2 text-left text-xs text-gray-900">
				<code>{text}</code>
			</div>
			<button
				className="flex flex-row items-center justify-center rounded-md bg-locker-600 p-2 text-xs text-white"
				onClick={() => copyToClipboard(text, setCopied)}
			>
				{copied ? "Copied" : "Copy"}
				{copied ? (
					<IoCheckboxOutline className="ml-2 shrink-0" size={18} />
				) : (
					<IoCopyOutline className="ml-2 shrink-0" size={18} />
				)}
			</button>
		</div>
	);
}
