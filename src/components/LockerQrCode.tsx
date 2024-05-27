import { useTheme } from "next-themes";
import QRCodeSVG from "qrcode.react";

export interface ILockerQrCode {
	lockerAddress: `0x${string}`;
}

function LockerQrCode({ lockerAddress }: ILockerQrCode) {
	const { resolvedTheme } = useTheme();
	return (
		<div className="relative inline-block">
			<QRCodeSVG
				value={lockerAddress}
				bgColor={resolvedTheme === "dark" ? "#131316" : "#ffffff"}
				fgColor={resolvedTheme === "dark" ? "#ffffff" : "#131316"}
				size={225}
				includeMargin
				level="H"
				imageSettings={{
					src: "/assets/iconLockerWithMargin.svg",
					height: 45,
					width: 45,
					excavate: true,
				}}
			/>
			<div className="absolute left-[-0.5px] top-[-0.5px] h-10 w-10 rounded-md border-l-[7px] border-t-[7px] border-secondary-100" />
			<div className="absolute right-[-0.5px] top-[-0.5px] h-10 w-10 rounded-md border-r-[7px] border-t-[7px] border-primary-100" />
			<div className="absolute bottom-[-0.5px] left-[-0.5px] h-10 w-10 rounded-md border-b-[7px] border-l-[7px] border-primary-100" />
			<div className="absolute bottom-[-0.5px] right-[-0.5px] h-10 w-10 rounded-md border-b-[7px] border-r-[7px] border-secondary-100" />
		</div>
		// <QRCodeSVG
		// 	className="rounded-xl border border-light-200 shadow-sm shadow-light-600 dark:border-dark-200 dark:shadow-none"
		// 	value={lockerAddress}
		// 	size={225}
		// 	includeMargin
		// 	level="H"
		// 	imageSettings={{
		// 		src: "/assets/iconLockerWithMargin.svg",
		// 		height: 45,
		// 		width: 45,
		// 		excavate: true,
		// 	}}
		// />
	);
}

export default LockerQrCode;
