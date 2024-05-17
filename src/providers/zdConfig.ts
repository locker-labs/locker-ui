import { createConfig } from "@zerodev/waas";

import {
	supportedChains,
	transports,
	zdProjectIds,
} from "@/data/constants/supportedChains";

export const zdConfig = createConfig({
	chains: supportedChains,
	transports,
	projectIds: zdProjectIds,
});
