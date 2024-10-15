"use client";

import Link from "next/link";
import { useEffect } from "react";

import { paths } from "@/data/constants/paths";
// Error boundaries must be Client Components

export default function GlobalError({
	error,
}: {
	error: Error & { digest?: string };
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);
	return (
		// global-error must include html and body tags
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-4">
			<p className="flex text-lg font-light">Don&apos;t worry.</p>
			<p>
				if you can&apos;t open your locker, no one can. Go{" "}
				<Link href={paths.HOME} className="text-locker-500">
					home
				</Link>
				.
			</p>
		</div>
	);
}
