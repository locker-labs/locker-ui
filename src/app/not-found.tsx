import Link from "next/link";

import { paths } from "@/data/constants/paths";

function Custom404() {
	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center space-y-4">
			<p className="flex text-lg font-light">
				Can&apos;t find your locker?
			</p>
			<p>
				Try going{" "}
				<Link href={paths.HOME} className="text-locker-500">
					home
				</Link>
				.
			</p>
		</div>
	);
}

export default Custom404;
