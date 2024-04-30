"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { CgScreen } from "react-icons/cg";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

function ThemeSwitcher() {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	// If user did not choose anything,
	//    - theme = "system"
	//    - resolvedTheme = "undefined"
	// If user chose something
	//   - theme = "light", "dark", or "system"
	//   - resolvedTheme = "light", "dark", "system"

	// TODO: Make this component a Radio button with three options, defaulting to "system" if resolvedTheme is undefined

	useEffect(() => {
		console.log("***theme: ", theme);
		console.log("***resolvedTheme: ", resolvedTheme);
		setMounted(true);
	}, []);

	if (!mounted) return <AiOutlineLoading3Quarters className="animate-spin" />;

	if (resolvedTheme === "light") {
		return (
			<IoMoonOutline
				className="cursor-pointer"
				onClick={() => setTheme("dark")}
			/>
		);
	}

	// if (resolvedTheme === "system") {
	// 	return <CgScreen onClick={() => setTheme("system")} />;
	// }

	if (resolvedTheme === "dark") {
		return (
			<IoSunnyOutline
				className="cursor-pointer"
				onClick={() => setTheme("light")}
			/>
		);
	}

	return null;
}

export default ThemeSwitcher;
