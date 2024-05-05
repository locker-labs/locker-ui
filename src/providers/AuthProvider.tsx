import { ClerkProvider } from "@clerk/nextjs";

function AuthProvider({ children }: { children: React.ReactNode }) {
	return <ClerkProvider>{children}</ClerkProvider>;
}

export default AuthProvider;
