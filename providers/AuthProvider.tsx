import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
	return <ClerkProvider>{children}</ClerkProvider>;
}

export default AuthProvider;
