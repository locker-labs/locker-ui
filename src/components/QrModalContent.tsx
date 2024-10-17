import AarcButton from "./AarcButton";
import CopyButton from "./buttons/CopyButton";
import LockerQrCode from "./LockerQrCode";
import SupportedChainsIcons from "./SupportedChainsIcons";

export default function QrModalContent({
	lockerAddress,
	chainId,
}: {
	lockerAddress: `0x${string}`;
	chainId: number;
}) {
	return (
		<div className="mt-6 flex w-full flex-col items-center justify-center space-y-6">
			<div className="mt-3 space-y-2">
				<p className="text-center text-xs font-semibold">
					Your locker address
				</p>
				<CopyButton text={lockerAddress} />
			</div>

			<div className="mt-2 flex items-center justify-center space-x-2">
				<SupportedChainsIcons />
			</div>
			<div>
				<LockerQrCode lockerAddress={lockerAddress} />
			</div>
			<AarcButton lockerAddress={lockerAddress} chainId={chainId} />
		</div>
	);
}
