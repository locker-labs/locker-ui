import Link from "next/link";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";

import FarcasterIcon from "./FarcasterIcon";
import IconLink from "./IconLink";
import ThemeSwitcher from "./ThemeSwitcher";

function Footer() {
	return (
		<footer className="flex w-full flex-col items-center justify-center">
			<div className="flex w-full flex-col items-center justify-center xs:flex-row xs:justify-between">
				<div className="flex">
					{/* <IconLink
					Icon={FaGithub}
					url={process.env.GITHUB_URL}
					label="Github Link"
					size="20px"
				/> */}
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
				<div className="mt-4 flex xs:mt-0">
					<ThemeSwitcher />
				</div>
			</div>
			<div className="mt-6 flex text-center ">
				<Link
					href="https://docs.locker.money"
					className="text-sm text-light-600"
					target="_blank"
				>
					Docs
				</Link>
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
