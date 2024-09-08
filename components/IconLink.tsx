import { IconType } from "react-icons/lib";

export interface IIconLink {
	Icon: IconType;
	url: string | undefined;
	size: string | undefined;
	label: string | undefined;
}

function IconLink({ Icon, url, size, label }: IIconLink) {
	return (
		<a
			className="flex shrink-0 flex-col items-center justify-center p-3 text-light-600 hover:text-secondary-100 dark:hover:text-primary-100"
			href={url}
			target="_blank"
			aria-label={label}
			rel="noopener noreferrer"
		>
			<Icon size={size} />
		</a>
	);
}

export default IconLink;
