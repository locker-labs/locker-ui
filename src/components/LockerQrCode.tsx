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
			<div className="border-secondary-100 absolute left-[-0.5px] top-[-0.5px] h-10 w-10 rounded-md border-l-[7px] border-t-[7px]" />
			<div className="border-primary-100 absolute right-[-0.5px] top-[-0.5px] h-10 w-10 rounded-md border-r-[7px] border-t-[7px]" />
			<div className="border-primary-100 absolute bottom-[-0.5px] left-[-0.5px] h-10 w-10 rounded-md border-b-[7px] border-l-[7px]" />
			<div className="border-secondary-100 absolute bottom-[-0.5px] right-[-0.5px] h-10 w-10 rounded-md border-b-[7px] border-r-[7px]" />
		</div>
	);
}

export default LockerQrCode;
