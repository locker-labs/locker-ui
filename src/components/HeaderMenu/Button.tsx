import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Blockies from "react-blockies";
import { FaUserAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import { useLocker } from "@/providers/LockerProvider";

function Button({ open }: { open: boolean }) {
	const { user } = useUser();
	const { lockers } = useLocker();

	let profileImg = (
		<div className="bg-secondary-100 text-light-100 dark:bg-primary-100 flex size-7 items-center justify-center rounded-full">
			<FaUserAlt size={16} />
		</div>
	);

	if (lockers.length > 0) {
		profileImg = (
			<div className="flex size-7 items-center justify-center">
				<Blockies
					className="flex self-center rounded-md bg-white"
					seed={lockers[0].address.toLowerCase()}
					size={6}
				/>
			</div>
		);
	} else if (user) {
		profileImg = (
			<div className="flex size-7 items-center justify-center">
				<Image
					className="rounded-full"
					alt="User Image"
					src={user.imageUrl}
					width={32}
					height={32}
				/>
			</div>
		);
	}

	return (
		<div className="flex size-full items-center justify-center space-x-1 rounded-full">
			{profileImg}
			<IoChevronDown
				className={`${open && "rotate-180 transform"} hidden xs:flex xs:shrink-0`}
				size={16}
			/>
		</div>
	);
}

export default Button;
