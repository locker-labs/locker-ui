"use client";

import { RadioGroup } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CgScreen } from "react-icons/cg";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

function ThemeSwitcher() {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme } = useTheme();

	// ********** BEHAVIOR ********** //
	// resoldvedTheme can be imported from useTheme
	//
	// By default:
	//    Before mounting completes:
	//        theme === "system"
	//        resolvedTheme === undefined
	//    After mounting completes:
	//        theme === "system"
	//        resolvedTheme === undefined
	//
	// If user manually sets the theme:
	//    theme and resolvedTheme should be the same before and after mounting completes
	// ****************************** //

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div>
			{mounted ? (
				<RadioGroup
					className="flex items-center space-x-2 rounded-full border border-light-300 p-1 text-dark-100 dark:border-dark-100 dark:text-light-400"
					value={theme}
					onChange={setTheme}
				>
					<RadioGroup.Option
						className="flex size-6 cursor-pointer items-center justify-center hover:text-dark-600 dark:hover:text-light-100"
						value="light"
					>
						{({ checked }) => (
							<IoSunnyOutline
								className={`${checked && "bg-secondary-200/30"} size-full rounded-full p-1`}
							/>
						)}
					</RadioGroup.Option>
					<RadioGroup.Option
						className="flex size-6 cursor-pointer items-center justify-center hover:text-dark-600 dark:hover:text-light-100"
						value="system"
					>
						{({ checked }) => (
							<CgScreen
								className={`${checked && "bg-secondary-200/30"} size-full rounded-full p-1`}
							/>
						)}
					</RadioGroup.Option>
					<RadioGroup.Option
						className="flex size-6 cursor-pointer items-center justify-center hover:text-dark-600 dark:hover:text-light-100"
						value="dark"
					>
						{({ checked }) => (
							<IoMoonOutline
								className={`${checked && "bg-secondary-200/30"} size-full rounded-full p-1`}
							/>
						)}
					</RadioGroup.Option>
				</RadioGroup>
			) : null}
		</div>
	);
}

export default ThemeSwitcher;
