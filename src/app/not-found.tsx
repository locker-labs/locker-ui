import Image from "next/image";
import Link from "next/link";

import { paths } from "@/data/constants/paths";

function Custom404() {
	return (
		<div className="sm:max-w-2/3 flex h-screen flex-col items-center space-y-3 px-4 xxs:justify-center sm:flex-row sm:justify-between">
			<div className="w-1/2">
				<Image
					src="/assets/locker/locker-404.png"
					width={465}
					height={396}
					alt="Not found image"
				/>
			</div>

			<div className="flex flex-col space-y-3">
				<p className="flex text-xxl font-bold">Page not found</p>
				<Link
					href={paths.HOME}
					className="rounded-sm bg-locker-500 px-3 py-1 text-center text-xs text-white"
				>
					Go home
				</Link>
			</div>
		</div>
	);
}

export default Custom404;
