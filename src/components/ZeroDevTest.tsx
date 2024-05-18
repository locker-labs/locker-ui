import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useAccount } from "wagmi";

import useSmartAccount from "@/hooks/useSmartAccount";
import { createPolicy } from "@/services/lockers";
import { Policy } from "@/types";

function ZeroDevTest() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [sessionKeySig, setSessionKeySig] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { address, chainId } = useAccount();
	const { genSmartAccountAddress, signSessionKey } = useSmartAccount();
	const { getToken } = useAuth();

	const createNewPolicy = async () => {
		// Need to handle the case where user rejects signing
		const sig = await signSessionKey();
		setSessionKeySig(sig);

		// Get from lockers[0].id
		const lockerId = 15;

		// craft automations object in LockerSetup
		const automations = {
			savings: 30,
			hot_wallet: 20,
			off_ramp: 50,
		};

		const policy: Policy = {
			lockerId,
			chainId: chainId as number,
			sessionKey: sig,
			automations,
		};

		console.log("policy: ", policy);
		console.log("sig length: ", sig.length);

		const token = await getToken();
		if (token) {
			await createPolicy(token, policy, setErrorMessage);
		}
	};

	return (
		<div className="flex w-full flex-1 flex-col items-center space-y-4 rounded">
			<button
				className="rounded-full bg-secondary-100 px-4 py-3 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
				onClick={async () =>
					console.log(
						"locker[0] addr: ",
						await genSmartAccountAddress(address!, 0)
					)
				}
			>
				Gen Locker Addr
			</button>
			<button
				className="rounded-full bg-secondary-100 px-4 py-3 text-light-100 hover:bg-secondary-200 dark:bg-primary-200 dark:hover:bg-primary-100"
				onClick={() => createNewPolicy()}
			>
				Serialize
			</button>
			{errorMessage && (
				<span className="text-sm text-error">{errorMessage}</span>
			)}
		</div>
	);
}

export default ZeroDevTest;
