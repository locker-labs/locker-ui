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
		</div>
	);
}

export default LockerQrCode;
