import Link from "next/link";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

import FarcasterIcon from "@/components/FarcasterIcon";
import IconLink from "@/components/IconLink";
import { paths, pathStrings } from "@/data/constants/paths";

function Footer() {
	return (
		<footer className="mb-4 mt-4 flex w-full max-w-[55rem] items-center space-y-4 text-center text-gray-400 xxs:mt-8 xxs:flex-col xxs:justify-center sm:mt-10 sm:flex-row sm:justify-between sm:space-y-0">
			<div className="flex flex-row justify-center space-x-4 text-xs font-semibold">
				<Link target="_blank" href={paths.EFROGS}>
					FREE EFROGS
				</Link>
				<Link target="_blank" href={paths.DOCS}>
					Docs
				</Link>
				<Link target="_blank" href={paths.GITHUB}>
					Github
				</Link>
				<Link target="_blank" href={pathStrings.CONTACT_EMAIL_MAILTO}>
					Support
				</Link>
				<Link target="_blank" href={paths.PRIVACY}>
					Privacy
				</Link>
				<Link target="_blank" href={paths.TERMS}>
					Terms
				</Link>
			</div>

			<div className="flex flex-row justify-center space-x-3">
				<IconLink
					Icon={FarcasterIcon}
					url={process.env.FARCASTER_URL}
					label="Farcaster Link"
					size="20px"
				/>
				<IconLink
					Icon={FaXTwitter}
					url={process.env.TWITTER_URL}
					label="Twitter Link"
					size="20px"
				/>
				<IconLink
					Icon={FaTelegram}
					url={process.env.TELEGRAM_URL}
					label="Telegram Link"
					size="20px"
				/>
			</div>
		</footer>
	);
}

export default Footer;
