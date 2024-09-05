import { FaFile, FaGithub, FaTelegram, FaXTwitter } from "react-icons/fa6";

import FarcasterIcon from "@/components/FarcasterIcon";
import IconLink from "@/components/IconLink";

function Footer() {
	return (
		<footer className="flex w-full flex-col items-center justify-center">
			<div className="flex">
				<IconLink
					Icon={FaFile}
					url="https://docs.locker.money"
					label="Locker Docs"
					size="20px"
				/>
				<IconLink
					Icon={FaGithub}
					url="https://github.com/locker-labs"
					label="Github Link"
					size="20px"
				/>
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
			<div className="mt-6 flex text-center text-xs text-light-600">
				<span className="text-sm">
					Need help?{" "}
					<a
						href="mailto:support@chainrule.io"
						className="underline underline-offset-2 hover:text-secondary-100 dark:hover:text-primary-100"
					>
						Contact us
					</a>
				</span>
			</div>
			<div className="mt-6 flex text-center text-sm text-light-600">
				© 2024 Locker. All rights reserved.
			</div>
		</footer>
	);
}

export default Footer;
