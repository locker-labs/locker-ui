"use client";

import { ZeroDevProvider } from "@zerodev/waas";
import type { ReactNode } from "react";

import { zdConfig } from "@/providers/zdConfig";

function SmartAccountProvider({ children }: { children: ReactNode }) {
	return <ZeroDevProvider config={zdConfig}>{children}</ZeroDevProvider>;
}

export default SmartAccountProvider;
