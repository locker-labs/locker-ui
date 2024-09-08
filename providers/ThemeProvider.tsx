import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
		>
			{children}
		</NextThemesProvider>
	);
}

export default ThemeProvider;
