import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

function Button() {
	const { user } = useUser();

	return (
		<div className="flex size-full items-center justify-center space-x-1 rounded-full">
			{user?.hasImage ? (
				<div className="flex size-7 items-center justify-center">
					<Image
						className="rounded-full"
						alt="User Image"
						src={user.imageUrl}
						width={32}
						height={32}
					/>
				</div>
			) : (
				<div className="flex size-7 items-center justify-center rounded-full bg-secondary-100 text-light-100 dark:bg-primary-100">
					<FaUserAlt size={16} />
				</div>
			)}
			<IoChevronDown className="hidden xs:flex xs:shrink-0" size={16} />
		</div>
	);
}

export default Button;
