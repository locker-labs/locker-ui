import { Locker } from "@/types";

export interface ILockerSetup {
	lockers: Locker[];
}

function LockerSetup({ lockers }: ILockerSetup) {
	return (
		<div className="flex w-full flex-1 flex-col items-start space-y-8">
			<span>LockerSetup</span>
			<span>
				Locker: <code>{lockers[0].address}</code>
			</span>
		</div>
	);
}

export default LockerSetup;
