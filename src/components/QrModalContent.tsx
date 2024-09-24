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
			<div>
				<LockerQrCode lockerAddress={lockerAddress} />
			</div>
			<div>
				<p className="w-full text-center text-xs font-semibold">
					Your locker address
				</p>
				<div className="mt-3">
					<CopyButton text={lockerAddress} />
				</div>
			</div>

			<span className="w-full text-sm text-light-600">
				You can receive native and ERC-20 tokens at this locker address
				on all supported chains.
			</span>

			<div className="mt-2 flex items-center justify-center -space-x-2">
				<SupportedChainsIcons />
			</div>
			<AarcButton lockerAddress={lockerAddress} chainId={chainId} />
		</div>
	);
}
