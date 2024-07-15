export default function getZerodevIndex(lockerIndex: number) {
	return BigInt(lockerIndex) + BigInt(process.env.LOCKER_SEED_OFFSET!);
}
